
-- 1. Enable Realtime for the matches and overlay_commands tables
begin;
  -- Drop existing publication if it exists to avoid errors
  drop publication if exists supabase_realtime;
  
  -- Create publication for all tables we want to track
  create publication supabase_realtime for table matches, balls, overlay_commands;
  
  -- Set replication to FULL for the matches table to ensure all columns are sent in realtime updates
  alter table matches replica identity full;
commit;

-- 2. Ensure RLS is enabled and policies are correct
alter table matches enable row level security;
alter table balls enable row level security;
alter table overlay_commands enable row level security;

-- 3. Create policies for public access (Select)
drop policy if exists "Allow public select on matches" on matches;
create policy "Allow public select on matches" on matches for select using (true);

drop policy if exists "Allow public select on balls" on balls;
create policy "Allow public select on balls" on balls for select using (true);

drop policy if exists "Allow public select on overlay_commands" on overlay_commands;
create policy "Allow public select on overlay_commands" on overlay_commands for select using (true);

-- 4. Create policies for authenticated users (All)
drop policy if exists "Allow authenticated all on matches" on matches;
create policy "Allow authenticated all on matches" on matches for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated all on balls" on balls;
create policy "Allow authenticated all on balls" on balls for all using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated all on overlay_commands" on overlay_commands;
create policy "Allow authenticated all on overlay_commands" on overlay_commands for all using (auth.role() = 'authenticated');

-- 5. Ensure updated_at trigger exists
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

drop trigger if exists update_matches_updated_at on matches;
create trigger update_matches_updated_at
before update on matches
for each row
execute procedure update_updated_at_column();
