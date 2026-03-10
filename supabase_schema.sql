-- CRITICAL: FORCE RESET SCHEMA
-- This script drops and recreates everything to fix schema cache issues.

-- 1. DROP EVERYTHING
DROP TABLE IF EXISTS ball_events CASCADE;
DROP TABLE IF EXISTS overlay_commands CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS tournaments CASCADE;
DROP TABLE IF EXISTS matches CASCADE;

-- 2. CREATE MATCHES TABLE
CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_a_id uuid,
  team_b_id uuid,
  tournament_id uuid,
  runs integer DEFAULT 0,
  wickets integer DEFAULT 0,
  balls integer DEFAULT 0,
  overs numeric DEFAULT 0,
  extras integer DEFAULT 0,
  striker text DEFAULT 'Batter 1',
  non_striker text DEFAULT 'Batter 2',
  bowler text DEFAULT 'Bowler',
  toss_winner text,
  toss_decision text,
  status text DEFAULT 'live',
  venue text DEFAULT 'International Stadium',
  match_overs integer DEFAULT 20,
  target integer DEFAULT 0,
  current_innings integer DEFAULT 1,
  fours integer DEFAULT 0,
  sixes integer DEFAULT 0,
  overlay_theme text DEFAULT 'default',
  
  -- Player specific stats
  striker_runs integer DEFAULT 0,
  striker_balls integer DEFAULT 0,
  non_striker_runs integer DEFAULT 0,
  non_striker_balls integer DEFAULT 0,
  bowler_runs integer DEFAULT 0,
  bowler_wickets integer DEFAULT 0,
  bowler_overs numeric DEFAULT 0,
  
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT matches_team_a_id_fkey FOREIGN KEY (team_a_id) REFERENCES teams(id),
  CONSTRAINT matches_team_b_id_fkey FOREIGN KEY (team_b_id) REFERENCES teams(id),
  CONSTRAINT matches_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
);

-- 3. CREATE BALL_EVENTS TABLE
CREATE TABLE ball_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  over_number integer NOT NULL,
  ball_number integer NOT NULL,
  runs integer DEFAULT 0,
  extra_type text DEFAULT 'none',
  wicket boolean DEFAULT false,
  dismissal_type text,
  fielder_id uuid REFERENCES players(id),
  innings integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. CREATE TEAMS TABLE
CREATE TABLE teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  team_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 5. CREATE TOURNAMENTS TABLE
CREATE TABLE tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  tournament_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 6. CREATE PLAYERS TABLE
CREATE TABLE players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  player_name text NOT NULL,
  jersey_number integer,
  role text DEFAULT 'Player',
  created_at timestamp with time zone DEFAULT now()
);

-- 7. CREATE OVERLAY_COMMANDS TABLE
CREATE TABLE overlay_commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  command text NOT NULL,
  payload jsonb DEFAULT '{}',
  visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- 8. ENABLE RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE ball_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE overlay_commands ENABLE ROW LEVEL SECURITY;

-- 9. RLS POLICIES
CREATE POLICY "Public matches are viewable by everyone" ON matches FOR SELECT USING (true);
CREATE POLICY "Public ball_events are viewable by everyone" ON ball_events FOR SELECT USING (true);
CREATE POLICY "Public teams are viewable by everyone" ON teams FOR SELECT USING (true);
CREATE POLICY "Public tournaments are viewable by everyone" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Public players are viewable by everyone" ON players FOR SELECT USING (true);
CREATE POLICY "Public overlay_commands are viewable by everyone" ON overlay_commands FOR SELECT USING (true);

CREATE POLICY "Users can manage their own matches" ON matches FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Users can manage their own ball_events" ON ball_events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own teams" ON teams FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own tournaments" ON tournaments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own players" ON players FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own overlay_commands" ON overlay_commands FOR ALL USING (auth.uid() = user_id);

-- 10. REALTIME
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE matches, ball_events, overlay_commands;

-- 11. FORCE CACHE RELOAD
NOTIFY pgrst, 'reload schema';
