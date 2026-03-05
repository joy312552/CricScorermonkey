
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Match, OverlayCommand } from '../../types';
import { IntroBanner } from './IntroBanner';
import { MatchSummary } from './MatchSummary';
import { PlayingXI } from './PlayingXI';
import { BatsmanCard } from './BatsmanCard';
import { BallSummary } from './BallSummary';
import { TargetNeed } from './TargetNeed';
import { Partnership } from './Partnership';
import { StatPanels } from './StatPanels';
import { SpecialEvents } from './SpecialEvents';
import { ScoreSplash } from './ScoreSplash';
import { BoundaryTracker } from './BoundaryTracker';

interface BroadcastOverlayContainerProps {
  match: Match;
  command: OverlayCommand | null;
  scoreAnimation: string | null;
}

export const BroadcastOverlayContainer: React.FC<BroadcastOverlayContainerProps> = ({ 
  match, 
  command,
  scoreAnimation 
}) => {
  const activeCmd = command?.visible ? command.command : null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden font-display">
      {/* Layer 1: Score Splashes (Highest Priority) */}
      <AnimatePresence mode="wait">
        {scoreAnimation && (
          <ScoreSplash key="splash" type={scoreAnimation} />
        )}
      </AnimatePresence>

      {/* Layer 2: Full Screen Overlays */}
      <AnimatePresence mode="wait">
        {activeCmd === 'TEAM_VS_TEAM' && <IntroBanner key="intro" match={match} />}
        {activeCmd === 'MATCH_SUMMARY' && <MatchSummary key="summary" match={match} />}
        {activeCmd === 'PLAYING_XI' && <PlayingXI key="xi" match={match} />}
        {activeCmd === 'INDIA_PLAYING_XI' && <PlayingXI key="india_xi" match={match} isIndia />}
      </AnimatePresence>

      {/* Layer 3: Lower Thirds & Side Panels */}
      <AnimatePresence>
        {activeCmd === 'BATT_SUMMARY' && <BatsmanCard key="batt" match={match} />}
        {activeCmd === 'BALL_SUMMARY' && <BallSummary key="balls" match={match} />}
        {activeCmd === 'TARGET' && <TargetNeed key="target" match={match} type="TARGET" />}
        {activeCmd === 'NEED_RUN' && <TargetNeed key="need" match={match} type="NEED" />}
        {activeCmd === 'PARTNERSHIP' && <Partnership key="partner" match={match} />}
        {activeCmd === 'SHOW_CRR' && <StatPanels key="crr" match={match} type="CRR" />}
        {activeCmd === 'SHOW_EXTRA' && <StatPanels key="extra" match={match} type="EXTRA" />}
        {activeCmd === 'BOUNDARY_TRACKER' && <BoundaryTracker key="boundary" match={match} scoreAnimation={scoreAnimation} />}
        {[
          'POWERPLAY', 
          'TIMEOUT', 
          'STRATEGIC_TIMEOUT', 
          'WICKET_FALL', 
          'MILESTONE', 
          'HAT_TRICK', 
          'SUPER_OVER', 
          'DRS_REVIEW', 
          'PLAYER_SPOTLIGHT'
        ].includes(activeCmd || '') && (
          <SpecialEvents key="special" match={match} type={activeCmd!} />
        )}
      </AnimatePresence>
    </div>
  );
};
