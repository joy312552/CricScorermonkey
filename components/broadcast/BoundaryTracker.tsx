
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Match } from '../../types';

interface BoundaryTrackerProps {
  match: Match;
  scoreAnimation: string | null;
}

export const BoundaryTracker: React.FC<BoundaryTrackerProps> = ({ match, scoreAnimation }) => {
  const [fours, setFours] = useState(match.fours || 0);
  const [sixes, setSixes] = useState(match.sixes || 0);
  const [animateFour, setAnimateFour] = useState(false);
  const [animateSix, setAnimateSix] = useState(false);

  useEffect(() => {
    if (match.fours !== fours) {
      setFours(match.fours || 0);
      if (scoreAnimation === 'FOUR') {
        setAnimateFour(true);
        setTimeout(() => setAnimateFour(false), 600);
      }
    }
    if (match.sixes !== sixes) {
      setSixes(match.sixes || 0);
      if (scoreAnimation === 'SIX') {
        setAnimateSix(true);
        setTimeout(() => setAnimateSix(false), 800);
      }
    }
  }, [match.fours, match.sixes, scoreAnimation]);

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed right-[20px] bottom-[120px] z-[9999] w-[90%] max-w-[400px] md:max-w-[450px] lg:max-w-[500px] pointer-events-none select-none origin-bottom-right scale-[0.6] sm:scale-[0.8] md:scale-100"
    >
      {/* TOP TITLE BAR */}
      <div 
        className="flex items-center justify-center py-2 px-4 relative overflow-hidden rounded-t-xl"
        style={{ background: 'linear-gradient(90deg, #000000, #1A1A1A)' }}
      >
        {/* Geometric Accents */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[10px] border-r-pink-500" />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-pink-500" />
        
        <h3 className="text-white font-black text-xl md:text-2xl uppercase tracking-[0.15em] italic">
          Match Boundary Tracker
        </h3>
      </div>

      {/* MAIN CONTENT PANEL (PINK ZONE) */}
      <div 
        className="relative p-6 shadow-[0_10px_30px_rgba(0,0,0,0.4)] overflow-hidden rounded-b-xl"
        style={{ 
          background: 'linear-gradient(180deg, #FF69B4, #FF1493)',
        }}
      >
        {/* Decorative Geometric Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-2 left-10 text-white text-xl">△</div>
          <div className="absolute top-10 right-20 text-white text-lg">○</div>
          <div className="absolute bottom-10 left-20 text-white text-2xl">▽</div>
          <div className="absolute top-1/2 left-1/2 text-white text-xl">△</div>
          <div className="absolute bottom-5 right-10 text-white text-lg">○</div>
        </div>

        {/* Wave Bottom Shape */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] translate-y-[1px]">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="relative block w-full h-[40px]">
            <path d="M0.00,49.98 C149.99,150.00 349.85,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" className="fill-[#FF1493]"></path>
            <path d="M0.00,49.98 C149.99,150.00 349.85,-49.98 500.00,49.98" className="fill-none stroke-white/40 stroke-[4px]"></path>
          </svg>
        </div>

        <div className="flex flex-col gap-4 relative z-10 mb-4">
          {/* ROW 1 — FOURS COUNTER */}
          <div className="flex justify-between items-center">
            <span className="text-white font-black text-3xl md:text-4xl uppercase tracking-tighter italic">Fours</span>
            <motion.span 
              animate={animateFour ? { scale: [1, 1.3, 1], filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'] } : {}}
              transition={{ duration: 0.6 }}
              className={`text-black font-black text-5xl md:text-6xl tracking-tighter ${animateFour ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]' : ''}`}
            >
              {fours}
            </motion.span>
          </div>

          {/* DIVIDER */}
          <div className="h-px bg-white/40 w-full" />

          {/* ROW 2 — SIX COUNTER */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-3xl md:text-4xl uppercase tracking-tighter italic">Six</span>
              <span className="text-white/60 text-2xl">～～</span>
            </div>
            <motion.span 
              animate={animateSix ? { scale: [1, 1.4, 1], x: [0, -5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.8 }}
              className={`text-black font-black text-5xl md:text-6xl tracking-tighter ${animateSix ? 'drop-shadow-[0_0_20px_rgba(255,255,255,1)]' : ''}`}
            >
              {sixes}
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
