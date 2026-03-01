
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
  name: string;
  runs: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  oversBowled: number;
  ballsBowled: number;
  runsConceded: number;
  wicketsTaken: number;
}

export interface Team {
  id: string;
  name: string;
  user_id?: string;
  tournament_id?: string;
}

export type ExtraType = 'wide' | 'no-ball' | 'bye' | 'leg-bye' | 'none';
export type WicketType = 'bowled' | 'caught' | 'lbw' | 'run-out' | 'stumped' | 'hit-wicket' | 'none';

export type MatchType = 'T20' | 'ODI' | 'Test' | 'Custom';
export type MatchStatus = 'upcoming' | 'live' | 'completed';

export interface Ball {
  id: string;
  match_id: string;
  runs: number;
  is_wicket: boolean;
  over_number: number;
  ball_number: number;
  created_at: string;
}

export interface Match {
  id: string;
  team_a: string;
  team_b: string;
  total_runs: number;
  total_wickets: number;
  total_overs: number;
  created_by: string;
  status: 'live' | 'upcoming' | 'completed';
  created_at: string;
}

export interface AppState {
  matches: Match[];
  tournaments: Tournament[];
}

export interface Tournament {
  id: string;
  name: string;
  user_id: string;
}
