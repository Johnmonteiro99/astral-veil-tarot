-- Lightweight room visit tracking for Account Overview.
-- Stores one row per user and archive room, then increments repeat visits.

create extension if not exists pgcrypto;

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
  metadata jsonb not null default '{}'::jsonb
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

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_room_visits_user_room_key'
      and conrelid = 'public.user_room_visits'::regclass
  ) then
    alter table public.user_room_visits
      add constraint user_room_visits_user_room_key unique (user_id, room_key);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_room_visits_archive_type_check'
      and conrelid = 'public.user_room_visits'::regclass
  ) then
    alter table public.user_room_visits
      add constraint user_room_visits_archive_type_check check (archive_type in ('lumen', 'noctis'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_room_visits_visit_count_positive'
      and conrelid = 'public.user_room_visits'::regclass
  ) then
    alter table public.user_room_visits
      add constraint user_room_visits_visit_count_positive check (visit_count > 0);
  end if;
end $$;

create index if not exists user_room_visits_user_last_visited_idx
on public.user_room_visits (user_id, last_visited_at desc);

alter table public.user_room_visits enable row level security;

revoke all on public.user_room_visits from anon;
revoke all on public.user_room_visits from authenticated;
grant select, insert, update on public.user_room_visits to authenticated;

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
