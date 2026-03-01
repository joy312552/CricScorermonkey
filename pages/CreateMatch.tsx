
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swords, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MatchService } from '../services/MatchService';
import { MatchType } from '../types';
import { InputField } from '../components/InputField';
import { SelectField } from '../components/SelectField';
import { Button } from '../components/Button';

export const CreateMatch: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    matchNumber: '',
    matchType: 'T20' as MatchType,
    totalOvers: '20',
    teamAName: '',
    teamBName: '',
    tossWonBy: '',
    tossDecision: 'bat' as 'bat' | 'bowl',
    venue: '',
    matchDate: new Date().toISOString().split('T')[0],
    tournamentName: '',
    isPublic: true
  });

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    
    // Basic validation
    if (!formData.teamAName || !formData.teamBName || !formData.totalOvers) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!user) {
      setError('You must be logged in to create a match.');
      return;
    }

    setLoading(true);

    try {
      // Create Match directly using the simplified service
      await MatchService.createMatch(
        formData.teamAName, 
        formData.teamBName, 
        parseInt(formData.totalOvers), 
        user.id
      );
      
      // 4. Success and Redirect
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || "Failed to create match. Check your connection or SQL schema.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 pb-10">
      <header className="flex items-center gap-4">
        <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-500/20">
          <Swords className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">New Match Setup</h1>
          <p className="text-slate-500 font-medium">Configure rules and broadcast settings.</p>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 p-5 rounded-[1.5rem] border-2 border-red-100 flex items-center gap-4 animate-in slide-in-from-top-2">
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
          <span className="text-sm font-bold text-red-700">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 md:p-10 space-y-10 shadow-sm">
          {/* Match Basic Info */}
          <div className="grid md:grid-cols-3 gap-6">
            <InputField 
              label="Match #" 
              placeholder="e.g. 101"
              value={formData.matchNumber} 
              onChange={(e) => handleChange('matchNumber', e.target.value)} 
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
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
               <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Home Side</h3>
               <InputField 
                label="Team A Name" 
                placeholder="Team Alpha"
                value={formData.teamAName} 
                onChange={(e) => handleChange('teamAName', e.target.value)} 
                required 
               />
            </div>
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
               <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Away Side</h3>
               <InputField 
                label="Team B Name" 
                placeholder="Team Beta"
                value={formData.teamBName} 
                onChange={(e) => handleChange('teamBName', e.target.value)} 
                required 
               />
            </div>
          </div>

          {/* Toss Info */}
          <div className="grid md:grid-cols-2 gap-8 pt-4">
            <SelectField 
              label="Toss Won By" 
              value={formData.tossWonBy} 
              onChange={(e) => handleChange('tossWonBy', e.target.value)} 
              options={[
                {label: formData.teamAName || 'Team A', value: 'A'}, 
                {label: formData.teamBName || 'Team B', value: 'B'}
              ]} 
              required 
            />
            <SelectField 
              label="Toss Decision" 
              value={formData.tossDecision} 
              onChange={(e) => handleChange('tossDecision', e.target.value as any)} 
              options={[
                {label: 'Batting First', value: 'bat'}, 
                {label: 'Bowling First', value: 'bowl'}
              ]} 
              required 
            />
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-3 gap-6">
            <InputField label="Venue" placeholder="Central Stadium" value={formData.venue} onChange={(e) => handleChange('venue', e.target.value)} />
            <InputField label="Tournament" placeholder="Winter League" value={formData.tournamentName} onChange={(e) => handleChange('tournamentName', e.target.value)} />
            <InputField label="Date" type="date" value={formData.matchDate} onChange={(e) => handleChange('matchDate', e.target.value)} />
          </div>

          {/* Visibility Toggle */}
          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[1.5rem] flex items-center justify-between">
             <div className="space-y-1">
                <h4 className="text-emerald-900 font-black text-xs uppercase tracking-widest">Broadcast Publicly</h4>
                <p className="text-slate-500 text-[10px] font-bold">Allow anyone to view live scores on the homepage.</p>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isPublic} 
                  onChange={(e) => handleChange('isPublic', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
             </label>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-end gap-4 pt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="w-full md:w-auto px-10 order-2 md:order-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            loading={loading} 
            disabled={loading}
            className="w-full md:w-auto px-12 order-1 md:order-2"
          >
            {loading ? 'Submitting...' : 'Create Match'} <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
};
