
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useMatchRealTime } from '../hooks/useMatchRealTime';
import { CenteredScoreboard } from '../components/CenteredScoreboard';
import { BroadcastOverlayContainer } from '../components/broadcast/BroadcastOverlayContainer';
import { LowerThirdOverlay } from '../components/broadcast/LowerThirdOverlay';
import { supabase } from '../supabase';
import { BallEvent } from '../types';

export const Overlay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { match, overlayCommand } = useMatchRealTime(id);
  const [scoreAnimation, setScoreAnimation] = useState<string | null>(null);
  const [ballEvents, setBallEvents] = useState<BallEvent[]>([]);
  const prevMatchRef = useRef<any>(null);

  // Fetch ball events for the indicator
  useEffect(() => {
    if (!id) return;

    const fetchBalls = async () => {
      const { data } = await supabase
        .from('ball_events')
        .select('*')
        .eq('match_id', id)
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (data) setBallEvents(data);
    };

    fetchBalls();

    // Subscribe to new balls
    const channel = supabase
      .channel(`balls-${id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'ball_events',
        filter: `match_id=eq.${id}`
      }, (payload) => {
        setBallEvents(prev => [payload.new as BallEvent, ...prev].slice(0, 12));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  // Handle Score Animations based on match state changes
  useEffect(() => {
    if (match && prevMatchRef.current) {
      const prev = prevMatchRef.current;
      const runDiff = (match.runs || 0) - (prev.runs || 0);
      const wicketDiff = (match.wickets || 0) - (prev.wickets || 0);
      const ballDiff = (match.balls || 0) - (prev.balls || 0);

      if (wicketDiff > 0) {
        triggerAnimation('WICKET');
      } else if (runDiff === 4) {
        triggerAnimation('FOUR');
      } else if (runDiff === 6) {
        triggerAnimation('SIX');
      } else if (ballDiff === 0 && runDiff > 0) {
        // Likely a No Ball or Wide if runs increased but balls didn't
        triggerAnimation('NO_BALL');
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
      {/* Professional Lower Third Overlay */}
      {overlayCommand?.visible && overlayCommand.command === 'DEFAULT_SCOREBOARD' && (
        <LowerThirdOverlay 
          match={match} 
          recentBalls={ballEvents} 
          scoreAnimation={scoreAnimation} 
        />
      )}

      {/* International Standard Centered Scoreboard (Optional, can be toggled via overlayCommand) */}
      {overlayCommand?.type === 'SCOREBOARD' && (
        <CenteredScoreboard 
          teamA={match.team_a_name || 'Team A'}
          teamB={match.team_b_name || 'Team B'}
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
      )}

      {/* Premium Broadcast Graphics Layer */}
      <BroadcastOverlayContainer 
        match={match} 
        command={overlayCommand} 
        scoreAnimation={scoreAnimation}
        theme={match.overlay_theme || localStorage.getItem('scoreboardTheme') || 'theme1'}
      />
    </div>
  );
};
