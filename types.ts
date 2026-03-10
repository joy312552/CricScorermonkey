
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
export type DismissalType = 'Bowled' | 'Caught' | 'LBW' | 'Run Out' | 'Stumped' | 'Hit Wicket' | 'Obstructing Field' | 'Retired Out' | 'none';

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
  dismissal_type?: DismissalType;
  fielder_id?: string;
  innings: number;
  created_at: string;
}

export interface Match {
  id: string;
  team_a_id: string;
  team_b_id: string;
  tournament_id?: string;
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
  venue?: string;
  match_overs?: number;
  target?: number;
  
  // Player specific stats
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

  // Virtual fields for UI convenience (joined data)
  team_a_name?: string;
  team_b_name?: string;
  tournament_name?: string;
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
