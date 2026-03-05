
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';

export const TeamVS: React.FC<{ match: Match }> = ({ match }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-[100] font-sans italic"
    >
      {/* Animated Particles Background (Subtle) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '110%', x: `${Math.random() * 100}%`, opacity: 0 }}
            animate={{ y: '-10%', opacity: [0, 0.5, 0] }}
            transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: 'linear', delay: Math.random() * 5 }}
            className="absolute w-1 h-1 bg-white rounded-full"
          />
        ))}
      </div>

      <div className="w-full max-w-7xl relative">
        {/* Top Title: LIVE FROM */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute -top-32 left-1/2 -translate-x-1/2 text-center"
        >
          <span className="text-cyan-400 font-black text-xl tracking-[0.3em] uppercase block mb-2">LIVE FROM</span>
          <h3 className="text-white font-black text-5xl uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            {match.venue || 'SHER-E-BANGLA NATIONAL STADIUM'}
          </h3>
        </motion.div>

        {/* Main VS Content */}
        <div className="flex items-center justify-between px-20 relative">
          {/* Team A */}
          <motion.div 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-8"
          >
            <div className="w-64 h-64 bg-gradient-to-br from-[#0A1128] to-[#1A237E] rounded-3xl flex items-center justify-center shadow-[0_0_80px_rgba(30,58,138,0.5)] border-4 border-white/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
              />
              <span className="text-white text-9xl font-black italic drop-shadow-2xl">{match.team_a.charAt(0)}</span>
            </div>
            <h2 className="text-6xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
              {match.team_a}
            </h2>
          </motion.div>

          {/* Center VS */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="h-40 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
              <span className="text-9xl font-black italic text-white my-10 drop-shadow-[0_0_30px_rgba(34,211,238,0.8)]">VS</span>
              <div className="h-40 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
            </div>
          </motion.div>

          {/* Team B */}
          <motion.div 
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-8"
          >
            <div className="w-64 h-64 bg-gradient-to-br from-[#0A1128] to-[#1A237E] rounded-3xl flex items-center justify-center shadow-[0_0_80px_rgba(30,58,138,0.5)] border-4 border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2.5 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
              />
              <span className="text-white text-9xl font-black italic drop-shadow-2xl">{match.team_b.charAt(0)}</span>
            </div>
            <h2 className="text-6xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
              {match.team_b}
            </h2>
          </motion.div>
        </div>

        {/* Bottom Section: Match Info */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-full max-w-4xl"
        >
          <div className="bg-gradient-to-r from-transparent via-[#0A1128]/80 to-transparent backdrop-blur-md border-y border-white/10 py-6 flex flex-col items-center">
            <span className="text-cyan-400 font-black text-2xl uppercase tracking-[0.4em] mb-2">
              {match.tournament_name || 'TOURNAMENT NAME'}
            </span>
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-white/20" />
              <span className="text-white/60 font-bold text-lg uppercase tracking-widest">MATCH NO. {match.id.slice(0, 4)}</span>
              <div className="h-px w-12 bg-white/20" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
