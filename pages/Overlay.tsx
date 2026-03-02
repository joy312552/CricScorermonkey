
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMatchRealTime } from '../hooks/useMatchRealTime';
import { Trophy, Swords, BarChart3, TrendingUp, Target } from 'lucide-react';
import { LowerScoreboard } from '../components/LowerScoreboard';
import { PlayingXIOverlay } from '../components/PlayingXIOverlay';
import { IndiaPlayingXIOverlay } from '../components/IndiaPlayingXIOverlay';

export const Overlay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { match, overlayCommand } = useMatchRealTime(id);
  const [activeGraphic, setActiveGraphic] = useState<string | null>(null);
  const [payload, setPayload] = useState<any>({});

  useEffect(() => {
    if (overlayCommand && overlayCommand.visible) {
      setActiveGraphic(overlayCommand.command);
      setPayload(overlayCommand.payload || {});

      // Auto-hide certain graphics after 10 seconds
      const autoHideCommands = ['TEAM_VS_TEAM', 'MATCH_SUMMARY', 'TOSS_WINNER', 'BATT_SUMMARY', 'BOWL_SUMMARY'];
      if (autoHideCommands.includes(overlayCommand.command)) {
        const timer = setTimeout(() => {
          setActiveGraphic(null);
        }, 10000);
        return () => clearTimeout(timer);
      }
    } else if (overlayCommand && !overlayCommand.visible) {
      setActiveGraphic(null);
    }
  }, [overlayCommand]);

  useEffect(() => {
    document.body.style.background = 'transparent';
    return () => {
      document.body.style.background = '';
    };
  }, []);

  if (!match) return null;

  const renderGraphic = () => {
    switch (activeGraphic) {
      case 'TEAM_VS_TEAM':
        return (
          <motion.div 
            key="team_vs_team"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center p-20 z-50 pointer-events-none"
          >
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[4rem] p-16 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8)] flex items-center gap-20">
              <div className="text-center space-y-4">
                <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                  <Trophy className="w-16 h-16 text-emerald-500" />
                </div>
                <h2 className="text-6xl font-black text-white tracking-tighter uppercase">{match.team_a}</h2>
              </div>
              <div className="text-8xl font-black text-emerald-500 italic opacity-20">VS</div>
              <div className="text-center space-y-4">
                <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                  <Swords className="w-16 h-16 text-blue-500" />
                </div>
                <h2 className="text-6xl font-black text-white tracking-tighter uppercase">{match.team_b}</h2>
              </div>
            </div>
          </motion.div>
        );

      case 'MATCH_SUMMARY':
        return (
          <motion.div 
            key="match_summary"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed left-20 top-1/2 -translate-y-1/2 w-[500px] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 shadow-2xl z-50 pointer-events-none"
          >
            <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
              <BarChart3 className="w-8 h-8 text-emerald-500" />
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Match Summary</h3>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">{match.team_a}</span>
                <span className="text-3xl font-black text-white">{match.total_runs}/{match.total_wickets}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Overs</span>
                <span className="text-3xl font-black text-emerald-500">{match.total_overs.toFixed(1)}</span>
              </div>
              {match.target && (
                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Target</span>
                  <span className="text-3xl font-black text-blue-500">{match.target}</span>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 'CUSTOM_TEXT':
        return (
          <motion.div 
            key="custom_text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-40 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-12 py-6 rounded-full shadow-2xl z-50 pointer-events-none"
          >
            <p className="text-2xl font-black uppercase tracking-widest text-center">{payload.text || ''}</p>
          </motion.div>
        );

      case 'PLAYING_XI':
        return <PlayingXIOverlay key="playing_xi" />;

      case 'INDIA_PLAYING_XI':
        return <IndiaPlayingXIOverlay key="india_playing_xi" />;

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none font-sans bg-transparent">
      {/* Professional Lower Scoreboard (Always Visible) */}
      <LowerScoreboard 
        teamA={match.team_a}
        teamB={match.team_b}
        striker={match.striker || 'Batter 1'}
        nonStriker={match.non_striker || 'Batter 2'}
        bowler={match.bowler || 'Bowler'}
        score={`${match.total_runs}-${match.total_wickets}`}
        overs={match.total_overs.toFixed(1)}
        inning="1ST INNING"
        strikerRuns={match.striker_runs || 0}
        strikerBalls={match.striker_balls || 0}
        nonStrikerRuns={match.non_striker_runs || 0}
        nonStrikerBalls={match.non_striker_balls || 0}
        bowlerWickets={match.bowler_wickets || 0}
        bowlerRuns={match.bowler_runs || 0}
        bowlerOvers={(match.bowler_overs || 0).toFixed(1)}
        crr={(match.total_runs / Math.max(0.1, match.total_overs)).toFixed(2)}
        target={match.target}
        matchOvers={match.match_overs || 20}
      />

      {/* Dynamic Overlays */}
      <AnimatePresence mode="wait">
        {renderGraphic()}
      </AnimatePresence>
    </div>
  );
};
