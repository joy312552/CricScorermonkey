
import { supabase } from '../supabase';
import { Match, BallEvent, OverlayCommand, Team, Tournament, Player } from '../types';

export const MatchService = {
  async createMatch(teamA: string, teamB: string, matchOvers: number, userId: string) {
    const { data, error } = await supabase
      .from('matches')
      .insert([{ 
        team_a: teamA, 
        team_b: teamB, 
        match_overs: matchOvers,
        created_by: userId,
        runs: 0,
        wickets: 0,
        balls: 0,
        overs: 0,
        striker: 'Batter 1',
        non_striker: 'Batter 2',
        bowler: 'Bowler',
        status: 'live',
        tournament_name: 'CricScore Pro League',
        series_name: 'T20 Series',
        venue: 'International Stadium'
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

  async recordBall(matchId: string, runs: number, isWicket: boolean, extraType?: string) {
    // 1. Fetch current state with fresh data
    const { data: match, error: fetchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();
    
    if (fetchError || !match) {
      console.error('Fetch error before scoring:', fetchError);
      throw new Error('Could not find match to update');
    }

    // 2. Calculate Logic
    const isLegalBall = !['wd', 'nb'].includes(extraType || '');
    const nextBalls = isLegalBall ? (match.balls || 0) + 1 : (match.balls || 0);
    
    // Cricket notation: 6 balls = 1.0, 7 balls = 1.1
    const completedOvers = Math.floor(nextBalls / 6);
    const remainingBalls = nextBalls % 6;
    const nextOvers = parseFloat(`${completedOvers}.${remainingBalls}`);

    console.log(`[SCORING] Match: ${matchId} | Before: ${match.balls} | After: ${nextBalls} | Legal: ${isLegalBall}`);

    // 3. Insert Ball Event
    const { error: ballError } = await supabase
      .from('ball_events')
      .insert([{
        match_id: matchId,
        runs: runs,
        extra_type: extraType || 'none',
        wicket: isWicket,
        over_number: Math.floor((match.balls || 0) / 6),
        ball_number: ((match.balls || 0) % 6) + 1
      }]);

    if (ballError) {
      console.error('Ball insertion failed. Details:', {
        message: ballError.message,
        code: ballError.code,
        hint: ballError.hint,
        details: ballError.details
      });
      
      // If it's a cache error, we throw a specific message
      if (ballError.code === 'PGRST205') {
        throw new Error('Database API cache is stale. Please refresh the page or wait 30 seconds.');
      }
      throw ballError;
    }

    // 4. Update Summary Stats
    let striker = match.striker;
    let nonStriker = match.non_striker;
    let strikerRuns = match.striker_runs || 0;
    let strikerBalls = match.striker_balls || 0;
    let nonStrikerRuns = match.non_striker_runs || 0;
    let nonStrikerBalls = match.non_striker_balls || 0;
    let bowlerRuns = match.bowler_runs || 0;
    let bowlerWickets = match.bowler_wickets || 0;
    let bowlerOvers = match.bowler_overs || 0;
    let totalExtras = match.extras || 0;

    // Batter runs (only if not byes/legbyes)
    const batterRuns = (extraType === 'byes' || extraType === 'lb') ? 0 : runs;
    strikerRuns += batterRuns;
    if (isLegalBall) strikerBalls += 1;

    // Bowler runs (only if not byes/legbyes)
    const bowlerRunsToAdd = (extraType === 'byes' || extraType === 'lb') ? 0 : runs;
    bowlerRuns += bowlerRunsToAdd;
    if (isWicket) bowlerWickets += 1;
    
    if (isLegalBall) {
      const bOvers = Math.floor(bowlerOvers);
      const bBalls = Math.round((bowlerOvers % 1) * 10) + 1;
      if (bBalls >= 6) bowlerOvers = bOvers + 1;
      else bowlerOvers = bOvers + (bBalls / 10);
    }

    if (extraType && extraType !== 'none') {
      totalExtras += runs;
    }

    // Strike Rotation
    if (runs % 2 !== 0) {
      [striker, nonStriker] = [nonStriker, striker];
      [strikerRuns, nonStrikerRuns] = [nonStrikerRuns, strikerRuns];
      [strikerBalls, nonStrikerBalls] = [nonStrikerBalls, strikerBalls];
    }

    // Over End Strike Rotation
    if (isLegalBall && nextBalls % 6 === 0) {
      [striker, nonStriker] = [nonStriker, striker];
      [strikerRuns, nonStrikerRuns] = [nonStrikerRuns, strikerRuns];
      [strikerBalls, nonStrikerBalls] = [nonStrikerBalls, strikerBalls];
    }

    // 5. Final Update
    const { data: updatedMatch, error: matchError } = await supabase
      .from('matches')
      .update({
        runs: (match.runs || 0) + runs,
        wickets: (match.wickets || 0) + (isWicket ? 1 : 0),
        balls: nextBalls,
        overs: nextOvers,
        extras: totalExtras,
        striker,
        non_striker: nonStriker,
        striker_runs: strikerRuns,
        striker_balls: strikerBalls,
        non_striker_runs: nonStrikerRuns,
        non_striker_balls: nonStrikerBalls,
        bowler_runs: bowlerRuns,
        bowler_wickets: bowlerWickets,
        bowler_overs: bowlerOvers,
        updated_at: new Date().toISOString()
      })
      .eq('id', matchId)
      .select()
      .single();

    if (matchError) {
      console.error('Match summary update failed:', matchError);
      throw matchError;
    }
    return updatedMatch as Match;
  },

  async updateMatchPlayers(matchId: string, updates: Partial<Match>) {
    const { data, error } = await supabase
      .from('matches')
      .update(updates)
      .eq('id', matchId)
      .select()
      .single();
    if (error) throw error;
    return data as Match;
  },

  async undoLastBall(matchId: string) {
    // 1. Get last ball
    const { data: lastBall, error: ballFetchError } = await supabase
      .from('ball_events')
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

    const isLegalBall = !['wd', 'nb'].includes(lastBall.extra_type || '');
    const prevBalls = isLegalBall ? Math.max(0, (match.balls || 0) - 1) : (match.balls || 0);
    
    const completedOvers = Math.floor(prevBalls / 6);
    const remainingBalls = prevBalls % 6;
    const prevOvers = parseFloat(`${completedOvers}.${remainingBalls}`);

    // 3. Update match
    await supabase
      .from('matches')
      .update({
        runs: Math.max(0, (match.runs || 0) - lastBall.runs),
        wickets: Math.max(0, (match.wickets || 0) - (lastBall.wicket ? 1 : 0)),
        balls: prevBalls,
        overs: prevOvers,
        updated_at: new Date().toISOString()
      })
      .eq('id', matchId);

    // 4. Delete ball
    await supabase
      .from('ball_events')
      .delete()
      .eq('id', lastBall.id);
  },

  // Team Management
  async getTeams(userId: string): Promise<Team[]> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data as Team[];
  },

  async createTeam(userId: string, teamName: string) {
    const { data, error } = await supabase
      .from('teams')
      .insert([{ user_id: userId, team_name: teamName }])
      .select()
      .single();
    if (error) throw error;
    return data as Team;
  },

  // Tournament Management
  async getTournaments(userId: string): Promise<Tournament[]> {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data as Tournament[];
  },

  async createTournament(userId: string, tournamentName: string) {
    const { data, error } = await supabase
      .from('tournaments')
      .insert([{ user_id: userId, tournament_name: tournamentName }])
      .select()
      .single();
    if (error) throw error;
    return data as Tournament;
  },

  // Player Management
  async getPlayers(userId: string): Promise<Player[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data as Player[];
  },

  async createPlayer(userId: string, teamId: string, playerName: string, jerseyNumber: number, role: string) {
    const { data, error } = await supabase
      .from('players')
      .insert([{ 
        user_id: userId, 
        team_id: teamId, 
        player_name: playerName, 
        jersey_number: jerseyNumber, 
        role 
      }])
      .select()
      .single();
    if (error) throw error;
    return data as Player;
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
