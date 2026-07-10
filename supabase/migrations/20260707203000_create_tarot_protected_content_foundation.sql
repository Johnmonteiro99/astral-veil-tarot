-- Tarot protected content foundation.
-- Public frontend files may hold card identity and safe public deck shells only.
-- Paid deck lore, premium extras, hidden Noctis codes, and reward mappings live here.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.tarot_decks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  mode text,
  coverage text,
  is_public boolean default false,
  is_paid boolean default false,
  meaning_set_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.tarot_deck_cards (
  id uuid primary key default gen_random_uuid(),
  deck_slug text references public.tarot_decks(slug) on delete cascade,
  card_id text not null,
  image_path text,
  thumbnail_path text,
  status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.tarot_card_meanings (
  id uuid primary key default gen_random_uuid(),
  meaning_set_id text not null,
  card_id text not null,
  keywords text[] default '{}',
  upright text default '',
  reversed text default '',
  reflection text default '',
  short text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (meaning_set_id, card_id)
);

create table if not exists public.tarot_deck_card_extras (
  id uuid primary key default gen_random_uuid(),
  deck_slug text references public.tarot_decks(slug) on delete cascade,
  card_id text not null,
  lore text default '',
  deck_message text default '',
  extra_reflection text default '',
  noctis_hint text default '',
  reward_id text,
  premium_only boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (deck_slug, card_id)
);

create table if not exists public.user_deck_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  deck_slug text references public.tarot_decks(slug) on delete cascade,
  unlocked_at timestamptz default now(),
  source text,
  unique (user_id, deck_slug)
);

create table if not exists public.noctis_rewards (
  id uuid primary key default gen_random_uuid(),
  reward_key text unique not null,
  title text not null,
  description text,
  reward_type text,
  asset_path text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.noctis_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null,
  reward_key text references public.noctis_rewards(reward_key) on delete cascade,
  is_active boolean default true,
  starts_at timestamptz,
  expires_at timestamptz,
  max_redemptions integer,
  created_at timestamptz default now()
);

create table if not exists public.user_noctis_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  reward_key text references public.noctis_rewards(reward_key) on delete cascade,
  unlocked_at timestamptz default now(),
  unique (user_id, reward_key)
);

create index if not exists tarot_deck_cards_deck_card_idx
on public.tarot_deck_cards (deck_slug, card_id);

create index if not exists tarot_card_meanings_lookup_idx
on public.tarot_card_meanings (meaning_set_id, card_id);

create index if not exists tarot_deck_card_extras_deck_card_idx
on public.tarot_deck_card_extras (deck_slug, card_id);

create index if not exists user_deck_unlocks_user_idx
on public.user_deck_unlocks (user_id, deck_slug);

create index if not exists noctis_codes_reward_idx
on public.noctis_codes (reward_key, is_active);

create index if not exists user_noctis_unlocks_user_idx
on public.user_noctis_unlocks (user_id, reward_key);

drop trigger if exists set_tarot_decks_updated_at on public.tarot_decks;
create trigger set_tarot_decks_updated_at
before update on public.tarot_decks
for each row
execute function public.set_updated_at();

drop trigger if exists set_tarot_deck_cards_updated_at on public.tarot_deck_cards;
create trigger set_tarot_deck_cards_updated_at
before update on public.tarot_deck_cards
for each row
execute function public.set_updated_at();

drop trigger if exists set_tarot_card_meanings_updated_at on public.tarot_card_meanings;
create trigger set_tarot_card_meanings_updated_at
before update on public.tarot_card_meanings
for each row
execute function public.set_updated_at();

drop trigger if exists set_tarot_deck_card_extras_updated_at on public.tarot_deck_card_extras;
create trigger set_tarot_deck_card_extras_updated_at
before update on public.tarot_deck_card_extras
for each row
execute function public.set_updated_at();

alter table public.tarot_decks enable row level security;
alter table public.tarot_deck_cards enable row level security;
alter table public.tarot_card_meanings enable row level security;
alter table public.tarot_deck_card_extras enable row level security;
alter table public.user_deck_unlocks enable row level security;
alter table public.noctis_rewards enable row level security;
alter table public.noctis_codes enable row level security;
alter table public.user_noctis_unlocks enable row level security;

revoke all on public.tarot_decks from anon, authenticated;
revoke all on public.tarot_deck_cards from anon, authenticated;
revoke all on public.tarot_card_meanings from anon, authenticated;
revoke all on public.tarot_deck_card_extras from anon, authenticated;
revoke all on public.user_deck_unlocks from anon, authenticated;
revoke all on public.noctis_rewards from anon, authenticated;
revoke all on public.noctis_codes from anon, authenticated;
revoke all on public.user_noctis_unlocks from anon, authenticated;

grant select on public.tarot_decks to anon, authenticated;
grant select on public.tarot_deck_cards to anon, authenticated;
grant select on public.tarot_card_meanings to anon, authenticated;
grant select on public.tarot_deck_card_extras to anon, authenticated;
grant select on public.user_deck_unlocks to authenticated;
grant select on public.noctis_rewards to authenticated;
grant select on public.user_noctis_unlocks to authenticated;

drop policy if exists "Public tarot decks are readable" on public.tarot_decks;
create policy "Public tarot decks are readable"
on public.tarot_decks
for select
to anon, authenticated
using (is_public = true);

drop policy if exists "Unlocked tarot decks are readable" on public.tarot_decks;
create policy "Unlocked tarot decks are readable"
on public.tarot_decks
for select
to authenticated
using (
  exists (
    select 1
    from public.user_deck_unlocks unlock
    where unlock.user_id = auth.uid()
      and unlock.deck_slug = tarot_decks.slug
  )
);

drop policy if exists "Admins can manage tarot decks" on public.tarot_decks;
create policy "Admins can manage tarot decks"
on public.tarot_decks
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public tarot deck cards are readable" on public.tarot_deck_cards;
create policy "Public tarot deck cards are readable"
on public.tarot_deck_cards
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.tarot_decks deck
    where deck.slug = tarot_deck_cards.deck_slug
      and deck.is_public = true
  )
);

drop policy if exists "Unlocked tarot deck cards are readable" on public.tarot_deck_cards;
create policy "Unlocked tarot deck cards are readable"
on public.tarot_deck_cards
for select
to authenticated
using (
  exists (
    select 1
    from public.user_deck_unlocks unlock
    where unlock.user_id = auth.uid()
      and unlock.deck_slug = tarot_deck_cards.deck_slug
  )
);

drop policy if exists "Admins can manage tarot deck cards" on public.tarot_deck_cards;
create policy "Admins can manage tarot deck cards"
on public.tarot_deck_cards
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Readable tarot card meanings follow deck access" on public.tarot_card_meanings;
create policy "Readable tarot card meanings follow deck access"
on public.tarot_card_meanings
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.tarot_decks deck
    where deck.meaning_set_id = tarot_card_meanings.meaning_set_id
      and deck.is_public = true
  )
  or exists (
    select 1
    from public.tarot_decks deck
    join public.user_deck_unlocks unlock on unlock.deck_slug = deck.slug
    where deck.meaning_set_id = tarot_card_meanings.meaning_set_id
      and unlock.user_id = auth.uid()
  )
);

drop policy if exists "Admins can manage tarot card meanings" on public.tarot_card_meanings;
create policy "Admins can manage tarot card meanings"
on public.tarot_card_meanings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public tarot deck extras are readable when not premium" on public.tarot_deck_card_extras;
create policy "Public tarot deck extras are readable when not premium"
on public.tarot_deck_card_extras
for select
to anon, authenticated
using (
  premium_only = false
  and exists (
    select 1
    from public.tarot_decks deck
    where deck.slug = tarot_deck_card_extras.deck_slug
      and deck.is_public = true
  )
);

drop policy if exists "Unlocked tarot deck extras are readable" on public.tarot_deck_card_extras;
create policy "Unlocked tarot deck extras are readable"
on public.tarot_deck_card_extras
for select
to authenticated
using (
  exists (
    select 1
    from public.user_deck_unlocks unlock
    where unlock.user_id = auth.uid()
      and unlock.deck_slug = tarot_deck_card_extras.deck_slug
  )
);

drop policy if exists "Admins can manage tarot deck extras" on public.tarot_deck_card_extras;
create policy "Admins can manage tarot deck extras"
on public.tarot_deck_card_extras
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can view their own deck unlocks" on public.user_deck_unlocks;
create policy "Users can view their own deck unlocks"
on public.user_deck_unlocks
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Admins can manage deck unlocks" on public.user_deck_unlocks;
create policy "Admins can manage deck unlocks"
on public.user_deck_unlocks
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can view their unlocked Noctis rewards" on public.noctis_rewards;
create policy "Users can view their unlocked Noctis rewards"
on public.noctis_rewards
for select
to authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.user_noctis_unlocks unlock
    where unlock.user_id = auth.uid()
      and unlock.reward_key = noctis_rewards.reward_key
  )
);

drop policy if exists "Admins can manage Noctis rewards" on public.noctis_rewards;
create policy "Admins can manage Noctis rewards"
on public.noctis_rewards
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage Noctis codes" on public.noctis_codes;
create policy "Admins can manage Noctis codes"
on public.noctis_codes
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can view their own Noctis unlocks" on public.user_noctis_unlocks;
create policy "Users can view their own Noctis unlocks"
on public.user_noctis_unlocks
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Admins can manage Noctis unlocks" on public.user_noctis_unlocks;
create policy "Admins can manage Noctis unlocks"
on public.user_noctis_unlocks
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
