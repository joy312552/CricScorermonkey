import React from 'react';
import { motion } from 'framer-motion';

interface CenteredScoreboardProps {
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

export const CenteredScoreboard: React.FC<CenteredScoreboardProps> = ({
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
  crr: providedCrr
}) => {
  const currentOversNum = parseFloat(overs);
  const runsScored = parseInt(score.split('-')[0]);
  
  // Auto-calculate CRR if not provided
  let displayCrr = providedCrr;
  if (!displayCrr) {
    if (currentOversNum > 0) {
      // Convert overs like 15.3 to total balls then back to decimal overs for calculation
      const fullOvers = Math.floor(currentOversNum);
      const ballsInCurrentOver = Math.round((currentOversNum % 1) * 10);
      const totalBalls = (fullOvers * 6) + ballsInCurrentOver;
      const decimalOvers = totalBalls / 6;
      displayCrr = (runsScored / decimalOvers).toFixed(2);
    } else {
      displayCrr = '0.00';
    }
  }

  const ballsBowled = Math.floor(currentOversNum) * 6 + Math.round((currentOversNum % 1) * 10);
  const totalBallsMatch = matchOvers * 6;
  const ballsRemaining = Math.max(0, totalBallsMatch - ballsBowled);
  
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
      initial={{ y: 100, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        maxWidth: '1100px',
      }}
      className="h-20 flex items-stretch font-sans select-none z-50 drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden rounded-xl border border-white/10 bg-slate-900/95"
    >
      {/* LEFT SECTION: BATTING TEAM & BATSMEN */}
      <div className="flex-[1.5] flex items-center px-6 gap-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent pointer-events-none" />
        
        {/* Team Logo */}
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg border border-white/20">
          <span className="text-white font-black text-xl italic">{teamA.charAt(0)}</span>
        </div>

        {/* Batsmen */}
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="text-white font-black text-base uppercase tracking-tight truncate max-w-[150px]">{striker}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-yellow-400 font-black text-lg">{strikerRuns}</span>
              <span className="text-white/40 font-bold text-xs">({strikerBalls})</span>
            </div>
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_#facc15]" />
          </div>
          <div className="flex items-center gap-3 opacity-60">
            <span className="text-white font-bold text-sm uppercase tracking-tight truncate max-w-[130px]">{nonStriker}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-white font-bold text-sm">{nonStrikerRuns}</span>
              <span className="text-white/40 font-bold text-[10px]">({nonStrikerBalls})</span>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER SECTION: MAIN SCORE & OVERS & CRR */}
      <div className="flex-1 bg-gradient-to-b from-slate-50 via-white to-slate-200 flex flex-col items-center justify-center relative z-10 shadow-inner px-4 overflow-hidden">
        <div className="absolute top-0 w-full h-1 bg-blue-600" />
        
        <div className="flex items-baseline gap-2">
          <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{teamA.substring(0, 3)}</span>
          <span className="text-slate-900 font-black text-4xl tracking-tighter leading-none">{score}</span>
        </div>

        <div className="flex flex-col items-center -mt-1">
          <span className="text-slate-800 font-black text-xs uppercase tracking-tighter">
            {overs} <span className="text-slate-400 font-bold text-[10px]">OVERS</span>
          </span>
          <div className="flex gap-3 mt-0.5">
            <span className="text-blue-700 font-black text-[10px] uppercase tracking-widest">
              CRR: {displayCrr}
            </span>
            {rrr && (
              <span className="text-red-600 font-black text-[10px] uppercase tracking-widest">
                RRR: {rrr}
              </span>
            )}
          </div>
        </div>

        <div className="absolute bottom-1 text-slate-900/30 text-[8px] font-black uppercase tracking-[0.4em]">
          {inning}
        </div>
      </div>

      {/* RIGHT SECTION: BOWLING TEAM & BOWLER */}
      <div className="flex-1 flex items-center justify-end px-6 gap-4 relative">
        <div className="absolute inset-0 bg-gradient-to-l from-slate-800/50 to-transparent pointer-events-none" />

        {/* Bowler Info */}
        <div className="flex flex-col items-end justify-center min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-white/30 font-bold text-[10px] uppercase tracking-widest">BOWLING</span>
            <span className="text-white font-black text-base uppercase tracking-tight truncate max-w-[150px]">{bowler}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white font-black text-2xl tracking-tighter">{bowlerWickets}-{bowlerRuns}</span>
            <span className="text-white/40 font-bold text-xs">({bowlerOvers})</span>
          </div>
        </div>

        {/* Team Logo */}
        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 shadow-lg border border-white/10">
          <span className="text-white font-black text-xl italic">{teamB.charAt(0)}</span>
        </div>
      </div>
    </motion.div>
  );
};
