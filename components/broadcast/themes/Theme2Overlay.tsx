
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Match, BallEvent } from '../../../types';

interface ThemeOverlayProps {
  match: Match;
  recentBalls: BallEvent[];
  scoreAnimation: string | null;
}

export const Theme2Overlay: React.FC<ThemeOverlayProps> = ({ match, recentBalls, scoreAnimation }) => {
  const crr = useMemo(() => {
    const totalBalls = match.balls || 0;
    if (totalBalls === 0) return '0.00';
    return ((match.runs / totalBalls) * 6).toFixed(2);
  }, [match.runs, match.balls]);

  return (
    <div className="fixed bottom-10 left-10 right-10 z-50 pointer-events-none select-none font-sans">
      {/* MINIMAL ANIMATION */}
      <AnimatePresence>
        {(scoreAnimation === 'FOUR' || scoreAnimation === 'SIX' || scoreAnimation === 'WICKET') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-20 left-0 right-0 flex justify-center"
          >
            <div className="bg-cyan-500/90 backdrop-blur-md px-8 py-2 rounded-full border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              <span className="text-white font-black text-2xl uppercase tracking-widest">
                {scoreAnimation}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex items-stretch h-20 shadow-2xl">
        {/* TEAM & SCORE */}
        <div className="flex items-center px-8 gap-6 border-r border-white/5">
          <div className="flex flex-col">
            <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest">MATCH LIVE</span>
            <span className="text-white font-black text-2xl tracking-tighter uppercase">{match.team_a}</span>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="flex items-baseline gap-2">
            <span className="text-white font-black text-4xl tracking-tighter">{match.runs}/{match.wickets}</span>
            <span className="text-white/50 font-bold text-lg">({match.overs.toFixed(1)})</span>
          </div>
        </div>

        {/* BATTERS */}
        <div className="flex-1 flex items-center px-8 gap-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="text-white font-bold text-lg uppercase tracking-tight">{match.striker}</span>
            <span className="text-cyan-400 font-black text-xl">{match.striker_runs}</span>
            <span className="text-white/30 text-sm">({match.striker_balls})</span>
          </div>
          <div className="flex items-center gap-3 opacity-50">
            <span className="text-white font-medium text-lg uppercase tracking-tight">{match.non_striker}</span>
            <span className="text-white font-bold text-xl">{match.non_striker_runs}</span>
            <span className="text-white/30 text-sm">({match.non_striker_balls})</span>
          </div>
        </div>

        {/* STATS */}
        <div className="bg-cyan-500/10 px-8 flex flex-col justify-center items-end border-l border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">CRR</span>
            <span className="text-cyan-400 font-black text-2xl tracking-tighter">{crr}</span>
          </div>
          {match.target && (
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">TARGET</span>
              <span className="text-white font-black text-lg tracking-tighter">{match.target}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
