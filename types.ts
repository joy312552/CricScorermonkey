
export type Role = 'admin' | 'scorer' | 'viewer';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Role;
}

export interface Player {
  id: string;
  user_id: string;
  team_id: string;
  player_name: string;
  jersey_number: number;
  role: string;
  created_at: string;
}

export interface Team {
  id: string;
  user_id: string;
  team_name: string;
  created_at: string;
}

export interface Tournament {
  id: string;
  user_id: string;
  tournament_name: string;
  created_at: string;
}

export type ExtraType = 'wide' | 'no-ball' | 'bye' | 'leg-bye' | 'none';
export type WicketType = 'bowled' | 'caught' | 'lbw' | 'run-out' | 'stumped' | 'hit-wicket' | 'none';

export type MatchType = 'T20' | 'ODI' | 'Test' | 'Custom';
export type MatchStatus = 'upcoming' | 'live' | 'completed';

export interface BallEvent {
  id: string;
  match_id: string;
  over_number: number;
  ball_number: number;
  runs: number;
  extra_type?: string;
  wicket: boolean;
  innings: number;
  created_at: string;
}

export interface Match {
  id: string;
  team_a: string;
  team_b: string;
  runs: number;
  wickets: number;
  balls: number;
  overs: number;
  extras: number;
  striker: string;
  non_striker: string;
  bowler: string;
  toss_winner: string;
  toss_decision: string;
  status: 'live' | 'upcoming' | 'completed';
  current_innings: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  
  // New fields for professional broadcast
  tournament_name?: string;
  series_name?: string;
  venue?: string;
  match_overs?: number;
  target?: number;
  
  // Legacy fields for backward compatibility if needed, but we'll try to stick to the new ones
  striker_runs?: number;
  striker_balls?: number;
  non_striker_runs?: number;
  non_striker_balls?: number;
  bowler_wickets?: number;
  bowler_runs?: number;
  bowler_overs?: number;
  fours?: number;
  sixes?: number;
  overlay_theme?: string;
}

export interface OverlayCommand {
  id: string;
  match_id: string;
  command: string;
  payload: any;
  visible: boolean;
  created_at: string;
}

export interface AppState {
  matches: Match[];
  tournaments: Tournament[];
  teams: Team[];
  players: Player[];
}
