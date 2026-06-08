-- Profile cosmetic unlocks for account-bound progression rewards.

create extension if not exists pgcrypto;

alter table public.profiles
  add column if not exists profile_background_url text,
  add column if not exists equipped_profile_title text;

create table if not exists public.user_profile_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  unlock_key text not null,
  unlock_type text not null,
  label text not null,
  description text,
  source_key text,
  mode_key text,
  asset_path text,
  metadata jsonb not null default '{}'::jsonb,
  unlocked_at timestamptz not null default now(),
  constraint user_profile_unlocks_user_unlock_key unique (user_id, unlock_key),
  constraint user_profile_unlocks_type_check check (unlock_type in ('background', 'title', 'emblem', 'badge'))
);

alter table public.user_profile_unlocks
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists unlock_key text,
  add column if not exists unlock_type text,
  add column if not exists label text,
  add column if not exists description text,
  add column if not exists source_key text,
  add column if not exists mode_key text,
  add column if not exists asset_path text,
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists unlocked_at timestamptz not null default now();

alter table public.user_profile_unlocks
  alter column user_id set not null,
  alter column unlock_key set not null,
  alter column unlock_type set not null,
  alter column label set not null,
  alter column metadata set default '{}'::jsonb,
  alter column metadata set not null,
  alter column unlocked_at set default now(),
  alter column unlocked_at set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_profile_unlocks_user_unlock_key'
      and conrelid = 'public.user_profile_unlocks'::regclass
  ) then
    alter table public.user_profile_unlocks
      add constraint user_profile_unlocks_user_unlock_key unique (user_id, unlock_key);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_profile_unlocks_type_check'
      and conrelid = 'public.user_profile_unlocks'::regclass
  ) then
    alter table public.user_profile_unlocks
      add constraint user_profile_unlocks_type_check check (unlock_type in ('background', 'title', 'emblem', 'badge'));
  end if;
end $$;

create index if not exists user_profile_unlocks_user_type_idx
on public.user_profile_unlocks (user_id, unlock_type, unlocked_at desc);

alter table public.user_profile_unlocks enable row level security;

revoke all on public.user_profile_unlocks from anon;
revoke all on public.user_profile_unlocks from authenticated;
grant select, insert on public.user_profile_unlocks to authenticated;

drop policy if exists "Users can view their own profile unlocks" on public.user_profile_unlocks;
drop policy if exists "Users can create their own profile unlocks" on public.user_profile_unlocks;
drop policy if exists "Admins can view all profile unlocks" on public.user_profile_unlocks;

create policy "Users can view their own profile unlocks"
on public.user_profile_unlocks
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create their own profile unlocks"
on public.user_profile_unlocks
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Admins can view all profile unlocks"
on public.user_profile_unlocks
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
