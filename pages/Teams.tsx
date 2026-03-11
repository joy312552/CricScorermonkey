import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Shield, ChevronLeft, Trash2 } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { MatchService } from '../services/MatchService';
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
        .order('created_at', { ascending: false });
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
        .insert([{ 
          user_id: user.id, 
          team_name: newTeamName.trim()
        }]);
      if (error) throw error;
      
      setNewTeamName('');
      fetchTeams();
    } catch (err) {
      alert('Operation failed. Please try again.');
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
      alert('Operation failed. Please try again.');
      console.error('Error deleting team:', err);
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
            <Shield className="w-8 h-8 text-cricket-green" />
            Manage Teams
          </h1>
        </div>

        <div className="cricket-card p-8">
          <form onSubmit={handleAddTeam} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Team Name (e.g. Blitz)"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-6 py-4 text-sm font-bold focus:border-cricket-green focus:ring-4 focus:ring-cricket-green/10 transition-all outline-none"
            />
            <Button type="submit" className="cricket-button-primary px-8 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Add Team
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <div key={team.id} className="cricket-card p-6 flex justify-between items-center group hover:border-cricket-green/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cricket-light rounded-xl flex items-center justify-center text-cricket-green overflow-hidden group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="text-lg font-display font-black text-slate-900">{team.team_name}</span>
              </div>
              <button 
                onClick={() => handleDeleteTeam(team.id)}
                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {teams.length === 0 && !loading && (
            <div className="col-span-full p-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
                <Shield className="w-8 h-8" />
              </div>
              <p className="text-slate-500 font-bold text-lg">No teams added yet. Start by adding your first team!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
