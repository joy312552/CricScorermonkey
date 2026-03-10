
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Match, BallEvent } from '../../../types';

interface ThemeOverlayProps {
  match: Match;
  recentBalls: BallEvent[];
  scoreAnimation: string | null;
}

export const Theme3Overlay: React.FC<ThemeOverlayProps> = ({ match, recentBalls, scoreAnimation }) => {
  const crr = useMemo(() => {
    const totalBalls = match.balls || 0;
    if (totalBalls === 0) return '0.00';
    return ((match.runs / totalBalls) * 6).toFixed(2);
  }, [match.runs, match.balls]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none select-none font-serif">
      {/* CLASSIC ANIMATION */}
      <AnimatePresence>
        {(scoreAnimation === 'FOUR' || scoreAnimation === 'SIX' || scoreAnimation === 'WICKET') && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute bottom-32 left-0 right-0 flex justify-center"
          >
            <div className="bg-[#002147] border-4 border-[#FFD700] px-12 py-4 shadow-2xl">
              <span className="text-[#FFD700] font-black text-6xl uppercase tracking-widest italic">
                {scoreAnimation}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center pb-4">
        <div className="flex items-stretch h-16 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {/* TEAM NAME */}
          <div className="bg-[#002147] px-8 flex items-center border-r-4 border-[#FFD700]">
            <span className="text-white font-black text-2xl uppercase tracking-tighter">{match.team_a_name || 'Team A'}</span>
          </div>
          
          {/* SCORE */}
          <div className="bg-white px-10 flex items-center gap-4">
            <span className="text-[#002147] font-black text-5xl tracking-tighter">{match.runs}-{match.wickets}</span>
            <div className="flex flex-col justify-center">
              <span className="text-[#002147] font-bold text-xl leading-none">{match.overs.toFixed(1)}</span>
              <span className="text-[#002147]/60 text-xs font-bold uppercase">OVERS</span>
            </div>
          </div>

          {/* BATTERS PANEL */}
          <div className="bg-[#002147] px-8 flex items-center gap-12 border-l-4 border-[#FFD700]">
            <div className="flex items-center gap-4">
              <span className="text-[#FFD700] font-black text-xl uppercase italic">{match.striker}*</span>
              <span className="text-white font-black text-2xl">{match.striker_runs}</span>
              <span className="text-white/50 text-sm font-bold">({match.striker_balls})</span>
            </div>
            <div className="flex items-center gap-4 opacity-70">
              <span className="text-white font-bold text-xl uppercase italic">{match.non_striker}</span>
              <span className="text-white font-black text-2xl">{match.non_striker_runs}</span>
              <span className="text-white/50 text-sm font-bold">({match.non_striker_balls})</span>
            </div>
          </div>

          {/* CRR */}
          <div className="bg-[#FFD700] px-6 flex flex-col justify-center items-center">
            <span className="text-[#002147] font-bold text-[10px] uppercase tracking-widest">CRR</span>
            <span className="text-[#002147] font-black text-2xl tracking-tighter">{crr}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
