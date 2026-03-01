
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { MatchService } from '../services/MatchService';
import { Match } from '../types';

export const useMatchRealTime = (matchId: string | undefined) => {
  const [match, setMatch] = useState<Match | null>(null);
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
      .channel(`match_${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          // Automatically update UI when database changes
          setMatch(payload.new as Match);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  return { match, loading };
};
