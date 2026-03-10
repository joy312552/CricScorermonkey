
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';

interface TossOverlayProps {
  match: Match;
  visible: boolean;
  theme?: string;
}

export const TossOverlay: React.FC<TossOverlayProps> = ({ match, visible, theme = 'theme1' }) => {
  if (!visible) return null;

  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  const teamAGradient = isTheme2 
    ? 'from-slate-900 to-slate-800' 
    : isTheme3 
    ? 'from-emerald-950 to-emerald-900' 
    : 'from-[#050A18] to-[#0A1128]';

  const teamBGradient = isTheme2 
    ? 'from-slate-800 to-slate-700' 
    : isTheme3 
    ? 'from-emerald-900 to-emerald-800' 
    : 'from-[#0077B6] to-[#00A8E8]';

  const tossGradient = isTheme2 
    ? 'from-slate-700 via-slate-600 to-slate-700' 
    : isTheme3 
    ? 'from-emerald-600 via-emerald-500 to-emerald-600' 
    : 'from-red-700 via-red-600 to-red-700';

  const vsBg = isTheme2 ? 'bg-slate-200' : isTheme3 ? 'bg-emerald-100' : 'bg-white';
  const vsBorder = isTheme2 ? 'border-slate-400' : isTheme3 ? 'border-emerald-400' : 'border-yellow-400';

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

          {/* TEAM A */}
          <div className={`flex-1 bg-gradient-to-r ${teamAGradient} flex items-center justify-end pr-16 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent" />
            <span className="text-white font-black text-2xl md:text-4xl uppercase tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] z-10">
              {match.team_a}
            </span>
          </div>

          {/* VS CENTER PIECE */}
          <div className="w-28 md:w-36 relative z-40 flex items-center justify-center">
            {/* Trapezoid Shape with Glow */}
            <div className={`absolute inset-0 ${vsBg} border-x-[6px] ${vsBorder} transform -skew-x-12 shadow-[0_0_30px_rgba(255,255,255,0.3)]`} />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent transform -skew-x-12" />
            
            <div className="relative flex flex-col items-center">
              <span className="text-black font-black text-3xl md:text-5xl uppercase tracking-tighter italic leading-none">
                VS
              </span>
            </div>
          </div>

          {/* TEAM B */}
          <div className={`flex-1 bg-gradient-to-l ${teamBGradient} flex items-center justify-start pl-16 relative overflow-hidden`}>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent" />
            <span className="text-white font-black text-2xl md:text-4xl uppercase tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] z-10">
              {match.team_b}
            </span>
          </div>
        </div>

        {/* BOTTOM BAR: TOSS RESULT */}
        <div className={`w-[96%] h-12 md:h-14 bg-gradient-to-r ${tossGradient} mt-1.5 relative overflow-hidden shadow-2xl border-t-2 border-white/30 rounded-b-sm`}>
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
