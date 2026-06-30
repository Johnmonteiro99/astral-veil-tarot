-- Per-user Noctis Gallery recent views and marked records.

create extension if not exists pgcrypto;

create table if not exists public.user_gallery_recent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  record_id uuid not null references public.gallery_records(id) on delete cascade,
  last_viewed_at timestamptz not null default now(),
  view_count integer not null default 1,
  created_at timestamptz not null default now(),
  unique(user_id, record_id)
);

create table if not exists public.user_gallery_marked_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  record_id uuid not null references public.gallery_records(id) on delete cascade,
  marked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(user_id, record_id)
);

create index if not exists user_gallery_recent_records_user_idx
on public.user_gallery_recent_records (user_id);

create index if not exists user_gallery_recent_records_record_idx
on public.user_gallery_recent_records (record_id);

create index if not exists user_gallery_recent_records_last_viewed_idx
on public.user_gallery_recent_records (user_id, last_viewed_at desc);

create index if not exists user_gallery_marked_records_user_idx
on public.user_gallery_marked_records (user_id);

create index if not exists user_gallery_marked_records_record_idx
on public.user_gallery_marked_records (record_id);

create index if not exists user_gallery_marked_records_marked_idx
on public.user_gallery_marked_records (user_id, marked_at desc);

alter table public.user_gallery_recent_records enable row level security;
alter table public.user_gallery_marked_records enable row level security;

revoke all on public.user_gallery_recent_records from anon;
revoke all on public.user_gallery_recent_records from authenticated;
revoke all on public.user_gallery_marked_records from anon;
revoke all on public.user_gallery_marked_records from authenticated;

grant select, insert, update on public.user_gallery_recent_records to authenticated;
grant select, insert, delete on public.user_gallery_marked_records to authenticated;

drop policy if exists "Users can view their own recent gallery records"
on public.user_gallery_recent_records;

drop policy if exists "Users can create their own recent gallery records"
on public.user_gallery_recent_records;

drop policy if exists "Users can update their own recent gallery records"
on public.user_gallery_recent_records;

drop policy if exists "Users can view their own marked gallery records"
on public.user_gallery_marked_records;

drop policy if exists "Users can create their own marked gallery records"
on public.user_gallery_marked_records;

drop policy if exists "Users can delete their own marked gallery records"
on public.user_gallery_marked_records;

create policy "Users can view their own recent gallery records"
on public.user_gallery_recent_records
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create their own recent gallery records"
on public.user_gallery_recent_records
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own recent gallery records"
on public.user_gallery_recent_records
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can view their own marked gallery records"
on public.user_gallery_marked_records
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create their own marked gallery records"
on public.user_gallery_marked_records
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete their own marked gallery records"
on public.user_gallery_marked_records
for delete
to authenticated
using (auth.uid() = user_id);
