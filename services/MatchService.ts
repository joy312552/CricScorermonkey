
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
    
    let nextOverBalls = match.current_over_balls;
    let nextTotalOvers = match.total_overs;
    
    if (isLegalBall) {
      nextOverBalls += 1;
      if (nextOverBalls === 6) {
        nextTotalOvers = Math.floor(nextTotalOvers) + 1;
        nextOverBalls = 0;
      } else {
        nextTotalOvers = Math.floor(nextTotalOvers) + (nextOverBalls / 10);
      }
    }

    // Insert ball record
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

    // Update match score
    const { data: updatedMatch, error: matchError } = await supabase
      .from('matches')
      .update({
        total_runs: match.total_runs + runs,
        total_wickets: match.total_wickets + (isWicket ? 1 : 0),
        total_overs: nextTotalOvers,
        current_over_balls: nextOverBalls
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
    let prevOverBalls = match.current_over_balls;
    let prevTotalOvers = match.total_overs;

    if (isLegalBall) {
      if (prevOverBalls === 0) {
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
        total_runs: match.total_runs - lastBall.runs,
        total_wickets: match.total_wickets - (lastBall.is_wicket ? 1 : 0),
        total_overs: prevTotalOvers,
        current_over_balls: prevOverBalls
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
