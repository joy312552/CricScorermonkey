
import React from 'react';
import { Match } from '../types';

interface TossOverlayProps {
  match: Match | any;
  visible: boolean;
}

export const TossOverlay: React.FC<TossOverlayProps> = ({ match, visible }) => {
  if (!match) return null;

  const teamAName = match.team_a_name || match.team_a?.name || 'TEAM A';
  const teamBName = match.team_b_name || match.team_b?.name || 'TEAM B';
  const tossWinner = match.toss_won_by === 'A' || match.toss_won_by === match.team_a_name ? teamAName : teamBName;
  const decision = match.toss_decision === 'bat' ? 'BAT' : 'BOWL';
  
  const tossText = `${tossWinner} WON THE TOSS & CHOSE TO ${decision} FIRST`.toUpperCase();

  return (
    <div className={`fixed bottom-12 left-0 w-full flex justify-center px-4 transition-all duration-700 ease-in-out z-[999] ${visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
      <div className="w-full max-w-5xl flex items-stretch h-14 md:h-16 relative">
        
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-white/5 blur-xl rounded-full scale-x-110 pointer-events-none" />

        {/* Team A Panel */}
        <div 
          className="flex-1 bg-gradient-to-r from-emerald-800 to-emerald-600 flex items-center justify-center relative overflow-hidden shadow-xl"
          style={{ clipPath: 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          <span className="text-white font-black text-sm md:text-xl tracking-tighter italic drop-shadow-lg pr-4">
            {teamAName}
          </span>
        </div>

        {/* Toss Center Panel */}
        <div 
          className="w-full max-w-[60%] -mx-6 bg-white flex items-center justify-center relative z-10 shadow-2xl border-x-4 border-slate-900"
          style={{ clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0 100%)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-white" />
          <div className="relative px-8 md:px-12 text-center">
            <span className="text-slate-900 font-black text-[9px] md:text-xs tracking-[0.3em] block opacity-50 mb-0.5">MATCH UPDATE</span>
            <span className="text-slate-900 font-black text-[10px] md:text-sm tracking-tight leading-tight">
              {tossText}
            </span>
          </div>
        </div>

        {/* Team B Panel */}
        <div 
          className="flex-1 bg-gradient-to-l from-blue-800 to-blue-600 flex items-center justify-center relative overflow-hidden shadow-xl"
          style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 5% 100%, 0 50%)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          <span className="text-white font-black text-sm md:text-xl tracking-tighter italic drop-shadow-lg pl-4">
            {teamBName}
          </span>
        </div>

      </div>
    </div>
  );
};
