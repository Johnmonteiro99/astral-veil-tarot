-- Make Supabase Noctis Documents the source of truth for The Shelves.
-- Keep the real Tide document, but remove the earlier sample placeholders from
-- public publication by unpublishing them.

create extension if not exists pgcrypto;

create table if not exists public.noctis_documents (
  id uuid primary key default gen_random_uuid()
);

alter table public.noctis_documents
  add column if not exists slug text,
  add column if not exists title text,
  add column if not exists subtitle text,
  add column if not exists author text,
  add column if not exists attribution text,
  add column if not exists zodiac text,
  add column if not exists document_type text default 'journal',
  add column if not exists category text,
  add column if not exists category_label text,
  add column if not exists summary text,
  add column if not exists excerpt text,
  add column if not exists body text,
  add column if not exists tags text[] default '{}',
  add column if not exists themes text[] default '{}',
  add column if not exists shelf_mark text,
  add column if not exists mode text default 'blood_moon',
  add column if not exists moon_phase text,
  add column if not exists unlock_requirement text default 'public',
  add column if not exists is_published boolean default false,
  add column if not exists is_featured boolean default false,
  add column if not exists is_notable boolean default false,
  add column if not exists is_blood_moon boolean default false,
  add column if not exists sort_order integer default 0,
  add column if not exists cover_image text,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

create unique index if not exists noctis_documents_slug_unique_idx
on public.noctis_documents (slug)
where slug is not null;

create unique index if not exists noctis_documents_shelf_mark_unique_idx
on public.noctis_documents (shelf_mark)
where shelf_mark is not null;

-- If the Tide document already exists by shelf mark under an older slug, align
-- the identity fields before the slug-keyed upsert.
update public.noctis_documents
set
  slug = 'the-tide-that-moves-within',
  title = coalesce(nullif(trim(title), ''), 'The Tide That Moves Within'),
  document_type = 'journal',
  category = coalesce(nullif(trim(category), ''), 'journals'),
  category_label = coalesce(nullif(trim(category_label), ''), 'Recovered Journal'),
  author = case
    when author is null or trim(author) = '' or author ilike 'Attributed to Zephyra%' then 'Zephyra Noctis'
    else author
  end,
  attribution = coalesce(nullif(trim(attribution), ''), 'Zephyra Noctis'),
  shelf_mark = 'J-SC-ZN-01',
  mode = coalesce(nullif(trim(mode), ''), nullif(trim(moon_phase), ''), 'blood_moon'),
  moon_phase = coalesce(nullif(trim(moon_phase), ''), nullif(trim(mode), ''), 'blood_moon'),
  is_published = true,
  is_featured = true,
  is_blood_moon = true,
  tags = case when tags is null or cardinality(tags) = 0 then array['water', 'memory', 'fragment'] else tags end,
  themes = case when themes is null or cardinality(themes) = 0 then array['The Veil', 'Tides', 'Memory'] else themes end,
  updated_at = now()
where shelf_mark = 'J-SC-ZN-01';

insert into public.noctis_documents (
  slug,
  title,
  subtitle,
  author,
  attribution,
  zodiac,
  document_type,
  category,
  category_label,
  summary,
  excerpt,
  body,
  tags,
  themes,
  shelf_mark,
  mode,
  moon_phase,
  unlock_requirement,
  is_published,
  is_featured,
  is_blood_moon,
  sort_order,
  cover_image
)
values (
  'the-tide-that-moves-within',
  'The Tide That Moves Within',
  'Recovered Journal Fragment',
  'Zephyra Noctis',
  'Zephyra Noctis',
  'Scorpio',
  'journal',
  'journals',
  'Recovered Journal',
  'A recovered journal fragment about memory, water, resistance, and the quiet strength of yielding.',
  'The sea is not distant. It is memory. It pulls at the edge of the self, where names dissolve and the Veil grows thin.',
  $body$I used to think water was soft because it yielded.

I was wrong.

Water yields because it is patient enough to win without announcing itself. It does not argue with stone. It remembers the shape of resistance and returns, again and again, until the mountain learns to bow.

There is a kind of strength that breaks everything it touches.

There is another kind that enters without violence, fills what is empty, cools what is burning, reflects what refuses to be named, and carries away what has become too heavy to hold.

The archive taught me this beside a basin with no bottom.

I looked into it and saw every version of myself that had tried to become fire just to survive. Every face was bright. Every face was tired.

Then the water moved.

Not against me.

Through me.

Water does not show you the world by keeping still.

It shows you what moves when you finally look.

The sailor crosses oceans seeking new shores.

Home waits beneath the face in the tide.

In every reflection, a door opens inward.

Nothing is farther than the self we avoid.

That is what water knows.

Long before maps were trusted, people followed the sea into the unknown. They sailed past familiar shores because something in them believed discovery lived beyond the horizon.

But the oldest voyage was never across the water.

It was through it.

A person may cross every ocean and still remain a stranger to themselves. They may name islands, chart stars, survive storms, and return with gold in their hands, yet never once look into the dark mirror beneath the ship.

Water remembers what the traveler forgets.

It shows the face, then the fear behind the face. It shows the wound, then the tenderness guarding it. It shows the self not as a fixed thing, but as a current becoming.

To become like water is not to disappear.

It is to stop mistaking hardness for power.

It is to move with enough truth that no cage can keep its original shape around you.

When the candle went out, something small rested at the bottom of the basin.

A key, dark as midnight glass.

It had no teeth.

Only a reflection.$body$,
  array['water', 'memory', 'fragment'],
  array['The Veil', 'Tides', 'Memory'],
  'J-SC-ZN-01',
  'blood_moon',
  'blood_moon',
  'public',
  true,
  true,
  true,
  0,
  null
)
on conflict (slug) where slug is not null do update
set
  title = 'The Tide That Moves Within',
  subtitle = coalesce(nullif(trim(public.noctis_documents.subtitle), ''), excluded.subtitle),
  author = case
    when public.noctis_documents.author is null
      or trim(public.noctis_documents.author) = ''
      or public.noctis_documents.author ilike 'Attributed to Zephyra%'
      then 'Zephyra Noctis'
    else public.noctis_documents.author
  end,
  attribution = coalesce(nullif(trim(public.noctis_documents.attribution), ''), 'Zephyra Noctis'),
  zodiac = coalesce(nullif(trim(public.noctis_documents.zodiac), ''), excluded.zodiac),
  document_type = 'journal',
  category = coalesce(nullif(trim(public.noctis_documents.category), ''), 'journals'),
  category_label = coalesce(nullif(trim(public.noctis_documents.category_label), ''), 'Recovered Journal'),
  summary = coalesce(nullif(trim(public.noctis_documents.summary), ''), excluded.summary),
  excerpt = coalesce(nullif(trim(public.noctis_documents.excerpt), ''), excluded.excerpt),
  tags = case
    when public.noctis_documents.tags is null or cardinality(public.noctis_documents.tags) = 0 then excluded.tags
    else public.noctis_documents.tags
  end,
  themes = case
    when public.noctis_documents.themes is null or cardinality(public.noctis_documents.themes) = 0 then excluded.themes
    else public.noctis_documents.themes
  end,
  shelf_mark = 'J-SC-ZN-01',
  mode = coalesce(nullif(trim(public.noctis_documents.mode), ''), excluded.mode),
  moon_phase = coalesce(nullif(trim(public.noctis_documents.moon_phase), ''), excluded.moon_phase),
  unlock_requirement = coalesce(nullif(trim(public.noctis_documents.unlock_requirement), ''), 'public'),
  is_published = true,
  is_featured = true,
  is_blood_moon = true,
  sort_order = coalesce(public.noctis_documents.sort_order, 0),
  updated_at = now();

update public.noctis_documents
set
  is_published = false,
  is_featured = false,
  is_notable = false,
  updated_at = now()
where slug in (
  'a-letter-without-address',
  'notes-on-the-blue-drowning',
  'the-veil-and-its-watchers',
  'blood-moon-observations'
)
or shelf_mark in (
  'L-UN-UK-01',
  'J-SC-ZN-02',
  'M-UN-UK-01',
  'R-SC-ZN-01'
);

alter table public.noctis_documents enable row level security;

revoke all on public.noctis_documents from anon;
revoke all on public.noctis_documents from authenticated;
grant select on public.noctis_documents to anon;
grant select, insert, update, delete on public.noctis_documents to authenticated;

drop policy if exists "Published Noctis documents are readable" on public.noctis_documents;
drop policy if exists "Admins can select Noctis documents" on public.noctis_documents;
drop policy if exists "Admins can insert Noctis documents" on public.noctis_documents;
drop policy if exists "Admins can update Noctis documents" on public.noctis_documents;
drop policy if exists "Admins can delete Noctis documents" on public.noctis_documents;

create policy "Published Noctis documents are readable"
on public.noctis_documents
for select
to anon, authenticated
using (is_published = true);

create policy "Admins can select Noctis documents"
on public.noctis_documents
for select
to authenticated
using (public.is_admin());

create policy "Admins can insert Noctis documents"
on public.noctis_documents
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update Noctis documents"
on public.noctis_documents
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete Noctis documents"
on public.noctis_documents
for delete
to authenticated
using (public.is_admin());
