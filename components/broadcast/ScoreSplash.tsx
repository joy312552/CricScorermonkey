
import React from 'react';
import { motion } from 'framer-motion';

interface ScoreSplashProps {
  type: string;
  theme?: string;
}

export const ScoreSplash: React.FC<ScoreSplashProps> = ({ type, theme = 'theme1' }) => {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  const config: Record<string, { text: string, color: string, sub: string }> = {
    'FOUR': { 
      text: 'FOUR', 
      color: isTheme2 ? 'from-slate-600 to-slate-800' : isTheme3 ? 'from-emerald-600 to-emerald-800' : 'from-blue-600 to-indigo-600', 
      sub: 'BOUNDARY' 
    },
    'SIX': { 
      text: 'SIX', 
      color: isTheme2 ? 'from-slate-700 to-slate-900' : isTheme3 ? 'from-emerald-700 to-emerald-900' : 'from-purple-600 to-pink-600', 
      sub: 'MAXIMUM' 
    },
    'WICKET': { 
      text: 'WICKET', 
      color: isTheme2 ? 'from-red-800 to-red-950' : isTheme3 ? 'from-red-700 to-red-900' : 'from-red-600 to-orange-600', 
      sub: 'OUT' 
    },
    'NO BALL': { 
      text: 'NO BALL', 
      color: isTheme2 ? 'from-slate-500 to-slate-700' : isTheme3 ? 'from-emerald-500 to-emerald-700' : 'from-yellow-500 to-orange-500', 
      sub: 'FREE HIT' 
    },
    'WIDE': { 
      text: 'WIDE', 
      color: isTheme2 ? 'from-slate-400 to-slate-600' : isTheme3 ? 'from-emerald-400 to-emerald-600' : 'from-blue-400 to-blue-600', 
      sub: 'EXTRA' 
    },
  };

  const item = config[type] || { text: type, color: 'from-slate-700 to-slate-900', sub: '' };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
      className="absolute inset-0 flex items-center justify-center z-[200]"
    >
      {/* Background Flash */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 0.5 }}
        className={`absolute inset-0 bg-gradient-to-r ${item.color}`}
      />

      <div className="relative">
        {/* Main Text */}
        <motion.h1 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`text-[15vw] font-black italic tracking-tighter text-white broadcast-text-shadow bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50`}
        >
          {item.text}
        </motion.h1>

        {/* Sub Text */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute -bottom-4 left-0 right-0 flex justify-center"
        >
          <span className={`px-8 py-2 bg-gradient-to-r ${item.color} text-white font-black text-2xl skew-x-[-15deg] shadow-2xl`}>
            {item.sub}
          </span>
        </motion.div>

        {/* Decorative Streaks */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-1/2 -left-[20vw] -right-[20vw] h-2 bg-white/30 blur-sm"
        />
      </div>
    </motion.div>
  );
};
