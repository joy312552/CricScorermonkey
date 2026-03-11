
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, ChevronLeft, Trash2, Shield } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { MatchService } from '../services/MatchService';
import { Player, Team } from '../types';

export const Players: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', jersey: '', teamId: '' });
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!user) return;
    try {
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .eq('user_id', user.id);

      if (playersError) throw playersError;
      if (teamsError) throw teamsError;

      setPlayers(playersData || []);
      setTeams(teamsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.teamId || !user) return;

    try {
      const { error } = await supabase
        .from('players')
        .insert([{ 
          user_id: user.id, 
          team_id: form.teamId, 
          player_name: form.name.trim(), 
          jersey_number: parseInt(form.jersey) || 0,
          role: 'Player'
        }]);
      if (error) throw error;
      
      setForm({ name: '', jersey: '', teamId: '' });
      fetchData();
    } catch (err) {
      alert('Operation failed. Please try again.');
      console.error('Error adding player:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this player?')) return;
    try {
      const { error } = await supabase.from('players').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      alert('Operation failed. Please try again.');
      console.error('Error deleting player:', err);
    }
  };

  return (
    <div className="min-h-screen bg-cricket-gray p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-400 hover:text-cricket-green transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <Users className="w-8 h-8 text-cricket-green" />
            Manage Players
          </h1>
        </div>

        <div className="cricket-card p-8">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Player Name"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-cricket-green focus:ring-4 focus:ring-cricket-green/10 transition-all outline-none"
            />
            <input
              type="number"
              placeholder="Jersey #"
              value={form.jersey}
              onChange={(e) => setForm(prev => ({ ...prev, jersey: e.target.value }))}
              className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-cricket-green focus:ring-4 focus:ring-cricket-green/10 transition-all outline-none"
            />
            <select
              value={form.teamId}
              onChange={(e) => setForm(prev => ({ ...prev, teamId: e.target.value }))}
              className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-cricket-green focus:ring-4 focus:ring-cricket-green/10 transition-all outline-none"
            >
              <option value="">Select Team</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
            </select>
            <Button type="submit" className="cricket-button-primary rounded-xl flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Add Player
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players.map((p) => (
            <div key={p.id} className="cricket-card p-6 flex justify-between items-center group hover:border-cricket-green/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cricket-light rounded-xl flex items-center justify-center text-cricket-green group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-lg font-display font-black text-slate-900 block">{p.player_name}</span>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1">
                    #{p.jersey_number} <span className="text-slate-300">•</span> {teams.find(t => t.id === p.team_id)?.team_name}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(p.id)}
                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {players.length === 0 && !loading && (
            <div className="col-span-full p-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
                <Users className="w-8 h-8" />
              </div>
              <p className="text-slate-500 font-bold text-lg">No players added yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
