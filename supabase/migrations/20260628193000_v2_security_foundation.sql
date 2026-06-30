-- Astral Veil v2 security foundation.
-- This migration intentionally uses IF EXISTS guards because several private
-- tables were created before the checked-in migration history was complete.
-- It strengthens the tables used by the v2 frontend without creating new data
-- models or changing app behavior.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and (
        to_jsonb(profile)->>'role' = 'admin'
        or to_jsonb(profile)->>'is_admin' = 'true'
        or (to_jsonb(profile)->'roles') ? 'admin'
      )
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

do $$
begin
  if to_regclass('public.profiles') is not null then
    alter table public.profiles enable row level security;

    revoke all on public.profiles from anon;
    revoke all on public.profiles from authenticated;
    grant select, insert, update on public.profiles to authenticated;

    drop policy if exists "Users can view their own profile" on public.profiles;
    drop policy if exists "Users can create their own profile" on public.profiles;
    drop policy if exists "Users can update their own profile" on public.profiles;
    drop policy if exists "Admins can view all profiles" on public.profiles;

    create policy "Users can view their own profile"
    on public.profiles
    for select
    to authenticated
    using (auth.uid() = id);

    create policy "Users can create their own profile"
    on public.profiles
    for insert
    to authenticated
    with check (auth.uid() = id);

    create policy "Users can update their own profile"
    on public.profiles
    for update
    to authenticated
    using (auth.uid() = id)
    with check (auth.uid() = id);

    create policy "Admins can view all profiles"
    on public.profiles
    for select
    to authenticated
    using (public.is_admin());
  end if;
end $$;

do $$
begin
  if to_regclass('public.user_readings') is not null then
    alter table public.user_readings enable row level security;

    revoke all on public.user_readings from anon;
    revoke all on public.user_readings from authenticated;
    grant select, insert, update, delete on public.user_readings to authenticated;

    drop policy if exists "Users can view their own readings" on public.user_readings;
    drop policy if exists "Users can create their own readings" on public.user_readings;
    drop policy if exists "Users can update their own readings" on public.user_readings;
    drop policy if exists "Users can delete their own readings" on public.user_readings;
    drop policy if exists "Admins can view all readings" on public.user_readings;

    create policy "Users can view their own readings"
    on public.user_readings
    for select
    to authenticated
    using (auth.uid() = user_id);

    create policy "Users can create their own readings"
    on public.user_readings
    for insert
    to authenticated
    with check (auth.uid() = user_id);

    create policy "Users can update their own readings"
    on public.user_readings
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

    create policy "Users can delete their own readings"
    on public.user_readings
    for delete
    to authenticated
    using (auth.uid() = user_id);

    create policy "Admins can view all readings"
    on public.user_readings
    for select
    to authenticated
    using (public.is_admin());
  end if;
end $$;

do $$
begin
  if to_regclass('public.user_journal_entries') is not null then
    alter table public.user_journal_entries enable row level security;

    revoke all on public.user_journal_entries from anon;
    revoke all on public.user_journal_entries from authenticated;
    grant select, insert, update, delete on public.user_journal_entries to authenticated;

    drop policy if exists "Users can view their own journal entries" on public.user_journal_entries;
    drop policy if exists "Users can create their own journal entries" on public.user_journal_entries;
    drop policy if exists "Users can update their own journal entries" on public.user_journal_entries;
    drop policy if exists "Users can delete their own journal entries" on public.user_journal_entries;
    drop policy if exists "Admins can view all journal entries" on public.user_journal_entries;

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

    create policy "Admins can view all journal entries"
    on public.user_journal_entries
    for select
    to authenticated
    using (public.is_admin());
  end if;
end $$;

do $$
begin
  if to_regclass('public.user_artifacts') is not null then
    alter table public.user_artifacts enable row level security;

    revoke all on public.user_artifacts from anon;
    revoke all on public.user_artifacts from authenticated;
    grant select, insert, update, delete on public.user_artifacts to authenticated;

    drop policy if exists "Users can view their own artifacts" on public.user_artifacts;
    drop policy if exists "Users can create their own artifacts" on public.user_artifacts;
    drop policy if exists "Users can update their own artifacts" on public.user_artifacts;
    drop policy if exists "Users can delete their own artifacts" on public.user_artifacts;
    drop policy if exists "Admins can view all user artifacts" on public.user_artifacts;

    create policy "Users can view their own artifacts"
    on public.user_artifacts
    for select
    to authenticated
    using (auth.uid() = user_id);

    create policy "Users can create their own artifacts"
    on public.user_artifacts
    for insert
    to authenticated
    with check (auth.uid() = user_id);

    create policy "Users can update their own artifacts"
    on public.user_artifacts
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

    create policy "Users can delete their own artifacts"
    on public.user_artifacts
    for delete
    to authenticated
    using (auth.uid() = user_id);

    create policy "Admins can view all user artifacts"
    on public.user_artifacts
    for select
    to authenticated
    using (public.is_admin());
  end if;
end $$;

do $$
begin
  if to_regclass('public.user_rooms') is not null then
    alter table public.user_rooms enable row level security;

    revoke all on public.user_rooms from anon;
    revoke all on public.user_rooms from authenticated;
    grant select, insert, update, delete on public.user_rooms to authenticated;

    drop policy if exists "Users can view their own rooms" on public.user_rooms;
    drop policy if exists "Users can create their own rooms" on public.user_rooms;
    drop policy if exists "Users can update their own rooms" on public.user_rooms;
    drop policy if exists "Users can delete their own rooms" on public.user_rooms;
    drop policy if exists "Admins can view all user rooms" on public.user_rooms;

    create policy "Users can view their own rooms"
    on public.user_rooms
    for select
    to authenticated
    using (auth.uid() = user_id);

    create policy "Users can create their own rooms"
    on public.user_rooms
    for insert
    to authenticated
    with check (auth.uid() = user_id);

    create policy "Users can update their own rooms"
    on public.user_rooms
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

    create policy "Users can delete their own rooms"
    on public.user_rooms
    for delete
    to authenticated
    using (auth.uid() = user_id);

    create policy "Admins can view all user rooms"
    on public.user_rooms
    for select
    to authenticated
    using (public.is_admin());
  end if;
end $$;
