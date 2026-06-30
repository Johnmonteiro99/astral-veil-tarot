-- Supabase-backed Veilwalkers foundation. The public Veilwalkers page can keep
-- using static reader data while admin-managed records are prepared safely.

create extension if not exists pgcrypto;

create table if not exists public.veilwalkers (
  id uuid primary key default gen_random_uuid()
);

alter table public.veilwalkers
  add column if not exists slug text,
  add column if not exists display_name text,
  add column if not exists zodiac_sign text,
  add column if not exists element text,
  add column if not exists sort_order integer default 0,
  add column if not exists is_active boolean default true,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.veilwalkers
set
  slug = coalesce(
    nullif(trim(slug), ''),
    lower(regexp_replace(coalesce(nullif(trim(display_name), ''), id::text), '[^a-zA-Z0-9]+', '-', 'g'))
  ),
  display_name = coalesce(nullif(trim(display_name), ''), 'Unnamed Veilwalker'),
  zodiac_sign = nullif(trim(zodiac_sign), ''),
  element = nullif(trim(element), ''),
  sort_order = coalesce(sort_order, 0),
  is_active = coalesce(is_active, true),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

alter table public.veilwalkers
  alter column slug set not null,
  alter column display_name set not null,
  alter column sort_order set default 0,
  alter column is_active set default true,
  alter column created_at set default now(),
  alter column updated_at set default now();

create unique index if not exists veilwalkers_slug_unique_idx
on public.veilwalkers (slug);

create index if not exists veilwalkers_active_sort_idx
on public.veilwalkers (is_active, sort_order, display_name);

create table if not exists public.veilwalker_variants (
  id uuid primary key default gen_random_uuid(),
  veilwalker_id uuid not null references public.veilwalkers(id) on delete cascade,
  variant_key text not null,
  mode text default 'normal',
  phase text,
  title text,
  subtitle text,
  description text,
  focus text,
  traits text[] default '{}',
  symbolic_traits text[] default '{}',
  image_url text,
  profile_image_url text,
  is_available boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.veilwalker_variants
  add column if not exists veilwalker_id uuid references public.veilwalkers(id) on delete cascade,
  add column if not exists variant_key text,
  add column if not exists mode text default 'normal',
  add column if not exists phase text,
  add column if not exists title text,
  add column if not exists subtitle text,
  add column if not exists description text,
  add column if not exists focus text,
  add column if not exists traits text[] default '{}',
  add column if not exists symbolic_traits text[] default '{}',
  add column if not exists image_url text,
  add column if not exists profile_image_url text,
  add column if not exists is_available boolean default true,
  add column if not exists sort_order integer default 0,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.veilwalker_variants
set
  mode = coalesce(nullif(trim(mode), ''), 'normal'),
  traits = coalesce(traits, '{}'),
  symbolic_traits = coalesce(symbolic_traits, '{}'),
  is_available = coalesce(is_available, true),
  sort_order = coalesce(sort_order, 0),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

alter table public.veilwalker_variants
  alter column variant_key set not null,
  alter column mode set default 'normal',
  alter column traits set default '{}',
  alter column symbolic_traits set default '{}',
  alter column is_available set default true,
  alter column sort_order set default 0,
  alter column created_at set default now(),
  alter column updated_at set default now();

create unique index if not exists veilwalker_variants_unique_variant_idx
on public.veilwalker_variants (veilwalker_id, variant_key, mode, coalesce(phase, ''));

create index if not exists veilwalker_variants_parent_sort_idx
on public.veilwalker_variants (veilwalker_id, sort_order, variant_key);

create index if not exists veilwalker_variants_public_idx
on public.veilwalker_variants (is_available, mode, variant_key);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_veilwalkers_updated_at on public.veilwalkers;
create trigger set_veilwalkers_updated_at
before update on public.veilwalkers
for each row
execute function public.set_updated_at();

drop trigger if exists set_veilwalker_variants_updated_at on public.veilwalker_variants;
create trigger set_veilwalker_variants_updated_at
before update on public.veilwalker_variants
for each row
execute function public.set_updated_at();

insert into public.veilwalkers (slug, display_name, zodiac_sign, element, sort_order, is_active)
select 'zahira-veyra', 'Zahira Veyra', 'Aries', 'Fire', 0, true
where not exists (
  select 1 from public.veilwalkers where slug = 'zahira-veyra'
);

with zahira as (
  select id from public.veilwalkers where slug = 'zahira-veyra' limit 1
)
insert into public.veilwalker_variants (
  veilwalker_id,
  variant_key,
  mode,
  phase,
  title,
  description,
  focus,
  traits,
  symbolic_traits,
  image_url,
  profile_image_url,
  is_available,
  sort_order
)
select
  zahira.id,
  seed.variant_key,
  seed.mode,
  seed.phase,
  seed.title,
  seed.description,
  seed.focus,
  seed.traits,
  seed.symbolic_traits,
  seed.image_url,
  seed.profile_image_url,
  true,
  seed.sort_order
from zahira
cross join (
  values
    (
      'oracle',
      'normal',
      'phase_1',
      'Ember Oracle of First Sparks',
      'Zahira walks where beginnings catch fire. Her readings favor courage, decisive movement, and the clean burn of truth that makes a new path possible.',
      'For courage, action, purpose, and decisive movement.',
      array['courage', 'initiation', 'purpose', 'revelation']::text[],
      array[]::text[],
      'assets/images/readers/phase1/aries-phase1.png',
      'assets/images/readers/phase1/aries-phase1.png',
      0
    ),
    (
      'ascendant',
      'normal',
      'phase_2',
      'Ember Oracle of First Sparks',
      'Zahira turns questions toward action, truth, and the first brave spark that refuses to dim.',
      'For courage, action, purpose, and decisive movement.',
      array['courage', 'initiation', 'purpose', 'revelation']::text[],
      array[]::text[],
      'assets/images/readers/phase2/aries-phase2.webp',
      'assets/images/readers/phase2/aries-phase2.webp',
      1
    ),
    (
      'bloodmoon',
      'blood_moon',
      null,
      'Crimson Harbinger of the First Wound',
      'Zahira''s Blood Moon fire splits into twin voices: one laughing at the edge of danger, the other cutting straight through hesitation. They speak to the seeker and to each other, teasing, contradicting, daring the truth to move faster than fear.',
      'Blood Moon-only shadow reading for impulse, courage, and the wound beneath action.',
      array['Rage', 'Impulse', 'Recklessness', 'Domination']::text[],
      array['Blood Moon Rising']::text[],
      'assets/images/readers/bloodmoon/aries-bloodmoon.webp',
      'assets/images/readers/bloodmoon/aries-bloodmoon.webp',
      2
    )
) as seed(variant_key, mode, phase, title, description, focus, traits, symbolic_traits, image_url, profile_image_url, sort_order)
where not exists (
  select 1
  from public.veilwalker_variants existing
  where existing.veilwalker_id = zahira.id
    and existing.variant_key = seed.variant_key
    and existing.mode = seed.mode
    and coalesce(existing.phase, '') = coalesce(seed.phase, '')
);

alter table public.veilwalkers enable row level security;
alter table public.veilwalker_variants enable row level security;

revoke all on public.veilwalkers from anon;
revoke all on public.veilwalkers from authenticated;
grant select on public.veilwalkers to anon;
grant select, insert, update, delete on public.veilwalkers to authenticated;

revoke all on public.veilwalker_variants from anon;
revoke all on public.veilwalker_variants from authenticated;
grant select on public.veilwalker_variants to anon;
grant select, insert, update, delete on public.veilwalker_variants to authenticated;

drop policy if exists "Public can read active veilwalkers" on public.veilwalkers;
drop policy if exists "Admins can select veilwalkers" on public.veilwalkers;
drop policy if exists "Admins can insert veilwalkers" on public.veilwalkers;
drop policy if exists "Admins can update veilwalkers" on public.veilwalkers;
drop policy if exists "Admins can delete veilwalkers" on public.veilwalkers;

create policy "Public can read active veilwalkers"
on public.veilwalkers
for select
to anon, authenticated
using (is_active = true);

create policy "Admins can select veilwalkers"
on public.veilwalkers
for select
to authenticated
using (public.is_admin());

create policy "Admins can insert veilwalkers"
on public.veilwalkers
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update veilwalkers"
on public.veilwalkers
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete veilwalkers"
on public.veilwalkers
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Public can read available veilwalker variants" on public.veilwalker_variants;
drop policy if exists "Admins can select veilwalker variants" on public.veilwalker_variants;
drop policy if exists "Admins can insert veilwalker variants" on public.veilwalker_variants;
drop policy if exists "Admins can update veilwalker variants" on public.veilwalker_variants;
drop policy if exists "Admins can delete veilwalker variants" on public.veilwalker_variants;

create policy "Public can read available veilwalker variants"
on public.veilwalker_variants
for select
to anon, authenticated
using (
  is_available = true
  and exists (
    select 1
    from public.veilwalkers
    where veilwalkers.id = veilwalker_variants.veilwalker_id
      and veilwalkers.is_active = true
  )
);

create policy "Admins can select veilwalker variants"
on public.veilwalker_variants
for select
to authenticated
using (public.is_admin());

create policy "Admins can insert veilwalker variants"
on public.veilwalker_variants
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update veilwalker variants"
on public.veilwalker_variants
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete veilwalker variants"
on public.veilwalker_variants
for delete
to authenticated
using (public.is_admin());
