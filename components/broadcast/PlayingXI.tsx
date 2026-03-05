
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';

export const PlayingXI: React.FC<{ match: Match }> = ({ match }) => {
  // Mock players for both teams
  const teamAPlayers = [
    { name: 'ROHIT SHARMA', no: 45, role: 'C' },
    { name: 'SHUBMAN GILL', no: 77, role: '' },
    { name: 'VIRAT KOHLI', no: 18, role: '' },
    { name: 'SHREYAS IYER', no: 96, role: '' },
    { name: 'KL RAHUL', no: 1, role: 'WK' },
    { name: 'HARDIK PANDYA', no: 33, role: '' },
    { name: 'RAVINDRA JADEJA', no: 8, role: '' },
    { name: 'KULDEEP YADAV', no: 23, role: '' },
    { name: 'JASPRIT BUMRAH', no: 93, role: '' },
    { name: 'MOHAMMED SHAMI', no: 11, role: '' },
    { name: 'MOHAMMED SIRAJ', no: 73, role: '' },
  ];

  const teamBPlayers = [
    { name: 'DAVID WARNER', no: 31, role: '' },
    { name: 'TRAVIS HEAD', no: 62, role: '' },
    { name: 'MITCHELL MARSH', no: 8, role: '' },
    { name: 'STEVE SMITH', no: 49, role: '' },
    { name: 'MARNUS LABUSCHAGNE', no: 33, role: '' },
    { name: 'GLENN MAXWELL', no: 32, role: '' },
    { name: 'JOSH INGLIS', no: 48, role: 'WK' },
    { name: 'PAT CUMMINS', no: 30, role: 'C' },
    { name: 'MITCHELL STARC', no: 56, role: '' },
    { name: 'ADAM ZAMPA', no: 88, role: '' },
    { name: 'JOSH HAZLEWOOD', no: 38, role: '' },
  ];

  const renderPlayerRow = (player: any, index: number, teamColor: string) => (
    <motion.div 
      key={index}
      initial={{ x: teamColor === 'blue' ? -50 : 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5 + (index * 0.05), duration: 0.4 }}
      className="flex items-center justify-between px-6 py-2.5 bg-white/5 border-b border-white/5 last:border-0 hover:bg-white/10 transition-colors group"
    >
      <div className="flex items-center gap-4">
        {/* Jersey Icon Placeholder */}
        <div className={`w-8 h-8 rounded-sm flex items-center justify-center relative overflow-hidden ${teamColor === 'blue' ? 'bg-blue-600' : 'bg-yellow-500'}`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
          <span className="text-white font-black text-[10px] z-10">{player.no}</span>
        </div>
        <span className="text-white font-black text-lg uppercase tracking-tighter group-hover:text-cyan-400 transition-colors">
          {player.name}
          {player.role && <span className="ml-2 text-[10px] text-cyan-400 font-bold">({player.role})</span>}
        </span>
      </div>
      <span className="text-white/30 font-black text-sm italic">#{player.no}</span>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none select-none font-sans italic p-12"
    >
      <div className="w-full max-w-6xl bg-gradient-to-br from-[#0A1128] to-[#1A237E] rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-2 border-white/10 relative flex flex-col">
        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="bg-[#0A1128] py-4 px-12 border-b-2 border-white/10 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] animate-pulse" />
          <h2 className="text-white font-black text-4xl uppercase tracking-tighter drop-shadow-lg z-10">PLAYING XI</h2>
        </div>

        {/* Content */}
        <div className="flex-1 grid grid-cols-2 gap-px bg-white/10">
          {/* Team A Column */}
          <div className="bg-[#0A1128]/40 backdrop-blur-md flex flex-col">
            <div className="bg-blue-900/40 py-4 px-8 flex items-center gap-4 border-b border-white/10">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg border-2 border-white/20">
                <span className="text-white text-2xl font-black">{match.team_a.charAt(0)}</span>
              </div>
              <h3 className="text-white font-black text-3xl uppercase tracking-tighter">{match.team_a}</h3>
            </div>
            <div className="flex-1 overflow-hidden">
              {teamAPlayers.map((p, i) => renderPlayerRow(p, i, 'blue'))}
            </div>
          </div>

          {/* Team B Column */}
          <div className="bg-[#0A1128]/40 backdrop-blur-md flex flex-col border-l border-white/10">
            <div className="bg-yellow-900/20 py-4 px-8 flex items-center gap-4 border-b border-white/10">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg border-2 border-white/20">
                <span className="text-white text-2xl font-black">{match.team_b.charAt(0)}</span>
              </div>
              <h3 className="text-white font-black text-3xl uppercase tracking-tighter">{match.team_b}</h3>
            </div>
            <div className="flex-1 overflow-hidden">
              {teamBPlayers.map((p, i) => renderPlayerRow(p, i, 'yellow'))}
            </div>
          </div>
        </div>

        {/* Footer Accent */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-yellow-500" />
      </div>
    </motion.div>
  );
};
