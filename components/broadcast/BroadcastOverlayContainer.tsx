
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Match, OverlayCommand } from '../../types';
import { IntroBanner } from './IntroBanner';
import { TeamVS } from './TeamVS';
import { MatchSummary } from './MatchSummary';
import { PlayingXI } from './PlayingXI';
import { BatsmanCard } from './BatsmanCard';
import { BowlingCard } from './BowlingCard';
import { ComparisonBarChart } from './ComparisonBarChart';
import { ComparisonLineChart } from './ComparisonLineChart';
import { TargetNeed } from './TargetNeed';
import { NeedRun } from './NeedRun';
import { Partnership } from './Partnership';
import { StatPanels } from './StatPanels';
import { SpecialEvents } from './SpecialEvents';
import { ScoreSplash } from './ScoreSplash';
import { BoundaryTracker } from './BoundaryTracker';
import { TossOverlay } from './TossOverlay';

interface BroadcastOverlayContainerProps {
  match: Match;
  command: OverlayCommand | null;
  scoreAnimation: string | null;
  theme?: string;
}

export const BroadcastOverlayContainer: React.FC<BroadcastOverlayContainerProps> = ({ 
  match, 
  command,
  scoreAnimation,
  theme = 'theme1'
}) => {
  const activeCmd = command?.visible ? command.command : null;

  // Suppress full-screen splash for 4, 6, Wicket if using Theme 1 (it has integrated animation)
  const shouldShowSplash = scoreAnimation && 
    !(theme === 'theme1' && ['FOUR', 'SIX', 'WICKET'].includes(scoreAnimation));

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden font-display">
      {/* Layer 1: Score Splashes (Highest Priority) */}
      <AnimatePresence mode="wait">
        {shouldShowSplash && (
          <ScoreSplash key="splash" type={scoreAnimation!} theme={theme} />
        )}
      </AnimatePresence>

      {/* Layer 2: Full Screen Overlays */}
      <AnimatePresence mode="wait">
        {activeCmd === 'TEAM_VS' && <TeamVS key="team_vs" match={match} theme={theme} />}
        {activeCmd === 'TEAM_VS_TEAM' && <IntroBanner key="intro" match={match} theme={theme} />}
        {activeCmd === 'MATCH_SUMMARY' && <MatchSummary key="summary" match={match} theme={theme} />}
        {activeCmd === 'PLAYING_XI' && <PlayingXI key="xi" match={match} theme={theme} />}
        {activeCmd === 'INDIA_PLAYING_XI' && <PlayingXI key="india_xi" match={match} isIndia theme={theme} />}
        {activeCmd === 'TOSS_WINNER' && <TossOverlay key="toss" match={match} visible={true} theme={theme} />}
      </AnimatePresence>

      {/* Layer 3: Lower Thirds & Side Panels */}
      <AnimatePresence>
        {activeCmd === 'BATT_SUMMARY' && <BatsmanCard key="batt" match={match} theme={theme} />}
        {activeCmd === 'BALL_SUMMARY' && <BowlingCard key="bowling" match={match} theme={theme} />}
        {activeCmd === 'BAR_STAT' && <ComparisonBarChart key="bar" match={match} theme={theme} />}
        {activeCmd === 'LINE_STAT' && <ComparisonLineChart key="line" match={match} theme={theme} />}
        {activeCmd === 'TARGET' && <TargetNeed key="target" match={match} type="TARGET" theme={theme} />}
        {activeCmd === 'NEED_RUN' && <NeedRun key="need" match={match} theme={theme} />}
        {activeCmd === 'PARTNERSHIP' && <Partnership key="partner" match={match} theme={theme} />}
        {activeCmd === 'SHOW_CRR' && <StatPanels key="crr" match={match} type="CRR" theme={theme} />}
        {activeCmd === 'SHOW_EXTRA' && <StatPanels key="extra" match={match} type="EXTRA" theme={theme} />}
        {activeCmd === 'BOUNDARY_TRACKER' && <BoundaryTracker key="boundary" match={match} scoreAnimation={scoreAnimation} theme={theme} />}
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
          <SpecialEvents key="special" match={match} type={activeCmd!} theme={theme} />
        )}
      </AnimatePresence>
    </div>
  );
};
