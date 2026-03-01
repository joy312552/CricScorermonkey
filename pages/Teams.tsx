import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Trophy, ChevronLeft, Trash2 } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Team } from '../types';

export const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchTeams = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('user_id', user.id)
        .order('name');
      if (error) throw error;
      setTeams(data || []);
    } catch (err) {
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [user]);

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('teams')
        .insert([{ name: newTeamName.trim(), user_id: user.id }]);
      if (error) throw error;
      setNewTeamName('');
      fetchTeams();
    } catch (err) {
      console.error('Error adding team:', err);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
      const { error } = await supabase.from('teams').delete().eq('id', id);
      if (error) throw error;
      fetchTeams();
    } catch (err) {
      console.error('Error deleting team:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-400 hover:text-slate-900 transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Manage Teams</h1>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <form onSubmit={handleAddTeam} className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Team Name (e.g. Mumbai Indians)"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-emerald-500 transition-all outline-none"
            />
            <Button type="submit" className="px-8 rounded-2xl">
              <Plus className="w-5 h-5" /> Add Team
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {teams.map((team) => (
            <div key={team.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center group hover:border-emerald-500/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-lg font-black text-slate-900">{team.name}</span>
              </div>
              <button 
                onClick={() => handleDeleteTeam(team.id)}
                className="p-2 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {teams.length === 0 && !loading && (
            <div className="col-span-full p-12 text-center bg-white border border-dashed border-slate-200 rounded-[3rem]">
              <p className="text-slate-400 font-bold">No teams added yet. Start by adding your first team!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
