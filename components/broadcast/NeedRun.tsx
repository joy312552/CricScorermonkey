
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';

export const NeedRun: React.FC<{ match: Match, theme?: string }> = ({ match, theme = 'theme1' }) => {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';
  const target = match.target || 0;
  const runs = match.runs || 0;
  const balls = match.balls || 0;
  const matchOvers = match.match_overs || 20;
  const totalBalls = matchOvers * 6;
  
  const runsNeeded = Math.max(0, target - runs);
  const ballsRemaining = Math.max(0, totalBalls - balls);

  const bgGradient = isTheme2 
    ? 'from-slate-900 to-slate-800' 
    : isTheme3 
    ? 'from-emerald-950 to-emerald-900' 
    : 'from-[#0A1128] to-[#000033]';

  const accentColor = isTheme2 ? 'bg-slate-700' : isTheme3 ? 'bg-emerald-700' : 'bg-[#FFD700]';
  const textColor = isTheme2 || isTheme3 ? 'text-white' : 'text-black';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none select-none font-sans italic"
    >
      <div className="flex gap-16">
        {/* Runs Needed Box */}
        <div className="flex flex-col items-center gap-4">
          {/* Top Label */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`${accentColor} px-12 py-2 rounded-t-3xl rounded-b-lg shadow-lg border-b-4 border-black/20 flex items-center justify-center min-w-[180px]`}
          >
            <span className={`${textColor} font-black text-3xl uppercase tracking-tighter`}>NEED</span>
          </motion.div>

          {/* Value Box */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className={`w-56 h-48 bg-gradient-to-br ${bgGradient} rounded-[40px] flex items-center justify-center relative overflow-hidden border-4 border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)]`}
          >
            {/* Glossy Reflection with Sweep Animation */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none" 
            />
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            
            <span className="text-white font-black text-9xl tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] z-10">
              {runsNeeded}
            </span>
          </motion.div>

          {/* Bottom Label */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`${accentColor} px-12 py-2 rounded-b-3xl rounded-t-lg shadow-lg border-t-4 border-white/30 flex items-center justify-center min-w-[180px]`}
          >
            <span className={`${textColor} font-black text-3xl uppercase tracking-tighter`}>RUNS</span>
          </motion.div>
        </div>

        {/* Balls Remaining Box */}
        <div className="flex flex-col items-center gap-4">
          {/* Top Label */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`${accentColor} px-12 py-2 rounded-t-3xl rounded-b-lg shadow-lg border-b-4 border-black/20 flex items-center justify-center min-w-[180px]`}
          >
            <span className={`${textColor} font-black text-3xl uppercase tracking-tighter`}>FROM</span>
          </motion.div>

          {/* Value Box */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            className={`w-56 h-48 bg-gradient-to-br ${bgGradient} rounded-[40px] flex items-center justify-center relative overflow-hidden border-4 border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)]`}
          >
            {/* Glossy Reflection with Sweep Animation */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none" 
            />
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            
            <span className="text-white font-black text-9xl tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] z-10">
              {ballsRemaining}
            </span>
          </motion.div>

          {/* Bottom Label */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`${accentColor} px-12 py-2 rounded-b-3xl rounded-t-lg shadow-lg border-t-4 border-white/30 flex items-center justify-center min-w-[180px]`}
          >
            <span className={`${textColor} font-black text-3xl uppercase tracking-tighter`}>BALLS</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
