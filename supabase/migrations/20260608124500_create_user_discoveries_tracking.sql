-- Lightweight discovery tracking for Account Overview.
-- Keeps discoveries independent from future progress-event tables.

create extension if not exists pgcrypto;

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
  metadata jsonb not null default '{}'::jsonb,
  discovered_at timestamptz not null default now(),
  constraint user_discoveries_user_discovery_key unique (user_id, discovery_key)
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
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists discovered_at timestamptz not null default now();

alter table public.user_discoveries
  alter column user_id set not null,
  alter column discovery_key set not null,
  alter column metadata set default '{}'::jsonb,
  alter column metadata set not null,
  alter column discovered_at set default now(),
  alter column discovered_at set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_discoveries_user_discovery_key'
      and conrelid = 'public.user_discoveries'::regclass
  ) then
    alter table public.user_discoveries
      add constraint user_discoveries_user_discovery_key unique (user_id, discovery_key);
  end if;
end $$;

create index if not exists user_discoveries_user_discovered_idx
on public.user_discoveries (user_id, discovered_at desc);

alter table public.user_discoveries enable row level security;

revoke all on public.user_discoveries from anon;
revoke all on public.user_discoveries from authenticated;
grant select, insert on public.user_discoveries to authenticated;

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
