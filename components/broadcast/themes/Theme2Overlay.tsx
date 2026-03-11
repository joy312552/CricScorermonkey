
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Match, BallEvent } from '../../../types';

interface ThemeOverlayProps {
  match: Match;
  recentBalls: BallEvent[];
  scoreAnimation: string | null;
}

export const Theme2Overlay: React.FC<ThemeOverlayProps> = ({ match, recentBalls, scoreAnimation }) => {
  const crr = useMemo(() => {
    const totalBalls = match.balls || 0;
    if (totalBalls === 0) return '0.00';
    return ((match.runs / totalBalls) * 6).toFixed(2);
  }, [match.runs, match.balls]);

  const projectedScore = useMemo(() => {
    const totalBalls = match.balls || 0;
    if (totalBalls === 0) return '0';
    const rate = match.runs / totalBalls;
    return Math.round(rate * (match.match_overs || 20) * 6);
  }, [match.runs, match.balls, match.match_overs]);

  const battingTeam = match.current_innings === 1 ? match.team_a_name : match.team_b_name;
  const bowlingTeam = match.current_innings === 1 ? match.team_b_name : match.team_a_name;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none select-none font-sans flex justify-center pb-6">
      <div className="flex items-stretch h-[90px] w-[98%] max-w-[1500px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 rounded-sm">
        
        {/* LEFT SECTION: TEAM & SCORE (DARK METALLIC) */}
        <div className="bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#111] flex items-center px-6 gap-6 relative overflow-hidden min-w-[380px]">
          {/* Logo Space (Blank with Team Name) */}
          <div className="w-16 h-16 bg-gradient-to-br from-slate-200/10 to-transparent rounded-full flex items-center justify-center border border-white/20 shrink-0 shadow-inner">
            <span className="text-white font-black text-sm text-center leading-tight uppercase px-1 drop-shadow-lg">
              {battingTeam?.substring(0, 3)}
            </span>
          </div>

          <div className="flex flex-col justify-center flex-1">
            <div className="flex items-center gap-4">
              <span className="text-white font-black italic text-4xl tracking-tighter uppercase drop-shadow-md">
                {battingTeam?.substring(0, 3)}
              </span>
              <div className="bg-gradient-to-b from-[#0056b3] to-[#003d80] px-5 py-1.5 rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] border border-white/10">
                <span className="text-white font-black text-4xl tracking-tighter drop-shadow-lg">
                  {match.runs} - {match.wickets}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-white font-black text-2xl tracking-tighter drop-shadow-md">
                  {match.overs.toFixed(1)}
                </span>
                <span className="text-white/60 font-black text-xs uppercase">
                  ({match.current_innings})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-8 mt-1.5">
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-[11px] font-black uppercase tracking-widest">CRR :</span>
                <span className="text-white font-black text-base tracking-tight">{crr}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-[11px] font-black uppercase tracking-widest">PROJECTED SCORE :</span>
                <span className="text-white font-black text-base tracking-tight">{projectedScore}</span>
              </div>
            </div>
          </div>
          
          {/* Subtle Shine Effect */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        </div>

        {/* MIDDLE SECTION: BATTERS (BLUE METALLIC) */}
        <div className="bg-gradient-to-b from-[#0047AB] via-[#003399] to-[#002366] flex-1 flex flex-col justify-center px-8 border-x border-white/10 relative overflow-hidden">
          {/* Striker */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.5 2L14.5 6L16.5 8L20.5 4L18.5 2M13.5 7L3.5 17L2.5 21L6.5 20L16.5 10L13.5 7Z" />
                </svg>
              </motion.div>
              <span className="text-white font-black text-xl tracking-tight uppercase italic drop-shadow-md truncate max-w-[180px]">
                {match.striker || 'BATTER 1'}
              </span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-white font-black text-2xl tracking-tighter drop-shadow-lg">{match.striker_runs}</span>
              <span className="text-white/70 font-bold text-lg">{match.striker_balls}</span>
            </div>
          </div>
          
          {/* Divider */}
          <div className="h-[1px] bg-white/10 my-1.5 w-full z-10" />

          {/* Non-Striker */}
          <div className="flex items-center justify-between z-10 opacity-80">
            <div className="flex items-center gap-4 pl-8">
              <span className="text-white font-black text-xl tracking-tight uppercase italic drop-shadow-md truncate max-w-[180px]">
                {match.non_striker || 'BATTER 2'}
              </span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-white font-black text-2xl tracking-tighter drop-shadow-lg">{match.non_striker_runs}</span>
              <span className="text-white/70 font-bold text-lg">{match.non_striker_balls}</span>
            </div>
          </div>

          {/* Lens Flare / Shine */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        </div>

        {/* INNING SECTION (VIBRANT YELLOW) */}
        <div className="bg-gradient-to-b from-[#FFD700] to-[#E6C200] w-32 flex flex-col items-center justify-center border-x border-black/20 shadow-inner relative overflow-hidden">
          <span className="text-black font-black text-[11px] uppercase tracking-[0.3em] leading-none mb-1 z-10">INNING</span>
          <span className="text-black font-black text-4xl tracking-tighter italic leading-none z-10 drop-shadow-sm">
            {match.current_innings === 1 ? '1ST' : '2ND'}
          </span>
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        </div>

        {/* RIGHT SECTION: BOWLER (DEEP RED METALLIC) */}
        <div className="bg-gradient-to-b from-[#D2042D] via-[#B20326] to-[#8B0000] flex-1 flex flex-col justify-center px-8 relative overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <span className="text-white font-black text-xl tracking-tight uppercase italic drop-shadow-md truncate max-w-[180px]">
              {match.bowler || 'BOWLER'}
            </span>
            <div className="flex items-baseline gap-4">
              <span className="text-white font-black text-2xl tracking-tighter drop-shadow-lg">
                {match.bowler_wickets} - {match.bowler_runs}
              </span>
              <span className="text-white/70 font-bold text-lg">
                {(match.bowler_overs || 0).toFixed(1)}
              </span>
            </div>
          </div>

          {/* Recent Balls */}
          <div className="flex items-center gap-2 mt-2 z-10">
            {recentBalls.slice(0, 6).reverse().map((ball, idx) => (
              <div 
                key={idx}
                className={`w-7 h-7 rounded-sm flex items-center justify-center text-[11px] font-black shadow-md border border-white/10 ${
                  ball.wicket ? 'bg-[#8B0000] text-white' : 
                  ball.runs === 4 ? 'bg-green-600 text-white' :
                  ball.runs === 6 ? 'bg-green-700 text-white' :
                  'bg-white/10 text-white/90 backdrop-blur-sm'
                }`}
              >
                {ball.wicket ? 'W' : ball.runs}
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        </div>

        {/* FAR RIGHT SECTION: OPPONENT (DARK METALLIC) */}
        <div className="bg-gradient-to-l from-[#0a0a0a] via-[#1a1a1a] to-[#111] flex items-center px-6 gap-6 min-w-[180px] justify-end relative overflow-hidden">
          <div className="flex flex-col items-end z-10">
            <span className="text-white/40 text-[11px] font-black uppercase tracking-widest leading-none mb-1">OPPONENT</span>
            <span className="text-white font-black text-2xl tracking-tighter uppercase italic drop-shadow-md">
              {bowlingTeam?.substring(0, 3)}
            </span>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-slate-200/10 to-transparent rounded-full flex items-center justify-center border border-white/20 shrink-0 shadow-inner z-10">
            <span className="text-white font-black text-sm text-center leading-tight uppercase px-1 drop-shadow-lg">
              {bowlingTeam?.substring(0, 3)}
            </span>
          </div>
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        </div>

      </div>

      {/* SCORE ANIMATION OVERLAY */}
      <AnimatePresence>
        {scoreAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.5, y: -50 }}
            className="absolute -top-40 left-0 right-0 flex justify-center pointer-events-none"
          >
            <div className={`px-16 py-6 rounded-3xl border-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] ${
              scoreAnimation === 'WICKET' ? 'bg-gradient-to-b from-red-500 to-red-700 border-red-400' :
              scoreAnimation === 'SIX' ? 'bg-gradient-to-b from-blue-500 to-blue-700 border-blue-400' :
              scoreAnimation === 'FOUR' ? 'bg-gradient-to-b from-green-500 to-green-700 border-green-400' :
              'bg-gradient-to-b from-slate-700 to-slate-900 border-slate-600'
            }`}>
              <span className="text-white font-black text-7xl uppercase tracking-tighter italic drop-shadow-2xl">
                {scoreAnimation}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
