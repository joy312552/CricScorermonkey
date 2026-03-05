
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';

export const Partnership: React.FC<{ match: Match }> = ({ match }) => {
  // Mock partnership data for now
  const pRuns = 68;
  const pBalls = 42;
  const pA = 32;
  const pABalls = 24;
  const pB = 35;
  const pBBalls = 29;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      className="absolute bottom-40 left-1/2 -translate-x-1/2 w-full max-w-4xl z-[100] pointer-events-none select-none font-sans italic"
    >
      <div className="bg-gradient-to-br from-[#0A1128] to-[#1A237E] rounded-lg overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.6)] border-2 border-white/10 relative flex items-center h-24">
        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        
        {/* Left Section: Batsman 1 */}
        <div className="flex-1 flex flex-col items-center justify-center border-r border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors" />
          <span className="text-white font-black text-xl uppercase tracking-tighter relative z-10">{match.striker || 'VIRAT KOHLI'}</span>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-cyan-400 font-black text-2xl">{pA}</span>
            <span className="text-white/60 font-bold text-sm uppercase">({pABalls})</span>
          </div>
        </div>

        {/* Center Section: Partnership */}
        <div className="w-64 flex flex-col items-center justify-center bg-black/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
          <span className="text-cyan-400 font-black text-xs uppercase tracking-[0.3em] mb-1 relative z-10">PARTNERSHIP</span>
          <motion.span 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-white font-black text-4xl tracking-tighter relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            {pRuns} <span className="text-lg font-bold text-white/60 uppercase">RUNS</span>
          </motion.span>
          {/* Glowing Highlight Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
        </div>

        {/* Right Section: Batsman 2 */}
        <div className="flex-1 flex flex-col items-center justify-center border-l border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors" />
          <span className="text-white font-black text-xl uppercase tracking-tighter relative z-10">{match.non_striker || 'ROHIT SHARMA'}</span>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-cyan-400 font-black text-2xl">{pB}</span>
            <span className="text-white/60 font-bold text-sm uppercase">({pBBalls})</span>
          </div>
        </div>

        {/* Animated Shine Sweep */}
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] pointer-events-none"
        />
      </div>
    </motion.div>
  );
};
