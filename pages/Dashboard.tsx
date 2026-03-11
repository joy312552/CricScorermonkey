
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, PlayCircle, LayoutDashboard, ArrowRight, Shield, Users, Activity } from 'lucide-react';
import { MatchService } from '../services/MatchService';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';

export const Dashboard: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [stats, setStats] = useState({ teams: 0, players: 0, tournaments: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!user) return;
    try {
      const [matchesData, teamsData, playersData, tournamentsData] = await Promise.all([
        MatchService.getMatchesByUser(user.id),
        MatchService.getTeams(user.id),
        MatchService.getPlayers(user.id),
        MatchService.getTournaments(user.id)
      ]);
      setMatches(matchesData);
      setStats({
        teams: teamsData.length,
        players: playersData.length,
        tournaments: tournamentsData.length
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const activeMatches = matches.filter(m => m.status === 'live');

  return (
    <div className="min-h-screen bg-cricket-gray">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-cricket-green" />
              Sports Analytics
            </h1>
            <p className="text-slate-500 font-medium">Manage your tournaments, teams, and broadcast overlays.</p>
          </div>
          <Button onClick={() => navigate('/create-match')} className="cricket-button-primary px-8 py-4 text-lg flex items-center gap-2">
            <Plus className="w-5 h-5" /> Create Match
          </Button>
        </header>

        {/* Top Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="cricket-card p-6 flex items-center gap-4 group">
            <div className="p-4 bg-cricket-light rounded-full text-cricket-green group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Live Matches</p>
              <p className="text-3xl font-display font-black text-slate-900">{activeMatches.length}</p>
            </div>
          </div>
          <div className="cricket-card p-6 flex items-center gap-4 group">
            <div className="p-4 bg-cricket-light rounded-full text-cricket-green group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Teams</p>
              <p className="text-3xl font-display font-black text-slate-900">{stats.teams}</p>
            </div>
          </div>
          <div className="cricket-card p-6 flex items-center gap-4 group">
            <div className="p-4 bg-cricket-light rounded-full text-cricket-green group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Players</p>
              <p className="text-3xl font-display font-black text-slate-900">{stats.players}</p>
            </div>
          </div>
          <div className="cricket-card p-6 flex items-center gap-4 group">
            <div className="p-4 bg-cricket-light rounded-full text-cricket-green group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Tournaments</p>
              <p className="text-3xl font-display font-black text-slate-900">{stats.tournaments}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           <div className="md:col-span-2 space-y-8">
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-xl font-display font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <PlayCircle className="w-5 h-5 text-cricket-green" /> Active Sessions
                   </h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                   {activeMatches.map(m => (
                     <MatchCard 
                        key={m.id} 
                        match={m} 
                        canEdit={true} 
                        onDelete={fetchData}
                      />
                   ))}
                   {activeMatches.length === 0 && (
                     <div className="p-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4">
                        <div className="text-6xl mb-2 animate-bounce">🏏</div>
                        <p className="text-slate-500 font-bold text-lg">No matches created yet</p>
                        <Button onClick={() => navigate('/create-match')} className="cricket-button-secondary mt-2">
                          Create Match
                        </Button>
                     </div>
                   )}
                </div>
              </section>
           </div>

           <div className="space-y-8">
              <div className="cricket-card p-8 border-t-4 border-t-cricket-green">
                 <Trophy className="w-10 h-10 text-cricket-green mb-6" />
                 <h3 className="text-2xl font-display font-black tracking-tight mb-2 text-slate-900">Build Your League</h3>
                 <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">Create teams, add your local players, and organize season-wide tournaments.</p>
                 <div className="space-y-3">
                    <button 
                      onClick={() => navigate('/teams')}
                      className="w-full py-4 bg-slate-50 hover:bg-cricket-light rounded-xl text-sm font-bold transition-all text-left px-6 flex justify-between items-center group text-slate-700 hover:text-cricket-dark border border-slate-100"
                    >
                       <span className="flex items-center gap-3"><Shield className="w-4 h-4" /> Manage Teams</span>
                       <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => navigate('/players')}
                      className="w-full py-4 bg-slate-50 hover:bg-cricket-light rounded-xl text-sm font-bold transition-all text-left px-6 flex justify-between items-center group text-slate-700 hover:text-cricket-dark border border-slate-100"
                    >
                       <span className="flex items-center gap-3"><Users className="w-4 h-4" /> Manage Players</span>
                       <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => navigate('/tournaments')}
                      className="w-full py-4 bg-slate-50 hover:bg-cricket-light rounded-xl text-sm font-bold transition-all text-left px-6 flex justify-between items-center group text-slate-700 hover:text-cricket-dark border border-slate-100"
                    >
                       <span className="flex items-center gap-3"><Trophy className="w-4 h-4" /> Manage Tournament</span>
                       <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
