-- Integration checks for 20260711120000_protect_admin_authorization.sql.
--
-- Run with psql against a non-production Supabase database:
--   psql "$DATABASE_URL" \
--     -v user_a_id='UUID-OF-ORDINARY-USER-A' \
--     -v admin_id='UUID-OF-ADMIN-MEMBERSHIP-USER' \
--     -f supabase/tests/admin_authorization_rls.sql
--
-- Both IDs must already have profiles. The admin ID must be in
-- public.admin_memberships. The transaction always rolls back.

\set ON_ERROR_STOP on

begin;

-- User A: self-promotion and a direct Supabase-equivalent moderation request
-- must be rejected by the database trigger, not by the browser.
set local role authenticated;
select set_config('request.jwt.claim.sub', :'user_a_id', true);

do $$
begin
  begin
    update public.profiles
    set role = 'admin', roles = '["admin"]'::jsonb, is_admin = true
    where id = current_setting('request.jwt.claim.sub')::uuid;
    raise exception 'User A self-promotion unexpectedly succeeded';
  exception
    when others then
      if sqlerrm not like 'Only server-controlled operations can update profile authorization fields.%' then
        raise;
      end if;
  end;
end;
$$;

do $$
begin
  begin
    update public.profiles
    set account_status = 'pending_deletion'
    where id = current_setting('request.jwt.claim.sub')::uuid;
    raise exception 'User A direct deletion-status update unexpectedly succeeded';
  exception
    when others then
      if sqlerrm not like 'Only server-controlled operations can update profile authorization fields.%' then
        raise;
      end if;
  end;
end;
$$;

do $$
begin
  begin
    update public.profiles
    set account_status = 'banned', ban_reason = 'forged through direct API'
    where id = current_setting('request.jwt.claim.sub')::uuid;
    raise exception 'User A direct moderation update unexpectedly succeeded';
  exception
    when others then
      if sqlerrm not like 'Only server-controlled operations can update profile authorization fields.%' then
        raise;
      end if;
  end;
end;
$$;

-- Safe profile data remains editable by its owner.
update public.profiles
set display_name = 'User A security test', biography = 'Safe profile edit'
where id = current_setting('request.jwt.claim.sub')::uuid;

select public.request_account_deletion('user-a-security-test@example.test', 'Integration test');

do $$
begin
  if not exists (
    select 1
    from public.profiles
    where id = current_setting('request.jwt.claim.sub')::uuid
      and account_status = 'pending_deletion'
  ) then
    raise exception 'Supported deletion-request RPC did not update User A';
  end if;
end;
$$;

do $$
declare
  memberships jsonb;
begin
  begin
    select jsonb_agg(to_jsonb(membership)) into memberships
    from public.admin_memberships as membership;
    raise exception 'User A could read admin_memberships: %', memberships;
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

do $$
begin
  begin
    insert into public.admin_memberships (user_id)
    values (current_setting('request.jwt.claim.sub')::uuid);
    raise exception 'User A could insert an admin membership';
  exception
    when insufficient_privilege then null;
  end;

  begin
    update public.admin_memberships
    set granted_at = now();
    raise exception 'User A could update an admin membership';
  exception
    when insufficient_privilege then null;
  end;

  begin
    delete from public.admin_memberships;
    raise exception 'User A could delete an admin membership';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

reset role;

-- A genuine membership grants is_admin() and the existing admin RLS policy.
set local role authenticated;
select set_config('request.jwt.claim.sub', :'admin_id', true);

do $$
begin
  if not public.is_admin() then
    raise exception 'Protected admin membership was not recognized';
  end if;
end;
$$;

update public.profiles
set account_status = 'restricted', ban_reason = 'Admin integration test'
where id = :'user_a_id'::uuid;

reset role;
rollback;
