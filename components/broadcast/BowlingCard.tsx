
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';

export const BowlingCard: React.FC<{ match: Match, theme?: string }> = ({ match, theme = 'theme1' }) => {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  // Mock data for display based on image
  const bowlers = [
    { name: 'HARSHAL', overs: '1.0', dots: 0, runs: 17, wkts: 0, econ: '17.00' },
    { name: 'RUDRA', overs: '2.0', dots: 0, runs: 33, wkts: 1, econ: '16.50' },
    { name: 'SAMARTH', overs: '1.0', dots: 0, runs: 17, wkts: 0, econ: '17.00' },
    { name: 'ROHAN', overs: '1.0', dots: 0, runs: 3, wkts: 2, econ: '3.00' },
  ];

  const fow = [
    { wkt: 1, runs: 49 },
    { wkt: 2, runs: 51 },
    { wkt: 3, runs: 62 },
  ];

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 50 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none select-none font-sans italic"
    >
      <div className={`w-[90%] max-w-5xl rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-2 border-white/10 relative ${
        isTheme2 ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 
        isTheme3 ? 'bg-gradient-to-br from-emerald-950 to-emerald-900' : 
        'bg-gradient-to-br from-[#0A1128] to-[#1A237E]'
      }`}>
        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        
        {/* Side Accents */}
        <div className="absolute left-0 top-0 bottom-0 w-32 overflow-hidden pointer-events-none">
          <div className={`absolute -left-16 top-0 w-32 h-full transform skew-x-[-15deg] ${
            isTheme2 ? 'bg-slate-600' : isTheme3 ? 'bg-emerald-600' : 'bg-yellow-400'
          }`} />
          <div className={`absolute -left-20 top-0 w-32 h-full transform skew-x-[-15deg] opacity-50 ml-4 ${
            isTheme2 ? 'bg-slate-400' : isTheme3 ? 'bg-emerald-400' : 'bg-cyan-400'
          }`} />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-16 overflow-hidden pointer-events-none">
          <div className={`absolute -right-8 top-0 w-16 h-full transform skew-x-[-15deg] ${
            isTheme2 ? 'bg-slate-600' : isTheme3 ? 'bg-emerald-600' : 'bg-cyan-500'
          }`} />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 pl-24 pr-12">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-white font-black text-4xl uppercase tracking-tighter drop-shadow-lg">
              {match.team_a}
            </h2>
            <p className="text-white/80 font-bold text-lg uppercase tracking-widest mt-1">
              {match.tournament_name || 'TOURNAMENT NAME'}, MATCH NO.2
            </p>
          </div>

          {/* Table Header */}
          <div className={`flex items-center py-2 px-4 mb-2 shadow-inner border-y border-white/20 ${
            isTheme2 ? 'bg-slate-700' : isTheme3 ? 'bg-emerald-700' : 'bg-[#00A8E8]'
          }`}>
            <div className="flex-1" />
            <div className="flex gap-8 text-white font-black text-sm uppercase tracking-widest">
              <span className="w-16 text-center">OVERS</span>
              <span className="w-16 text-center">DOTS</span>
              <span className="w-16 text-center">RUNS</span>
              <span className="w-16 text-center">WKTS</span>
              <span className="w-16 text-center">ECON</span>
            </div>
          </div>

          {/* Bowler Rows */}
          <div className="space-y-1 mb-8">
            {bowlers.map((bowler, idx) => (
              <div key={idx} className="flex items-center py-2 px-4 text-white font-black text-xl uppercase tracking-tighter hover:bg-white/5 transition-colors">
                <span className="flex-1">{bowler.name}</span>
                <div className="flex gap-8">
                  <span className="w-16 text-center">{bowler.overs}</span>
                  <span className="w-16 text-center">{bowler.dots}</span>
                  <span className="w-16 text-center">{bowler.runs}</span>
                  <span className={`w-16 text-center ${isTheme2 ? 'text-slate-400' : isTheme3 ? 'text-emerald-400' : 'text-cyan-400'}`}>{bowler.wkts}</span>
                  <span className="w-16 text-center">{bowler.econ}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Fall of Wickets */}
          <div className="space-y-1 mb-8">
            <div className="bg-[#1B4332] flex items-center py-1 px-4 border-l-4 border-emerald-500">
              <span className="w-32 text-white font-black text-sm uppercase">WICKETS</span>
              <div className="flex gap-12 text-white font-black text-lg">
                {fow.map(f => <span key={f.wkt} className="w-8 text-center">{f.wkt}</span>)}
              </div>
            </div>
            <div className="bg-[#780000] flex items-center py-1 px-4 border-l-4 border-red-500">
              <span className="w-32 text-white font-black text-sm uppercase">RUNS</span>
              <div className="flex gap-12 text-white font-black text-lg">
                {fow.map(f => <span key={f.wkt} className="w-8 text-center">{f.runs}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`h-12 flex items-center justify-between px-12 relative overflow-hidden border-t-2 border-white/20 ${
          isTheme2 ? 'bg-slate-950' : isTheme3 ? 'bg-emerald-950' : 'bg-red-600'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          <span className="text-white font-black text-lg uppercase tracking-widest z-10">BOWLING SUMMARY</span>
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
