
import { supabase } from '../supabase';
import { Match, Ball, OverlayCommand } from '../types';

export const MatchService = {
  async createMatch(teamA: string, teamB: string, totalOvers: number, userId: string) {
    const { data, error } = await supabase
      .from('matches')
      .insert([{ 
        team_a: teamA, 
        team_b: teamB, 
        created_by: userId,
        total_runs: 0,
        total_wickets: 0,
        total_overs: 0,
        current_over_balls: 0,
        match_overs: totalOvers,
        striker: 'Batter 1',
        non_striker: 'Batter 2',
        bowler: 'Bowler',
        striker_runs: 0,
        striker_balls: 0,
        non_striker_runs: 0,
        non_striker_balls: 0,
        bowler_wickets: 0,
        bowler_runs: 0,
        bowler_overs: 0,
        status: 'live'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Match;
  },

  async getMatchById(matchId: string): Promise<Match | null> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();
    
    if (error || !data) return null;
    return data as Match;
  },

  async getMatchesByUser(userId: string): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Match[];
  },

  async getPublicLiveMatches(): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'live')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Match[];
  },

  async recordBall(matchId: string, match: Match, runs: number, isWicket: boolean, extraType?: string) {
    const isLegalBall = !['wd', 'nb'].includes(extraType || '');
    
    let nextOverBalls = match.current_over_balls || 0;
    let nextTotalOvers = match.total_overs || 0;
    let striker = match.striker || 'Batter 1';
    let nonStriker = match.non_striker || 'Batter 2';

    // 1. Handle Strike Rotation (Odd runs)
    // Wides/No-balls: runs usually include the extra + what was run.
    // If it's a wide/nb, the runs recorded might be 1 (extra) + runs.
    // Standard: 1 run on legal ball = swap. 1 run on wide = swap if they ran.
    // Let's assume 'runs' passed is the total runs for that ball.
    // If runs are odd, swap strike.
    if (runs % 2 !== 0) {
      [striker, nonStriker] = [nonStriker, striker];
    }

    // 2. Handle Overs
    if (isLegalBall) {
      nextOverBalls += 1;
      if (nextOverBalls === 6) {
        // Over complete: increment over, reset ball count, and swap strike
        nextTotalOvers = Math.floor(nextTotalOvers) + 1;
        nextOverBalls = 0;
        [striker, nonStriker] = [nonStriker, striker];
      } else {
        // Just update the decimal part
        nextTotalOvers = Math.floor(nextTotalOvers) + (nextOverBalls / 10);
      }
    }

    // 3. Insert ball record
    const { error: ballError } = await supabase
      .from('balls')
      .insert([{
        match_id: matchId,
        runs,
        extra_type: extraType,
        is_wicket: isWicket,
        over_number: Math.floor(nextTotalOvers),
        ball_number: nextOverBalls
      }]);

    if (ballError) throw ballError;

    // 4. Update match score
    const { data: updatedMatch, error: matchError } = await supabase
      .from('matches')
      .update({
        total_runs: (match.total_runs || 0) + runs,
        total_wickets: (match.total_wickets || 0) + (isWicket ? 1 : 0),
        total_overs: nextTotalOvers,
        current_over_balls: nextOverBalls,
        striker,
        non_striker: nonStriker,
        striker_runs: (match.striker_runs || 0) + runs,
        striker_balls: (match.striker_balls || 0) + (isLegalBall ? 1 : 0),
        bowler_runs: (match.bowler_runs || 0) + runs,
        bowler_wickets: (match.bowler_wickets || 0) + (isWicket ? 1 : 0),
        bowler_overs: isLegalBall ? (match.bowler_overs || 0) + 0.1 : (match.bowler_overs || 0)
      })
      .eq('id', matchId)
      .select()
      .single();

    if (matchError) throw matchError;
    return updatedMatch as Match;
  },

  async undoLastBall(matchId: string) {
    // 1. Get last ball
    const { data: lastBall, error: ballFetchError } = await supabase
      .from('balls')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (ballFetchError || !lastBall) return;

    // 2. Get match
    const { data: match, error: matchFetchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (matchFetchError || !match) return;

    // 3. Calculate previous state
    const isLegalBall = !['wd', 'nb'].includes(lastBall.extra_type || '');
    let prevOverBalls = match.current_over_balls || 0;
    let prevTotalOvers = match.total_overs || 0;
    let striker = match.striker;
    let nonStriker = match.non_striker;

    // Reverse strike rotation if runs were odd
    if (lastBall.runs % 2 !== 0) {
      [striker, nonStriker] = [nonStriker, striker];
    }

    if (isLegalBall) {
      if (prevOverBalls === 0) {
        // Was end of over, reverse over completion strike swap too
        [striker, nonStriker] = [nonStriker, striker];
        prevTotalOvers = Math.floor(prevTotalOvers) - 1 + 0.5;
        prevOverBalls = 5;
      } else {
        prevOverBalls -= 1;
        prevTotalOvers = Math.floor(prevTotalOvers) + (prevOverBalls / 10);
      }
    }

    // 4. Update match
    await supabase
      .from('matches')
      .update({
        total_runs: Math.max(0, (match.total_runs || 0) - lastBall.runs),
        total_wickets: Math.max(0, (match.total_wickets || 0) - (lastBall.is_wicket ? 1 : 0)),
        total_overs: prevTotalOvers,
        current_over_balls: prevOverBalls,
        striker,
        non_striker: nonStriker,
        striker_runs: Math.max(0, (match.striker_runs || 0) - lastBall.runs),
        striker_balls: Math.max(0, (match.striker_balls || 0) - (isLegalBall ? 1 : 0)),
        bowler_runs: Math.max(0, (match.bowler_runs || 0) - lastBall.runs),
        bowler_wickets: Math.max(0, (match.bowler_wickets || 0) - (lastBall.is_wicket ? 1 : 0)),
        bowler_overs: isLegalBall ? Math.max(0, (match.bowler_overs || 0) - 0.1) : (match.bowler_overs || 0)
      })
      .eq('id', matchId);

    // 5. Delete ball
    await supabase
      .from('balls')
      .delete()
      .eq('id', lastBall.id);
  },

  async sendOverlayCommand(matchId: string, command: string, payload: any = {}) {
    const { error } = await supabase
      .from('overlay_commands')
      .insert([{
        match_id: matchId,
        command,
        payload,
        visible: true
      }]);
    if (error) throw error;
  },

  async hideOverlay(matchId: string) {
    await supabase
      .from('overlay_commands')
      .update({ visible: false })
      .eq('match_id', matchId);
  },

  async deleteMatch(matchId: string) {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', matchId);
    if (error) throw error;
  }
};
