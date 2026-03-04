
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';
import { Users } from 'lucide-react';

export const Partnership: React.FC<{ match: Match }> = ({ match }) => {
  // Mock partnership data
  const pRuns = 67;
  const pBalls = 42;
  const pA = 40; // Player A contribution
  const pB = 27; // Player B contribution
  const pAPercent = (pA / pRuns) * 100;

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="absolute top-40 left-1/2 -translate-x-1/2 w-full max-w-3xl broadcast-panel rounded-[2rem] overflow-hidden"
    >
      <div className="bg-slate-800/50 p-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <Users className="w-6 h-6 text-emerald-500" />
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Current Partnership</h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white">{pRuns}</span>
          <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Runs ({pBalls} Balls)</span>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-white font-black text-2xl uppercase tracking-tighter">{match.striker}</span>
            <span className="text-emerald-400 font-black text-lg">{pA} <span className="text-slate-500 text-sm">({pAPercent.toFixed(0)}%)</span></span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white font-black text-2xl uppercase tracking-tighter">{match.non_striker}</span>
            <span className="text-blue-400 font-black text-lg">{pB} <span className="text-slate-500 text-sm">({(100 - pAPercent).toFixed(0)}%)</span></span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-4 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${pAPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${100 - pAPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          />
        </div>
      </div>
    </motion.div>
  );
};
