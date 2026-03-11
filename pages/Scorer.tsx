
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
  LogOut,
  ArrowRightCircle,
  UserPlus,
  X
} from 'lucide-react';
import { useMatchRealTime } from '../hooks/useMatchRealTime';
import { supabase } from '../supabase';
import { MatchService } from '../services/MatchService';
import { Match, Player, DismissalType } from '../types';

export const Scorer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { match: remoteMatch, overlayCommand, loading } = useMatchRealTime(id);
  const [match, setMatch] = useState<Match | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [activeModal, setActiveModal] = useState<'batter' | 'bowler' | 'settings' | 'dismissal' | null>(null);
  const [isThemesOpen, setIsThemesOpen] = useState(false);
  const [isOverlayLinkOpen, setIsOverlayLinkOpen] = useState(false);
  const [hasInitializedDefault, setHasInitializedDefault] = useState(false);
  
  // Player Data
  const [battingTeamPlayers, setBattingTeamPlayers] = useState<Player[]>([]);
  const [bowlingTeamPlayers, setBowlingTeamPlayers] = useState<Player[]>([]);
  
  // Dismissal Selection State
  const [dismissalState, setDismissalState] = useState<{
    type: DismissalType | null;
    fielderId: string | null;
    step: 1 | 2;
  }>({ type: null, fielderId: null, step: 1 });

  const [settingsForm, setSettingsForm] = useState({ 
    team_a_name: '', 
    team_b_name: '', 
    match_overs: 20,
    target: 0,
    venue: '',
    overlay_theme: 'default',
    toss_winner_id: '',
    toss_choice: 'bat' as 'bat' | 'bowl'
  });

  useEffect(() => {
    if (match) {
      setSettingsForm({
        team_a_name: match.team_a_name || '',
        team_b_name: match.team_b_name || '',
        match_overs: match.match_overs || 20,
        target: match.target || 0,
        venue: match.venue || '',
        overlay_theme: match.overlay_theme || 'default',
        toss_winner_id: match.toss_winner_id || '',
        toss_choice: (match.toss_choice as 'bat' | 'bowl') || 'bat'
      });

      // Load players for the teams
      const loadPlayers = async () => {
        const battingTeamId = match.current_innings === 1 ? match.team_a_id : match.team_b_id;
        const bowlingTeamId = match.current_innings === 1 ? match.team_b_id : match.team_a_id;
        
        if (battingTeamId && bowlingTeamId) {
          const [batters, bowlers] = await Promise.all([
            MatchService.getPlayersByTeam(battingTeamId),
            MatchService.getPlayersByTeam(bowlingTeamId)
          ]);
          setBattingTeamPlayers(batters);
          setBowlingTeamPlayers(bowlers);
        }
      };
      loadPlayers();
    }
  }, [match?.id, match?.current_innings]);

  const updateMatch = async (updates: any) => {
    if (!match) return;
    setIsProcessing(true);
    try {
      // Handle Team Name Updates
      if (updates.team_a_name && updates.team_a_name !== match.team_a_name && match.team_a_id) {
        await MatchService.updateTeamName(match.team_a_id, updates.team_a_name);
      }
      if (updates.team_b_name && updates.team_b_name !== match.team_b_name && match.team_b_id) {
        await MatchService.updateTeamName(match.team_b_id, updates.team_b_name);
      }

      // Handle Toss Update
      if (updates.toss_winner_id || updates.toss_choice) {
        await MatchService.updateToss(
          match.id, 
          updates.toss_winner_id || match.toss_winner_id || '', 
          (updates.toss_choice || match.toss_choice || 'bat') as 'bat' | 'bowl'
        );
      }

      // Handle other match updates
      await MatchService.updateMatchPlayers(match.id, updates);
      setActiveModal(null);
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Sync remote match to local state for optimistic updates
  useEffect(() => {
    if (remoteMatch && !isProcessing) {
      setMatch(remoteMatch);
    }
  }, [remoteMatch, isProcessing]);

  // Auto-enable default scoreboard on load
  useEffect(() => {
    if (match && !hasInitializedDefault && !loading) {
      if (!overlayCommand?.visible) {
        MatchService.sendOverlayCommand(match.id, 'DEFAULT_SCOREBOARD', {});
      }
      setHasInitializedDefault(true);
    }
  }, [match?.id, loading, hasInitializedDefault, overlayCommand?.visible]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-cricket-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cricket-green border-t-transparent rounded-full animate-spin" />
        <p className="text-cricket-green font-black uppercase tracking-widest text-[10px]">Initializing Engine...</p>
      </div>
    </div>
  );

  if (!match) return (
    <div className="flex flex-col items-center justify-center h-screen bg-cricket-dark text-white p-6">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-black uppercase tracking-tighter mb-2 text-center">Match Not Found</h1>
      <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-cricket-green rounded-xl font-black uppercase text-xs tracking-widest">Return to Dashboard</button>
    </div>
  );

  const handleThemeChange = async (theme: string) => {
    if (!match) return;
    try {
      await MatchService.updateTheme(match.id, theme);
      localStorage.setItem('scoreboardTheme', theme);
    } catch (err) {
      console.error('Theme update error:', err);
    }
  };

  const handleScore = async (runs: number, isWicket: boolean = false, extraType?: string) => {
    if (isProcessing || isDebouncing || !match) return;
    
    if (isWicket) {
      setDismissalState({ type: null, fielderId: null, step: 1 });
      setActiveModal('dismissal');
      return;
    }

    // Optimistic Update
    const isLegalBall = !['wd', 'nb'].includes(extraType || '');
    const nextBalls = isLegalBall ? (match.balls || 0) + 1 : (match.balls || 0);
    const completedOvers = Math.floor(nextBalls / 6);
    const remainingBalls = nextBalls % 6;
    const nextOvers = parseFloat(`${completedOvers}.${remainingBalls}`);

    const optimisticMatch = {
      ...match,
      runs: (match.runs || 0) + runs,
      wickets: (match.wickets || 0) + (isWicket ? 1 : 0),
      balls: nextBalls,
      overs: nextOvers,
    };
    setMatch(optimisticMatch);

    setIsProcessing(true);
    setIsDebouncing(true);

    try {
      await MatchService.recordBall(match.id, runs, false, extraType);
    } catch (err: any) {
      console.error('Scoring error:', err);
      // Rollback
      setMatch(remoteMatch);
      alert(`Scoring failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setIsDebouncing(false), 300);
    }
  };

  const handleDismissalSubmit = async () => {
    if (!match || !dismissalState.type) return;
    
    // Optimistic Update
    const nextBalls = (match.balls || 0) + 1;
    const completedOvers = Math.floor(nextBalls / 6);
    const remainingBalls = nextBalls % 6;
    const nextOvers = parseFloat(`${completedOvers}.${remainingBalls}`);

    const optimisticMatch = {
      ...match,
      wickets: (match.wickets || 0) + 1,
      balls: nextBalls,
      overs: nextOvers,
    };
    setMatch(optimisticMatch);

    setIsProcessing(true);
    try {
      await MatchService.recordBall(
        match.id, 
        0, 
        true, 
        'none', 
        dismissalState.type, 
        dismissalState.fielderId || undefined
      );
      setActiveModal(null);
    } catch (err) {
      console.error('Dismissal error:', err);
      // Rollback
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

  const handleNextInnings = async () => {
    if (isProcessing || !match) return;
    if (window.confirm('Start Next Innings? Teams will switch and target will be set.')) {
      setIsProcessing(true);
      try {
        await MatchService.updateMatchPlayers(match.id, {
          current_innings: 2,
          runs: 0,
          wickets: 0,
          balls: 0,
          overs: 0,
          striker_runs: 0,
          striker_balls: 0,
          non_striker_runs: 0,
          non_striker_balls: 0,
          bowler_runs: 0,
          bowler_wickets: 0,
          bowler_overs: 0,
          target: match.runs + 1
        });
      } catch (err) {
        console.error('Next innings error:', err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const sendCommand = async (command: string, payload: any = {}) => {
    try {
      // For default scoreboard, we always want to show it (no toggle) to fix the bug reported
      if (command === 'DEFAULT_SCOREBOARD') {
        // First hide everything to ensure a clean state
        await MatchService.hideOverlay(match.id);
        // Then send the default command
        await MatchService.sendOverlayCommand(match.id, command, payload);
        return;
      }

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
    { label: 'DEFAULT', cmd: 'DEFAULT_SCOREBOARD' },
    { label: 'INTRO', cmd: 'TEAM_VS_TEAM' },
    { label: 'TEAM VS', cmd: 'TEAM_VS' },
    { label: 'SUMMARY', cmd: 'MATCH_SUMMARY' },
    { label: 'PLAYING XI', cmd: 'PLAYING_XI' },
    { label: 'BATT CARD', cmd: 'BATT_SUMMARY' },
    { label: 'BALL CARD', cmd: 'BALL_SUMMARY' },
    { label: 'TARGET', cmd: 'TARGET' },
    { label: 'NEED', cmd: 'NEED_RUN' },
    { label: 'PARTNERSHIP', cmd: 'PARTNERSHIP' },
    { label: 'TOSS', cmd: 'TOSS_WINNER' },
    { label: 'BOUNDARIES', cmd: 'BOUNDARY_TRACKER' },
    { label: 'CRR', cmd: 'SHOW_CRR' },
    { label: 'EXTRAS', cmd: 'SHOW_EXTRA' },
  ];

  const isBoundaryTrackerActive = overlayCommand?.visible && overlayCommand.command === 'BOUNDARY_TRACKER';
  const isInningsCompleted = match.wickets >= 10 || 
                             (match.overs >= (match.match_overs || 20)) || 
                             (match.current_innings === 2 && match.target && match.runs >= match.target);

  return (
    <div className="h-screen w-screen bg-cricket-gray text-slate-900 font-sans overflow-hidden flex flex-col">
      {/* 1. SLIM HEADER */}
      <header className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cricket-green rounded-lg">
            <Radio className="w-4 h-4 text-white animate-pulse" />
          </div>
          <h1 className="text-xs font-display font-black tracking-tighter text-slate-900 uppercase">
            CricScore<span className="text-cricket-green">Pro</span> <span className="text-[8px] bg-red-600 text-white px-1.5 py-0.5 rounded-full ml-1">LIVE</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsOverlayLinkOpen(true)}
            className="cricket-button-secondary flex items-center gap-1.5 px-3 py-1.5"
          >
            <MonitorPlay className="w-3 h-3" />
            <span className="text-[9px] font-black uppercase">Overlay Link</span>
          </button>
          <button onClick={() => navigate('/dashboard')} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200">
            <LogOut className="w-3.5 h-3.5 text-slate-600" />
          </button>
        </div>
      </header>

      {/* 2. COMPACT SCORE PREVIEW */}
      <section className="h-28 sm:h-24 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cricket-green/5 rounded-full blur-3xl -mr-24 -mt-24" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cricket-green/5 rounded-full blur-3xl -ml-24 -mb-24" />
        
        <div className="relative z-10 flex flex-col w-[30%]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 bg-cricket-green rounded-full" />
            <span className="text-[8px] font-black text-cricket-green uppercase tracking-widest">Match Preview</span>
          </div>
          <h2 className="text-[9px] sm:text-sm md:text-base font-display font-black text-slate-900 tracking-tight uppercase truncate">
            {match.team_a_name}
          </h2>
          <div className="flex items-center gap-1">
             <span className="text-cricket-green italic text-[7px]">vs</span>
             <h2 className="text-[9px] sm:text-sm md:text-base font-display font-black text-slate-900 tracking-tight uppercase truncate">
               {match.team_b_name}
             </h2>
          </div>
          <div className="hidden sm:flex gap-3 mt-1.5">
             <div className="flex flex-col">
               <span className="text-[7px] font-black text-slate-400 uppercase">Striker</span>
               <span className="text-[10px] font-bold text-slate-700 uppercase">{match.striker?.split(' ')[0] || '---'}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-[7px] font-black text-slate-400 uppercase">Non-Striker</span>
               <span className="text-[10px] font-bold text-slate-700 uppercase">{match.non_striker?.split(' ')[0] || '---'}</span>
             </div>
          </div>
        </div>
        
        {/* Centered Scoreboard */}
        <div className="relative z-20 text-center bg-cricket-light px-4 sm:px-6 py-2 rounded-2xl border border-cricket-green/20 shadow-sm">
          {isInningsCompleted ? (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse shadow-lg shadow-red-600/20">
                {match.current_innings === 2 ? 'Match Completed' : 'Innings Completed'}
              </div>
              {match.current_innings === 1 && (
                <button 
                  onClick={handleNextInnings}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  <ArrowRightCircle className="w-3 h-3" /> Start 2nd Innings
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="text-2xl sm:text-4xl font-display font-black text-slate-900 tracking-tighter leading-none flex items-baseline justify-center">
                {match.runs}<span className="text-cricket-green/50 text-xl sm:text-2xl mx-0.5">/</span>{match.wickets}
              </div>
              <div className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 flex items-center justify-center gap-2">
                <span>Overs</span>
                <span className="bg-cricket-green text-white px-2 py-0.5 rounded-md text-[8px] sm:text-[9px]">{match.overs.toFixed(1)}</span>
              </div>
            </>
          )}
        </div>

        <div className="relative z-10 text-right flex flex-col items-end gap-1 w-[30%]">
          {match.target && match.target > 0 && (
            <div className="bg-cricket-dark text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-lg">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-0.5">Target</span>
              <span className="text-xs sm:text-sm font-black tracking-tighter">{match.target}</span>
            </div>
          )}
        </div>
      </section>

      {/* 3. MAIN CONTROL AREA (SCROLL-FREE) */}
      <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden bg-white">
        
        {/* Scoring Engine */}
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center gap-2 px-1">
            <Zap className="w-3 h-3 text-cricket-green" />
            <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Scoring Engine</span>
          </div>
          
          {/* Runs Grid */}
          <div className={`grid grid-cols-8 gap-1.5 shrink-0 ${isInningsCompleted ? 'opacity-50 pointer-events-none' : ''}`}>
            {scoreButtons.map((runs) => (
              <button
                key={runs}
                onClick={() => handleScore(runs)}
                disabled={isProcessing}
                className="w-full h-12 bg-white hover:bg-cricket-green hover:text-white active:scale-95 text-slate-800 rounded-xl text-lg font-black transition-all border border-slate-200 shadow-sm flex items-center justify-center disabled:opacity-50"
              >
                {runs}
              </button>
            ))}
            <button
              onClick={() => handleScore(0, true)}
              disabled={isProcessing}
              className="w-full h-12 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border border-red-100 shadow-sm disabled:opacity-50"
            >
              OUT
            </button>
          </div>

          {/* Extras Grid */}
          <div className={`grid grid-cols-4 gap-1.5 shrink-0 ${isInningsCompleted ? 'opacity-50 pointer-events-none' : ''}`}>
            {extraButtons.map((btn) => (
              <button
                key={btn.label}
                onClick={() => handleScore(btn.runs, false, btn.type)}
                disabled={isProcessing}
                className="py-2.5 bg-white hover:bg-blue-600 hover:text-white text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 shadow-sm disabled:opacity-50"
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Utility Row */}
          <div className="grid grid-cols-5 gap-1.5 shrink-0">
            <button onClick={handleUndo} disabled={isProcessing} className="py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50">
              <Undo2 className="w-3 h-3" /> Undo
            </button>
            <button onClick={handleNextInnings} disabled={isProcessing} className={`py-2 bg-white border border-slate-200 hover:bg-slate-50 text-blue-500 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50 ${isInningsCompleted ? 'opacity-50 pointer-events-none' : ''}`}>
              <ArrowRightCircle className="w-3 h-3" /> Next
            </button>
            <button onClick={() => setActiveModal('batter')} disabled={isProcessing} className={`py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95 disabled:opacity-50 ${isInningsCompleted ? 'opacity-50 pointer-events-none' : ''}`}>
              Batter
            </button>
            <button onClick={() => setActiveModal('bowler')} disabled={isProcessing} className={`py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95 disabled:opacity-50 ${isInningsCompleted ? 'opacity-50 pointer-events-none' : ''}`}>
              Bowler
            </button>
            <button onClick={() => setActiveModal('settings')} disabled={isProcessing} className="py-2 bg-cricket-light border border-cricket-green/20 hover:bg-cricket-green/10 text-cricket-dark rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50">
              <Settings className="w-3 h-3" /> Settings
            </button>
          </div>
        </div>

        {/* Graphics Engine */}
        <div className="flex-1 flex flex-col gap-1 min-h-0">
          <div className="flex items-center justify-between px-1 shrink-0">
            <div className="flex items-center gap-2">
              <MonitorPlay className="w-3 h-3 text-cricket-green" />
              <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Graphics Engine</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsThemesOpen(true)}
                className="text-[8px] font-black text-cricket-green hover:text-cricket-dark uppercase flex items-center gap-1 transition-colors"
              >
                <Tv className="w-2.5 h-2.5" /> Themes
              </button>
              <button onClick={() => MatchService.hideOverlay(match.id)} className="text-[8px] font-black text-slate-400 hover:text-slate-600 uppercase flex items-center gap-1 transition-colors">
                <EyeOff className="w-2.5 h-2.5" /> Hide All
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3">
            {/* Match Graphics */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
              <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Match Graphics</h4>
              <div className="grid grid-cols-4 gap-1.5">
                {graphicsButtons.filter(b => ['DEFAULT_SCOREBOARD', 'TEAM_VS_TEAM', 'TEAM_VS', 'MATCH_SUMMARY', 'TOSS_WINNER', 'TARGET', 'NEED_RUN'].includes(b.cmd)).map((btn) => {
                  const isActive = overlayCommand?.visible && overlayCommand.command === btn.cmd;
                  return (
                    <button
                      key={btn.label}
                      onClick={() => sendCommand(btn.cmd)}
                      className={`py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all border ${
                        isActive 
                          ? "bg-cricket-green border-cricket-green text-white shadow-sm" 
                          : "bg-white border-cricket-green/20 text-cricket-dark hover:bg-cricket-light shadow-sm"
                      }`}
                    >
                      <span className="text-[7px] font-black uppercase tracking-widest leading-none text-center">
                        {btn.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Player Graphics */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
              <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Player Graphics</h4>
              <div className="grid grid-cols-4 gap-1.5">
                {graphicsButtons.filter(b => ['PLAYING_XI', 'BATT_SUMMARY', 'BALL_SUMMARY', 'PARTNERSHIP'].includes(b.cmd)).map((btn) => {
                  const isActive = overlayCommand?.visible && overlayCommand.command === btn.cmd;
                  return (
                    <button
                      key={btn.label}
                      onClick={() => sendCommand(btn.cmd)}
                      className={`py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all border ${
                        isActive 
                          ? "bg-cricket-green border-cricket-green text-white shadow-sm" 
                          : "bg-white border-cricket-green/20 text-cricket-dark hover:bg-cricket-light shadow-sm"
                      }`}
                    >
                      <span className="text-[7px] font-black uppercase tracking-widest leading-none text-center">
                        {btn.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stats Graphics */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
              <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Stats Graphics</h4>
              <div className="grid grid-cols-3 gap-1.5">
                {graphicsButtons.filter(b => ['BOUNDARY_TRACKER', 'SHOW_CRR', 'SHOW_EXTRA'].includes(b.cmd)).map((btn) => {
                  const isActive = overlayCommand?.visible && overlayCommand.command === btn.cmd;
                  return (
                    <button
                      key={btn.label}
                      onClick={() => sendCommand(btn.cmd)}
                      className={`py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all border ${
                        isActive 
                          ? "bg-cricket-green border-cricket-green text-white shadow-sm" 
                          : "bg-white border-cricket-green/20 text-cricket-dark hover:bg-cricket-light shadow-sm"
                      }`}
                    >
                      <span className="text-[7px] font-black uppercase tracking-widest leading-none text-center">
                        {btn.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Boundary Tracker Specific Controls */}
            {isBoundaryTrackerActive && (
              <div className="mt-4 p-3 bg-cricket-light border border-cricket-green/20 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-cricket-dark uppercase tracking-widest">Boundary Tracker Controls</span>
                  <button 
                    onClick={() => updateMatch({ fours: 0, sixes: 0 })}
                    className="text-[8px] font-black text-slate-400 hover:text-red-500 uppercase transition-colors"
                  >
                    Reset All
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase">Fours</label>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateMatch({ fours: Math.max(0, (match.fours || 0) - 1) })}
                        className="w-6 h-6 bg-white border border-cricket-green/20 rounded flex items-center justify-center text-cricket-dark font-bold hover:bg-cricket-light"
                      >
                        -
                      </button>
                      <span className="text-sm font-black text-cricket-dark w-8 text-center">{match.fours || 0}</span>
                      <button 
                        onClick={() => updateMatch({ fours: (match.fours || 0) + 1 })}
                        className="w-6 h-6 bg-white border border-cricket-green/20 rounded flex items-center justify-center text-cricket-dark font-bold hover:bg-cricket-light"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase">Sixes</label>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateMatch({ sixes: Math.max(0, (match.sixes || 0) - 1) })}
                        className="w-6 h-6 bg-white border border-cricket-green/20 rounded flex items-center justify-center text-cricket-dark font-bold hover:bg-cricket-light"
                      >
                        -
                      </button>
                      <span className="text-sm font-black text-cricket-dark w-8 text-center">{match.sixes || 0}</span>
                      <button 
                        onClick={() => updateMatch({ sixes: (match.sixes || 0) + 1 })}
                        className="w-6 h-6 bg-white border border-cricket-green/20 rounded flex items-center justify-center text-cricket-dark font-bold hover:bg-cricket-light"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
          className="text-[8px] font-black text-cricket-green hover:text-cricket-dark uppercase tracking-widest flex items-center gap-1 transition-colors"
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

      {/* MODALS */}
      {isOverlayLinkOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-cricket-green/20">
            <div className="p-4 border-b border-cricket-green/10 flex items-center justify-between bg-cricket-light">
              <h3 className="text-sm font-black text-cricket-dark uppercase tracking-widest">Overlay Link</h3>
              <button onClick={() => setIsOverlayLinkOpen(false)} className="p-1 hover:bg-cricket-green/10 rounded-lg transition-colors">
                <X className="w-4 h-4 text-cricket-green" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Copy this link and use it as a Browser Source in OBS or vMix.</p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 break-all font-mono text-[10px] text-slate-600 select-all">
                {`${window.location.origin}/#/overlay/${match.id}`}
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/#/overlay/${match.id}`);
                  alert('Link copied to clipboard!');
                }}
                className="w-full py-3 bg-cricket-green hover:bg-cricket-dark text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-cricket-green/20 transition-all active:scale-95"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {isThemesOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-cricket-green/20">
            <div className="p-4 border-b border-cricket-green/10 flex items-center justify-between bg-cricket-light">
              <h3 className="text-sm font-black text-cricket-dark uppercase tracking-widest">Select Theme</h3>
              <button onClick={() => setIsThemesOpen(false)} className="p-1 hover:bg-cricket-green/10 rounded-lg transition-colors">
                <X className="w-4 h-4 text-cricket-green" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-1 gap-2">
              {[
                { id: 'theme1', name: 'Theme 1 (Default)' },
                { id: 'theme2', name: 'Theme 2 (Modern)' },
                { id: 'theme3', name: 'Theme 3 (Classic)' }
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    handleThemeChange(theme.id);
                    setIsThemesOpen(false);
                  }}
                  className={`w-full py-4 px-4 rounded-xl text-left flex items-center justify-between border transition-all ${
                    match.overlay_theme === theme.id 
                      ? "bg-cricket-light border-cricket-green/30 text-cricket-dark" 
                      : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-widest">{theme.name}</span>
                  {match.overlay_theme === theme.id && <div className="w-2 h-2 bg-cricket-green rounded-full" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeModal === 'batter' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Select Batters</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Striker</label>
                <select 
                  value={settingsForm.striker}
                  onChange={(e) => setSettingsForm({ ...settingsForm, striker: e.target.value })}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-cricket-green outline-none transition-all"
                >
                  <option value="">Select Striker</option>
                  {battingTeamPlayers.map(p => (
                    <option key={p.id} value={p.player_name}>{p.player_name} ({p.role})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Non-Striker</label>
                <select 
                  value={settingsForm.non_striker}
                  onChange={(e) => setSettingsForm({ ...settingsForm, non_striker: e.target.value })}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-cricket-green outline-none transition-all"
                >
                  <option value="">Select Non-Striker</option>
                  {battingTeamPlayers.map(p => (
                    <option key={p.id} value={p.player_name}>{p.player_name} ({p.role})</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={() => updateMatch({ striker: settingsForm.striker, non_striker: settingsForm.non_striker })}
                className="w-full py-3 bg-cricket-green hover:bg-cricket-dark text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-cricket-green/20 transition-all active:scale-95"
              >
                Update Batters
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'bowler' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Select Bowler</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Bowler</label>
                <select 
                  value={settingsForm.bowler}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bowler: e.target.value })}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-cricket-green outline-none transition-all"
                >
                  <option value="">Select Bowler</option>
                  {bowlingTeamPlayers.map(p => (
                    <option key={p.id} value={p.player_name}>{p.player_name} ({p.role})</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={() => updateMatch({ bowler: settingsForm.bowler })}
                className="w-full py-3 bg-cricket-green hover:bg-cricket-dark text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-cricket-green/20 transition-all active:scale-95"
              >
                Update Bowler
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'settings' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Match Settings</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Overs</label>
                  <input 
                    type="number"
                    value={settingsForm.match_overs}
                    onChange={(e) => setSettingsForm({ ...settingsForm, match_overs: parseInt(e.target.value) })}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-cricket-green outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target</label>
                  <input 
                    type="number"
                    value={settingsForm.target}
                    onChange={(e) => setSettingsForm({ ...settingsForm, target: parseInt(e.target.value) })}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-cricket-green outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team A Name</label>
                <input 
                  type="text"
                  value={settingsForm.team_a_name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, team_a_name: e.target.value })}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-cricket-green outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team B Name</label>
                <input 
                  type="text"
                  value={settingsForm.team_b_name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, team_b_name: e.target.value })}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-cricket-green outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Venue</label>
                <input 
                  type="text"
                  value={settingsForm.venue}
                  onChange={(e) => setSettingsForm({ ...settingsForm, venue: e.target.value })}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-cricket-green outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toss Winner</label>
                  <select 
                    value={settingsForm.toss_winner_id}
                    onChange={(e) => setSettingsForm({ ...settingsForm, toss_winner_id: e.target.value })}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-cricket-green outline-none transition-all"
                  >
                    <option value="">Select Team</option>
                    <option value={match.team_a_id}>{match.team_a_name}</option>
                    <option value={match.team_b_id}>{match.team_b_name}</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toss Choice</label>
                  <select 
                    value={settingsForm.toss_choice}
                    onChange={(e) => setSettingsForm({ ...settingsForm, toss_choice: e.target.value as 'bat' | 'bowl' })}
                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-cricket-green outline-none transition-all"
                  >
                    <option value="bat">Batting</option>
                    <option value="bowl">Bowling</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overlay Theme</label>
                <select 
                  value={settingsForm.overlay_theme}
                  onChange={(e) => setSettingsForm({ ...settingsForm, overlay_theme: e.target.value })}
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-cricket-green outline-none transition-all"
                >
                  <option value="theme1">Theme 1 (Professional Blue)</option>
                  <option value="theme2">Theme 2 (Metallic Dark)</option>
                  <option value="theme3">Theme 3 (Modern Glass)</option>
                </select>
              </div>

              <button 
                onClick={() => updateMatch(settingsForm)}
                className="w-full py-3 bg-cricket-green hover:bg-cricket-dark text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-cricket-green/20 transition-all active:scale-95"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'dismissal' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                {dismissalState.step === 1 ? 'Select Dismissal Type' : 'Select Fielder'}
              </h3>
              <button 
                onClick={() => {
                  setActiveModal(null);
                  setDismissalState({ type: null, fielderId: null, step: 1 });
                }} 
                className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            
            <div className="p-4">
              {dismissalState.step === 1 ? (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Bowled', 'Caught', 'LBW', 'Run Out', 
                    'Stumped', 'Hit Wicket', 'Retired Out', 'Obstructing Field'
                  ].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        if (type === 'Caught' || type === 'Run Out' || type === 'Stumped') {
                          setDismissalState({ ...dismissalState, type: type as DismissalType, step: 2 });
                        } else {
                          setDismissalState({ ...dismissalState, type: type as DismissalType });
                          handleDismissalSubmit();
                        }
                      }}
                      className="py-3 bg-slate-50 hover:bg-cricket-green hover:text-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fielder</label>
                    <select 
                      onChange={(e) => setDismissalState({ ...dismissalState, fielderId: e.target.value })}
                      className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-cricket-green outline-none transition-all"
                    >
                      <option value="">Select Fielder</option>
                      {bowlingTeamPlayers.map(p => (
                        <option key={p.id} value={p.id}>{p.player_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setDismissalState({ ...dismissalState, step: 1 })}
                      className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleDismissalSubmit}
                      className="flex-[2] py-3 bg-cricket-green text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cricket-green/20"
                    >
                      Confirm Wicket
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
