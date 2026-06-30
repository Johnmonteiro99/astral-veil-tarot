-- Owner-only RLS for private user journal entries.
-- Apply in the Supabase SQL editor for the Astral Veil project.

alter table public.user_journal_entries
  add column if not exists check_in text,
  add column if not exists mood text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists prompt text,
  add column if not exists guided_answers jsonb not null default '[]'::jsonb,
  add column if not exists mode text not null default 'sun',
  add column if not exists source_type text not null default 'journal',
  add column if not exists source_reading_id uuid,
  add column if not exists reflection_type text not null default 'daily_reflection',
  add column if not exists updated_at timestamptz not null default now();

comment on column public.user_journal_entries.source_reading_id is
  'Nullable saved reading id. No strict foreign key yet so existing saved reading id type/ownership can evolve safely.';

revoke all on public.user_journal_entries from anon;
grant select, insert, update, delete on public.user_journal_entries to authenticated;

alter table public.user_journal_entries enable row level security;

drop policy if exists "Users can view their own journal entries" on public.user_journal_entries;
drop policy if exists "Users can create their own journal entries" on public.user_journal_entries;
drop policy if exists "Users can update their own journal entries" on public.user_journal_entries;
drop policy if exists "Users can delete their own journal entries" on public.user_journal_entries;

create policy "Users can view their own journal entries"
on public.user_journal_entries
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create their own journal entries"
on public.user_journal_entries
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own journal entries"
on public.user_journal_entries
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own journal entries"
on public.user_journal_entries
for delete
to authenticated
using (auth.uid() = user_id);
