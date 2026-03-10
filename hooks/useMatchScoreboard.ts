
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { MatchService } from '../services/MatchService';
import { Match, BallEvent } from '../types';

export const useMatchScoreboard = (matchId: string | undefined) => {
  const [match, setMatch] = useState<Match | null>(null);
  const [ballEvents, setBallEvents] = useState<BallEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;

    const fetchInitialData = async () => {
      try {
        // Fetch match
        const matchData = await MatchService.getMatchById(matchId);
        if (matchData) setMatch(matchData);

        // Fetch last 12 ball events (to cover current and last over)
        const { data: ballData, error: ballError } = await supabase
          .from('ball_events')
          .select('*')
          .eq('match_id', matchId)
          .order('created_at', { ascending: false })
          .limit(12);
        
        if (ballError) throw ballError;
        setBallEvents(ballData as BallEvent[]);

      } catch (err) {
        console.error('Error fetching scoreboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Realtime subscription for match
    const matchChannel = supabase
      .channel(`match_scoreboard_${matchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          if (payload.new) {
            setMatch(prev => prev ? { ...prev, ...payload.new } : (payload.new as Match));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ball_events',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          setBallEvents(prev => [payload.new as BallEvent, ...prev.slice(0, 11)]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'ball_events',
          filter: `match_id=eq.${matchId}`,
        },
        () => {
          // Re-fetch ball events on delete (undo)
          supabase
            .from('ball_events')
            .select('*')
            .eq('match_id', matchId)
            .order('created_at', { ascending: false })
            .limit(12)
            .then(({ data }) => {
              if (data) setBallEvents(data as BallEvent[]);
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(matchChannel);
    };
  }, [matchId]);

  return { match, ballEvents, loading };
};
