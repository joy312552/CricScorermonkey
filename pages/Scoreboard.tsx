
import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useMatchScoreboard } from '../hooks/useMatchScoreboard';
import { MapPin, Users, TrendingUp, ChevronRight, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Subcomponents ---

const LiveIndicator: React.FC<{ venue?: string }> = ({ venue }) => (
  <div className="bg-[#DC2626] h-12 flex items-center justify-center gap-4 px-4">
    <div className="flex items-center gap-2">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-2.5 h-2.5 bg-white rounded-full"
      />
      <span className="text-white font-bold text-sm tracking-widest uppercase">Live</span>
    </div>
    <div className="h-4 w-px bg-white/20" />
    <div className="flex items-center gap-1.5 text-white/90">
      <MapPin className="w-3.5 h-3.5" />
      <span className="text-xs font-bold uppercase tracking-wider">{venue || 'International Stadium'}</span>
    </div>
  </div>
);

const MatchHeader: React.FC<{ tournament?: string, series?: string }> = ({ tournament, series }) => (
  <div className="bg-white px-4 py-4 border-b border-slate-100">
    <h1 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">
      {tournament || 'CricScore Pro League 2024'}
    </h1>
    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-0.5">
      {series || 'Match 12 • T20 Series'}
    </p>
  </div>
);

const TeamCard: React.FC<{ name: string, score: string, overs: string, isYetToBat?: boolean }> = ({ name, score, overs, isYetToBat }) => (
  <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#DC2626] p-4 flex items-center gap-4 flex-1">
    <div className="w-12 h-12 bg-[#DC2626] rounded-full flex items-center justify-center shrink-0 shadow-inner">
      <span className="text-white font-black text-xl italic">{name.charAt(0)}</span>
    </div>
    <div className="flex flex-col min-w-0">
      <h3 className="text-[#1D4ED8] font-black text-lg uppercase tracking-tight truncate">{name}</h3>
      {isYetToBat ? (
        <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Yet to Bat</span>
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 tracking-tighter">{score}</span>
          <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">({overs} OVR)</span>
        </div>
      )}
    </div>
  </div>
);

const StatusBanner: React.FC<{ text: string }> = ({ text }) => (
  <div className="bg-[#FEF3C7] py-3.5 flex items-center justify-center border-y border-[#FDE68A]">
    <span className="text-slate-900 font-black text-sm uppercase tracking-[0.15em]">{text}</span>
  </div>
);

const BallCircle: React.FC<{ val: string | number, type: string }> = ({ val, type }) => {
  const getBg = () => {
    if (type === 'wicket') return 'bg-[#DC2626]';
    if (type === 'extra') return 'bg-[#F59E0B]';
    if (val === 0 || val === '0') return 'bg-slate-400';
    return 'bg-[#10B981]';
  };

  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm ${getBg()}`}>
      {val}
    </div>
  );
};

const OverSection: React.FC<{ bowler: string, balls: any[] }> = ({ bowler, balls }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
    <div className="flex items-center justify-between">
      <h4 className="text-slate-900 font-black text-sm uppercase tracking-widest">Current Over: <span className="text-[#1D4ED8]">{bowler}</span></h4>
      <Share2 className="w-4 h-4 text-slate-300" />
    </div>
    <div className="flex gap-2.5 overflow-x-auto pb-1 custom-scrollbar">
      {balls.map((ball, i) => (
        <BallCircle 
          key={i} 
          val={ball.wicket ? 'W' : (ball.extra_type ? ball.extra_type.charAt(0).toUpperCase() : ball.runs)} 
          type={ball.wicket ? 'wicket' : (ball.extra_type ? 'extra' : 'run')} 
        />
      ))}
      {balls.length === 0 && <p className="text-slate-300 font-bold text-[10px] uppercase tracking-widest py-2">Waiting for next ball...</p>}
    </div>
  </div>
);

const StatsBar: React.FC<{ crr: string, rrr?: string }> = ({ crr, rrr }) => (
  <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-y border-slate-100">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        <Users className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">12.4K Views</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full animate-pulse" />
        <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest">842 Live</span>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
        <span className="text-slate-900 font-black text-[10px] uppercase tracking-widest">CRR <span className="text-[#1D4ED8] ml-1">{crr}</span></span>
      </div>
      {rrr && (
        <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
          <span className="text-slate-900 font-black text-[10px] uppercase tracking-widest">RRR <span className="text-[#DC2626] ml-1">{rrr}</span></span>
        </div>
      )}
    </div>
  </div>
);

// --- Main Component ---

export const Scoreboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { match, ballEvents, loading } = useMatchScoreboard(id);
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'SCORECARD' | 'COMMENTARY' | 'PE'>('SUMMARY');

  const currentOverBalls = useMemo(() => {
    if (!ballEvents.length) return [];
    const lastBall = ballEvents[0];
    const currentOver = lastBall.over_number;
    return ballEvents.filter(b => b.over_number === currentOver).reverse();
  }, [ballEvents]);

  const lastOverBalls = useMemo(() => {
    if (!ballEvents.length) return [];
    const lastBall = ballEvents[0];
    const currentOver = lastBall.over_number;
    const prevOver = currentOver - 1;
    if (prevOver < 0) return null;
    const balls = ballEvents.filter(b => b.over_number === prevOver);
    if (!balls.length) return null;
    const runs = balls.reduce((acc, b) => acc + b.runs, 0);
    return { runs, bowler: 'Previous Bowler' }; // In real app, we'd track bowler per over
  }, [ballEvents]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#F3F4F6]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#1D4ED8] font-black uppercase tracking-widest text-[10px]">Loading Scoreboard...</p>
      </div>
    </div>
  );

  if (!match) return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center px-6">
      <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Match Not Found</h1>
      <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">This match might be private or doesn't exist.</p>
    </div>
  );

  const crr = (match.runs / Math.max(0.1, match.balls / 6)).toFixed(2);
  const rrr = match.target ? (((match.target - match.runs) / Math.max(1, (match.match_overs || 20) * 6 - match.balls)) * 6).toFixed(2) : undefined;

  return (
    <div className="bg-[#F3F4F6] min-h-screen font-sans">
      <LiveIndicator venue={match.venue} />
      <MatchHeader tournament={match.tournament_name} series={match.series_name} />

      <div className="p-4 space-y-4">
        {/* Team Cards */}
        <div className="flex flex-col md:flex-row gap-4">
          <TeamCard 
            name={match.team_a_name || 'Team A'} 
            score={`${match.runs}/${match.wickets}`} 
            overs={match.overs.toFixed(1)} 
          />
          <TeamCard 
            name={match.team_b_name || 'Team B'} 
            score="0/0" 
            overs="0.0" 
            isYetToBat 
          />
        </div>

        {/* Status Banner */}
        <StatusBanner text={`${match.toss_winner || match.team_a} ELECTED TO ${match.toss_decision || 'BAT'} FIRST`} />

        {/* Over Sections */}
        <div className="space-y-3">
          <OverSection bowler={match.bowler || 'Current Bowler'} balls={currentOverBalls} />
          {lastOverBalls && (
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">
              Last Over: <span className="text-slate-900">{lastOverBalls.bowler}</span> • <span className="text-[#DC2626]">{lastOverBalls.runs} Runs</span>
            </p>
          )}
        </div>
      </div>

      <StatsBar crr={crr} rrr={rrr} />

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 flex sticky top-0 z-30">
        {['SUMMARY', 'SCORECARD', 'COMMENTARY', 'PE'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab ? "text-[#1D4ED8]" : "text-slate-400"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1D4ED8]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'SUMMARY' && (
            <motion.div 
              key="summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Batters Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Batters</span>
                  <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="w-6 text-center">R</span>
                    <span className="w-6 text-center">B</span>
                    <span className="w-6 text-center">4s</span>
                    <span className="w-6 text-center">6s</span>
                    <span className="w-12 text-center">SR</span>
                  </div>
                </div>
                <div className="divide-y divide-slate-50 divide-dashed">
                  <div className="px-4 py-4 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[#1D4ED8] font-black text-sm uppercase tracking-tight">{match.striker}*</span>
                    </div>
                    <div className="flex gap-6 text-sm font-black text-slate-900">
                      <span className="w-6 text-center">{match.striker_runs || 0}</span>
                      <span className="w-6 text-center text-slate-400">{match.striker_balls || 0}</span>
                      <span className="w-6 text-center text-slate-400">4</span>
                      <span className="w-6 text-center text-slate-400">2</span>
                      <span className="w-12 text-center text-slate-400">{((match.striker_runs || 0) / Math.max(1, match.striker_balls || 0) * 100).toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="px-4 py-4 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[#1D4ED8] font-black text-sm uppercase tracking-tight">{match.non_striker}</span>
                    </div>
                    <div className="flex gap-6 text-sm font-black text-slate-900">
                      <span className="w-6 text-center">{match.non_striker_runs || 0}</span>
                      <span className="w-6 text-center text-slate-400">{match.non_striker_balls || 0}</span>
                      <span className="w-6 text-center text-slate-400">1</span>
                      <span className="w-6 text-center text-slate-400">0</span>
                      <span className="w-12 text-center text-slate-400">{((match.non_striker_runs || 0) / Math.max(1, match.non_striker_balls || 0) * 100).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bowlers Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bowlers</span>
                  <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="w-6 text-center">O</span>
                    <span className="w-6 text-center">M</span>
                    <span className="w-6 text-center">R</span>
                    <span className="w-6 text-center">W</span>
                    <span className="w-12 text-center">E</span>
                  </div>
                </div>
                <div className="divide-y divide-slate-50 divide-dashed">
                  <div className="px-4 py-4 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[#1D4ED8] font-black text-sm uppercase tracking-tight">{match.bowler}*</span>
                    </div>
                    <div className="flex gap-6 text-sm font-black text-slate-900">
                      <span className="w-6 text-center">{(match.bowler_overs || 0).toFixed(1)}</span>
                      <span className="w-6 text-center text-slate-400">0</span>
                      <span className="w-6 text-center text-slate-400">{match.bowler_runs || 0}</span>
                      <span className="w-6 text-center text-[#DC2626]">{match.bowler_wickets || 0}</span>
                      <span className="w-12 text-center text-slate-400">{((match.bowler_runs || 0) / Math.max(0.1, match.bowler_overs || 0.1)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'SCORECARD' && (
            <motion.div 
              key="scorecard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl p-10 text-center border border-slate-100"
            >
              <TrendingUp className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Full Scorecard Coming Soon</p>
            </motion.div>
          )}

          {activeTab === 'COMMENTARY' && (
            <motion.div 
              key="commentary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {ballEvents.slice(0, 5).map((ball, i) => (
                <div key={ball.id} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black text-slate-900">{ball.over_number}.{ball.ball_number}</span>
                    <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase text-white ${ball.wicket ? 'bg-[#DC2626]' : 'bg-[#10B981]'}`}>
                      {ball.wicket ? 'Wicket' : `${ball.runs} Runs`}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {match.bowler} to {match.striker}, {ball.wicket ? 'OUT! Clean bowled!' : `${ball.runs} run(s) taken.`}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

