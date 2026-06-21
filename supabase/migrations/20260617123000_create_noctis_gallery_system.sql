-- Noctis Gallery visual records, collectible fragments, and per-user fragment progress.

create extension if not exists pgcrypto;

create table if not exists public.gallery_records (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  unknown_title text,
  slug text not null unique,
  description text,
  lore_note text,
  record_type text not null default 'visual_record',
  origin text default 'Noctis Archive',
  status text not null default 'available',
  full_image_url text,
  preview_image_url text,
  required_fragments integer not null default 0,
  is_fragmented boolean not null default false,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  tags text[] not null default '{}',
  themes text[] not null default '{}',
  related_room text,
  related_document_id uuid references public.noctis_documents(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_fragments (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.gallery_records(id) on delete cascade,
  fragment_label text,
  fragment_order integer not null default 1,
  fragment_image_url text,
  hint_text text,
  unlock_source_type text not null default 'document',
  document_id uuid references public.noctis_documents(id) on delete set null,
  unlock_source_value text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(record_id, fragment_order)
);

create table if not exists public.user_gallery_fragments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  fragment_id uuid not null references public.gallery_fragments(id) on delete cascade,
  record_id uuid not null references public.gallery_records(id) on delete cascade,
  collected_at timestamptz not null default now(),
  unique(user_id, fragment_id)
);

create index if not exists gallery_records_active_idx
on public.gallery_records (is_active);

create index if not exists gallery_records_featured_idx
on public.gallery_records (is_featured, sort_order);

create index if not exists gallery_records_type_idx
on public.gallery_records (record_type);

create index if not exists gallery_records_status_idx
on public.gallery_records (status);

create index if not exists gallery_records_tags_gin_idx
on public.gallery_records using gin (tags);

create index if not exists gallery_records_themes_gin_idx
on public.gallery_records using gin (themes);

create index if not exists gallery_fragments_record_idx
on public.gallery_fragments (record_id, fragment_order);

create index if not exists gallery_fragments_document_idx
on public.gallery_fragments (document_id);

create index if not exists gallery_fragments_unlock_source_type_idx
on public.gallery_fragments (unlock_source_type);

create index if not exists gallery_fragments_active_idx
on public.gallery_fragments (is_active);

create index if not exists user_gallery_fragments_user_idx
on public.user_gallery_fragments (user_id, collected_at desc);

create index if not exists user_gallery_fragments_record_idx
on public.user_gallery_fragments (record_id);

create index if not exists user_gallery_fragments_fragment_idx
on public.user_gallery_fragments (fragment_id);

drop trigger if exists set_gallery_records_updated_at on public.gallery_records;

create trigger set_gallery_records_updated_at
before update on public.gallery_records
for each row
execute function public.set_updated_at();

drop trigger if exists set_gallery_fragments_updated_at on public.gallery_fragments;

create trigger set_gallery_fragments_updated_at
before update on public.gallery_fragments
for each row
execute function public.set_updated_at();

alter table public.gallery_records enable row level security;
alter table public.gallery_fragments enable row level security;
alter table public.user_gallery_fragments enable row level security;

revoke all on public.gallery_records from anon;
revoke all on public.gallery_records from authenticated;
revoke all on public.gallery_fragments from anon;
revoke all on public.gallery_fragments from authenticated;
revoke all on public.user_gallery_fragments from anon;
revoke all on public.user_gallery_fragments from authenticated;

grant select on public.gallery_records to anon, authenticated;
grant select on public.gallery_fragments to anon, authenticated;
grant select, insert, delete on public.user_gallery_fragments to authenticated;

drop policy if exists "Anyone can read active gallery records" on public.gallery_records;
drop policy if exists "Anyone can read active gallery fragments" on public.gallery_fragments;
drop policy if exists "Users can view their own gallery fragments" on public.user_gallery_fragments;
drop policy if exists "Users can collect their own gallery fragments" on public.user_gallery_fragments;
drop policy if exists "Users can delete their own gallery fragments" on public.user_gallery_fragments;

create policy "Anyone can read active gallery records"
on public.gallery_records
for select
to anon, authenticated
using (is_active = true);

create policy "Anyone can read active gallery fragments"
on public.gallery_fragments
for select
to anon, authenticated
using (is_active = true);

create policy "Users can view their own gallery fragments"
on public.user_gallery_fragments
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can collect their own gallery fragments"
on public.user_gallery_fragments
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete their own gallery fragments"
on public.user_gallery_fragments
for delete
to authenticated
using (auth.uid() = user_id);
