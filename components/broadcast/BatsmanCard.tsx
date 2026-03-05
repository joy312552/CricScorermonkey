
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';

export const BatsmanCard: React.FC<{ match: Match }> = ({ match }) => {
  // Mock data for display based on image
  const batsmen = [
    { name: 'GARVIT', status: 'NOT OUT', runs: 22, balls: 9, isNotOut: true },
    { name: 'MANAS', status: 'BOWLED B. ROHAN', runs: 26, balls: 11, isNotOut: false },
    { name: 'SHIRISH', status: 'CAUGHT OUT B. ROHAN', runs: 2, balls: 2, isNotOut: false },
    { name: 'RUDRA', status: 'BOWLED B. RUDRA', runs: 11, balls: 5, isNotOut: false },
    { name: 'SHREE', status: 'NOT OUT', runs: 8, balls: 3, isNotOut: true },
  ];

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 50 }}
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
          <div className="mb-8">
            <h2 className="text-white font-black text-4xl uppercase tracking-tighter drop-shadow-lg">
              {match.team_a}
            </h2>
            <p className="text-white/80 font-bold text-lg uppercase tracking-widest mt-1">
              {match.tournament_name || 'TOURNAMENT NAME'}, MATCH NO.2
            </p>
          </div>

          {/* Batsman Rows */}
          <div className="space-y-2 mb-12">
            {batsmen.map((player, idx) => (
              <div 
                key={idx} 
                className={`flex items-center py-2 px-6 rounded-sm relative overflow-hidden shadow-lg border-y border-white/5 ${
                  player.isNotOut 
                    ? 'bg-gradient-to-r from-[#B8860B] to-[#DAA520] text-white' 
                    : 'text-white hover:bg-white/5'
                }`}
              >
                {player.isNotOut && (
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                )}
                <span className="w-48 font-black text-2xl uppercase tracking-tighter">{player.name}</span>
                <span className={`flex-1 font-bold text-sm uppercase tracking-widest ${player.isNotOut ? 'text-white/90' : 'text-white/60'}`}>
                  {player.status}
                </span>
                <div className="flex gap-6 items-baseline">
                  <span className="text-3xl font-black tracking-tighter">
                    {player.runs}{player.isNotOut ? '*' : ''}
                  </span>
                  <span className="text-xl font-bold text-white/70 w-8 text-right">{player.balls}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-red-600 h-12 flex items-center justify-between px-12 relative overflow-hidden border-t-2 border-white/20">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          <span className="text-white font-black text-lg uppercase tracking-widest z-10">BATTING SUMMARY</span>
          <div className="flex gap-12 text-white font-black text-xl z-10">
            <span>EXTRAS <span className="text-2xl">{match.extras || 0}</span></span>
            <span>OVERS <span className="text-2xl">{match.overs.toFixed(1)}</span></span>
            <span className="ml-8">TOTAL <span className="text-3xl">{match.runs} - {match.wickets}</span></span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
