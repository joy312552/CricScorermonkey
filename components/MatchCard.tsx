
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Play, CheckCircle, Clock, ChevronRight, Swords, Radio, Trash2, AlertCircle } from 'lucide-react';
import { Match } from '../types';
import { MatchService } from '../services/MatchService';

interface MatchCardProps {
  match: Match;
  canEdit: boolean;
  onDelete?: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, canEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const statusConfig = {
    live: { icon: Play, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', label: 'Live' },
    upcoming: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Upcoming' },
    completed: { icon: CheckCircle, color: 'text-cricket-green', bg: 'bg-cricket-light', border: 'border-cricket-green/20', label: 'Concluded' }
  };

  const config = statusConfig[match.status] || statusConfig.upcoming;
  const teamA = match.team_a_name || 'Team A';
  const teamB = match.team_b_name || 'Team B';

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await MatchService.deleteMatch(match.id);
      if (onDelete) onDelete();
    } catch (err) {
      console.error('Failed to delete match:', err);
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="cricket-card overflow-hidden group hover:border-cricket-green/30 transition-all duration-500 flex flex-col h-full relative">
      {showConfirm && (
        <div className="absolute inset-0 z-30 bg-slate-900/95 backdrop-blur-sm p-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
           <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
           </div>
           <h4 className="text-white font-display font-black text-xl mb-2 tracking-tight">Delete Match?</h4>
           <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed">This will permanently remove all scores for this session.</p>
           <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
              >
                {isDeleting ? 'Deleting...' : 'Confirm'}
              </button>
           </div>
        </div>
      )}

      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-8">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${config.border} ${config.bg} ${config.color} text-[10px] font-black uppercase tracking-[0.2em]`}>
            {match.status === 'live' ? <Radio className="w-3.5 h-3.5 animate-pulse" /> : <config.icon className="w-3.5 h-3.5" />}
            {config.label}
          </div>
          <div className="flex items-center gap-3">
            {canEdit && (
              <button 
                onClick={() => setShowConfirm(true)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 mb-8 flex-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center">
               <h3 className="text-lg sm:text-xl font-display font-black text-slate-900 tracking-tight leading-tight mb-1">{teamA}</h3>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Home</span>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shrink-0">
               <span className="text-[10px] sm:text-xs font-black text-slate-300 italic">VS</span>
            </div>
            <div className="flex-1 text-center">
               <h3 className="text-lg sm:text-xl font-display font-black text-slate-900 tracking-tight leading-tight mb-1">{teamB}</h3>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Away</span>
            </div>
          </div>
          
          <div className="bg-cricket-light/50 p-4 rounded-xl border border-cricket-green/10 flex flex-col items-center justify-center gap-2">
             <div className="flex items-center gap-4 text-xs font-black text-slate-700 uppercase tracking-widest">
                <Swords className="w-4 h-4 text-cricket-green" />
                Score: {match.runs}/{match.wickets}
             </div>
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Overs: {match.overs.toFixed(1)}
             </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8 pb-6 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(match.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {canEdit && match.status !== 'completed' ? (
            <Link 
              to={`/scorer/${match.id}`}
              className="cricket-button-primary flex-1 py-3 text-[11px] flex items-center justify-center gap-2 group/btn"
            >
              Scorer <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link 
              to={`/live/${match.id}`}
              className="cricket-button-primary flex-1 py-3 text-[11px] flex items-center justify-center gap-2 group/btn"
            >
              Live Stats <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          )}
          <Link 
            to={`/scoreboard/${match.id}`}
            className="cricket-button-secondary flex-1 py-3 text-[11px] flex items-center justify-center"
          >
            Scorecard
          </Link>
        </div>
      </div>
    </div>
  );
};
