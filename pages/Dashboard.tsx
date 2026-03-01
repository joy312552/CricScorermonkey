
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, PlayCircle, History, LayoutDashboard, ArrowRight } from 'lucide-react';
import { MatchService } from '../services/MatchService';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';

export const Dashboard: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchMatches = async () => {
    if (!user) return;
    try {
      const data = await MatchService.getMatchesByUser(user.id);
      setMatches(data);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [user]);

  // No full-page loading, just render the layout and show empty states if needed
  const activeMatches = matches.filter(m => m.status === 'live');

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-emerald-600" />
              Official Console
            </h1>
            <p className="text-slate-500 font-medium">Manage your tournaments and broadcast overlays.</p>
          </div>
          <Button onClick={() => navigate('/create-match')} className="px-8 py-4 rounded-3xl text-lg">
            <Plus className="w-5 h-5" /> Create Match
          </Button>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
           <div className="md:col-span-2 space-y-8">
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <PlayCircle className="w-5 h-5 text-emerald-600" /> Active Sessions
                   </h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                   {activeMatches.map(m => (
                     <MatchCard 
                        key={m.id} 
                        match={m} 
                        canEdit={true} 
                        onDelete={fetchMatches}
                      />
                   ))}
                   {activeMatches.length === 0 && (
                     <div className="p-12 text-center bg-white border border-dashed border-slate-200 rounded-[3rem]">
                        <p className="text-slate-400 font-bold">No live matches currently being scored.</p>
                     </div>
                   )}
                </div>
              </section>
           </div>

           <div className="space-y-8">
              <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl">
                 <Trophy className="w-10 h-10 text-emerald-400 mb-6" />
                 <h3 className="text-2xl font-black tracking-tight mb-2">Build Your League</h3>
                 <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">Create teams, add your local players, and organize season-wide tournaments.</p>
                 <div className="space-y-3">
                    <button 
                      onClick={() => navigate('/teams')}
                      className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold transition-all text-left px-6 flex justify-between items-center group"
                    >
                       Manage Teams <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => navigate('/tournaments')}
                      className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold transition-all text-left px-6 flex justify-between items-center group"
                    >
                       Tournament Tables <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
