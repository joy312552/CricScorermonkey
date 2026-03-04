
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';
import { TrendingUp, User } from 'lucide-react';

export const BatsmanCard: React.FC<{ match: Match }> = ({ match }) => {
  const striker = {
    name: match.striker || 'Batter 1',
    runs: match.striker_runs || 0,
    balls: match.striker_balls || 0,
    fours: 4, // Mock for now
    sixes: 2, // Mock for now
    sr: ((match.striker_runs || 0) / Math.max(1, match.striker_balls || 0) * 100).toFixed(2)
  };

  const nonStriker = {
    name: match.non_striker || 'Batter 2',
    runs: match.non_striker_runs || 0,
    balls: match.non_striker_balls || 0,
    fours: 2,
    sixes: 1,
    sr: ((match.non_striker_runs || 0) / Math.max(1, match.non_striker_balls || 0) * 100).toFixed(2)
  };

  return (
    <motion.div 
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 200, opacity: 0 }}
      className="absolute bottom-32 left-1/2 -translate-x-1/2 w-full max-w-5xl flex gap-6"
    >
      {/* Striker Card */}
      <div className="flex-1 broadcast-panel rounded-3xl overflow-hidden border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
        <div className="broadcast-gradient-accent p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-white" />
            <span className="text-white font-black text-lg uppercase tracking-tighter">{striker.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white/80 font-black text-[10px] uppercase tracking-widest">STRIKER</span>
          </div>
        </div>
        <div className="p-6 grid grid-cols-4 gap-4 bg-slate-900/95">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-white">{striker.runs}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RUNS</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-white">{striker.balls}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BALLS</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex gap-2">
              <span className="text-xl font-black text-emerald-400">4s: {striker.fours}</span>
              <span className="text-xl font-black text-blue-400">6s: {striker.sixes}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">BOUNDARIES</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-yellow-400">{striker.sr}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">STRIKE RATE</span>
          </div>
        </div>
      </div>

      {/* Non-Striker Card */}
      <div className="flex-1 broadcast-panel rounded-3xl overflow-hidden opacity-80 scale-95 origin-bottom">
        <div className="bg-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-slate-400" />
            <span className="text-white font-black text-lg uppercase tracking-tighter">{nonStriker.name}</span>
          </div>
        </div>
        <div className="p-6 grid grid-cols-4 gap-4 bg-slate-900/95">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-white">{nonStriker.runs}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RUNS</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-white">{nonStriker.balls}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BALLS</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex gap-2">
              <span className="text-xl font-black text-slate-400">4s: {nonStriker.fours}</span>
              <span className="text-xl font-black text-slate-400">6s: {nonStriker.sixes}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">BOUNDARIES</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-slate-400">{nonStriker.sr}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">STRIKE RATE</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
