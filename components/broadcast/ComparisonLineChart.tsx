
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Match, BallEvent } from '../../types';
import { MatchService } from '../../services/MatchService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ComparisonLineChart: React.FC<{ match: Match }> = ({ match }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balls = await MatchService.getBallEvents(match.id);
        
        // Cumulative runs by over
        const chartData: any[] = [{ over: 0, team1: 0, team2: 0, team1Wickets: 0, team2Wickets: 0 }];
        
        let t1Runs = 0;
        let t2Runs = 0;
        
        const maxOvers = Math.max(5, Math.ceil(match.overs));
        
        for (let i = 1; i <= maxOvers; i++) {
          const overBalls = balls.filter(b => b.over_number === i - 1);
          const t1Over = overBalls.filter(b => b.innings === 1);
          const t2Over = overBalls.filter(b => b.innings === 2);
          
          t1Runs += t1Over.reduce((sum, b) => sum + b.runs, 0);
          t2Runs += t2Over.reduce((sum, b) => sum + b.runs, 0);
          
          const t1Wkts = t1Over.filter(b => b.wicket).length;
          const t2Wkts = t2Over.filter(b => b.wicket).length;

          chartData.push({
            over: i,
            team1: t1Runs,
            team2: t2Runs,
            team1Wickets: t1Wkts,
            team2Wickets: t2Wkts
          });
        }
        
        setData(chartData);
      } catch (error) {
        console.error('Error fetching ball events:', error);
      }
    };

    fetchData();
  }, [match.balls, match.id]);

  const team1Total = data.length > 0 ? data[data.length - 1].team1 : 0;
  const team2Total = data.length > 0 ? data[data.length - 1].team2 : 0;
  const team1Wkts = data.reduce((sum, d) => sum + d.team1Wickets, 0);
  const team2Wkts = data.reduce((sum, d) => sum + d.team2Wickets, 0);

  const renderCustomDot = (props: any, team: 'team1' | 'team2') => {
    const { cx, cy, index } = props;
    const entry = data[index];
    const wickets = team === 'team1' ? entry?.team1Wickets : entry?.team2Wickets;

    if (!wickets || wickets === 0) return null;

    return (
      <g key={`dot-${team}-${index}`}>
        <g transform={`translate(${cx - 8}, ${cy - 25})`}>
          <rect width="16" height="16" fill="#EF4444" rx="2" />
          <text x="8" y="12" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" style={{ fontStyle: 'normal' }}>W</text>
          {wickets > 1 && (
             <g transform="translate(0, -18)">
                <rect width="16" height="16" fill="#EF4444" rx="2" />
                <text x="8" y="12" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" style={{ fontStyle: 'normal' }}>W</text>
             </g>
          )}
        </g>
        <circle cx={cx} cy={cy} r={4} fill="#EF4444" stroke="#fff" strokeWidth={2} />
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
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorTeam1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2C4C7E" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2C4C7E" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTeam2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B25E41" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#B25E41" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                <Area 
                  type="monotone" 
                  dataKey="team1" 
                  stroke="#2C4C7E" 
                  strokeWidth={4}
                  fill="url(#colorTeam1)" 
                  fillOpacity={0.3}
                  dot={(props: any) => renderCustomDot(props, 'team1')}
                />
                <Area 
                  type="monotone" 
                  dataKey="team2" 
                  stroke="#B25E41" 
                  strokeWidth={4}
                  fill="url(#colorTeam2)" 
                  fillOpacity={0.3}
                  dot={(props: any) => renderCustomDot(props, 'team2')}
                />
              </AreaChart>
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
