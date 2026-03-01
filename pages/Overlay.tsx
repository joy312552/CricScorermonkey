
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMatchRealTime } from '../hooks/useMatchRealTime';
import { TossOverlay } from '../components/TossOverlay';

export const Overlay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { match, loading } = useMatchRealTime(id);

  useEffect(() => {
    document.body.classList.add('overlay-transparent');
    const style = document.createElement('style');
    style.innerHTML = `
      *::-webkit-scrollbar { display: none !important; } 
      body, html { overflow: hidden !important; background: transparent !important; }
      .text-shadow-pro { text-shadow: 0 4px 10px rgba(0,0,0,0.5); }
      
      @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    `;
    document.head.appendChild(style);
    return () => { 
      document.body.classList.remove('overlay-transparent'); 
      document.head.removeChild(style); 
    };
  }, []);

  if (loading || !match) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden font-sans">
      {/* Primary Scoreboard Layer */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-5xl px-12 animate-slide-up">
        <div className="flex bg-slate-900/95 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/10 p-1.5">
          
          {/* Score Plate */}
          <div className="bg-emerald-600 px-10 py-6 flex flex-col justify-center border-r border-white/5 rounded-[1.8rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl" />
            <div className="text-[11px] font-black text-emerald-100 uppercase tracking-[0.3em] leading-none mb-2 opacity-80 relative z-10">
              {match.team_a}
            </div>
            <div className="text-6xl font-black text-white leading-none tracking-tighter text-shadow-pro relative z-10">
              {match.total_runs}<span className="text-emerald-300 font-light mx-1 opacity-40">/</span>{match.total_wickets}
            </div>
          </div>

          {/* Dynamic Context Block */}
          <div className="px-10 py-6 flex flex-col justify-center border-r border-white/5">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none mb-2">Overs</div>
            <div className="text-4xl font-black text-white leading-none tracking-tight">
              {match.total_overs?.toFixed(1) || '0.0'}
            </div>
          </div>

          <div className="flex-1 flex items-center px-10 gap-12">
            <div className="flex items-center gap-12 w-full">
                <div className="flex flex-col min-w-[180px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Live Feed</span>
                    </div>
                    <div className="text-xl font-black text-white tracking-tight uppercase truncate">
                      {match.team_b} to bowl
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-end gap-1 ml-auto pl-10 border-l border-white/5">
              <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black text-white tracking-[0.3em] uppercase">CricScore Pro</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)] animate-pulse" />
              </div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em]">LIVE BROADCAST</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
