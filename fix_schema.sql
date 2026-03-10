-- FIX: Add missing user_id columns and update RLS policies
-- Run this in your Supabase SQL Editor to fix the "Could not find the 'user_id' column" error.

-- 1. Add user_id to ball_events if missing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ball_events' AND column_name='user_id') THEN
        ALTER TABLE ball_events ADD COLUMN user_id uuid REFERENCES auth.users(id);
    END IF;
END $$;

-- 2. Add user_id to overlay_commands if missing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='overlay_commands' AND column_name='user_id') THEN
        ALTER TABLE overlay_commands ADD COLUMN user_id uuid REFERENCES auth.users(id);
    END IF;
END $$;

-- 3. Update RLS Policies for ball_events
DROP POLICY IF EXISTS "Users can manage their own ball_events" ON ball_events;
CREATE POLICY "Users can manage their own ball_events" ON ball_events FOR ALL USING (auth.uid() = user_id);

-- 4. Update RLS Policies for overlay_commands
DROP POLICY IF EXISTS "Users can manage their own overlay_commands" ON overlay_commands;
CREATE POLICY "Users can manage their own overlay_commands" ON overlay_commands FOR ALL USING (auth.uid() = user_id);

-- 5. Force Schema Reload
NOTIFY pgrst, 'reload schema';
