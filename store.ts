
import { Match } from './types';

// Calculation Helpers for rendering UI
export const calculateStats = (match: Match) => {
  return {
    runs: match.total_runs || 0,
    wickets: match.total_wickets || 0,
    overs: match.total_overs?.toFixed(1) || '0.0',
    extras: 0,
    totalBalls: Math.floor(match.total_overs || 0) * 6 + Math.round(((match.total_overs || 0) % 1) * 10)
  };
};

export const getPlayerStats = (match: Match, playerId: string) => {
    // Placeholder as player table logic is coming soon
    return {
        batting: { runs: 0, ballsFaced: 0, fours: 0, sixes: 0 },
        bowling: { runsConceded: 0, wickets: 0, overs: '0.0' }
    };
};
