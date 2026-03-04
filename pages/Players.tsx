
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, User, ChevronLeft, Trash2, Shield } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { MatchService } from '../services/MatchService';
import { Player, Team } from '../types';

export const Players: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', jersey: '', teamId: '', role: 'Batter' });
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!user) return;
    try {
      const [playersData, teamsData] = await Promise.all([
        MatchService.getPlayers(user.id),
        MatchService.getTeams(user.id)
      ]);
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
      await MatchService.createPlayer(
        user.id, 
        form.teamId, 
        form.name.trim(), 
        parseInt(form.jersey) || 0, 
        form.role
      );
      setForm({ name: '', jersey: '', teamId: '', role: 'Batter' });
      fetchData();
    } catch (err) {
      console.error('Error adding player:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;
    try {
      const { error } = await supabase.from('players').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error deleting player:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-400 hover:text-slate-900 transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Manage Players</h1>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Player Name"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-emerald-500 transition-all outline-none"
            />
            <input
              type="number"
              placeholder="Jersey #"
              value={form.jersey}
              onChange={(e) => setForm(prev => ({ ...prev, jersey: e.target.value }))}
              className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-emerald-500 transition-all outline-none"
            />
            <select
              value={form.teamId}
              onChange={(e) => setForm(prev => ({ ...prev, teamId: e.target.value }))}
              className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-emerald-500 transition-all outline-none"
            >
              <option value="">Select Team</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
            </select>
            <select
              value={form.role}
              onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
              className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-emerald-500 transition-all outline-none"
            >
              <option value="Batter">Batter</option>
              <option value="Bowler">Bowler</option>
              <option value="All-Rounder">All-Rounder</option>
              <option value="Wicket-Keeper">Wicket-Keeper</option>
            </select>
            <Button type="submit" className="rounded-2xl">
              <Plus className="w-5 h-5" /> Add
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {players.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center group hover:border-emerald-500/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-lg font-black text-slate-900 block">{p.player_name}</span>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    #{p.jersey_number} • {p.role}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(p.id)}
                className="p-2 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {players.length === 0 && !loading && (
            <div className="col-span-full p-12 text-center bg-white border border-dashed border-slate-200 rounded-[3rem]">
              <p className="text-slate-400 font-bold">No players added yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
