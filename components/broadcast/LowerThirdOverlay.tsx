
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Match, BallEvent } from '../../types';
import { Theme1Overlay } from './themes/Theme1Overlay';
import { Theme2Overlay } from './themes/Theme2Overlay';
import { Theme3Overlay } from './themes/Theme3Overlay';

interface LowerThirdOverlayProps {
  match: Match;
  recentBalls: BallEvent[];
  scoreAnimation: string | null;
}

export const LowerThirdOverlay: React.FC<LowerThirdOverlayProps> = ({ match, recentBalls, scoreAnimation }) => {
  const theme = match.overlay_theme || localStorage.getItem('scoreboardTheme') || 'theme1';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={theme}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'theme1' && (
          <Theme1Overlay 
            match={match} 
            recentBalls={recentBalls} 
            scoreAnimation={scoreAnimation} 
          />
        )}
        {theme === 'theme2' && (
          <Theme2Overlay 
            match={match} 
            recentBalls={recentBalls} 
            scoreAnimation={scoreAnimation} 
          />
        )}
        {theme === 'theme3' && (
          <Theme3Overlay 
            match={match} 
            recentBalls={recentBalls} 
            scoreAnimation={scoreAnimation} 
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};


