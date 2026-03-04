
import { Match } from './types';

// Calculation Helpers for rendering UI
export const calculateStats = (match: Match) => {
  const completedOvers = Math.floor(match.balls / 6);
  const remainingBalls = match.balls % 6;
  return {
    runs: match.runs || 0,
    wickets: match.wickets || 0,
    overs: `${completedOvers}.${remainingBalls}`,
    extras: match.extras || 0,
    totalBalls: match.balls
  };
};

export const getPlayerStats = (match: Match, playerId: string) => {
    // Placeholder as player table logic is coming soon
    return {
        batting: { runs: 0, ballsFaced: 0, fours: 0, sixes: 0 },
        bowling: { runsConceded: 0, wickets: 0, overs: '0.0' }
    };
};
