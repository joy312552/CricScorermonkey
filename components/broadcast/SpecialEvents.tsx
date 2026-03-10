
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types';
import { Zap, Clock, AlertTriangle, Star, Eye, User } from 'lucide-react';

export const SpecialEvents: React.FC<{ match: Match, type: string, theme?: string }> = ({ match, type, theme = 'theme1' }) => {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  const config: Record<string, { text: string, color: string, icon: any }> = {
    'POWERPLAY': { 
      text: 'POWERPLAY ON', 
      color: isTheme2 ? 'from-slate-600 to-slate-800' : isTheme3 ? 'from-emerald-600 to-emerald-800' : 'from-orange-500 to-red-600', 
      icon: Zap 
    },
    'TIMEOUT': { 
      text: 'STRATEGIC TIMEOUT', 
      color: isTheme2 ? 'from-slate-700 to-slate-900' : isTheme3 ? 'from-emerald-700 to-emerald-900' : 'from-blue-600 to-indigo-700', 
      icon: Clock 
    },
    'STRATEGIC_TIMEOUT': { 
      text: 'STRATEGIC TIMEOUT', 
      color: isTheme2 ? 'from-slate-700 to-slate-900' : isTheme3 ? 'from-emerald-700 to-emerald-900' : 'from-blue-600 to-indigo-700', 
      icon: Clock 
    },
    'FREE_HIT': { 
      text: 'FREE HIT', 
      color: isTheme2 ? 'from-slate-500 to-slate-700' : isTheme3 ? 'from-emerald-500 to-emerald-700' : 'from-yellow-400 to-orange-500', 
      icon: Zap 
    },
    'WICKET_FALL': { 
      text: 'FALL OF WICKET', 
      color: isTheme2 ? 'from-red-800 to-red-950' : isTheme3 ? 'from-red-700 to-red-900' : 'from-red-600 to-slate-900', 
      icon: AlertTriangle 
    },
    'MILESTONE': { 
      text: 'MILESTONE REACHED', 
      color: isTheme2 ? 'from-slate-400 to-slate-600' : isTheme3 ? 'from-emerald-400 to-emerald-600' : 'from-yellow-400 to-emerald-500', 
      icon: Star 
    },
    'HAT_TRICK': { 
      text: 'HAT-TRICK ALERT', 
      color: isTheme2 ? 'from-slate-700 to-slate-900' : isTheme3 ? 'from-emerald-700 to-emerald-900' : 'from-purple-600 to-indigo-900', 
      icon: Zap 
    },
    'SUPER_OVER': { 
      text: 'SUPER OVER', 
      color: isTheme2 ? 'from-slate-800 to-slate-950' : isTheme3 ? 'from-emerald-800 to-emerald-950' : 'from-red-600 to-blue-600', 
      icon: Zap 
    },
    'DRS_REVIEW': { 
      text: 'DRS REVIEW', 
      color: isTheme2 ? 'from-slate-600 to-slate-800' : isTheme3 ? 'from-emerald-600 to-emerald-800' : 'from-blue-500 to-slate-800', 
      icon: Eye 
    },
    'PLAYER_SPOTLIGHT': { 
      text: 'PLAYER SPOTLIGHT', 
      color: isTheme2 ? 'from-slate-500 to-slate-700' : isTheme3 ? 'from-emerald-500 to-emerald-700' : 'from-indigo-500 to-purple-600', 
      icon: User 
    },
  };

  const item = config[type] || { text: type, color: 'from-slate-700 to-slate-900', icon: AlertTriangle };
  const Icon = item.icon;

  const panelBg = isTheme2 ? 'bg-slate-900/95' : isTheme3 ? 'bg-emerald-950/95' : 'bg-slate-900/95';

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className={`absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-6 px-12 py-6 broadcast-panel rounded-full border-2 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden ${panelBg}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 animate-pulse`} />
      
      <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center shadow-lg relative z-10`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic relative z-10 broadcast-text-shadow">
        {item.text}
      </h2>

      <div className="flex gap-2 relative z-10">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </motion.div>
  );
};
