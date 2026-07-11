-- Align Noctis document records with The Shelves data model and add light seed data.

create extension if not exists pgcrypto;

create table if not exists public.noctis_documents (
  id uuid primary key default gen_random_uuid()
);

alter table public.noctis_documents
  add column if not exists slug text,
  add column if not exists title text,
  add column if not exists subtitle text,
  add column if not exists author text,
  add column if not exists zodiac text,
  add column if not exists document_type text,
  add column if not exists category text,
  add column if not exists summary text,
  add column if not exists excerpt text,
  add column if not exists body text,
  add column if not exists tags text[] default '{}',
  add column if not exists themes text[] default '{}',
  add column if not exists shelf_mark text,
  add column if not exists moon_phase text,
  add column if not exists unlock_requirement text default 'public',
  add column if not exists is_published boolean default true,
  add column if not exists is_featured boolean default false,
  add column if not exists cover_image text,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

create unique index if not exists noctis_documents_slug_unique_idx
on public.noctis_documents (slug)
where slug is not null;

create unique index if not exists noctis_documents_shelf_mark_unique_idx
on public.noctis_documents (shelf_mark)
where shelf_mark is not null;

create index if not exists noctis_documents_published_idx
on public.noctis_documents (is_published);

create index if not exists noctis_documents_featured_idx
on public.noctis_documents (is_featured);

create index if not exists noctis_documents_document_type_idx
on public.noctis_documents (document_type);

create index if not exists noctis_documents_category_idx
on public.noctis_documents (category);

create index if not exists noctis_documents_moon_phase_idx
on public.noctis_documents (moon_phase);

create index if not exists noctis_documents_unlock_requirement_idx
on public.noctis_documents (unlock_requirement);

create index if not exists noctis_documents_tags_gin_idx
on public.noctis_documents using gin (tags);

create index if not exists noctis_documents_themes_gin_idx
on public.noctis_documents using gin (themes);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_noctis_documents_updated_at on public.noctis_documents;

create trigger set_noctis_documents_updated_at
before update on public.noctis_documents
for each row
execute function public.set_updated_at();

-- Existing deployments may have the later generic-only constraint already.
-- Install the complete canonical type set before this migration's detailed
-- journal-fragment and Blood Moon record seeds are inserted.
alter table public.noctis_documents
  drop constraint if exists noctis_documents_document_type_allowed;

alter table public.noctis_documents
  add constraint noctis_documents_document_type_allowed
  check (document_type in (
    'journal',
    'journal_fragment',
    'manuscript',
    'letter',
    'cipher',
    'fragment',
    'veil_lore',
    'unstable_text',
    'blood_moon',
    'blood_moon_record',
    'other'
  ));

insert into public.noctis_documents (
  slug,
  title,
  subtitle,
  author,
  zodiac,
  document_type,
  category,
  summary,
  excerpt,
  body,
  tags,
  themes,
  shelf_mark,
  moon_phase,
  unlock_requirement,
  is_published,
  is_featured,
  cover_image
)
values
(
  'the-tide-that-moves-within',
  'The Tide That Moves Within',
  'Recovered Journal Fragment',
  'Attributed to Zephyra Noctis',
  'Scorpio',
  'journal_fragment',
  'journals',
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
  'public',
  true,
  true,
  null
),
(
  'a-letter-without-address',
  'A Letter Without Address',
  'Recovered Letter',
  'Unknown Hand',
  null,
  'letter',
  'letters',
  'A sealed letter with no recipient, recovered from the edges of the Noctis Archive.',
  'The letter carries no name, but the seal remembers being broken.',
  $body$No address was written.

No sender confessed.

Only the seal remained, red as a warning and warm as if it had been pressed moments before discovery.

Whoever wrote this knew the Archive would find it. Whoever received it may not have existed yet.$body$,
  array['letter', 'sealed', 'unknown'],
  array['The Veil', 'Memory'],
  'L-UN-UK-01',
  'blood_moon',
  'public',
  true,
  false,
  null
),
(
  'notes-on-the-blue-drowning',
  'Notes on the Blue Drowning',
  'Recovered Journal Fragment',
  'Attributed to Zephyra Noctis',
  'Scorpio',
  'journal_fragment',
  'journals',
  'A strange fragment referencing a blue cycle beyond the Blood Moon.',
  'Not every drowning belongs to water. Some belong to light.',
  $body$Not every drowning belongs to water.

Some belong to light.

There are cycles the Blood Moon cannot name because they do not arrive in red. They arrive pale. Distant. Quiet enough to be mistaken for mercy.

I wrote these notes before I understood what blue could take from a person.$body$,
  array['blue moon', 'water', 'cycle'],
  array['Blue Moon', 'Tides', 'Memory'],
  'J-SC-ZN-02',
  'blue_moon',
  'public',
  true,
  false,
  null
),
(
  'the-veil-and-its-watchers',
  'The Veil and Its Watchers',
  'Recovered Manuscript',
  'Unknown Author',
  null,
  'manuscript',
  'manuscripts',
  'A manuscript fragment describing the Veil as a boundary that may also be observing.',
  'A wall is simple. The Veil is not a wall.',
  $body$A wall is simple. The Veil is not a wall.

A wall divides.

The Veil remembers division.

Those who call it a barrier have not listened long enough. Those who call it alive have listened too closely and may not return unchanged.$body$,
  array['veil', 'watchers', 'manuscript'],
  array['The Veil', 'Watchers', 'Astral Lore'],
  'M-UN-UK-01',
  'blood_moon',
  'public',
  true,
  false,
  null
),
(
  'blood-moon-observations',
  'Blood Moon Observations',
  'Recovered Record',
  'Attributed to Zephyra Noctis',
  'Scorpio',
  'blood_moon_record',
  'blood_moon',
  'A field record describing the Archive during the Blood Moon cycle.',
  'During the Blood Moon, the Archive does not sleep. It waits with its eyes open.',
  $body$During the Blood Moon, the Archive does not sleep.

It waits with its eyes open.

Doors breathe differently. Names become heavier. Even silence seems to know where it was buried.

Do not confuse access with permission.$body$,
  array['blood moon', 'archive', 'observation'],
  array['Blood Moon', 'Noctis Archive'],
  'R-SC-ZN-01',
  'blood_moon',
  'public',
  true,
  false,
  null
)
on conflict (slug) where slug is not null do update
set
  title = excluded.title,
  subtitle = excluded.subtitle,
  author = excluded.author,
  zodiac = excluded.zodiac,
  document_type = excluded.document_type,
  category = excluded.category,
  summary = excluded.summary,
  excerpt = excluded.excerpt,
  body = excluded.body,
  tags = excluded.tags,
  themes = excluded.themes,
  shelf_mark = excluded.shelf_mark,
  moon_phase = excluded.moon_phase,
  unlock_requirement = excluded.unlock_requirement,
  is_published = excluded.is_published,
  is_featured = excluded.is_featured,
  cover_image = excluded.cover_image,
  updated_at = now();

alter table public.noctis_documents enable row level security;

grant select on public.noctis_documents to anon;
grant select on public.noctis_documents to authenticated;

drop policy if exists "Published Noctis documents are readable" on public.noctis_documents;

create policy "Published Noctis documents are readable"
on public.noctis_documents
for select
using (
  is_published = true
  and coalesce(unlock_requirement, 'public') = 'public'
);
