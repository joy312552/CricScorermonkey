
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  RotateCcw, 
  Settings, 
  ChevronRight, 
  Radio, 
  Tv, 
  MonitorPlay, 
  EyeOff, 
  Zap,
  BarChart3,
  LineChart,
  PieChart,
  AlertCircle,
  Undo2,
  MoreHorizontal,
  LogOut
} from 'lucide-react';
import { useMatchRealTime } from '../hooks/useMatchRealTime';
import { MatchService } from '../services/MatchService';
import { Match } from '../types';

export const Scorer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { match: remoteMatch, overlayCommand, loading } = useMatchRealTime(id);
  const [match, setMatch] = useState<Match | null>(null);
  const [customText, setCustomText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync remote match to local state for optimistic updates
  useEffect(() => {
    if (remoteMatch) {
      setMatch(remoteMatch);
    }
  }, [remoteMatch]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-emerald-500 font-black uppercase tracking-widest text-[10px]">Initializing Engine...</p>
      </div>
    </div>
  );

  if (!match) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white p-6">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-black uppercase tracking-tighter mb-2 text-center">Match Not Found</h1>
      <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-emerald-600 rounded-xl font-black uppercase text-xs tracking-widest">Return to Dashboard</button>
    </div>
  );

  const handleScore = async (runs: number, isWicket: boolean = false, extraType?: string) => {
    if (isProcessing || !match) return;
    setIsProcessing(true);

    // Optimistic Update
    const isLegalBall = !['wd', 'nb'].includes(extraType || '');
    let nextOverBalls = match.current_over_balls || 0;
    let nextTotalOvers = match.total_overs || 0;
    let striker = match.striker || 'Batter 1';
    let nonStriker = match.non_striker || 'Batter 2';

    if (runs % 2 !== 0) {
      [striker, nonStriker] = [nonStriker, striker];
    }

    if (isLegalBall) {
      nextOverBalls += 1;
      if (nextOverBalls >= 6) {
        nextTotalOvers = Math.floor(nextTotalOvers) + 1;
        nextOverBalls = 0;
        [striker, nonStriker] = [nonStriker, striker];
      } else {
        nextTotalOvers = Math.floor(nextTotalOvers) + (nextOverBalls / 10);
      }
    }

    const incrementBowlerOvers = (current: number) => {
      const overs = Math.floor(current);
      const balls = Math.round((current % 1) * 10) + 1;
      if (balls >= 6) return overs + 1;
      return overs + (balls / 10);
    };

    const optimisticMatch = {
      ...match,
      total_runs: (match.total_runs || 0) + runs,
      total_wickets: (match.total_wickets || 0) + (isWicket ? 1 : 0),
      total_overs: nextTotalOvers,
      current_over_balls: nextOverBalls,
      striker,
      non_striker: nonStriker,
      striker_runs: (match.striker_runs || 0) + runs,
      striker_balls: (match.striker_balls || 0) + (isLegalBall ? 1 : 0),
      bowler_runs: (match.bowler_runs || 0) + runs,
      bowler_wickets: (match.bowler_wickets || 0) + (isWicket ? 1 : 0),
      bowler_overs: isLegalBall ? incrementBowlerOvers(match.bowler_overs || 0) : (match.bowler_overs || 0)
    };

    setMatch(optimisticMatch);

    try {
      await MatchService.recordBall(match.id, match, runs, isWicket, extraType);
    } catch (err) {
      console.error('Scoring error:', err);
      // Revert on error
      setMatch(remoteMatch);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUndo = async () => {
    if (isProcessing || !match) return;
    setIsProcessing(true);
    try {
      await MatchService.undoLastBall(match.id);
    } catch (err) {
      console.error('Undo error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const sendCommand = async (command: string, payload: any = {}) => {
    try {
      if (overlayCommand?.visible && overlayCommand.command === command) {
        await MatchService.hideOverlay(match.id);
      } else {
        await MatchService.sendOverlayCommand(match.id, command, payload);
      }
    } catch (err) {
      console.error('Command error:', err);
    }
  };

  const scoreButtons = [0, 1, 2, 3, 4, 5, 6];
  const extraButtons = [
    { label: 'WD', type: 'wd', runs: 1 },
    { label: 'NB', type: 'nb', runs: 1 },
    { label: 'LB', type: 'lb', runs: 0 },
    { label: 'BYES', type: 'byes', runs: 0 },
  ];

  const graphicsButtons = [
    { label: 'INDIA XI', cmd: 'INDIA_PLAYING_XI' },
    { label: 'PAK XI', cmd: 'PLAYING_XI' },
    { label: 'TEAM VS', cmd: 'TEAM_VS_TEAM' },
    { label: 'SUMMARY', cmd: 'MATCH_SUMMARY' },
    { label: 'STRIKE', cmd: 'STRIKE_BATTER' },
    { label: 'TOSS', cmd: 'TOSS_WINNER' },
    { label: 'BATT', cmd: 'BATT_SUMMARY' },
    { label: 'BOWL', cmd: 'BOWL_SUMMARY' },
    { label: 'WICKET', cmd: 'LAST_WICKET' },
    { label: 'TARGET', cmd: 'TARGET' },
    { label: 'NEED', cmd: 'NEED_RUN' },
    { label: 'PARTNER', cmd: 'PARTNERSHIP' },
    { label: 'BAR', cmd: 'CHART_BAR', icon: BarChart3 },
    { label: 'LINE', cmd: 'CHART_LINE', icon: LineChart },
    { label: 'WAGON', cmd: 'CHART_WAGON', icon: PieChart },
    { label: 'OUT', cmd: 'STATUS_OUT' },
    { label: 'NOT OUT', cmd: 'STATUS_NOT_OUT' },
    { label: 'SCORE', cmd: 'SHOW_SCORE' },
    { label: 'CRR', cmd: 'SHOW_CRR' },
    { label: 'EXTRA', cmd: 'SHOW_EXTRA' },
  ];

  return (
    <div className="h-screen w-screen bg-white text-slate-900 font-sans overflow-hidden flex flex-col">
      {/* 1. SLIM HEADER */}
      <header className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
          <h1 className="text-xs font-black tracking-tighter text-slate-900 uppercase">
            Control <span className="text-[8px] bg-red-600 text-white px-1.5 py-0.5 rounded-full ml-1">LIVE</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-200">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-[8px] font-black text-slate-600 uppercase">Sync</span>
          </div>
          <button onClick={() => navigate('/dashboard')} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
            <LogOut className="w-3.5 h-3.5 text-slate-600" />
          </button>
        </div>
      </header>

      {/* 2. COMPACT SCORE PREVIEW */}
      <section className="h-20 bg-slate-50 border-b border-slate-200 px-4 flex items-center justify-between shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
        <div className="relative z-10 flex flex-col">
          <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Live Preview</span>
          <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase truncate max-w-[150px]">
            {match.team_a} <span className="text-slate-400 italic text-[10px]">v</span> {match.team_b}
          </h2>
          <div className="flex gap-2 mt-1">
             <span className="text-[8px] font-bold text-slate-500 uppercase">S: {match.striker?.split(' ')[0]}</span>
             <span className="text-[8px] font-bold text-slate-400 uppercase">NS: {match.non_striker?.split(' ')[0]}</span>
          </div>
        </div>
        <div className="relative z-10 text-right">
          <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
            {match.total_runs}<span className="text-slate-300">/</span>{match.total_wickets}
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">
            Overs <span className="text-emerald-600">{match.total_overs.toFixed(1)}</span>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTROL AREA (SCROLL-FREE) */}
      <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden bg-white">
        
        {/* Scoring Engine */}
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center gap-2 px-1">
            <Zap className="w-3 h-3 text-emerald-600" />
            <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Scoring Engine</span>
          </div>
          
          {/* Runs Grid */}
          <div className="grid grid-cols-8 gap-1 shrink-0">
            {scoreButtons.map((runs) => (
              <button
                key={runs}
                onClick={() => handleScore(runs)}
                disabled={isProcessing}
                className="w-full h-10 bg-slate-100 hover:bg-emerald-600 hover:text-white active:scale-95 text-slate-800 rounded-lg text-base font-black transition-all border border-slate-200 shadow-sm flex items-center justify-center disabled:opacity-50"
              >
                {runs}
              </button>
            ))}
            <button
              onClick={() => handleScore(0, true)}
              disabled={isProcessing}
              className="w-full h-10 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all border border-red-100 shadow-sm disabled:opacity-50"
            >
              OUT
            </button>
          </div>

          {/* Extras Grid */}
          <div className="grid grid-cols-4 gap-1 shrink-0">
            {extraButtons.map((btn) => (
              <button
                key={btn.label}
                onClick={() => handleScore(btn.runs, false, btn.type)}
                disabled={isProcessing}
                className="py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 disabled:opacity-50"
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Utility Row */}
          <div className="grid grid-cols-4 gap-1 shrink-0">
            <button onClick={handleUndo} className="py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 shadow-sm">
              <Undo2 className="w-3 h-3" /> Undo
            </button>
            <button className="py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
              Batter
            </button>
            <button className="py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
              Bowler
            </button>
            <button className="py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
              Settings
            </button>
          </div>
        </div>

        {/* Graphics Engine */}
        <div className="flex-1 flex flex-col gap-1 min-h-0">
          <div className="flex items-center justify-between px-1 shrink-0">
            <div className="flex items-center gap-2">
              <MonitorPlay className="w-3 h-3 text-blue-600" />
              <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Graphics Engine</span>
            </div>
            <button onClick={() => MatchService.hideOverlay(match.id)} className="text-[8px] font-black text-slate-400 hover:text-slate-600 uppercase flex items-center gap-1 transition-colors">
              <EyeOff className="w-2.5 h-2.5" /> Hide All
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <div className="grid grid-cols-4 gap-1">
              {graphicsButtons.map((btn) => {
                const isActive = overlayCommand?.visible && overlayCommand.command === btn.cmd;
                return (
                  <button
                    key={btn.label}
                    onClick={() => sendCommand(btn.cmd)}
                    className={`py-1.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all border ${
                      isActive 
                        ? "bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-[7px] font-black uppercase tracking-widest leading-none">
                      {btn.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. SLIM FOOTER */}
      <footer className="h-10 bg-white border-t border-slate-200 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">OBS Sync Active</span>
        </div>
        <button 
          onClick={() => window.open(`/#/overlay/${match.id}`, '_blank')}
          className="text-[8px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest flex items-center gap-1 transition-colors"
        >
          Open Overlay <ChevronRight className="w-2.5 h-2.5" />
        </button>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
