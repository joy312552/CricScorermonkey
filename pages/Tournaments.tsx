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
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
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
      const { error } = await supabase
        .from('tournaments')
        .insert([{ 
          user_id: user.id, 
          tournament_name: newName.trim()
        }]);
      if (error) throw error;
      
      setNewName('');
      fetchTournaments();
    } catch (err) {
      alert('Operation failed. Please try again.');
      console.error('Error adding tournament:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this tournament?')) return;
    try {
      const { error } = await supabase.from('tournaments').delete().eq('id', id);
      if (error) throw error;
      fetchTournaments();
    } catch (err) {
      alert('Operation failed. Please try again.');
      console.error('Error deleting tournament:', err);
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
            <Trophy className="w-8 h-8 text-cricket-green" />
            Tournaments
          </h1>
        </div>

        <div className="cricket-card p-8">
          <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Tournament Name (e.g. Blitz Cricket League)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-6 py-4 text-sm font-bold focus:border-cricket-green focus:ring-4 focus:ring-cricket-green/10 transition-all outline-none"
            />
            <Button type="submit" className="cricket-button-primary px-8 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Create League
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tournaments.map((t) => (
            <div key={t.id} className="cricket-card p-8 flex justify-between items-center group hover:border-cricket-green/30 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-cricket-light rounded-2xl flex items-center justify-center text-cricket-green shadow-sm group-hover:scale-110 transition-transform">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-black text-slate-900">{t.tournament_name}</h3>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(t.id)}
                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {tournaments.length === 0 && !loading && (
            <div className="p-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
                <Trophy className="w-8 h-8" />
              </div>
              <p className="text-slate-500 font-bold text-lg">No tournaments organized yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
