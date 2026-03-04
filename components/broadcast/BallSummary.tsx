
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';
import { CircleDot } from 'lucide-react';

export const BallSummary: React.FC<{ match: Match }> = ({ match }) => {
  // Mock last 6 balls for now
  const balls = [
    { val: '1', type: 'run' },
    { val: '4', type: 'four' },
    { val: 'W', type: 'wicket' },
    { val: '0', type: 'dot' },
    { val: '6', type: 'six' },
    { val: '2', type: 'run' },
  ];

  const getColor = (type: string) => {
    switch (type) {
      case 'four': return 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]';
      case 'six': return 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]';
      case 'wicket': return 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]';
      case 'extra': return 'bg-yellow-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]';
      case 'dot': return 'bg-slate-600';
      default: return 'bg-slate-800';
    }
  };

  return (
    <motion.div 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="absolute bottom-32 right-20 flex flex-col items-end gap-4"
    >
      <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
        <CircleDot className="w-5 h-5 text-emerald-500" />
        <span className="text-white font-black text-xs uppercase tracking-widest">Recent Balls</span>
      </div>

      <div className="flex gap-3">
        {balls.map((ball, i) => (
          <motion.div 
            key={i}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.1, type: 'spring' }}
            className={`w-14 h-14 rounded-full flex items-center justify-center border-2 border-white/20 ${getColor(ball.type)}`}
          >
            <span className="text-white font-black text-2xl italic">{ball.val}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
