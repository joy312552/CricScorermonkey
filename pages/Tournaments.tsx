import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, ChevronLeft, Trash2, Calendar } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { MatchService } from '../services/MatchService';
import { Tournament } from '../types';

export const Tournaments: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchTournaments = async () => {
    if (!user) return;
    try {
      const data = await MatchService.getTournaments(user.id);
      setTournaments(data || []);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !user) return;

    try {
      await MatchService.createTournament(user.id, newName.trim());
      setNewName('');
      fetchTournaments();
    } catch (err) {
      console.error('Error adding tournament:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) return;
    try {
      const { error } = await supabase.from('tournaments').delete().eq('id', id);
      if (error) throw error;
      fetchTournaments();
    } catch (err) {
      console.error('Error deleting tournament:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-400 hover:text-slate-900 transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Tournaments</h1>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <form onSubmit={handleAdd} className="flex gap-4">
            <input
              type="text"
              placeholder="Tournament Name (e.g. Summer League 2024)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 transition-all outline-none"
            />
            <Button type="submit" className="px-8 rounded-2xl">
              <Plus className="w-5 h-5" /> Create League
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tournaments.map((t) => (
            <div key={t.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center group hover:border-emerald-500/20 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-600 shadow-lg shadow-amber-100">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{t.tournament_name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
                    <Calendar className="w-3 h-3" /> Created Recently
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(t.id)}
                className="p-3 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 bg-slate-50 rounded-xl"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {tournaments.length === 0 && !loading && (
            <div className="p-12 text-center bg-white border border-dashed border-slate-200 rounded-[3rem]">
              <p className="text-slate-400 font-bold">No tournaments organized yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
