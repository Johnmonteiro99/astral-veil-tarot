-- Contact messages submitted from the Account page.
-- Apply with Supabase migrations or paste into the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text not null,
  topic text not null,
  subject text not null,
  message text not null,
  admin_notes text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_messages
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists user_email text,
  add column if not exists topic text,
  add column if not exists subject text,
  add column if not exists message text,
  add column if not exists admin_notes text,
  add column if not exists status text not null default 'new',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

update public.contact_messages
set status = 'new'
where status is null;

update public.contact_messages
set user_email = 'unknown@astral-veil.local'
where user_email is null;

update public.contact_messages
set topic = 'General Question'
where topic is null;

update public.contact_messages
set subject = '[Astral Veil] General Question'
where subject is null;

update public.contact_messages
set message = 'No message provided.'
where message is null;

update public.contact_messages
set user_email = left(user_email, 254)
where char_length(user_email) > 254;

update public.contact_messages
set subject = left(subject, 160)
where char_length(subject) > 160;

update public.contact_messages
set message = left(message, 5000)
where char_length(message) > 5000;

alter table public.contact_messages
  alter column user_email set not null,
  alter column topic set not null,
  alter column subject set not null,
  alter column message set not null,
  alter column status set not null,
  alter column status set default 'new';

create index if not exists contact_messages_created_at_idx
on public.contact_messages (created_at desc);

create index if not exists contact_messages_status_idx
on public.contact_messages (status);

do $$
begin
  alter table public.contact_messages
    add constraint contact_messages_user_email_length_check
    check (char_length(user_email) <= 254);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.contact_messages
    add constraint contact_messages_subject_length_check
    check (char_length(subject) <= 160);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.contact_messages
    add constraint contact_messages_message_length_check
    check (char_length(message) <= 5000);
exception
  when duplicate_object then null;
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

drop trigger if exists set_contact_messages_updated_at on public.contact_messages;
create trigger set_contact_messages_updated_at
before update on public.contact_messages
for each row
execute function public.set_updated_at();

alter table public.contact_messages enable row level security;

revoke all on public.contact_messages from anon;
revoke all on public.contact_messages from authenticated;

grant insert on public.contact_messages to anon;
grant insert on public.contact_messages to authenticated;
grant select, update on public.contact_messages to authenticated;

drop policy if exists "Public can create contact messages" on public.contact_messages;
drop policy if exists "Users can create contact messages" on public.contact_messages;
drop policy if exists "Users can read their own contact messages" on public.contact_messages;
drop policy if exists "Admins can read contact messages" on public.contact_messages;
drop policy if exists "Admins can update contact messages" on public.contact_messages;

create policy "Public can create contact messages"
on public.contact_messages
for insert
to anon
with check (user_id is null);

create policy "Users can create contact messages"
on public.contact_messages
for insert
to authenticated
with check (user_id is null or user_id = auth.uid());

create policy "Users can read their own contact messages"
on public.contact_messages
for select
to authenticated
using (user_id = auth.uid());

create policy "Admins can read contact messages"
on public.contact_messages
for select
to authenticated
using (public.is_admin());

create policy "Admins can update contact messages"
on public.contact_messages
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());
