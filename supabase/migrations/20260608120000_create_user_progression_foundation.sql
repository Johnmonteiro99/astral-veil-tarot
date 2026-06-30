-- User progression foundation for Astral Veil.
-- Tracks account-bound exploration events, room visits, and future discoveries.

create extension if not exists pgcrypto;

create table if not exists public.user_progress_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  event_key text not null,
  title text,
  description text,
  archive_type text,
  mode text,
  is_repeatable boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.user_progress_events
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists event_type text,
  add column if not exists event_key text,
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists archive_type text,
  add column if not exists mode text,
  add column if not exists is_repeatable boolean not null default false,
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now();

create table if not exists public.user_room_visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  room_key text not null,
  room_name text,
  archive_type text not null,
  mode text,
  first_visited_at timestamptz not null default now(),
  last_visited_at timestamptz not null default now(),
  visit_count integer not null default 1,
  metadata jsonb not null default '{}'::jsonb,
  constraint user_room_visits_visit_count_positive check (visit_count > 0)
);

alter table public.user_room_visits
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists room_key text,
  add column if not exists room_name text,
  add column if not exists archive_type text,
  add column if not exists mode text,
  add column if not exists first_visited_at timestamptz not null default now(),
  add column if not exists last_visited_at timestamptz not null default now(),
  add column if not exists visit_count integer not null default 1,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create table if not exists public.user_discoveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  discovery_key text not null,
  discovery_type text,
  source_location text,
  mode_key text,
  related_artifact_key text,
  related_room_key text,
  related_fragment_key text,
  related_veilwalker_key text,
  discovered_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

alter table public.user_discoveries
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists discovery_key text,
  add column if not exists discovery_type text,
  add column if not exists source_location text,
  add column if not exists mode_key text,
  add column if not exists related_artifact_key text,
  add column if not exists related_room_key text,
  add column if not exists related_fragment_key text,
  add column if not exists related_veilwalker_key text,
  add column if not exists discovered_at timestamptz not null default now(),
  add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table public.user_progress_events
  alter column user_id set not null,
  alter column event_type set not null,
  alter column event_key set not null,
  alter column metadata set default '{}'::jsonb,
  alter column metadata set not null,
  alter column created_at set default now(),
  alter column created_at set not null;

alter table public.user_room_visits
  alter column user_id set not null,
  alter column room_key set not null,
  alter column archive_type set not null,
  alter column first_visited_at set default now(),
  alter column first_visited_at set not null,
  alter column last_visited_at set default now(),
  alter column last_visited_at set not null,
  alter column visit_count set default 1,
  alter column visit_count set not null,
  alter column metadata set default '{}'::jsonb,
  alter column metadata set not null;

alter table public.user_discoveries
  alter column user_id set not null,
  alter column discovery_key set not null,
  alter column discovered_at set default now(),
  alter column discovered_at set not null,
  alter column metadata set default '{}'::jsonb,
  alter column metadata set not null;

create unique index if not exists user_progress_events_once_idx
on public.user_progress_events (user_id, event_type, event_key)
where is_repeatable = false;

create index if not exists user_progress_events_user_created_idx
on public.user_progress_events (user_id, created_at desc);

create unique index if not exists user_room_visits_user_room_idx
on public.user_room_visits (user_id, room_key);

create index if not exists user_room_visits_user_last_visited_idx
on public.user_room_visits (user_id, last_visited_at desc);

create unique index if not exists user_discoveries_user_discovery_idx
on public.user_discoveries (user_id, discovery_key);

create index if not exists user_discoveries_user_discovered_idx
on public.user_discoveries (user_id, discovered_at desc);

alter table public.user_progress_events enable row level security;
alter table public.user_room_visits enable row level security;
alter table public.user_discoveries enable row level security;

revoke all on public.user_progress_events from anon;
revoke all on public.user_room_visits from anon;
revoke all on public.user_discoveries from anon;
revoke all on public.user_progress_events from authenticated;
revoke all on public.user_room_visits from authenticated;
revoke all on public.user_discoveries from authenticated;

grant select, insert on public.user_progress_events to authenticated;
grant select, insert, update on public.user_room_visits to authenticated;
grant select, insert on public.user_discoveries to authenticated;

drop policy if exists "Users can view their own progress events" on public.user_progress_events;
drop policy if exists "Users can create their own progress events" on public.user_progress_events;
drop policy if exists "Admins can view all progress events" on public.user_progress_events;

create policy "Users can view their own progress events"
on public.user_progress_events
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create their own progress events"
on public.user_progress_events
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Admins can view all progress events"
on public.user_progress_events
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and (
        to_jsonb(profile)->>'role' = 'admin'
        or to_jsonb(profile)->>'is_admin' = 'true'
        or (to_jsonb(profile)->'roles') ? 'admin'
      )
  )
);

drop policy if exists "Users can view their own room visits" on public.user_room_visits;
drop policy if exists "Users can create their own room visits" on public.user_room_visits;
drop policy if exists "Users can update their own room visits" on public.user_room_visits;
drop policy if exists "Admins can view all room visits" on public.user_room_visits;

create policy "Users can view their own room visits"
on public.user_room_visits
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create their own room visits"
on public.user_room_visits
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own room visits"
on public.user_room_visits
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can view their own discoveries" on public.user_discoveries;
drop policy if exists "Users can create their own discoveries" on public.user_discoveries;
drop policy if exists "Admins can view all discoveries" on public.user_discoveries;

create policy "Users can view their own discoveries"
on public.user_discoveries
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create their own discoveries"
on public.user_discoveries
for insert
to authenticated
with check (auth.uid() = user_id);
