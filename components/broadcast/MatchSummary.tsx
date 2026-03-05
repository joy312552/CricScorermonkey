
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';

export const MatchSummary: React.FC<{ match: Match }> = ({ match }) => {
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none select-none font-sans italic"
    >
      <div className="w-[90%] max-w-5xl bg-gradient-to-br from-[#0A1128] to-[#1A237E] rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-2 border-white/10 relative">
        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        
        {/* Side Accents */}
        <div className="absolute left-0 top-0 bottom-0 w-32 overflow-hidden pointer-events-none">
          <div className="absolute -left-16 top-0 w-32 h-full bg-yellow-400 transform skew-x-[-15deg]" />
          <div className="absolute -left-20 top-0 w-32 h-full bg-cyan-400 transform skew-x-[-15deg] opacity-50 ml-4" />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-16 overflow-hidden pointer-events-none">
          <div className="absolute -right-8 top-0 w-16 h-full bg-cyan-500 transform skew-x-[-15deg]" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 pl-24 pr-12">
          {/* Header */}
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-white font-black text-4xl uppercase tracking-tighter drop-shadow-lg">
                MATCH SUMMARY
              </h2>
              <p className="text-white/80 font-bold text-lg uppercase tracking-widest mt-1">
                {match.tournament_name || 'TOURNAMENT NAME'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-cyan-400 font-black text-xl uppercase tracking-widest">LIVE</span>
            </div>
          </div>

          {/* Team Blocks */}
          <div className="space-y-6">
            {/* Team 1 */}
            <div className="bg-white/5 rounded-sm overflow-hidden border border-white/10">
              <div className="bg-[#0A1128]/80 flex items-center justify-between px-6 py-3 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
                    <span className="text-white font-black text-sm">{match.team_a.charAt(0)}</span>
                  </div>
                  <span className="text-white font-black text-2xl uppercase tracking-tighter">{match.team_a}</span>
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-white/60 font-bold text-sm uppercase">OVERS {match.current_innings === 1 ? match.overs.toFixed(1) : (match.match_overs || 20).toFixed(1)}</span>
                  <span className="text-white font-black text-3xl tracking-tighter">
                    {match.current_innings === 1 ? match.runs : (match.target ? match.target - 1 : 0)}-{match.current_innings === 1 ? match.wickets : 0}
                  </span>
                </div>
              </div>
              <div className="bg-[#00A8E8]/20 grid grid-cols-2 gap-px">
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                    <span>TOP BATSMEN</span>
                    <span>R (B)</span>
                  </div>
                  <div className="flex justify-between text-white font-black text-lg">
                    <span>{match.striker}</span>
                    <span>{match.striker_runs} <span className="text-sm font-bold text-white/70">{match.striker_balls}</span></span>
                  </div>
                  <div className="flex justify-between text-white font-black text-lg">
                    <span>{match.non_striker}</span>
                    <span>{match.non_striker_runs} <span className="text-sm font-bold text-white/70">{match.non_striker_balls}</span></span>
                  </div>
                </div>
                <div className="p-4 space-y-2 border-l border-white/10">
                  <div className="flex justify-between text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                    <span>TOP BOWLERS</span>
                    <span>W-R (O)</span>
                  </div>
                  <div className="flex justify-between text-white font-black text-lg">
                    <span>{match.bowler}</span>
                    <span>{match.bowler_wickets}-{match.bowler_runs} <span className="text-sm font-bold text-white/70">{match.bowler_overs.toFixed(1)}</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team 2 */}
            <div className="bg-white/5 rounded-sm overflow-hidden border border-white/10">
              <div className="bg-[#0A1128]/80 flex items-center justify-between px-6 py-3 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-yellow-500 rounded-sm flex items-center justify-center">
                    <span className="text-white font-black text-sm">{match.team_b.charAt(0)}</span>
                  </div>
                  <span className="text-white font-black text-2xl uppercase tracking-tighter">{match.team_b}</span>
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-white/60 font-bold text-sm uppercase">OVERS {match.current_innings === 2 ? match.overs.toFixed(1) : '0.0'}</span>
                  <span className="text-white font-black text-3xl tracking-tighter">
                    {match.current_innings === 2 ? match.runs : 0}-{match.current_innings === 2 ? match.wickets : 0}
                  </span>
                </div>
              </div>
              {match.current_innings === 2 && (
                <div className="bg-[#DAA520]/20 grid grid-cols-2 gap-px">
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                      <span>TOP BATSMEN</span>
                      <span>R (B)</span>
                    </div>
                    <div className="flex justify-between text-white font-black text-lg">
                      <span>{match.striker}</span>
                      <span>{match.striker_runs} <span className="text-sm font-bold text-white/70">{match.striker_balls}</span></span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2 border-l border-white/10">
                    <div className="flex justify-between text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                      <span>TOP BOWLERS</span>
                      <span>W-R (O)</span>
                    </div>
                    <div className="flex justify-between text-white font-black text-lg">
                      <span>{match.bowler}</span>
                      <span>{match.bowler_wickets}-{match.bowler_runs} <span className="text-sm font-bold text-white/70">{match.bowler_overs.toFixed(1)}</span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-red-600 h-12 flex items-center justify-center px-12 relative overflow-hidden border-t-2 border-white/20">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          <span className="text-white font-black text-lg uppercase tracking-widest z-10">
            {match.current_innings === 1 
              ? `${match.team_a} INNINGS IN PROGRESS` 
              : `${match.team_b} NEED ${match.target ? match.target - match.runs : 0} RUNS TO WIN`}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
