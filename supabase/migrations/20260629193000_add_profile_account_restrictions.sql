-- Basic admin-controlled account restrictions for Astral Veil v2.
-- Keeps the existing pending_deletion status used by account deletion requests.

alter table public.profiles
  add column if not exists account_status text not null default 'active',
  add column if not exists ban_reason text,
  add column if not exists banned_at timestamptz,
  add column if not exists banned_by uuid references auth.users(id) on delete set null;

update public.profiles
set account_status = 'active'
where account_status is null;

alter table public.profiles
drop constraint if exists profiles_account_status_check;

alter table public.profiles
add constraint profiles_account_status_check
check (account_status in ('active', 'restricted', 'banned', 'pending_deletion'));

-- Users may update safe profile fields, but only admins may change moderation fields.
create or replace function public.prevent_profile_moderation_self_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if new.account_status = 'pending_deletion'
    and new.ban_reason is not distinct from old.ban_reason
    and new.banned_at is not distinct from old.banned_at
    and new.banned_by is not distinct from old.banned_by then
    return new;
  end if;

  if new.account_status is distinct from old.account_status
    or new.ban_reason is distinct from old.ban_reason
    or new.banned_at is distinct from old.banned_at
    or new.banned_by is distinct from old.banned_by then
    raise exception 'Only admins can update account restriction fields.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_profile_moderation_self_update on public.profiles;

create trigger prevent_profile_moderation_self_update
before update on public.profiles
for each row
execute function public.prevent_profile_moderation_self_update();

drop policy if exists "Admins can update profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;

create policy "Admins can update all profiles"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());
