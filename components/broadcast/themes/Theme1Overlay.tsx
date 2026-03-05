
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Match, BallEvent } from '../../../types';

interface ThemeOverlayProps {
  match: Match;
  recentBalls: BallEvent[];
  scoreAnimation: string | null;
}

export const Theme1Overlay: React.FC<ThemeOverlayProps> = ({ match, recentBalls, scoreAnimation }) => {
  const [tickerIndex, setTickerIndex] = useState(0);

  const crr = useMemo(() => {
    const totalBalls = match.balls || 0;
    if (totalBalls === 0) return '0.00';
    return ((match.runs / totalBalls) * 6).toFixed(2);
  }, [match.runs, match.balls]);

  const reqRate = useMemo(() => {
    if (!match.target) return '0.00';
    const remainingRuns = match.target - match.runs;
    const totalMatchBalls = (match.match_overs || 20) * 6;
    const remainingBalls = totalMatchBalls - (match.balls || 0);
    if (remainingBalls <= 0) return '0.00';
    return ((remainingRuns / remainingBalls) * 6).toFixed(2);
  }, [match.target, match.runs, match.balls, match.match_overs]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const tickerContent = useMemo(() => {
    switch (tickerIndex) {
      case 0:
        return (
          <div className="flex items-center gap-4">
            <span className="text-white font-black text-[10px] md:text-xs uppercase tracking-widest">
              CRR : <span className="text-yellow-400">{crr}</span>
            </span>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="text-white font-black text-[10px] md:text-xs uppercase tracking-widest">
              REQUIRED RR : <span className="text-yellow-400">{reqRate}</span>
            </span>
          </div>
        );
      case 1:
        return (
          <span className="text-white font-black text-[10px] md:text-xs uppercase tracking-widest">
            TOURNAMENT : <span className="text-emerald-400">{match.tournament_name || 'CRICPRO LEAGUE'}</span>
          </span>
        );
      case 2:
        return (
          <span className="text-white font-black text-[10px] md:text-xs uppercase tracking-widest">
            VENUE : <span className="text-blue-400">{match.venue || 'INTERNATIONAL STADIUM'}</span>
          </span>
        );
      case 3:
        return (
          <span className="text-white font-black text-[10px] md:text-xs uppercase tracking-widest">
            TOSS : <span className="text-amber-400">{match.toss_winner ? `${match.toss_winner} WON & ELECTED TO ${match.toss_decision?.toUpperCase()}` : 'TOSS PENDING'}</span>
          </span>
        );
      default:
        return null;
    }
  }, [tickerIndex, crr, reqRate, match]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none select-none italic font-sans">
      {/* FULL WIDTH ANIMATION OVERLAY */}
      <AnimatePresence>
        {(scoreAnimation === 'FOUR' || scoreAnimation === 'SIX' || scoreAnimation === 'WICKET') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex items-center justify-center z-[100] bg-gradient-to-r from-transparent via-white/20 to-transparent"
          >
            <div className={`${scoreAnimation === 'WICKET' ? 'bg-red-600' : 'bg-yellow-400'} px-20 py-4 shadow-[0_0_50px_rgba(0,0,0,0.3)] border-y-4 border-black transform -skew-x-12`}>
              <span className={`text-5xl md:text-7xl font-black uppercase tracking-tighter drop-shadow-lg ${scoreAnimation === 'WICKET' ? 'text-white' : 'text-black'}`}>
                {scoreAnimation === 'FOUR' ? 'FOUR!' : scoreAnimation === 'SIX' ? 'SIXER!' : 'WICKET!'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN SCOREBOARD CONTAINER */}
      <div className="h-[80px] md:h-[90px] w-full flex items-stretch overflow-hidden shadow-2xl relative">
        {/* Glossy Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/30 pointer-events-none z-20" />
        
        {/* Animated Shine Effect */}
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] z-30 pointer-events-none"
        />
        
        {/* SECTION 1: TEAM A NAME */}
        <div className="w-[20%] bg-[#F5F5F5] flex items-center justify-center px-4 border-r border-black/10 relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-white/50" />
          <span className="text-black font-black text-sm md:text-lg uppercase leading-tight text-center tracking-tighter">
            {match.team_a}
          </span>
        </div>

        {/* SECTION 2: SCORE & OVERS (DARK BLUE) */}
        <div className="w-[20%] bg-[#0A1128] flex flex-col relative overflow-hidden border-r border-black/20">
          <div className="flex-1 flex items-center justify-center gap-3 px-2">
             {/* Score */}
             <span className="text-white font-black text-3xl md:text-4xl tracking-tighter">
               {match.runs}-{match.wickets}
             </span>
             {/* Overs */}
             <div className="flex flex-col">
               <span className="text-white font-bold text-sm md:text-base leading-none">
                 {match.overs.toFixed(1)}
               </span>
               <span className="text-white/60 text-[10px] md:text-xs font-bold">
                 ({match.match_overs || 20})
               </span>
             </div>
          </div>
          {/* Target Bar (Yellow) */}
          <motion.div 
            animate={{ backgroundColor: ['#FACC15', '#EAB308', '#FACC15'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-[25%] flex items-center justify-center"
          >
            <span className="text-black font-black text-[10px] md:text-xs uppercase tracking-widest">
              TARGET: {match.target || 'N/A'}
            </span>
          </motion.div>
          {/* Decorative Accents */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400/50" />
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-400/50" />
        </div>

        {/* SECTION 3: BATSMEN INFO */}
        <div className="flex-1 bg-white flex flex-col justify-center px-4 border-r border-black/10 relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-black/5" />
          {/* Striker */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full" />
              <span className="text-black font-black text-sm md:text-base uppercase truncate max-w-[120px]">
                {match.striker}
              </span>
            </div>
            <div className="flex gap-4 text-black font-black text-sm md:text-base">
              <span>{match.striker_runs}</span>
              <span className="text-black/40">{match.striker_balls}</span>
            </div>
          </div>
          {/* Non-Striker */}
          <div className="flex items-center justify-between mt-1 opacity-60">
            <div className="flex items-center gap-2 ml-4">
              <span className="text-black font-bold text-xs md:text-sm uppercase truncate max-w-[120px]">
                {match.non_striker}
              </span>
            </div>
            <div className="flex gap-4 text-black font-bold text-xs md:text-sm">
              <span>{match.non_striker_runs}</span>
              <span className="text-black/40">{match.non_striker_balls}</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: BOWLER INFO (LIGHT BLUE) */}
        <div className="w-[20%] bg-[#00A8E8] flex flex-col justify-center px-4 border-r border-black/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="flex flex-col items-center relative z-10">
            <span className="text-white/80 font-bold text-[8px] md:text-[10px] uppercase tracking-widest leading-none">BOWLER</span>
            <span className="text-white font-black text-sm md:text-base uppercase truncate w-full text-center tracking-tighter leading-none mb-1">
              {match.bowler}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-white font-black text-xl md:text-2xl tracking-tighter">
                {match.bowler_wickets}-{match.bowler_runs}
              </span>
              <span className="text-white/70 font-bold text-xs">
                ({match.bowler_overs?.toFixed(1) || '0.0'})
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 5: TEAM B NAME */}
        <div className="w-[20%] bg-[#F5F5F5] flex items-center justify-center px-4 relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-white/50" />
          <span className="text-black font-black text-sm md:text-lg uppercase leading-tight text-center tracking-tighter">
            {match.team_b}
          </span>
        </div>
      </div>

      {/* BOTTOM TICKER BAR */}
      <div className="h-[25px] md:h-[30px] w-full bg-[#0A1128] flex items-center justify-center border-t border-white/10 shadow-inner overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={tickerIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center"
          >
            {tickerContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
