-- Request account deletion without deleting the Supabase Auth user from the frontend.
-- Apply with Supabase migrations or paste into the Supabase SQL editor.

alter table public.profiles
  add column if not exists account_status text not null default 'active',
  add column if not exists updated_at timestamptz not null default now();

update public.profiles
set account_status = 'active'
where account_status is null;

create or replace function public.request_account_deletion(
  p_user_email text,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
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
