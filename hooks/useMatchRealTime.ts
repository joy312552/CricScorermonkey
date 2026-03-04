
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { MatchService } from '../services/MatchService';
import { Match, OverlayCommand } from '../types';

export const useMatchRealTime = (matchId: string | undefined) => {
  const [match, setMatch] = useState<Match | null>(null);
  const [overlayCommand, setOverlayCommand] = useState<OverlayCommand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;

    const init = async () => {
      try {
        const data = await MatchService.getMatchById(matchId);
        if (data) setMatch(data);
      } catch (err) {
        console.error('Error fetching match:', err);
      } finally {
        setLoading(false);
      }
    };

    init();

    // STEP 5: REALTIME SUBSCRIPTION
    const channel = supabase
      .channel(`match_realtime_${matchId}`)
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
            setMatch(payload.new as Match);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'overlay_commands',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          if (payload.new) {
            setOverlayCommand(payload.new as OverlayCommand);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  return { match, overlayCommand, loading };
};
