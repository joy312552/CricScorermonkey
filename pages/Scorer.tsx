
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Swords, 
  RotateCcw, 
  Settings, 
  ChevronRight, 
  Radio, 
  Tv, 
  MonitorPlay, 
  Eye, 
  EyeOff, 
  Zap,
  Users,
  Layout,
  BarChart3,
  LineChart,
  PieChart,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useMatchRealTime } from '../hooks/useMatchRealTime';
import { MatchService } from '../services/MatchService';
import { Match } from '../types';

export const Scorer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { match, loading } = useMatchRealTime(id);
  const [customText, setCustomText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-emerald-500 font-black uppercase tracking-widest text-xs">Initializing Control Panel...</p>
      </div>
    </div>
  );

  if (!match) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white p-6">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Match Not Found</h1>
      <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-emerald-600 rounded-xl font-black uppercase text-xs tracking-widest">Return to Dashboard</button>
    </div>
  );

  const handleScore = async (runs: number, isWicket: boolean = false, extraType?: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await MatchService.recordBall(match.id, match, runs, isWicket, extraType);
    } catch (err) {
      console.error('Scoring error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUndo = async () => {
    if (isProcessing) return;
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
    { label: 'TEAM VS TEAM', cmd: 'TEAM_VS_TEAM' },
    { label: '2 TEAM PLAYERS', cmd: 'TEAM_PLAYERS' },
    { label: 'MATCH SUMMARY', cmd: 'MATCH_SUMMARY' },
    { label: 'STRIKE BATTER', cmd: 'STRIKE_BATTER' },
    { label: 'TOSS WINNER', cmd: 'TOSS_WINNER' },
    { label: 'BATT SUMMARY', cmd: 'BATT_SUMMARY' },
    { label: 'BOWL SUMMARY', cmd: 'BOWL_SUMMARY' },
    { label: 'LAST WICKET', cmd: 'LAST_WICKET' },
    { label: 'TARGET', cmd: 'TARGET' },
    { label: 'NEED RUN', cmd: 'NEED_RUN' },
    { label: 'PARTNERSHIP', cmd: 'PARTNERSHIP' },
    { label: 'PLAYER POSITION', cmd: 'PLAYER_POSITION' },
    { label: 'BAR', cmd: 'CHART_BAR', icon: BarChart3 },
    { label: 'LINE', cmd: 'CHART_LINE', icon: LineChart },
    { label: 'WAGON', cmd: 'CHART_WAGON', icon: PieChart },
    { label: 'PENDING', cmd: 'STATUS_PENDING' },
    { label: 'OUT', cmd: 'STATUS_OUT' },
    { label: 'NOT OUT', cmd: 'STATUS_NOT_OUT' },
    { label: 'HAT-TRICK BALL', cmd: 'HAT_TRICK' },
    { label: 'P1', cmd: 'PLAYER_1' },
    { label: 'P2', cmd: 'PLAYER_2' },
    { label: 'P3', cmd: 'PLAYER_3' },
    { label: 'SCORE', cmd: 'SHOW_SCORE' },
    { label: 'CRR', cmd: 'SHOW_CRR' },
    { label: 'RR', cmd: 'SHOW_RR' },
    { label: 'EXTRA', cmd: 'SHOW_EXTRA' },
    { label: 'TARGET 2', cmd: 'SHOW_TARGET_2' },
    { label: 'TOSS', cmd: 'SHOW_TOSS' },
    { label: 'WINFIRE', cmd: 'SHOW_WINFIRE' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* Top Professional Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-slate-900/80">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/20">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-white uppercase flex items-center gap-2">
              Broadcast Control <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Match ID: {match.id.slice(0, 8)}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 px-6 py-2 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-xs font-black text-white uppercase tracking-tighter">Connected</span>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Latency</p>
              <span className="text-xs font-black text-emerald-500 uppercase tracking-tighter">14ms</span>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scoring & Match Info */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Live Preview Card */}
          <section className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Live Scoreboard Preview</span>
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
                    {match.team_a} <span className="text-slate-700 italic">vs</span> {match.team_b}
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-6xl font-black text-white tracking-tighter mb-1">
                    {match.total_runs}<span className="text-slate-700">/</span>{match.total_wickets}
                  </div>
                  <div className="text-xl font-black text-slate-500 uppercase tracking-tighter">
                    Overs <span className="text-emerald-500">{match.total_overs.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Striker</p>
                  <p className="text-sm font-black text-white uppercase tracking-tight">{match.striker || 'Not Set'}</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Non-Striker</p>
                  <p className="text-sm font-black text-white uppercase tracking-tight">{match.non_striker || 'Not Set'}</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Bowler</p>
                  <p className="text-sm font-black text-emerald-500 uppercase tracking-tight">{match.bowler || 'Not Set'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Scoring Controls */}
          <section className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <Zap className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Match Control Engine</h3>
            </div>

            <div className="space-y-8">
              {/* Runs Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                {scoreButtons.map((runs) => (
                  <button
                    key={runs}
                    onClick={() => handleScore(runs)}
                    disabled={isProcessing}
                    className="aspect-square bg-slate-800 hover:bg-emerald-600 hover:scale-105 active:scale-95 text-white rounded-2xl text-2xl font-black transition-all shadow-lg shadow-black/20 flex items-center justify-center disabled:opacity-50"
                  >
                    {runs}
                  </button>
                ))}
              </div>

              {/* Extras & Wicket */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {extraButtons.map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => handleScore(btn.runs, false, btn.type)}
                    disabled={isProcessing}
                    className="py-6 bg-slate-800 hover:bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-all disabled:opacity-50"
                  >
                    {btn.label}
                  </button>
                ))}
                <button
                  onClick={() => handleScore(0, true)}
                  disabled={isProcessing}
                  className="py-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/20 disabled:opacity-50"
                >
                  Wicket
                </button>
              </div>

              {/* Utility Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-800">
                <button onClick={handleUndo} className="py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <RotateCcw className="w-3 h-3" /> Undo
                </button>
                <button className="py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Edit
                </button>
                <button className="py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Batter
                </button>
                <button className="py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Over
                </button>
                <button className="py-4 bg-slate-950 hover:bg-red-900/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-900/20">
                  End Match
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Graphics Control */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <MonitorPlay className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Graphics Engine</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => MatchService.hideOverlay(match.id)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <EyeOff className="w-3 h-3" /> Hide All
                </button>
              </div>
            </div>

            {/* Theme & Toggles */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              {['Theme 1', 'Theme 2', 'Theme 3', 'Default'].map(t => (
                <button key={t} className="py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                  {t}
                </button>
              ))}
            </div>

            {/* Custom Text Input */}
            <div className="flex gap-2 mb-8">
              <input 
                type="text" 
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter custom broadcast text..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button 
                onClick={() => sendCommand('CUSTOM_TEXT', { text: customText })}
                className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Show
              </button>
            </div>

            {/* Graphics Commands Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              {graphicsButtons.map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => sendCommand(btn.cmd)}
                  className="p-4 bg-slate-800 hover:bg-blue-600 group rounded-2xl border border-slate-700/50 transition-all flex flex-col items-center justify-center gap-2 text-center"
                >
                  {btn.icon ? <btn.icon className="w-4 h-4 text-slate-400 group-hover:text-white" /> : <Tv className="w-4 h-4 text-slate-400 group-hover:text-white" />}
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white leading-tight">
                    {btn.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-auto pt-8 flex items-center justify-between border-t border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OBS Sync Active</span>
              </div>
              <button 
                onClick={() => window.open(`/#/overlay/${match.id}`, '_blank')}
                className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                Open Overlay <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
