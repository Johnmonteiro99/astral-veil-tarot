-- Keep the admin Noctis Documents table compatible with the public Shelves
-- source of truth without rewriting existing document bodies.

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
  add column if not exists unlock_key text,
  add column if not exists required_artifact_key text,
  add column if not exists required_fragment_key text,
  add column if not exists is_published boolean default false,
  add column if not exists is_featured boolean default false,
  add column if not exists is_notable boolean default false,
  add column if not exists is_blood_moon boolean default false,
  add column if not exists sort_order integer default 0,
  add column if not exists cover_image text,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.noctis_documents
set
  slug = nullif(trim(slug), ''),
  title = coalesce(nullif(trim(title), ''), 'Untitled Document'),
  document_type = case
    when nullif(trim(document_type), '') is null then 'journal'
    when lower(document_type) in ('journal_fragment', 'recovered_journal', 'journals') then 'journal'
    when lower(document_type) in ('manuscripts') then 'manuscript'
    when lower(document_type) in ('letters') then 'letter'
    when lower(document_type) in ('cryptic_codes', 'codes') then 'cipher'
    when lower(document_type) in ('fragments') then 'fragment'
    when lower(document_type) in ('veil', 'the_veil') then 'veil_lore'
    when lower(document_type) in ('unstable_texts') then 'unstable_text'
    when lower(document_type) in ('blood_moon_record', 'bloodmoon') then 'blood_moon'
    when lower(document_type) in ('journal', 'manuscript', 'letter', 'cipher', 'fragment', 'veil_lore', 'unstable_text', 'blood_moon', 'other') then lower(document_type)
    else 'other'
  end,
  author = coalesce(nullif(trim(author), ''), nullif(trim(attribution), '')),
  attribution = coalesce(nullif(trim(attribution), ''), nullif(trim(author), '')),
  category = coalesce(nullif(trim(category), ''), case when lower(coalesce(document_type, '')) = 'journal' then 'journals' end),
  category_label = coalesce(nullif(trim(category_label), ''), nullif(trim(subtitle), ''), nullif(trim(category), '')),
  tags = coalesce(tags, '{}'),
  themes = coalesce(themes, '{}'),
  mode = coalesce(nullif(trim(mode), ''), nullif(trim(moon_phase), ''), 'blood_moon'),
  moon_phase = coalesce(nullif(trim(moon_phase), ''), nullif(trim(mode), '')),
  unlock_requirement = coalesce(nullif(trim(unlock_requirement), ''), 'public'),
  is_published = coalesce(is_published, false),
  is_featured = coalesce(is_featured, false),
  is_notable = coalesce(is_notable, false),
  is_blood_moon = coalesce(is_blood_moon, false)
    or lower(coalesce(mode, moon_phase, '')) in ('blood_moon', 'bloodmoon')
    or lower(coalesce(document_type, '')) = 'blood_moon',
  sort_order = coalesce(sort_order, 0),
  updated_at = coalesce(updated_at, now()),
  created_at = coalesce(created_at, now());

with canonical_tide as (
  select id
  from public.noctis_documents
  where slug = 'the-tide-that-moves-within'
     or shelf_mark = 'J-SC-ZN-01'
     or title ilike 'The Tide That Moves Within'
  order by
    case
      when slug = 'the-tide-that-moves-within' then 0
      when shelf_mark = 'J-SC-ZN-01' then 1
      else 2
    end,
    updated_at desc nulls last,
    created_at asc nulls last
  limit 1
)
update public.noctis_documents
set
  slug = coalesce(nullif(trim(slug), ''), 'the-tide-that-moves-within'),
  document_type = coalesce(nullif(trim(document_type), ''), 'journal'),
  author = coalesce(nullif(trim(author), ''), 'Zephyra Noctis'),
  attribution = coalesce(nullif(trim(attribution), ''), 'Zephyra Noctis'),
  shelf_mark = coalesce(nullif(trim(shelf_mark), ''), 'J-SC-ZN-01'),
  is_published = true,
  is_featured = true,
  mode = coalesce(nullif(trim(mode), ''), 'blood_moon'),
  moon_phase = coalesce(nullif(trim(moon_phase), ''), 'blood_moon'),
  is_blood_moon = true,
  category = coalesce(nullif(trim(category), ''), 'journals'),
  category_label = coalesce(nullif(trim(category_label), ''), 'Recovered Journal'),
  sort_order = coalesce(sort_order, 0)
from canonical_tide
where noctis_documents.id = canonical_tide.id;

alter table public.noctis_documents
  alter column document_type set default 'journal',
  alter column tags set default '{}',
  alter column themes set default '{}',
  alter column mode set default 'blood_moon',
  alter column unlock_requirement set default 'public',
  alter column is_published set default false,
  alter column is_featured set default false,
  alter column is_notable set default false,
  alter column is_blood_moon set default false,
  alter column sort_order set default 0,
  alter column created_at set default now(),
  alter column updated_at set default now();

create unique index if not exists noctis_documents_slug_unique_idx
on public.noctis_documents (slug)
where slug is not null;

create unique index if not exists noctis_documents_shelf_mark_unique_idx
on public.noctis_documents (shelf_mark)
where shelf_mark is not null;

create index if not exists noctis_documents_published_idx
on public.noctis_documents (is_published);

create index if not exists noctis_documents_document_type_idx
on public.noctis_documents (document_type);

create index if not exists noctis_documents_mode_idx
on public.noctis_documents (mode);

create index if not exists noctis_documents_sort_order_idx
on public.noctis_documents (sort_order);

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
