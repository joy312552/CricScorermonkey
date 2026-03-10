
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';
import { Target, TrendingUp } from 'lucide-react';

export const TargetNeed: React.FC<{ match: Match, type: 'TARGET' | 'NEED', theme?: string }> = ({ match, type, theme = 'theme1' }) => {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';
  const target = match.target || 0;
  const runsScored = match.runs || 0;
  const runsNeeded = Math.max(0, target - runsScored);
  const ballsBowled = match.balls || 0;
  const totalBalls = (match.match_overs || 20) * 6;
  const ballsRemaining = Math.max(0, totalBalls - ballsBowled);
  const rrr = ballsRemaining > 0 ? ((runsNeeded / ballsRemaining) * 6).toFixed(2) : '0.00';

  if (type === 'TARGET') {
    return (
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="absolute bottom-40 left-1/2 -translate-x-1/2 broadcast-panel rounded-3xl overflow-hidden flex items-stretch"
      >
        <div className={`${isTheme3 ? 'bg-emerald-600' : 'bg-blue-600'} p-8 flex flex-col items-center justify-center border-r border-white/10`}>
          <Target className="w-10 h-10 text-white mb-2" />
          <span className="text-white/60 font-black text-[10px] uppercase tracking-widest">TARGET</span>
        </div>
        <div className={`p-8 flex flex-col justify-center min-w-[300px] ${isTheme2 ? 'bg-slate-900/95' : isTheme3 ? 'bg-emerald-950/95' : 'bg-slate-900/95'}`}>
          <h2 className="text-6xl font-black text-white tracking-tighter leading-none">{target}</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">
            {match.team_a} needs to score {target} in {match.match_overs} overs
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="absolute bottom-40 left-20 broadcast-panel rounded-3xl overflow-hidden flex items-stretch"
    >
      <div className={`${isTheme3 ? 'bg-emerald-500' : 'bg-amber-500'} p-8 flex flex-col items-center justify-center border-r border-white/10`}>
        <TrendingUp className="w-10 h-10 text-white mb-2" />
        <span className="text-white/60 font-black text-[10px] uppercase tracking-widest">EQUATION</span>
      </div>
      <div className={`p-8 flex flex-col justify-center ${isTheme2 ? 'bg-slate-900/95' : isTheme3 ? 'bg-emerald-950/95' : 'bg-slate-900/95'}`}>
        <div className="flex items-baseline gap-4">
          <span className="text-5xl font-black text-white uppercase tracking-tighter">NEED {runsNeeded}</span>
          <span className="text-2xl font-bold text-slate-400 uppercase tracking-widest">FROM {ballsRemaining} BALLS</span>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="px-4 py-1.5 bg-white/5 rounded-lg border border-white/10">
            <span className="text-emerald-400 font-black text-sm uppercase tracking-widest">RRR: {rrr}</span>
          </div>
          <div className="px-4 py-1.5 bg-white/5 rounded-lg border border-white/10">
            <span className="text-blue-400 font-black text-sm uppercase tracking-widest">CRR: {(runsScored / Math.max(0.1, ballsBowled / 6)).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
