
import { supabase } from '../supabase';
import { Match, BallEvent, OverlayCommand, Team, Tournament, Player } from '../types';

export const MatchService = {
  async createMatch(teamAId: string, teamBId: string, tournamentId: string, matchOvers: number, userId: string) {
    const { data, error } = await supabase
      .from('matches')
      .insert([{ 
        team_a_id: teamAId, 
        team_b_id: teamBId, 
        tournament_id: tournamentId,
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
        current_innings: 1,
        fours: 0,
        sixes: 0,
        venue: 'International Stadium',
        overlay_theme: 'theme1'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Match;
  },

  async getMatchById(matchId: string): Promise<Match | null> {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!team_a_id(team_name),
        team_b:teams!team_b_id(team_name),
        tournament:tournaments(tournament_name)
      `)
      .eq('id', matchId)
      .single();
    
    if (error || !data) return null;
    
    // Flatten the joined data
    return {
      ...data,
      team_a_name: data.team_a?.team_name,
      team_b_name: data.team_b?.team_name,
      tournament_name: data.tournament?.tournament_name
    } as Match;
  },

  async getMatchesByUser(userId: string): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!team_a_id(team_name),
        team_b:teams!team_b_id(team_name),
        tournament:tournaments(tournament_name)
      `)
      .eq('created_by', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(m => ({
      ...m,
      team_a_name: m.team_a?.team_name,
      team_b_name: m.team_b?.team_name,
      tournament_name: m.tournament?.tournament_name
    })) as Match[];
  },

  async getPublicLiveMatches(): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!team_a_id(team_name),
        team_b:teams!team_b_id(team_name),
        tournament:tournaments(tournament_name)
      `)
      .eq('status', 'live')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(m => ({
      ...m,
      team_a_name: m.team_a?.team_name,
      team_b_name: m.team_b?.team_name,
      tournament_name: m.tournament?.tournament_name
    })) as Match[];
  },

  async updateTheme(matchId: string, theme: string) {
    const { data, error } = await supabase
      .from('matches')
      .update({ overlay_theme: theme })
      .eq('id', matchId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Match;
  },

  async recordBall(matchId: string, runs: number, isWicket: boolean, extraType?: string, dismissalType?: string, fielderId?: string) {
    console.log(`[SCORING] recordBall called for match ${matchId} | runs: ${runs} | wicket: ${isWicket} | extra: ${extraType} | dismissal: ${dismissalType}`);
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
    const { data: { user } } = await supabase.auth.getUser();
    
    let ballError;
    if (user) {
      // Try with user_id first (preferred)
      const { error } = await supabase
        .from('ball_events')
        .insert([{
          match_id: matchId,
          user_id: user.id,
          runs: runs,
          extra_type: extraType || 'none',
          wicket: isWicket,
          dismissal_type: dismissalType || null,
          fielder_id: fielderId || null,
          over_number: Math.floor((match.balls || 0) / 6),
          ball_number: ((match.balls || 0) % 6) + 1,
          innings: match.current_innings || 1
        }]);
      ballError = error;

      // Fallback if column doesn't exist yet
      if (ballError && ballError.message.includes("Could not find the 'user_id' column")) {
        const { error: fallbackError } = await supabase
          .from('ball_events')
          .insert([{
            match_id: matchId,
            runs: runs,
            extra_type: extraType || 'none',
            wicket: isWicket,
            dismissal_type: dismissalType || null,
            fielder_id: fielderId || null,
            over_number: Math.floor((match.balls || 0) / 6),
            ball_number: ((match.balls || 0) % 6) + 1,
            innings: match.current_innings || 1
          }]);
        ballError = fallbackError;
      }
    } else {
      // No user, try direct (will likely fail RLS but we try)
      const { error } = await supabase
        .from('ball_events')
        .insert([{
          match_id: matchId,
          runs: runs,
          extra_type: extraType || 'none',
          wicket: isWicket,
          dismissal_type: dismissalType || null,
          fielder_id: fielderId || null,
          over_number: Math.floor((match.balls || 0) / 6),
          ball_number: ((match.balls || 0) % 6) + 1,
          innings: match.current_innings || 1
        }]);
      ballError = error;
    }

    if (ballError) {
      console.error('Ball insertion failed. Details:', ballError);
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
    let fours = match.fours || 0;
    let sixes = match.sixes || 0;

    // Batter runs (only if not byes/legbyes)
    const batterRuns = (extraType === 'byes' || extraType === 'lb') ? 0 : runs;
    strikerRuns += batterRuns;
    if (isLegalBall) strikerBalls += 1;

    if (batterRuns === 4) fours += 1;
    if (batterRuns === 6) sixes += 1;

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
    console.log(`[SCORING] Updating match summary for ${matchId}...`);
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
        fours,
        sixes,
        updated_at: new Date().toISOString()
      })
      .eq('id', matchId)
      .select()
      .single();

    if (matchError) {
      console.error('Match summary update failed:', matchError);
      throw matchError;
    }
    console.log(`[SCORING] Match summary updated successfully:`, updatedMatch);
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

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('team_id', teamId);
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
    const { data: { user } } = await supabase.auth.getUser();
    
    let commandError;
    if (user) {
      const { error } = await supabase
        .from('overlay_commands')
        .insert([{
          match_id: matchId,
          user_id: user.id,
          command,
          payload,
          visible: true
        }]);
      commandError = error;

      if (commandError && commandError.message.includes("Could not find the 'user_id' column")) {
        const { error: fallbackError } = await supabase
          .from('overlay_commands')
          .insert([{
            match_id: matchId,
            command,
            payload,
            visible: true
          }]);
        commandError = fallbackError;
      }
    } else {
      const { error } = await supabase
        .from('overlay_commands')
        .insert([{
          match_id: matchId,
          command,
          payload,
          visible: true
        }]);
      commandError = error;
    }

    if (commandError) throw commandError;
  },

  async hideOverlay(matchId: string) {
    await supabase
      .from('overlay_commands')
      .update({ visible: false })
      .eq('match_id', matchId);
  },

  async getBallEvents(matchId: string): Promise<BallEvent[]> {
    const { data, error } = await supabase
      .from('ball_events')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data as BallEvent[];
  },

  async deleteMatch(matchId: string) {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', matchId);
    if (error) throw error;
  }
};
