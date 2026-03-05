
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';

interface TossOverlayProps {
  match: Match;
  visible: boolean;
}

export const TossOverlay: React.FC<TossOverlayProps> = ({ match, visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none select-none italic font-sans">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="w-[80%] max-w-4xl flex flex-col items-center"
      >
        {/* TOP BAR: TEAMS & VS */}
        <div className="w-full h-16 md:h-24 flex items-stretch relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-b-4 border-white/10">
          {/* Glossy Shine Layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/40 z-20 pointer-events-none" />
          
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] z-30 pointer-events-none"
          />

          {/* TEAM A (DARK BLUE) */}
          <div className="flex-1 bg-gradient-to-r from-[#050A18] to-[#0A1128] flex items-center justify-end pr-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent" />
            <span className="text-white font-black text-2xl md:text-4xl uppercase tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] z-10">
              {match.team_a}
            </span>
          </div>

          {/* VS CENTER PIECE */}
          <div className="w-28 md:w-36 relative z-40 flex items-center justify-center">
            {/* Trapezoid Shape with Glow */}
            <div className="absolute inset-0 bg-white border-x-[6px] border-yellow-400 transform -skew-x-12 shadow-[0_0_30px_rgba(255,255,255,0.3)]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent transform -skew-x-12" />
            
            <div className="relative flex flex-col items-center">
              <span className="text-black font-black text-3xl md:text-5xl uppercase tracking-tighter italic leading-none">
                VS
              </span>
            </div>
          </div>

          {/* TEAM B (LIGHT BLUE) */}
          <div className="flex-1 bg-gradient-to-l from-[#0077B6] to-[#00A8E8] flex items-center justify-start pl-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent" />
            <span className="text-white font-black text-2xl md:text-4xl uppercase tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] z-10">
              {match.team_b}
            </span>
          </div>
        </div>

        {/* BOTTOM BAR: TOSS RESULT (RED) */}
        <div className="w-[96%] h-12 md:h-14 bg-gradient-to-r from-red-700 via-red-600 to-red-700 mt-1.5 relative overflow-hidden shadow-2xl border-t-2 border-white/30 rounded-b-sm">
          {/* Glossy Shine */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/30 z-10" />
          
          <div className="h-full flex items-center justify-center px-10">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white font-black text-base md:text-2xl uppercase tracking-[0.15em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-20"
            >
              {match.toss_winner 
                ? `${match.toss_winner} WON THE TOSS AND CHOSE TO ${match.toss_decision?.toUpperCase()}`
                : 'WAITING FOR TOSS RESULT...'}
            </motion.span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
