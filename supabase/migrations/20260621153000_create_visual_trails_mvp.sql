-- Simple Gallery Visual Trails MVP: one active trail, four fragments, and
-- account-based recovery progress.

create extension if not exists pgcrypto;

create table if not exists public.visual_trails (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  lore_note text,
  full_image_url text,
  preview_image_url text,
  total_fragments integer not null default 4,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.visual_trail_fragments (
  id uuid primary key default gen_random_uuid(),
  trail_id uuid not null references public.visual_trails(id) on delete cascade,
  fragment_number integer not null,
  title text,
  fragment_image_url text not null,
  hint_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique(trail_id, fragment_number)
);

create table if not exists public.user_visual_trail_fragments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trail_id uuid not null references public.visual_trails(id) on delete cascade,
  fragment_id uuid not null references public.visual_trail_fragments(id) on delete cascade,
  recovered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(user_id, fragment_id)
);

create index if not exists visual_trails_active_idx
on public.visual_trails (is_active, sort_order);

create index if not exists visual_trail_fragments_trail_idx
on public.visual_trail_fragments (trail_id, sort_order, fragment_number);

create index if not exists user_visual_trail_fragments_user_idx
on public.user_visual_trail_fragments (user_id, recovered_at desc);

create index if not exists user_visual_trail_fragments_trail_idx
on public.user_visual_trail_fragments (trail_id);

drop trigger if exists set_visual_trails_updated_at on public.visual_trails;

create trigger set_visual_trails_updated_at
before update on public.visual_trails
for each row
execute function public.set_updated_at();

alter table public.visual_trails enable row level security;
alter table public.visual_trail_fragments enable row level security;
alter table public.user_visual_trail_fragments enable row level security;

grant select on public.visual_trails to anon, authenticated;
grant select on public.visual_trail_fragments to anon, authenticated;
grant select, insert on public.user_visual_trail_fragments to authenticated;

drop policy if exists "Anyone can view active visual trails" on public.visual_trails;
drop policy if exists "Anyone can view active visual trail fragments" on public.visual_trail_fragments;
drop policy if exists "Users can view their own visual trail fragments" on public.user_visual_trail_fragments;
drop policy if exists "Users can recover their own visual trail fragments" on public.user_visual_trail_fragments;

create policy "Anyone can view active visual trails"
on public.visual_trails
for select
using (is_active = true);

create policy "Anyone can view active visual trail fragments"
on public.visual_trail_fragments
for select
using (
  exists (
    select 1
    from public.visual_trails trail
    where trail.id = visual_trail_fragments.trail_id
      and trail.is_active = true
  )
);

create policy "Users can view their own visual trail fragments"
on public.user_visual_trail_fragments
for select
using (auth.uid() = user_id);

create policy "Users can recover their own visual trail fragments"
on public.user_visual_trail_fragments
for insert
with check (auth.uid() = user_id);

insert into public.visual_trails (
  title,
  slug,
  description,
  lore_note,
  full_image_url,
  preview_image_url,
  total_fragments,
  is_active,
  sort_order
) values (
  'The Spiral Beyond the Veil',
  'the-spiral-beyond-the-veil',
  'A recovered visual trail assembled from four unstable fragments.',
  'The image bends inward, as if the Archive found a door where the sky should have been.',
  '/assets/noctis/gallery/anomalies/cosmic-spiral-of-fiery-energy.png',
  '/assets/noctis/gallery/anomalies/cosmic-spiral-of-fiery-energy.png',
  4,
  true,
  10
)
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  lore_note = excluded.lore_note,
  full_image_url = excluded.full_image_url,
  preview_image_url = excluded.preview_image_url,
  total_fragments = excluded.total_fragments,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.visual_trail_fragments (
  trail_id,
  fragment_number,
  title,
  fragment_image_url,
  hint_text,
  sort_order
)
select
  trail.id,
  fragment.fragment_number,
  fragment.title,
  fragment.fragment_image_url,
  fragment.hint_text,
  fragment.sort_order
from public.visual_trails trail
cross join (
  values
    (1, 'Fragment I', '/assets/noctis/gallery/anomalies/cosmic-spiral-of-fiery-energy.png', 'Recovered where the spiral first opened.', 10),
    (2, 'Fragment II', '/assets/noctis/gallery/places/blood-red-moon-over-haunted-ruins.png', 'Recovered beneath a blood-red horizon.', 20),
    (3, 'Fragment III', '/assets/noctis/gallery/symbols/astrolabe-in-a-gothic-study.png', 'Recovered from the instrument that watched the sky.', 30),
    (4, 'Fragment IV', '/assets/noctis/gallery/recovered/gothic-occult-grimoire-in-candlelight.png', 'Recovered between candle ash and script.', 40)
) as fragment(fragment_number, title, fragment_image_url, hint_text, sort_order)
where trail.slug = 'the-spiral-beyond-the-veil'
on conflict (trail_id, fragment_number) do update
set
  title = excluded.title,
  fragment_image_url = excluded.fragment_image_url,
  hint_text = excluded.hint_text,
  sort_order = excluded.sort_order;
