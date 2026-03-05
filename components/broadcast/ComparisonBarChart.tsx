
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Match, BallEvent } from '../../types';
import { MatchService } from '../../services/MatchService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

export const ComparisonBarChart: React.FC<{ match: Match }> = ({ match }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balls = await MatchService.getBallEvents(match.id);
        
        // Group by over and innings
        const oversMap: { [key: number]: { over: number, team1: number, team2: number, team1Wickets: number, team2Wickets: number } } = {};
        
        // Initialize with at least 5 overs or current overs
        const maxOvers = Math.max(5, Math.ceil(match.overs));
        for (let i = 1; i <= maxOvers; i++) {
          oversMap[i] = { over: i, team1: 0, team2: 0, team1Wickets: 0, team2Wickets: 0 };
        }

        balls.forEach(ball => {
          const overNum = ball.over_number + 1;
          if (!oversMap[overNum]) {
            oversMap[overNum] = { over: overNum, team1: 0, team2: 0, team1Wickets: 0, team2Wickets: 0 };
          }
          
          if (ball.innings === 1) {
            oversMap[overNum].team1 += ball.runs;
            if (ball.wicket) oversMap[overNum].team1Wickets += 1;
          } else {
            oversMap[overNum].team2 += ball.runs;
            if (ball.wicket) oversMap[overNum].team2Wickets += 1;
          }
        });

        // Convert to array and sort
        const chartData = Object.values(oversMap).sort((a, b) => a.over - b.over);
        setData(chartData);
      } catch (error) {
        console.error('Error fetching ball events:', error);
      }
    };

    fetchData();
  }, [match.balls, match.id]);

  const team1Total = data.reduce((sum, d) => sum + d.team1, 0);
  const team2Total = data.reduce((sum, d) => sum + d.team2, 0);
  const team1Wkts = data.reduce((sum, d) => sum + d.team1Wickets, 0);
  const team2Wkts = data.reduce((sum, d) => sum + d.team2Wickets, 0);

  // Custom shape for "W" marker
  const renderWicketMarker = (props: any, team: 'team1' | 'team2') => {
    const { x, y, width, index } = props;
    const wickets = team === 'team1' ? data[index]?.team1Wickets : data[index]?.team2Wickets;
    
    if (!wickets) return null;

    return (
      <g>
        {Array.from({ length: wickets }).map((_, i) => (
          <g key={i} transform={`translate(${x + width / 2 - 8}, ${y - 25 - (i * 18)})`}>
            <rect width="16" height="16" fill="#EF4444" rx="2" className="shadow-lg" />
            <text x="8" y="12" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" style={{ fontStyle: 'normal' }}>W</text>
          </g>
        ))}
      </g>
    );
  };

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 50 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none select-none font-sans italic"
    >
      <div className="w-[90%] max-w-5xl bg-gradient-to-br from-[#0A1128] to-[#1A237E] rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-2 border-white/10 relative">
        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
        
        {/* Sweeping Shine */}
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 5 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] pointer-events-none"
        />
        
        {/* Side Accents */}
        <div className="absolute left-0 top-0 bottom-0 w-32 overflow-hidden pointer-events-none">
          <div className="absolute -left-16 top-0 w-32 h-full bg-yellow-400 transform skew-x-[-15deg]" />
          <div className="absolute -left-20 top-0 w-32 h-full bg-cyan-400 transform skew-x-[-15deg] opacity-50 ml-4" />
        </div>

        <div className="relative z-10 p-8 pl-24 pr-12">
          <div className="mb-6">
            <h2 className="text-white font-black text-4xl uppercase tracking-tighter drop-shadow-lg">COMPARISON</h2>
            <p className="text-white/80 font-bold text-lg uppercase tracking-widest mt-1">
              {match.tournament_name || 'TOURNAMENT NAME'}, MATCH {match.id.slice(0, 4)}
            </p>
          </div>

          <div className="h-[400px] w-full bg-[#B0B8C3] rounded-sm p-6 relative overflow-hidden">
            {/* Inner Gloss */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="0" stroke="rgba(0,0,0,0.1)" vertical={false} />
                <XAxis 
                  dataKey="over" 
                  stroke="#333" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={{ stroke: '#333', strokeWidth: 1 }}
                  label={{ value: 'OVERS', position: 'bottom', fill: '#333', fontSize: 12, fontWeight: 'bold', offset: 0 }}
                />
                <YAxis 
                  stroke="#333" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  label={{ value: 'RUNS', angle: -90, position: 'insideLeft', fill: '#333', fontSize: 12, fontWeight: 'bold' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A1128', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="team1" fill="#2C4C7E" radius={[0, 0, 0, 0]} barSize={35}>
                  <LabelList dataKey="team1" position="insideTop" fill="#fff" fontSize={11} fontWeight="bold" offset={10} />
                  {data.map((entry, index) => (
                    <Cell key={`cell-1-${index}`} fill="url(#barGradient1)" />
                  ))}
                </Bar>
                <Bar dataKey="team2" fill="#B25E41" radius={[0, 0, 0, 0]} barSize={35}>
                  <LabelList dataKey="team2" position="insideTop" fill="#fff" fontSize={11} fontWeight="bold" offset={10} />
                  {data.map((entry, index) => (
                    <Cell key={`cell-2-${index}`} fill="url(#barGradient2)" />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1E3A8A" />
                  </linearGradient>
                  <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#9A3412" />
                  </linearGradient>
                </defs>
                {/* Custom Wicket Markers */}
                <Bar dataKey="team1" fill="transparent" barSize={35} shape={(props: any) => renderWicketMarker(props, 'team1')} />
                <Bar dataKey="team2" fill="transparent" barSize={35} shape={(props: any) => renderWicketMarker(props, 'team2')} />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="flex justify-center gap-8 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#2C4C7E] rounded-sm" />
                <span className="text-[#333] text-xs font-bold uppercase">{match.team_a}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#B25E41] rounded-sm" />
                <span className="text-[#333] text-xs font-bold uppercase">{match.team_b}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0A1128] h-16 grid grid-cols-2 gap-px relative overflow-hidden border-t-2 border-white/20">
          <div className="bg-[#2C4C7E] flex items-center justify-between px-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            <span className="text-white font-black text-3xl tracking-tighter z-10">{team1Total}-{team1Wkts}</span>
            <span className="text-white/80 font-bold text-xl uppercase z-10">
              {match.current_innings === 1 ? match.overs.toFixed(1) : (match.match_overs || 20).toFixed(1)} OVERS
            </span>
          </div>
          <div className="bg-[#B25E41] flex items-center justify-between px-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            <span className="text-white font-black text-3xl tracking-tighter z-10">{team2Total}-{team2Wkts}</span>
            <span className="text-white/80 font-bold text-xl uppercase z-10">
              {match.current_innings === 2 ? match.overs.toFixed(1) : '0.0'} OVERS
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
