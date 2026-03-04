
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';
import { Trophy, Star } from 'lucide-react';

export const MatchSummary: React.FC<{ match: Match }> = ({ match }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl"
    >
      <div className="w-full max-w-4xl broadcast-panel rounded-[3rem] overflow-hidden">
        {/* Header */}
        <div className="broadcast-gradient-primary p-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Trophy className="w-10 h-10 text-yellow-400" />
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Match Summary</h2>
          </div>
          <span className="px-6 py-2 bg-white/20 rounded-full text-white font-bold tracking-widest text-sm">FINAL RESULT</span>
        </div>

        {/* Scores */}
        <div className="p-12 space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl italic">
                {match.team_a.charAt(0)}
              </div>
              <span className="text-4xl font-black text-white uppercase tracking-tighter">{match.team_a}</span>
            </div>
            <div className="text-right">
              <span className="text-6xl font-black text-white">{match.runs}/{match.wickets}</span>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-2">{match.overs.toFixed(1)} Overs</p>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          <div className="flex items-center justify-between opacity-60">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-white font-black text-2xl italic">
                {match.team_b.charAt(0)}
              </div>
              <span className="text-4xl font-black text-white uppercase tracking-tighter">{match.team_b}</span>
            </div>
            <div className="text-right">
              <span className="text-6xl font-black text-white">0/0</span>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-2">0.0 Overs</p>
            </div>
          </div>
        </div>

        {/* Result & POTM */}
        <div className="bg-white/5 p-10 flex items-center justify-between border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-emerald-400 font-black text-3xl uppercase tracking-tighter">
              {match.team_a} WON BY {match.runs} RUNS
            </span>
          </div>
          <div className="flex items-center gap-4 bg-yellow-400/10 px-6 py-3 rounded-2xl border border-yellow-400/20">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <div className="flex flex-col">
              <span className="text-yellow-400 font-black text-xs uppercase tracking-widest">Player of the Match</span>
              <span className="text-white font-black text-xl uppercase tracking-tighter">{match.striker || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
