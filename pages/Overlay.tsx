
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useMatchRealTime } from '../hooks/useMatchRealTime';
import { CenteredScoreboard } from '../components/CenteredScoreboard';
import { BroadcastOverlayContainer } from '../components/broadcast/BroadcastOverlayContainer';

export const Overlay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { match, overlayCommand } = useMatchRealTime(id);
  const [scoreAnimation, setScoreAnimation] = useState<string | null>(null);
  const prevMatchRef = useRef<any>(null);

  // Handle Score Animations based on match state changes
  useEffect(() => {
    if (match && prevMatchRef.current) {
      const prev = prevMatchRef.current;
      const runDiff = (match.runs || 0) - (prev.runs || 0);
      const wicketDiff = (match.wickets || 0) - (prev.wickets || 0);

      if (wicketDiff > 0) {
        triggerAnimation('WICKET');
      } else if (runDiff === 4) {
        triggerAnimation('FOUR');
      } else if (runDiff === 6) {
        triggerAnimation('SIX');
      } else if (match.balls > prev.balls) {
        // Check for extras if balls increased (or if balls didn't increase but runs did, like NB/WD)
        // Actually NB/WD often don't increase the ball count in some systems, but here they might.
        // For now, let's stick to the main ones or add explicit extra detection if available.
      }
    }
    prevMatchRef.current = match;
  }, [match]);

  const triggerAnimation = (type: string) => {
    setScoreAnimation(type);
    setTimeout(() => setScoreAnimation(null), 3000);
  };

  useEffect(() => {
    document.body.style.background = 'transparent';
    return () => {
      document.body.style.background = '';
    };
  }, []);

  if (!match) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none font-sans bg-transparent">
      {/* International Standard Centered Scoreboard */}
      <CenteredScoreboard 
        teamA={match.team_a}
        teamB={match.team_b}
        striker={match.striker || 'Batter 1'}
        nonStriker={match.non_striker || 'Batter 2'}
        bowler={match.bowler || 'Bowler'}
        score={`${match.runs}-${match.wickets}`}
        overs={match.overs.toFixed(1)}
        inning="1ST INNING"
        strikerRuns={match.striker_runs || 0}
        strikerBalls={match.striker_balls || 0}
        nonStrikerRuns={match.non_striker_runs || 0}
        nonStrikerBalls={match.non_striker_balls || 0}
        bowlerWickets={match.bowler_wickets || 0}
        bowlerRuns={match.bowler_runs || 0}
        bowlerOvers={(match.bowler_overs || 0).toFixed(1)}
        crr={(match.runs / Math.max(0.1, match.balls / 6)).toFixed(2)}
        target={match.target}
        matchOvers={match.match_overs || 20}
      />

      {/* Premium Broadcast Graphics Layer */}
      <BroadcastOverlayContainer 
        match={match} 
        command={overlayCommand} 
        scoreAnimation={scoreAnimation}
      />
    </div>
  );
};
