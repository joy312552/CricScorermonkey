
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
  const { match: remoteMatch, loading } = useMatchRealTime(id);
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
      if (nextOverBalls === 6) {
        nextTotalOvers = Math.floor(nextTotalOvers) + 1;
        nextOverBalls = 0;
        [striker, nonStriker] = [nonStriker, striker];
      } else {
        nextTotalOvers = Math.floor(nextTotalOvers) + (nextOverBalls / 10);
      }
    }

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
      bowler_overs: isLegalBall ? (match.bowler_overs || 0) + 0.1 : (match.bowler_overs || 0)
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
      await MatchService.sendOverlayCommand(match.id, command, payload);
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
    <div className="h-screen w-screen bg-slate-950 text-slate-200 font-sans overflow-hidden flex flex-col">
      {/* 1. SLIM HEADER */}
      <header className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
          <h1 className="text-xs font-black tracking-tighter text-white uppercase">
            Control <span className="text-[8px] bg-red-600 px-1.5 py-0.5 rounded-full ml-1">LIVE</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-950 rounded-lg border border-slate-800">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-[8px] font-black text-white uppercase">Sync</span>
          </div>
          <button onClick={() => navigate('/dashboard')} className="p-1.5 bg-slate-800 rounded-lg">
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* 2. COMPACT SCORE PREVIEW */}
      <section className="h-20 bg-slate-900/50 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
        <div className="relative z-10 flex flex-col">
          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">Live Preview</span>
          <h2 className="text-sm font-black text-white tracking-tight uppercase truncate max-w-[150px]">
            {match.team_a} <span className="text-slate-600 italic text-[10px]">v</span> {match.team_b}
          </h2>
          <div className="flex gap-2 mt-1">
             <span className="text-[8px] font-bold text-slate-500 uppercase">S: {match.striker?.split(' ')[0]}</span>
             <span className="text-[8px] font-bold text-slate-400 uppercase">NS: {match.non_striker?.split(' ')[0]}</span>
          </div>
        </div>
        <div className="relative z-10 text-right">
          <div className="text-3xl font-black text-white tracking-tighter leading-none">
            {match.total_runs}<span className="text-slate-700">/</span>{match.total_wickets}
          </div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mt-1">
            Overs <span className="text-emerald-500">{match.total_overs.toFixed(1)}</span>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTROL AREA (SCROLL-FREE) */}
      <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
        
        {/* Scoring Engine */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          <div className="flex items-center gap-2 px-1">
            <Zap className="w-3 h-3 text-emerald-500" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">Scoring Engine</span>
          </div>
          
          {/* Runs Grid */}
          <div className="grid grid-cols-4 gap-2 h-1/2">
            {scoreButtons.map((runs) => (
              <button
                key={runs}
                onClick={() => handleScore(runs)}
                disabled={isProcessing}
                className="bg-slate-800 hover:bg-emerald-600 active:scale-95 text-white rounded-xl text-xl font-black transition-all shadow-lg shadow-black/20 flex items-center justify-center disabled:opacity-50"
              >
                {runs}
              </button>
            ))}
            <button
              onClick={() => handleScore(0, true)}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/20 disabled:opacity-50"
            >
              Wicket
            </button>
          </div>

          {/* Extras Grid */}
          <div className="grid grid-cols-4 gap-2 h-1/4">
            {extraButtons.map((btn) => (
              <button
                key={btn.label}
                onClick={() => handleScore(btn.runs, false, btn.type)}
                disabled={isProcessing}
                className="bg-slate-800 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Utility Row */}
          <div className="grid grid-cols-4 gap-2 h-1/4">
            <button onClick={handleUndo} className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1">
              <Undo2 className="w-3 h-3" /> Undo
            </button>
            <button className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest">
              Batter
            </button>
            <button className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest">
              Bowler
            </button>
            <button className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest">
              Settings
            </button>
          </div>
        </div>

        {/* Graphics Engine */}
        <div className="h-1/3 flex flex-col gap-2 min-h-0">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <MonitorPlay className="w-3 h-3 text-blue-500" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">Graphics Engine</span>
            </div>
            <button onClick={() => MatchService.hideOverlay(match.id)} className="text-[8px] font-black text-slate-500 uppercase flex items-center gap-1">
              <EyeOff className="w-2.5 h-2.5" /> Hide All
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <div className="grid grid-cols-3 gap-1.5">
              {graphicsButtons.map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => sendCommand(btn.cmd)}
                  className="py-2.5 bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:border-blue-500 rounded-lg flex flex-col items-center justify-center gap-1 transition-all"
                >
                  {btn.icon ? <btn.icon className="w-3 h-3 text-slate-500" /> : <Tv className="w-3 h-3 text-slate-500" />}
                  <span className="text-[7px] font-black uppercase tracking-widest text-slate-400 leading-none">
                    {btn.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. SLIM FOOTER */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">OBS Sync Active</span>
        </div>
        <button 
          onClick={() => window.open(`/#/overlay/${match.id}`, '_blank')}
          className="text-[8px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1"
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
