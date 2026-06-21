-- Saved Noctis Shelves documents for account-bound Notable Documents.

create extension if not exists pgcrypto;

create table if not exists public.user_noctis_saved_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_id uuid not null references public.noctis_documents(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.user_noctis_saved_documents
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists document_id uuid references public.noctis_documents(id) on delete cascade,
  add column if not exists created_at timestamptz not null default now();

alter table public.user_noctis_saved_documents
  alter column user_id set not null,
  alter column document_id set not null,
  alter column created_at set default now(),
  alter column created_at set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_noctis_saved_documents_user_document_key'
      and conrelid = 'public.user_noctis_saved_documents'::regclass
  ) then
    alter table public.user_noctis_saved_documents
      add constraint user_noctis_saved_documents_user_document_key unique (user_id, document_id);
  end if;
end $$;

create index if not exists user_noctis_saved_documents_user_created_idx
on public.user_noctis_saved_documents (user_id, created_at desc);

create index if not exists user_noctis_saved_documents_document_idx
on public.user_noctis_saved_documents (document_id);

alter table public.user_noctis_saved_documents enable row level security;

revoke all on public.user_noctis_saved_documents from anon;
revoke all on public.user_noctis_saved_documents from authenticated;
grant select, insert, delete on public.user_noctis_saved_documents to authenticated;

drop policy if exists "Users can view their own saved Noctis documents" on public.user_noctis_saved_documents;
drop policy if exists "Users can save their own Noctis documents" on public.user_noctis_saved_documents;
drop policy if exists "Users can delete their own saved Noctis documents" on public.user_noctis_saved_documents;

create policy "Users can view their own saved Noctis documents"
on public.user_noctis_saved_documents
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can save their own Noctis documents"
on public.user_noctis_saved_documents
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete their own saved Noctis documents"
on public.user_noctis_saved_documents
for delete
to authenticated
using (auth.uid() = user_id);
