
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';
import { Users } from 'lucide-react';

export const PlayingXI: React.FC<{ match: Match, isIndia?: boolean }> = ({ match, isIndia }) => {
  // Mock players for now, in real app we'd fetch from match.playing_xi
  const players = [
    { name: 'Rohit Sharma', role: 'Captain', no: 45 },
    { name: 'Shubman Gill', role: 'Batsman', no: 77 },
    { name: 'Virat Kohli', role: 'Batsman', no: 18 },
    { name: 'Shreyas Iyer', role: 'Batsman', no: 96 },
    { name: 'KL Rahul', role: 'WK', no: 1 },
    { name: 'Hardik Pandya', role: 'All-rounder', no: 33 },
    { name: 'Ravindra Jadeja', role: 'All-rounder', no: 8 },
    { name: 'Kuldeep Yadav', role: 'Bowler', no: 23 },
    { name: 'Jasprit Bumrah', role: 'Bowler', no: 93 },
    { name: 'Mohammed Shami', role: 'Bowler', no: 11 },
    { name: 'Mohammed Siraj', role: 'Bowler', no: 73 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl"
    >
      <div className="w-full max-w-6xl h-[80vh] flex gap-12">
        {/* Left: Team Info */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-1/3 flex flex-col justify-center gap-8"
        >
          <div className={`w-32 h-32 ${isIndia ? 'bg-orange-600' : 'bg-blue-600'} rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white/20`}>
            <span className="text-white text-6xl font-black italic">{isIndia ? 'I' : match.team_a.charAt(0)}</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
              {isIndia ? 'INDIA' : match.team_a}
            </h2>
            <p className="text-2xl font-bold text-slate-400 uppercase tracking-widest">Playing XI</p>
          </div>
          <div className="h-1 w-24 bg-emerald-500" />
        </motion.div>

        {/* Right: Players List */}
        <div className="flex-1 grid grid-cols-1 gap-3 overflow-y-auto custom-scrollbar pr-6">
          {players.map((player, i) => (
            <motion.div 
              key={player.name}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-5 glass-effect rounded-2xl group hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-6">
                <span className="text-2xl font-black text-white/20 group-hover:text-emerald-500 transition-colors">
                  {player.no.toString().padStart(2, '0')}
                </span>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white uppercase tracking-tighter">{player.name}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{player.role}</span>
                </div>
              </div>
              {player.role === 'Captain' && (
                <span className="px-4 py-1 bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest rounded-full">Captain</span>
              )}
              {player.role === 'WK' && (
                <span className="px-4 py-1 bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest rounded-full">Wicketkeeper</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
