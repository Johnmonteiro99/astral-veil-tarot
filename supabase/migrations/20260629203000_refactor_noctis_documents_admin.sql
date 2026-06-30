-- Refactor the legacy admin Journals content model into a flexible Noctis
-- Documents table without dropping existing records or rewriting document bodies.

create extension if not exists pgcrypto;

create table if not exists public.noctis_documents (
  id uuid primary key default gen_random_uuid()
);

alter table public.noctis_documents
  add column if not exists title text,
  add column if not exists slug text,
  add column if not exists subtitle text,
  add column if not exists document_type text default 'journal',
  add column if not exists category text,
  add column if not exists category_label text,
  add column if not exists author text,
  add column if not exists attribution text,
  add column if not exists shelf_mark text,
  add column if not exists excerpt text,
  add column if not exists body text,
  add column if not exists tags text[] default '{}',
  add column if not exists themes text[] default '{}',
  add column if not exists mode text default 'blood_moon',
  add column if not exists moon_phase text,
  add column if not exists is_published boolean default false,
  add column if not exists is_featured boolean default false,
  add column if not exists is_notable boolean default false,
  add column if not exists is_blood_moon boolean default false,
  add column if not exists sort_order integer default 0,
  add column if not exists unlock_key text,
  add column if not exists required_artifact_key text,
  add column if not exists required_fragment_key text,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.noctis_documents
set
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
  category_label = coalesce(category_label, subtitle, category),
  mode = coalesce(nullif(trim(mode), ''), nullif(trim(moon_phase), ''), 'blood_moon'),
  is_blood_moon = coalesce(is_blood_moon, false)
    or lower(coalesce(mode, moon_phase, '')) in ('blood_moon', 'bloodmoon')
    or lower(coalesce(document_type, '')) = 'blood_moon',
  tags = coalesce(tags, '{}'),
  themes = coalesce(themes, '{}'),
  sort_order = coalesce(sort_order, 0),
  title = coalesce(nullif(trim(title), ''), 'Untitled Document'),
  body = coalesce(body, ''),
  updated_at = coalesce(updated_at, now()),
  created_at = coalesce(created_at, now());

alter table public.noctis_documents
  alter column title set not null,
  alter column document_type set default 'journal',
  alter column document_type set not null,
  alter column body set not null,
  alter column tags set default '{}',
  alter column themes set default '{}',
  alter column mode set default 'blood_moon',
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

create index if not exists noctis_documents_blood_moon_idx
on public.noctis_documents (is_blood_moon);

create index if not exists noctis_documents_sort_order_idx
on public.noctis_documents (sort_order);

create index if not exists noctis_documents_tags_gin_idx
on public.noctis_documents using gin (tags);

create index if not exists noctis_documents_themes_gin_idx
on public.noctis_documents using gin (themes);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'noctis_documents_document_type_allowed'
      and conrelid = 'public.noctis_documents'::regclass
  ) then
    alter table public.noctis_documents
      add constraint noctis_documents_document_type_allowed
      check (document_type in (
        'journal',
        'manuscript',
        'letter',
        'cipher',
        'fragment',
        'veil_lore',
        'unstable_text',
        'blood_moon',
        'other'
      ));
  end if;
end $$;

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
