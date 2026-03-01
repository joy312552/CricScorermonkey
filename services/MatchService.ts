
import { supabase } from '../supabase';
import { Match, Ball } from '../types';

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
        total_overs: 0, // This is current overs done
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

  async recordBall(matchId: string, match: Match, runs: number, isWicket: boolean) {
    // 1. Calculate new over and ball numbers
    const totalBalls = Math.floor(match.total_overs) * 6 + Math.round((match.total_overs % 1) * 10);
    const nextTotalBalls = totalBalls + 1;
    const nextOver = Math.floor(nextTotalBalls / 6);
    const nextBall = nextTotalBalls % 6;
    const nextTotalOvers = nextOver + (nextBall / 10);

    // 2. Insert ball record
    const { error: ballError } = await supabase
      .from('balls')
      .insert([{
        match_id: matchId,
        runs,
        is_wicket: isWicket,
        over_number: nextOver,
        ball_number: nextBall
      }]);

    if (ballError) throw ballError;

    // 3. Update match score
    const { data: updatedMatch, error: matchError } = await supabase
      .from('matches')
      .update({
        total_runs: match.total_runs + runs,
        total_wickets: match.total_wickets + (isWicket ? 1 : 0),
        total_overs: nextTotalOvers
      })
      .eq('id', matchId)
      .select()
      .single();

    if (matchError) throw matchError;
    return updatedMatch as Match;
  },

  async deleteMatch(matchId: string) {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', matchId);
    if (error) throw error;
  }
};
