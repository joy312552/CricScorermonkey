
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';

export const IntroBanner: React.FC<{ match: Match, theme?: string }> = ({ match, theme = 'theme1' }) => {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm ${
        isTheme2 ? 'bg-slate-950/80' : isTheme3 ? 'bg-emerald-950/80' : 'bg-black/40'
      }`}
    >
      <div className="w-full max-w-6xl flex items-center justify-between px-20">
        {/* Team A */}
        <motion.div 
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className={`w-48 h-48 rounded-3xl flex items-center justify-center border-4 border-white/20 animate-light-sweep ${
            isTheme2 ? 'bg-slate-800 shadow-[0_0_50px_rgba(30,41,59,0.4)]' : 
            isTheme3 ? 'bg-emerald-800 shadow-[0_0_50px_rgba(6,78,59,0.4)]' : 
            'bg-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.4)]'
          }`}>
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
          <div className={`h-32 w-1 bg-gradient-to-b from-transparent via-white to-transparent ${
            isTheme2 ? 'via-slate-400' : isTheme3 ? 'via-emerald-400' : 'via-white'
          }`} />
          <span className="text-7xl font-black italic text-white my-8 broadcast-text-shadow">VS</span>
          <div className={`h-32 w-1 bg-gradient-to-b from-transparent via-white to-transparent ${
            isTheme2 ? 'via-slate-400' : isTheme3 ? 'via-emerald-400' : 'via-white'
          }`} />
        </motion.div>

        {/* Team B */}
        <motion.div 
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className={`w-48 h-48 rounded-3xl flex items-center justify-center border-4 border-white/20 animate-light-sweep ${
            isTheme2 ? 'bg-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.4)]' : 
            isTheme3 ? 'bg-emerald-700 shadow-[0_0_50px_rgba(0,0,0,0.4)]' : 
            'bg-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.4)]'
          }`}>
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
        className={`absolute bottom-20 px-12 py-4 backdrop-blur-xl border border-white/20 rounded-full ${
          isTheme2 ? 'bg-slate-900/40' : isTheme3 ? 'bg-emerald-900/40' : 'bg-white/10'
        }`}
      >
        <span className="text-white font-bold tracking-[0.5em] uppercase text-xl">
          Live from {match.venue || 'Central Stadium'}
        </span>
      </motion.div>
    </motion.div>
  );
};
