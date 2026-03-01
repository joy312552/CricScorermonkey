import React from 'react';
import { motion } from 'framer-motion';

interface LowerScoreboardProps {
  teamA: string;
  teamB: string;
  striker: string;
  nonStriker: string;
  bowler: string;
  score: string;
  overs: string;
  inning: string;
  strikerRuns?: number;
  strikerBalls?: number;
  nonStrikerRuns?: number;
  nonStrikerBalls?: number;
  bowlerWickets?: number;
  bowlerRuns?: number;
  bowlerOvers?: string;
}

export const LowerScoreboard: React.FC<LowerScoreboardProps> = ({
  teamA,
  teamB,
  striker,
  nonStriker,
  bowler,
  score,
  overs,
  inning,
  strikerRuns = 0,
  strikerBalls = 0,
  nonStrikerRuns = 0,
  nonStrikerBalls = 0,
  bowlerWickets = 0,
  bowlerRuns = 0,
  bowlerOvers = '0.0'
}) => {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[1200px] h-24 flex items-stretch font-sans select-none z-50"
    >
      {/* LEFT SECTION: BATTING (GREEN) */}
      <div className="relative flex-1 bg-gradient-to-r from-[#0f5f2e] to-[#1f8f4a] flex items-center px-6 overflow-hidden border-l-4 border-emerald-400">
        {/* Animated Glow behind logo */}
        <div className="absolute -left-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
        
        {/* Team Logo Placeholder */}
        <div className="relative z-10 w-14 h-14 bg-white/10 rounded-full border border-white/20 flex items-center justify-center mr-4 shadow-lg">
          <div className="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center text-white font-black text-xl italic">
            {teamA.charAt(0)}
          </div>
        </div>

        {/* Batsmen Info */}
        <div className="relative z-10 flex flex-col justify-center gap-1">
          <div className="flex items-center gap-3">
            <span className="text-white font-black text-sm uppercase tracking-tighter w-32 truncate">{striker}</span>
            <span className="text-yellow-400 font-black text-lg tracking-tighter">{strikerRuns}</span>
            <span className="text-white/60 font-bold text-xs">({strikerBalls})</span>
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
          </div>
          <div className="flex items-center gap-3 opacity-80">
            <span className="text-white/80 font-bold text-sm uppercase tracking-tighter w-32 truncate">{nonStriker}</span>
            <span className="text-white/80 font-bold text-lg tracking-tighter">{nonStrikerRuns}</span>
            <span className="text-white/40 font-bold text-xs">({nonStrikerBalls})</span>
          </div>
        </div>

        {/* Angular Cut */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-black/10 skew-x-[20deg] translate-x-4" />
      </div>

      {/* CENTER SECTION: SCORE (METALLIC WHITE) */}
      <div className="relative w-[400px] bg-gradient-to-b from-white via-slate-200 to-slate-300 flex flex-col items-center justify-center px-4 shadow-[0_0_40px_rgba(255,255,255,0.2)] z-20">
        {/* Top Label */}
        <div className="absolute top-1 bg-slate-800 text-white px-3 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest">
          {inning}
        </div>

        {/* Main Score */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-slate-900 font-black text-xs uppercase tracking-widest opacity-60">{teamA}</span>
          <span className="text-slate-900 font-black text-4xl tracking-tighter">{score}</span>
        </div>

        {/* Overs */}
        <div className="text-slate-800 font-black text-sm uppercase tracking-tighter">
          Overs <span className="text-emerald-700">{overs}</span>
        </div>

        {/* Bottom Text */}
        <div className="absolute bottom-1 text-slate-900/40 text-[8px] font-black uppercase tracking-[0.4em]">
          BATTING: {teamA}
        </div>
      </div>

      {/* RIGHT SECTION: BOWLING (BLUE) */}
      <div className="relative flex-1 bg-gradient-to-l from-[#0a2a6c] to-[#1540a1] flex items-center justify-end px-6 overflow-hidden border-r-4 border-blue-400">
        {/* Animated Glow behind logo */}
        <div className="absolute -right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />

        {/* Bowler Info */}
        <div className="relative z-10 flex flex-col items-end justify-center gap-1 mr-4">
          <div className="flex items-center gap-3">
            <span className="text-white/60 font-bold text-xs uppercase tracking-widest">BOWLING</span>
            <span className="text-white font-black text-sm uppercase tracking-tighter truncate max-w-[120px]">{bowler}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white font-black text-2xl tracking-tighter">{bowlerWickets}-{bowlerRuns}</span>
            <span className="text-white/40 font-bold text-xs">({bowlerOvers})</span>
          </div>
        </div>

        {/* Team Logo Placeholder */}
        <div className="relative z-10 w-14 h-14 bg-white/10 rounded-full border border-white/20 flex items-center justify-center shadow-lg">
          <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-black text-xl italic">
            {teamB.charAt(0)}
          </div>
        </div>

        {/* Angular Cut */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-l from-transparent to-black/10 -skew-x-[20deg] -translate-x-4" />
      </div>

      {/* Subtle Bottom Shadow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-4 bg-black/40 blur-xl rounded-full" />
    </motion.div>
  );
};
