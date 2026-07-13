-- Move admin authorization out of the user-editable profiles row.
--
-- Existing administrators are copied once from the legacy profile attributes.
-- After this migration, those attributes are display-only legacy data and are
-- never consulted for authorization.

create table if not exists public.admin_memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id) on delete set null
);

comment on table public.admin_memberships is
  'Server-controlled administrator membership. Do not grant client access.';

-- Preserve access for administrators that existed before this migration. New
-- memberships must be managed with the Supabase service role or SQL editor.
insert into public.admin_memberships (user_id)
select profile.id
from public.profiles as profile
where coalesce(to_jsonb(profile)->>'role', '') = 'admin'
   or coalesce(to_jsonb(profile)->>'is_admin', 'false') = 'true'
   or coalesce(to_jsonb(profile)->'roles', '[]'::jsonb) ? 'admin'
on conflict (user_id) do nothing;

alter table public.admin_memberships enable row level security;

-- `if not exists` also supports a partially applied prior deployment. Remove
-- every policy so such a table cannot accidentally expose membership rows.
do $$
declare
  policy_name text;
begin
  for policy_name in
    select policyname
    from pg_catalog.pg_policies
    where schemaname = 'public'
      and tablename = 'admin_memberships'
  loop
    execute format('drop policy if exists %I on public.admin_memberships', policy_name);
  end loop;
end;
$$;

revoke all on table public.admin_memberships from public;
revoke all on table public.admin_memberships from anon;
revoke all on table public.admin_memberships from authenticated;

-- This function deliberately does not inspect public.profiles: authenticated
-- users may update their own profile, while admin_memberships has no client
-- privileges or RLS policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.admin_memberships as membership
    where membership.user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Protect every existing and future profile column whose name denotes an
-- authorization or moderation concern. The explicit list covers the fields
-- already present in this project; the pattern prevents a later field such as
-- "suspension_reason" from silently becoming self-editable.
create or replace function public.prevent_profile_authorization_self_update()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  new_profile jsonb := to_jsonb(new);
  old_profile jsonb := case when tg_op = 'UPDATE' then to_jsonb(old) else '{}'::jsonb end;
  protected_column text;
  changed_protected_columns text[] := array[]::text[];
begin
  -- Service-role and SQL-editor writes have no end-user identity. Membership
  -- changes and moderation are server-controlled operations and remain
  -- available to those trusted paths; authenticated admins are also allowed.
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;

  for protected_column in
    select attribute.attname
    from pg_catalog.pg_attribute as attribute
    where attribute.attrelid = 'public.profiles'::regclass
      and attribute.attnum > 0
      and not attribute.attisdropped
      and (
        attribute.attname = any (array[
          'role', 'roles', 'is_admin',
          'account_status', 'ban_reason', 'banned_at', 'banned_by'
        ])
        or attribute.attname ~* '(^|_)(role|roles|admin|superuser|moderation|moderated|moderator|restrict|restricted|restriction|suspend|suspended|suspension|ban|banned|block|blocked|lock|locked|disable|disabled|deletion|flag|flagged|approval|review|permission|permissions|privilege|privileges|authorization|authorisation|access|security|staff|owner|trusted|verified|entitlement|entitlements|claim|claims)(_|$)'
      )
  loop
    if tg_op = 'INSERT' then
      -- A user-created profile may only carry the ordinary, non-privileged
      -- defaults for the legacy fields. This closes insert-time escalation.
      if protected_column = 'role'
         and coalesce(new_profile ->> protected_column, 'user') <> 'user' then
        raise exception 'Only server-controlled operations can set profile authorization fields.';
      elsif protected_column = 'roles'
         and coalesce(new_profile -> protected_column, '[]'::jsonb) not in ('[]'::jsonb, '["user"]'::jsonb) then
        raise exception 'Only server-controlled operations can set profile authorization fields.';
      elsif protected_column = 'is_admin'
         and coalesce(new_profile ->> protected_column, 'false') <> 'false' then
        raise exception 'Only server-controlled operations can set profile authorization fields.';
      elsif protected_column = 'account_status'
         and coalesce(new_profile ->> protected_column, 'active') <> 'active' then
        raise exception 'Only server-controlled operations can set profile authorization fields.';
      elsif protected_column not in ('role', 'roles', 'is_admin', 'account_status')
         and new_profile -> protected_column is not null
         and new_profile -> protected_column <> 'null'::jsonb then
        raise exception 'Only server-controlled operations can set profile authorization fields.';
      end if;
    elsif new_profile -> protected_column is distinct from old_profile -> protected_column then
      changed_protected_columns := array_append(changed_protected_columns, protected_column);
    end if;
  end loop;

  if tg_op = 'INSERT' then
    return new;
  end if;

  -- Only the supported deletion-request RPC may mark an account pending
  -- deletion. A direct REST update cannot set this transaction-local marker.
  if changed_protected_columns = array['account_status']
     and new_profile ->> 'account_status' = 'pending_deletion'
     and current_setting('app.profile_deletion_request', true) = 'on' then
    return new;
  end if;

  if cardinality(changed_protected_columns) > 0 then
    raise exception 'Only server-controlled operations can update profile authorization fields.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_profile_moderation_self_update on public.profiles;
drop trigger if exists prevent_profile_authorization_self_update on public.profiles;

create trigger prevent_profile_authorization_self_update
before insert or update on public.profiles
for each row
execute function public.prevent_profile_authorization_self_update();

-- Keep the established deletion-request behavior without allowing users to
-- write account_status through a direct REST/profile update. The marker is
-- transaction-local and can only be set by this server-controlled RPC.
create or replace function public.request_account_deletion(
  p_user_email text,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_user_id uuid := auth.uid();
  v_user_email text := left(trim(coalesce(p_user_email, '')), 254);
  v_reason text := left(trim(coalesce(p_reason, '')), 1000);
  v_message text;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if v_user_email = '' then
    v_user_email := left(coalesce(auth.jwt() ->> 'email', 'unknown@astral-veil.local'), 254);
  end if;

  v_message := case
    when v_reason = '' then 'No reason provided.'
    else v_reason
  end;

  perform pg_catalog.set_config('app.profile_deletion_request', 'on', true);

  update public.profiles
  set
    account_status = 'pending_deletion',
    updated_at = now()
  where id = v_user_id;

  insert into public.contact_messages (
    user_id,
    user_email,
    topic,
    subject,
    message,
    status
  )
  values (
    v_user_id,
    v_user_email,
    'Delete Account Request',
    '[Astral Veil] Delete Account Request',
    v_message,
    'new'
  );
end;
$$;

revoke all on function public.request_account_deletion(text, text) from public;
grant execute on function public.request_account_deletion(text, text) to authenticated;
