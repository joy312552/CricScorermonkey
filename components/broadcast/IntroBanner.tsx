
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';

export const IntroBanner: React.FC<{ match: Match }> = ({ match }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-6xl flex items-center justify-between px-20">
        {/* Team A */}
        <motion.div 
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-48 h-48 bg-blue-600 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] border-4 border-white/20 animate-light-sweep">
            <span className="text-white text-8xl font-black italic">{match.team_a.charAt(0)}</span>
          </div>
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter broadcast-text-shadow">
            {match.team_a}
          </h2>
        </motion.div>

        {/* VS Divider */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="h-32 w-1 bg-gradient-to-b from-transparent via-white to-transparent" />
          <span className="text-7xl font-black italic text-white my-8 broadcast-text-shadow">VS</span>
          <div className="h-32 w-1 bg-gradient-to-b from-transparent via-white to-transparent" />
        </motion.div>

        {/* Team B */}
        <motion.div 
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-48 h-48 bg-slate-800 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.4)] border-4 border-white/20 animate-light-sweep">
            <span className="text-white text-8xl font-black italic">{match.team_b.charAt(0)}</span>
          </div>
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter broadcast-text-shadow">
            {match.team_b}
          </h2>
        </motion.div>
      </div>

      {/* Bottom Info */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-20 px-12 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full"
      >
        <span className="text-white font-bold tracking-[0.5em] uppercase text-xl">
          Live from {match.venue || 'Central Stadium'}
        </span>
      </motion.div>
    </motion.div>
  );
};
