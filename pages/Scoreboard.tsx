
import React from 'react';
import { useParams } from 'react-router-dom';
import { useMatchRealTime } from '../hooks/useMatchRealTime';
import { Trophy, MapPin, Calendar, Clock, Swords, Shield, User, CircleDot } from 'lucide-react';
import { TossOverlay } from '../components/TossOverlay';

export const Scoreboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { match, loading } = useMatchRealTime(id);

  // No full-page loading spinner
  if (!match && !loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center px-6">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
        <Swords className="w-10 h-10 text-slate-300" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Match Not Found</h1>
      <p className="text-slate-500 font-medium">This match might be private or doesn't exist.</p>
    </div>
  );

  const teamAName = match?.team_a || 'Team A';
  const teamBName = match?.team_b || 'Team B';
  const score = match?.total_runs || 0;
  const wickets = match?.total_wickets || 0;
  const oversDone = match?.total_overs || 0;

  const crr = (score / Math.max(0.1, oversDone) || 0).toFixed(2);

  return (
    <div className="bg-slate-50 min-h-screen pb-20 relative">
      {/* Top Professional Banner */}
      <div className="bg-slate-900 text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[120px]" />
           <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-12 text-center md:text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3">
                 <div className="px-4 py-1.5 bg-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Live Match</div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
                {teamAName} <span className="text-slate-700 italic">vs</span> {teamBName}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-400 text-[11px] font-black uppercase tracking-widest">
                 <span className="flex items-center gap-2"><Trophy className="w-4 h-4 text-emerald-500" /> CricScore Pro League</span>
              </div>
            </div>

            <div className="text-center md:text-right">
               <div className="flex items-center justify-center md:justify-end gap-3 mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{teamAName} Current Score</span>
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
               </div>
               <div className="text-8xl md:text-9xl font-black tracking-tighter text-white">
                  {score}<span className="text-slate-800">/</span>{wickets}
               </div>
               <div className="text-2xl font-black text-slate-500 mt-2">
                  Overs <span className="text-white">{oversDone.toFixed(1)}</span> <span className="mx-2 opacity-20">|</span> CRR <span className="text-emerald-500">{crr}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Dashboard Grid */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20 space-y-8">
        <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-xl shadow-slate-200/50">
           <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-50">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Live Partnership</h3>
           </div>
           <p className="text-slate-400 font-bold text-center py-20 uppercase tracking-widest text-xs">Ball-by-ball details coming soon in next update</p>
        </div>
      </div>
    </div>
  );
};
