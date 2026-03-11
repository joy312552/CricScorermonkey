
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swords, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MatchService } from '../services/MatchService';
import { MatchType, Team, Tournament } from '../types';
import { InputField } from '../components/InputField';
import { SelectField } from '../components/SelectField';
import { Button } from '../components/Button';

export const CreateMatch: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const [formData, setFormData] = useState({
    matchType: 'T20' as MatchType,
    totalOvers: '20',
    teamAId: '',
    teamBId: '',
    tournamentId: '',
    venue: 'International Stadium',
    isPublic: true
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [teamsData, tournamentsData] = await Promise.all([
          MatchService.getTeams(user.id),
          MatchService.getTournaments(user.id)
        ]);
        setTeams(teamsData);
        setTournaments(tournamentsData);
      } catch (err) {
        console.error('Failed to fetch setup data:', err);
      }
    };
    fetchData();
  }, [user]);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    
    // Basic validation
    if (!formData.teamAId || !formData.teamBId || !formData.totalOvers) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.teamAId === formData.teamBId) {
      setError('Team A and Team B cannot be the same.');
      return;
    }

    if (!user) {
      setError('You must be logged in to create a match.');
      return;
    }

    setLoading(true);

    try {
      await MatchService.createMatch(
        formData.teamAId, 
        formData.teamBId, 
        formData.tournamentId,
        parseInt(formData.totalOvers), 
        user.id
      );
      
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || "Failed to create match.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cricket-gray">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 pb-10">
        <header className="flex items-center gap-4">
          <div className="bg-cricket-green p-3 rounded-2xl shadow-lg shadow-cricket-green/20">
            <Swords className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">New Match Setup</h1>
            <p className="text-slate-500 font-medium">Configure rules and broadcast settings.</p>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 p-5 rounded-2xl border-2 border-red-100 flex items-center gap-4 animate-in slide-in-from-top-2">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <span className="text-sm font-bold text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="cricket-card p-8 md:p-10 space-y-10">
            {/* Match Basic Info */}
            <div className="grid md:grid-cols-3 gap-6">
              <SelectField 
                label="Tournament" 
                value={formData.tournamentId} 
                onChange={(e) => handleChange('tournamentId', e.target.value)} 
                options={[
                  {label: 'Select Tournament', value: ''},
                  ...tournaments.map(t => ({ label: t.tournament_name, value: t.id }))
                ]}
                required 
              />
              <SelectField 
                label="Match Type" 
                value={formData.matchType} 
                onChange={(e) => handleChange('matchType', e.target.value)} 
                options={[
                  {label:'T20', value:'T20'},
                  {label:'ODI', value:'ODI'},
                  {label:'Test', value:'Test'},
                  {label:'Custom', value:'Custom'}
                ]} 
                required 
              />
              <InputField 
                label="Total Overs" 
                type="number" 
                placeholder="20"
                value={formData.totalOvers} 
                onChange={(e) => handleChange('totalOvers', e.target.value)} 
                required 
              />
            </div>

            {/* Teams Setup */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                 <h3 className="text-[10px] font-black text-cricket-green uppercase tracking-widest">Home Side</h3>
                 <SelectField 
                  label="Team A" 
                  value={formData.teamAId} 
                  onChange={(e) => handleChange('teamAId', e.target.value)} 
                  options={[
                    {label: 'Select Team A', value: ''},
                    ...teams.map(t => ({ label: t.team_name, value: t.id }))
                  ]}
                  required 
                 />
              </div>
              <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                 <h3 className="text-[10px] font-black text-cricket-dark uppercase tracking-widest">Away Side</h3>
                 <SelectField 
                  label="Team B" 
                  value={formData.teamBId} 
                  onChange={(e) => handleChange('teamBId', e.target.value)} 
                  options={[
                    {label: 'Select Team B', value: ''},
                    ...teams.map(t => ({ label: t.team_name, value: t.id }))
                  ]}
                  required 
                 />
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <InputField label="Venue" placeholder="Central Stadium" value={formData.venue} onChange={(e) => handleChange('venue', e.target.value)} />
              <div className="flex items-center justify-between p-6 bg-cricket-light border border-cricket-green/20 rounded-2xl">
                 <div className="space-y-1">
                    <h4 className="text-cricket-dark font-black text-xs uppercase tracking-widest">Broadcast Publicly</h4>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.isPublic} 
                      onChange={(e) => handleChange('isPublic', e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cricket-green"></div>
                 </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="w-full md:w-auto px-10 order-2 md:order-1 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-cricket-green hover:border-cricket-green rounded-full font-bold"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={loading} 
              disabled={loading}
              className="cricket-button-primary w-full md:w-auto px-12 order-1 md:order-2 flex items-center justify-center"
            >
              {loading ? 'Submitting...' : 'Create Match'} <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
