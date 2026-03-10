
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';
import { TrendingUp, PlusCircle } from 'lucide-react';

export const StatPanels: React.FC<{ match: Match, type: 'CRR' | 'EXTRA', theme?: string }> = ({ match, type, theme = 'theme1' }) => {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';
  const crr = (match.runs / Math.max(0.1, match.balls / 6)).toFixed(2);
  const target = match.target || 0;
  const runsNeeded = Math.max(0, target - match.runs);
  const ballsRemaining = Math.max(0, (match.match_overs || 20) * 6 - match.balls);
  const rrr = ballsRemaining > 0 ? ((runsNeeded / ballsRemaining) * 6).toFixed(2) : '0.00';

  if (type === 'CRR') {
    return (
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        className={`absolute top-40 left-20 broadcast-panel rounded-2xl overflow-hidden flex items-center gap-6 p-6 shadow-2xl ${
          isTheme2 ? 'bg-slate-900/95' : isTheme3 ? 'bg-emerald-950/95' : 'bg-slate-900/95'
        }`}
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${isTheme3 ? 'bg-emerald-500' : 'bg-emerald-500'}`}>
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Current Run Rate</span>
          <span className="text-white font-black text-4xl tracking-tighter">{crr}</span>
        </div>
        {target > 0 && (
          <>
            <div className="w-px h-12 bg-white/10 mx-2" />
            <div className="flex flex-col">
              <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Required RR</span>
              <span className={`${isTheme3 ? 'text-emerald-400' : 'text-blue-400'} font-black text-4xl tracking-tighter`}>{rrr}</span>
            </div>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className={`absolute top-40 right-20 broadcast-panel rounded-2xl overflow-hidden p-8 shadow-2xl min-w-[300px] ${
        isTheme2 ? 'bg-slate-900/95' : isTheme3 ? 'bg-emerald-950/95' : 'bg-slate-900/95'
      }`}
    >
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
        <PlusCircle className={`w-6 h-6 ${isTheme3 ? 'text-emerald-500' : 'text-blue-500'}`} />
        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Extras Breakdown</h3>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Wide</span>
          <span className="text-white font-black text-xl">12</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Ball</span>
          <span className="text-white font-black text-xl">2</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Leg Bye</span>
          <span className="text-white font-black text-xl">4</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Bye</span>
          <span className="text-white font-black text-xl">1</span>
        </div>
        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
          <span className={`${isTheme3 ? 'text-emerald-400' : 'text-emerald-400'} font-black uppercase tracking-widest text-xs`}>Total Extras</span>
          <span className={`${isTheme3 ? 'text-emerald-400' : 'text-emerald-400'} font-black text-2xl`}>19</span>
        </div>
      </div>
    </motion.div>
  );
};
