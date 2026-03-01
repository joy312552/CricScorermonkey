
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatchRealTime } from '../hooks/useMatchRealTime';
import { MatchService } from '../services/MatchService';
import { BroadcastTools } from '../components/BroadcastTools';
import { ChevronLeft, AlertTriangle, Undo, Settings, Swords, Tv, MonitorPlay } from 'lucide-react';

export const Scorer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { match, loading } = useMatchRealTime(id);
  const [isUpdating, setIsUpdating] = useState(false);

  // STEP 4: FIX FRONTEND SCORING LOGIC
  const handleScore = async (runs: number, isWicket: boolean = false) => {
    if (isUpdating || !match) return;
    
    // 6. Optimistic UI update
    const totalBalls = Math.floor(match.total_overs) * 6 + Math.round((match.total_overs % 1) * 10);
    const nextTotalBalls = totalBalls + 1;
    const nextOver = Math.floor(nextTotalBalls / 6);
    const nextBall = nextTotalBalls % 6;
    const nextTotalOvers = nextOver + (nextBall / 10);

    // Update UI instantly
    // Note: Realtime subscription will eventually sync this with the DB truth
    setIsUpdating(true);

    try {
      // 1. Insert ball & 2,3. Update match score
      await MatchService.recordBall(match.id, match, runs, isWicket);
    } catch (e) {
      console.error('Scoring error:', e);
      alert('Failed to update score. Please check your connection.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!match && !loading) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-black">Session Expired or Match Deleted</h2>
      <button onClick={() => navigate('/dashboard')} className="mt-4 text-emerald-600 font-bold underline">Return to Dashboard</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">
                {match?.team_a} vs {match?.team_b}
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Official Scorer Console</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Sync Active</span>
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              {/* SECTION 1: LIVE SCORE PREVIEW */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                   <Tv className="w-4 h-4 text-emerald-600" />
                   <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Broadcast Preview</h2>
                </div>
                <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-200 border border-white/5">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="flex items-center gap-3 mb-6">
                       <span className="px-3 py-1 bg-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Live</span>
                    </div>
                    
                    <div className="text-9xl font-black tracking-tighter flex items-baseline">
                      {match?.total_runs || 0}
                      <span className="text-slate-700 mx-2 font-light">/</span>
                      <span className="text-emerald-500">{match?.total_wickets || 0}</span>
                    </div>
                    
                    <div className="mt-6 flex items-center gap-8">
                       <div className="text-center">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Overs</p>
                          <p className="text-3xl font-black text-white">{match?.total_overs?.toFixed(1) || '0.0'}</p>
                       </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 2: SCOREBOARD CONTROL */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                   <Swords className="w-4 h-4 text-emerald-600" />
                   <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Scoring Console</h2>
                </div>
                <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm space-y-10">
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {[0, 1, 2, 3, 4, 6].map(r => (
                      <button
                        key={r}
                        disabled={isUpdating}
                        onClick={() => handleScore(r)}
                        className="aspect-square bg-slate-50 border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 rounded-3xl text-3xl font-black text-slate-900 transition-all active:scale-90 flex items-center justify-center shadow-sm"
                      >
                        {r}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                     <button 
                      onClick={() => handleScore(0, true)} 
                      disabled={isUpdating}
                      className="py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-red-100 transition-all active:scale-95"
                    >
                        <AlertTriangle className="w-5 h-5" /> Record Wicket
                     </button>
                  </div>
                </div>
              </section>
           </div>

           <div className="space-y-8">
              {/* Match Info Card */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 pb-4 border-b border-slate-50">Match Information</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team A</span>
                       <span className="text-xs font-black text-slate-900">{match?.team_a}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team B</span>
                       <span className="text-xs font-black text-slate-900">{match?.team_b}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
