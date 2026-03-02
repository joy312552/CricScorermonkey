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
  target?: number;
  matchOvers?: number;
  crr?: string;
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
  bowlerOvers = '0.0',
  target,
  matchOvers = 20,
  crr
}) => {
  const currentOversNum = parseFloat(overs);
  const runsScored = parseInt(score.split('-')[0]);
  const ballsBowled = Math.floor(currentOversNum) * 6 + Math.round((currentOversNum % 1) * 10);
  const totalBalls = matchOvers * 6;
  const ballsRemaining = Math.max(0, totalBalls - ballsBowled);
  
  let rrr = null;
  if (target) {
    const runsNeeded = Math.max(0, target - runsScored);
    if (ballsRemaining > 0) {
      rrr = ((runsNeeded / ballsRemaining) * 6).toFixed(2);
    } else if (runsNeeded > 0) {
      rrr = 'INF';
    } else {
      rrr = '0.00';
    }
  }

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      className="fixed bottom-6 left-1/2 w-[65%] min-w-[850px] max-w-[1100px] h-16 flex items-stretch font-sans select-none z-50 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
    >
      {/* LEFT SECTION: BATTING TEAM & BATSMEN */}
      <div 
        className="flex-[1.4] bg-slate-900/95 border-l-4 border-emerald-500 flex items-center px-4 gap-4 relative overflow-hidden"
        style={{ clipPath: 'polygon(0 0, 100% 0, 94% 100%, 0 100%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />
        
        {/* Team Logo */}
        <div className="w-10 h-10 bg-white/10 rounded-full border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
          <span className="text-white font-black text-lg italic">{teamA.charAt(0)}</span>
        </div>

        {/* Batsmen */}
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-[13px] uppercase tracking-tighter truncate max-w-[120px]">{striker}</span>
            <span className="text-yellow-400 font-black text-sm">{strikerRuns}</span>
            <span className="text-white/40 font-bold text-[10px]">({strikerBalls})</span>
            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" />
          </div>
          <div className="flex items-center gap-2 opacity-60">
            <span className="text-white font-bold text-[11px] uppercase tracking-tighter truncate max-w-[100px]">{nonStriker}</span>
            <span className="text-white font-bold text-xs">{nonStrikerRuns}</span>
            <span className="text-white/40 font-bold text-[9px]">({nonStrikerBalls})</span>
          </div>
        </div>
      </div>

      {/* CENTER SECTION: MAIN SCORE & OVERS */}
      <div 
        className="flex-1 bg-gradient-to-b from-white via-slate-100 to-slate-300 flex flex-col items-center justify-center relative -mx-6 z-10 shadow-2xl"
        style={{ clipPath: 'polygon(6% 0, 94% 0, 100% 100%, 0 100%)' }}
      >
        <div className="absolute top-0.5 bg-slate-800 text-white px-2 py-0.5 rounded-b-sm text-[8px] font-black uppercase tracking-[0.2em]">
          {inning}
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">{teamA.substring(0, 3)}</span>
          <span className="text-slate-900 font-black text-3xl tracking-tighter">{score}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-800 font-black text-xs uppercase tracking-tighter">
            Overs <span className="text-emerald-700">{overs}</span>
          </span>
          <div className="flex gap-2">
            {crr && (
              <span className="text-slate-500 font-bold text-[9px] uppercase tracking-widest">
                CRR {crr}
              </span>
            )}
            {rrr && (
              <span className="text-blue-600 font-bold text-[9px] uppercase tracking-widest">
                RRR {rrr}
              </span>
            )}
          </div>
        </div>

        <div className="absolute bottom-0.5 text-slate-900/40 text-[7px] font-black uppercase tracking-[0.3em]">
          BATTING: {teamA}
        </div>
      </div>

      {/* RIGHT SECTION: BOWLING TEAM & BOWLER */}
      <div 
        className="flex-1 bg-slate-900/95 border-r-4 border-blue-500 flex items-center justify-end px-4 gap-4 relative overflow-hidden"
        style={{ clipPath: 'polygon(6% 0, 100% 0, 100% 100%, 0 100%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />

        {/* Bowler Info */}
        <div className="flex flex-col items-end justify-center min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-white/40 font-bold text-[9px] uppercase tracking-widest">BOWLING</span>
            <span className="text-white font-black text-[13px] uppercase tracking-tighter truncate max-w-[120px]">{bowler}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white font-black text-xl tracking-tighter">{bowlerWickets}-{bowlerRuns}</span>
            <span className="text-white/40 font-bold text-[10px]">({bowlerOvers})</span>
          </div>
        </div>

        {/* Team Logo */}
        <div className="w-10 h-10 bg-white/10 rounded-full border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
          <span className="text-white font-black text-lg italic">{teamB.charAt(0)}</span>
        </div>
      </div>
    </motion.div>
  );
};
