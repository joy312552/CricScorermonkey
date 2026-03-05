
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Match, BallEvent } from '../../types';
import { Zap, Shield } from 'lucide-react';

interface LowerThirdOverlayProps {
  match: Match;
  recentBalls: BallEvent[];
  scoreAnimation: string | null;
}

export const LowerThirdOverlay: React.FC<LowerThirdOverlayProps> = ({ match, recentBalls, scoreAnimation }) => {
  const [infoIndex, setInfoIndex] = useState(0);
  
  const infoTexts = useMemo(() => [
    'NEW TOURNAMENT COMING UP',
    match.tournament_name || 'CRIC SCORE PRO LEAGUE',
    `MATCH #${match.id.substring(0, 4).toUpperCase()}`,
    match.venue || 'INTERNATIONAL STADIUM'
  ], [match]);

  useEffect(() => {
    const timer = setInterval(() => {
      setInfoIndex((prev) => (prev + 1) % infoTexts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [infoTexts.length]);

  const displayBalls = useMemo(() => {
    return [...recentBalls].reverse().slice(-6);
  }, [recentBalls]);


  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none select-none italic">
      {/* MAIN CONTAINER */}
      <div className="h-[60px] md:h-[70px] w-full flex items-stretch overflow-hidden bg-[#1A1A1A] border-t border-white/20 shadow-2xl">
        
        {/* LEFT SECTION — Team & Match Info */}
        <div className="w-[38%] flex flex-col relative overflow-hidden">
          {/* Top Row: Match Title & Score */}
          <div className="flex-1 flex items-center px-2 gap-2">
            {/* Logo Left */}
            <div className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-white rounded-full flex items-center justify-center shrink-0 shadow-lg border-2 border-white/20 z-10 overflow-hidden">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-orange-600 fill-orange-600" />
            </div>
            
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-white font-black text-[10px] md:text-xs uppercase tracking-tighter whitespace-nowrap">
                {match.team_a} <span className="text-white/60 font-medium lowercase">v</span>
              </span>
              
              {/* Pink Score Box */}
              <div className="bg-[#FF80D5] px-2 py-0.5 flex items-center justify-between flex-1 rounded-sm">
                <span className="text-black font-black text-[10px] md:text-xs uppercase truncate">
                  {match.team_b}
                </span>
                <span className="text-black font-black text-sm md:text-base ml-2">
                  {match.runs}-{match.wickets}
                </span>
              </div>
              
              {/* Overs */}
              <span className="text-white font-black text-sm md:text-base px-1">
                {match.overs.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Bottom Row: Cycling Info */}
          <div className="h-[30%] bg-black/60 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={infoIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest"
              >
                {infoTexts[infoIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>


        {/* MIDDLE SECTION — Batsman Info (Vibrant Purple/Pink) */}
        <div className="w-[30%] bg-gradient-to-r from-[#c026d3] to-[#9333ea] flex flex-col justify-center px-3 relative overflow-hidden border-x border-black/10 shadow-inner">
          {/* Batsman 1 */}
          <div className="flex items-center justify-between relative z-10">
            <span className="text-white font-black text-[10px] md:text-xs uppercase truncate pr-2 tracking-tighter">
              {match.striker}
            </span>
            <div className="flex gap-2 text-white font-black text-xs md:text-sm">
              <span>{match.striker_runs}</span>
              <span className="opacity-60">{match.striker_balls}</span>
            </div>
          </div>

          <div className="h-[1px] bg-white/20 my-0.5" />

          {/* Batsman 2 */}
          <div className="flex items-center justify-between relative z-10">
            <span className="text-white font-black text-[10px] md:text-xs uppercase truncate pr-2 tracking-tighter">
              {match.non_striker} <span className="text-white/60 font-bold">*</span>
            </span>
            <div className="flex gap-2 text-white font-black text-xs md:text-sm">
              <span>{match.non_striker_runs}</span>
              <span className="opacity-60">{match.non_striker_balls}</span>
            </div>
          </div>

          {/* 4/6 Animation Zone */}
          <AnimatePresence>
            {(scoreAnimation === 'FOUR' || scoreAnimation === 'SIX') && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 flex items-center justify-center bg-yellow-400 z-50"
              >
                <span className="text-xl md:text-3xl font-black text-black uppercase tracking-tighter italic">
                  {scoreAnimation === 'FOUR' ? 'FOUR!' : 'SIXER!'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>


        {/* RIGHT SECTION — Bowler Info (Red) */}
        <div className="w-[32%] bg-[#E62E2E] flex flex-col justify-center px-3 relative overflow-hidden">
          {/* Bowler Name & Stats */}
          <div className="flex items-center justify-between relative z-10">
            <span className="text-white font-black text-[10px] md:text-xs uppercase truncate pr-2">
              {match.bowler}
            </span>
            <div className="text-white font-black text-xs md:text-sm">
              {match.bowler_wickets}-{match.bowler_runs} <span className="opacity-60">{match.bowler_overs?.toFixed(1)}</span>
            </div>
          </div>

          {/* Ball Indicators */}
          <div className="flex gap-1 mt-1 relative z-10">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const ball = displayBalls[i];
              return (
                <div 
                  key={i}
                  className={`w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[8px] md:text-[10px] font-black rounded-sm border border-white/30
                    ${!ball ? 'bg-black/20' : 
                      ball.wicket ? 'bg-red-900 text-white' : 
                      (ball.runs === 4 || ball.runs === 6) ? 'bg-[#008080] text-white' : 
                      ball.runs === 0 ? 'bg-white text-black' : 'bg-black/40 text-white'}`}
                >
                  {ball ? (ball.wicket ? 'W' : (ball.runs === 0 ? '•' : ball.runs)) : ''}
                </div>
              );
            })}
          </div>

          {/* Logo Right */}
          <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-[45px] h-[45px] md:w-[55px] md:h-[55px] bg-black rounded-full flex items-center justify-center shrink-0 shadow-xl border-2 border-[#E62E2E] z-10 overflow-hidden">
            <div className="flex flex-col items-center">
              <Zap className="w-4 h-4 md:w-6 md:h-6 text-yellow-400 fill-yellow-400" />
              <span className="text-[4px] md:text-[6px] font-black text-white uppercase leading-none mt-0.5">Blitz</span>
            </div>
          </div>

          {/* Wicket / Free Hit Animation Zone */}
          <AnimatePresence>
            {scoreAnimation === 'WICKET' && (
              <motion.div
                animate={{ opacity: [0, 1, 0, 1, 0, 1, 0] }}
                transition={{ duration: 2 }}
                className="absolute inset-0 flex items-center justify-center bg-white z-50"
              >
                <span className="text-lg md:text-2xl font-black text-red-600 uppercase tracking-tighter">
                  WICKET!
                </span>
              </motion.div>
            )}
            {(scoreAnimation === 'NO_BALL' || scoreAnimation === 'FREE_HIT') && (
              <motion.div
                initial={{ y: 30 }}
                animate={{ y: 0, x: [0, -3, 3, -3, 3, 0] }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-yellow-400 z-50"
              >
                <span className="text-base md:text-xl font-black text-black uppercase tracking-tighter">
                  FREE HIT!
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

