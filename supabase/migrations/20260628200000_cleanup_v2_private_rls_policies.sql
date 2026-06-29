-- Astral Veil v2 RLS cleanup.
-- Deduplicates owner policies on private user tables and tightens
-- user_visual_trail_fragments so fragment recovery state is authenticated-only.
-- This migration does not create tables or change data models.

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
    drop policy if exists "Users can select own profile" on public.profiles;
    drop policy if exists "Users can insert own profile" on public.profiles;
    drop policy if exists "Users can update own profile" on public.profiles;
    drop policy if exists "Admins can view all profiles" on public.profiles;
    drop policy if exists "Admins can select all profiles" on public.profiles;
    drop policy if exists "Admins can update profiles" on public.profiles;

    create policy "Users can select own profile"
    on public.profiles
    for select
    to authenticated
    using (auth.uid() = id);

    create policy "Users can insert own profile"
    on public.profiles
    for insert
    to authenticated
    with check (auth.uid() = id);

    create policy "Users can update own profile"
    on public.profiles
    for update
    to authenticated
    using (auth.uid() = id)
    with check (auth.uid() = id);

    create policy "Admins can select all profiles"
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
    drop policy if exists "Users can select own readings" on public.user_readings;
    drop policy if exists "Users can insert own readings" on public.user_readings;
    drop policy if exists "Users can update own readings" on public.user_readings;
    drop policy if exists "Users can delete own readings" on public.user_readings;
    drop policy if exists "Admins can view all readings" on public.user_readings;
    drop policy if exists "Admins can select all readings" on public.user_readings;

    create policy "Users can select own readings"
    on public.user_readings
    for select
    to authenticated
    using (auth.uid() = user_id);

    create policy "Users can insert own readings"
    on public.user_readings
    for insert
    to authenticated
    with check (auth.uid() = user_id);

    create policy "Users can update own readings"
    on public.user_readings
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

    create policy "Users can delete own readings"
    on public.user_readings
    for delete
    to authenticated
    using (auth.uid() = user_id);

    create policy "Admins can select all readings"
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
    drop policy if exists "Users can select own journal entries" on public.user_journal_entries;
    drop policy if exists "Users can insert own journal entries" on public.user_journal_entries;
    drop policy if exists "Users can update own journal entries" on public.user_journal_entries;
    drop policy if exists "Users can delete own journal entries" on public.user_journal_entries;
    drop policy if exists "Admins can view all journal entries" on public.user_journal_entries;
    drop policy if exists "Admins can select all journal entries" on public.user_journal_entries;

    create policy "Users can select own journal entries"
    on public.user_journal_entries
    for select
    to authenticated
    using (auth.uid() = user_id);

    create policy "Users can insert own journal entries"
    on public.user_journal_entries
    for insert
    to authenticated
    with check (auth.uid() = user_id);

    create policy "Users can update own journal entries"
    on public.user_journal_entries
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

    create policy "Users can delete own journal entries"
    on public.user_journal_entries
    for delete
    to authenticated
    using (auth.uid() = user_id);

    create policy "Admins can select all journal entries"
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
    drop policy if exists "Users can select own artifacts" on public.user_artifacts;
    drop policy if exists "Users can insert own artifacts" on public.user_artifacts;
    drop policy if exists "Users can update own artifacts" on public.user_artifacts;
    drop policy if exists "Users can delete own artifacts" on public.user_artifacts;
    drop policy if exists "Admins can view all user artifacts" on public.user_artifacts;
    drop policy if exists "Admins can select all user artifacts" on public.user_artifacts;

    create policy "Users can select own artifacts"
    on public.user_artifacts
    for select
    to authenticated
    using (auth.uid() = user_id);

    create policy "Users can insert own artifacts"
    on public.user_artifacts
    for insert
    to authenticated
    with check (auth.uid() = user_id);

    create policy "Users can update own artifacts"
    on public.user_artifacts
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

    create policy "Users can delete own artifacts"
    on public.user_artifacts
    for delete
    to authenticated
    using (auth.uid() = user_id);

    create policy "Admins can select all user artifacts"
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
    drop policy if exists "Users can select own rooms" on public.user_rooms;
    drop policy if exists "Users can insert own rooms" on public.user_rooms;
    drop policy if exists "Users can update own rooms" on public.user_rooms;
    drop policy if exists "Users can delete own rooms" on public.user_rooms;
    drop policy if exists "Admins can view all user rooms" on public.user_rooms;
    drop policy if exists "Admins can select all user rooms" on public.user_rooms;

    create policy "Users can select own rooms"
    on public.user_rooms
    for select
    to authenticated
    using (auth.uid() = user_id);

    create policy "Users can insert own rooms"
    on public.user_rooms
    for insert
    to authenticated
    with check (auth.uid() = user_id);

    create policy "Users can update own rooms"
    on public.user_rooms
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

    create policy "Users can delete own rooms"
    on public.user_rooms
    for delete
    to authenticated
    using (auth.uid() = user_id);

    create policy "Admins can select all user rooms"
    on public.user_rooms
    for select
    to authenticated
    using (public.is_admin());
  end if;
end $$;

do $$
begin
  if to_regclass('public.user_room_visits') is not null then
    alter table public.user_room_visits enable row level security;

    revoke all on public.user_room_visits from anon;
    revoke all on public.user_room_visits from authenticated;
    grant select, insert, update on public.user_room_visits to authenticated;

    drop policy if exists "Users can view their own room visits" on public.user_room_visits;
    drop policy if exists "Users can create their own room visits" on public.user_room_visits;
    drop policy if exists "Users can update their own room visits" on public.user_room_visits;
    drop policy if exists "Users can select own room visits" on public.user_room_visits;
    drop policy if exists "Users can insert own room visits" on public.user_room_visits;
    drop policy if exists "Users can update own room visits" on public.user_room_visits;
    drop policy if exists "Admins can view all room visits" on public.user_room_visits;
    drop policy if exists "Admins can select all room visits" on public.user_room_visits;

    create policy "Users can select own room visits"
    on public.user_room_visits
    for select
    to authenticated
    using (auth.uid() = user_id);

    create policy "Users can insert own room visits"
    on public.user_room_visits
    for insert
    to authenticated
    with check (auth.uid() = user_id);

    create policy "Users can update own room visits"
    on public.user_room_visits
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

    create policy "Admins can select all room visits"
    on public.user_room_visits
    for select
    to authenticated
    using (public.is_admin());
  end if;
end $$;

do $$
begin
  if to_regclass('public.user_discoveries') is not null then
    alter table public.user_discoveries enable row level security;

    revoke all on public.user_discoveries from anon;
    revoke all on public.user_discoveries from authenticated;
    grant select, insert on public.user_discoveries to authenticated;

    drop policy if exists "Users can view their own discoveries" on public.user_discoveries;
    drop policy if exists "Users can create their own discoveries" on public.user_discoveries;
    drop policy if exists "Users can select own discoveries" on public.user_discoveries;
    drop policy if exists "Users can insert own discoveries" on public.user_discoveries;
    drop policy if exists "Admins can view all discoveries" on public.user_discoveries;
    drop policy if exists "Admins can select all discoveries" on public.user_discoveries;

    create policy "Users can select own discoveries"
    on public.user_discoveries
    for select
    to authenticated
    using (auth.uid() = user_id);

    create policy "Users can insert own discoveries"
    on public.user_discoveries
    for insert
    to authenticated
    with check (auth.uid() = user_id);

    create policy "Admins can select all discoveries"
    on public.user_discoveries
    for select
    to authenticated
    using (public.is_admin());
  end if;
end $$;

do $$
begin
  if to_regclass('public.user_profile_unlocks') is not null then
    alter table public.user_profile_unlocks enable row level security;

    revoke all on public.user_profile_unlocks from anon;
    revoke all on public.user_profile_unlocks from authenticated;
    grant select, insert on public.user_profile_unlocks to authenticated;

    drop policy if exists "Users can view their own profile unlocks" on public.user_profile_unlocks;
    drop policy if exists "Users can create their own profile unlocks" on public.user_profile_unlocks;
    drop policy if exists "Users can select own profile unlocks" on public.user_profile_unlocks;
    drop policy if exists "Users can insert own profile unlocks" on public.user_profile_unlocks;
    drop policy if exists "Admins can view all profile unlocks" on public.user_profile_unlocks;
    drop policy if exists "Admins can select all profile unlocks" on public.user_profile_unlocks;

    create policy "Users can select own profile unlocks"
    on public.user_profile_unlocks
    for select
    to authenticated
    using (auth.uid() = user_id);

    create policy "Users can insert own profile unlocks"
    on public.user_profile_unlocks
    for insert
    to authenticated
    with check (auth.uid() = user_id);

    create policy "Admins can select all profile unlocks"
    on public.user_profile_unlocks
    for select
    to authenticated
    using (public.is_admin());
  end if;
end $$;

do $$
begin
  if to_regclass('public.user_noctis_saved_documents') is not null then
    alter table public.user_noctis_saved_documents enable row level security;

    revoke all on public.user_noctis_saved_documents from anon;
    revoke all on public.user_noctis_saved_documents from authenticated;
    grant select, insert, delete on public.user_noctis_saved_documents to authenticated;

    drop policy if exists "Users can view their own saved Noctis documents" on public.user_noctis_saved_documents;
    drop policy if exists "Users can save their own Noctis documents" on public.user_noctis_saved_documents;
    drop policy if exists "Users can delete their own saved Noctis documents" on public.user_noctis_saved_documents;
    drop policy if exists "Users can select own Noctis documents" on public.user_noctis_saved_documents;
    drop policy if exists "Users can insert own Noctis documents" on public.user_noctis_saved_documents;
    drop policy if exists "Users can delete own Noctis documents" on public.user_noctis_saved_documents;

    create policy "Users can select own Noctis documents"
    on public.user_noctis_saved_documents
    for select
    to authenticated
    using (auth.uid() = user_id);

    create policy "Users can insert own Noctis documents"
    on public.user_noctis_saved_documents
    for insert
    to authenticated
    with check (auth.uid() = user_id);

    create policy "Users can delete own Noctis documents"
    on public.user_noctis_saved_documents
    for delete
    to authenticated
    using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if to_regclass('public.user_gallery_fragments') is not null then
    alter table public.user_gallery_fragments enable row level security;

    revoke all on public.user_gallery_fragments from anon;
    revoke all on public.user_gallery_fragments from authenticated;
    grant select, insert, delete on public.user_gallery_fragments to authenticated;

    drop policy if exists "Users can view their own gallery fragments" on public.user_gallery_fragments;
    drop policy if exists "Users can collect their own gallery fragments" on public.user_gallery_fragments;
    drop policy if exists "Users can delete their own gallery fragments" on public.user_gallery_fragments;
    drop policy if exists "Users can select own gallery fragments" on public.user_gallery_fragments;
    drop policy if exists "Users can insert own gallery fragments" on public.user_gallery_fragments;
    drop policy if exists "Users can delete own gallery fragments" on public.user_gallery_fragments;

    create policy "Users can select own gallery fragments"
    on public.user_gallery_fragments
    for select
    to authenticated
    using (auth.uid() = user_id);

    create policy "Users can insert own gallery fragments"
    on public.user_gallery_fragments
    for insert
    to authenticated
    with check (auth.uid() = user_id);

    create policy "Users can delete own gallery fragments"
    on public.user_gallery_fragments
    for delete
    to authenticated
    using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if to_regclass('public.user_gallery_recent_records') is not null then
    alter table public.user_gallery_recent_records enable row level security;

    revoke all on public.user_gallery_recent_records from anon;
    revoke all on public.user_gallery_recent_records from authenticated;
    grant select, insert, update, delete on public.user_gallery_recent_records to authenticated;

    drop policy if exists "Users can view their own recent gallery records" on public.user_gallery_recent_records;
    drop policy if exists "Users can create their own recent gallery records" on public.user_gallery_recent_records;
    drop policy if exists "Users can update their own recent gallery records" on public.user_gallery_recent_records;
    drop policy if exists "Users can select own recent gallery records" on public.user_gallery_recent_records;
    drop policy if exists "Users can insert own recent gallery records" on public.user_gallery_recent_records;
    drop policy if exists "Users can update own recent gallery records" on public.user_gallery_recent_records;
    drop policy if exists "Users can delete own recent gallery records" on public.user_gallery_recent_records;

    create policy "Users can select own recent gallery records"
    on public.user_gallery_recent_records
    for select
    to authenticated
    using (auth.uid() = user_id);

    create policy "Users can insert own recent gallery records"
    on public.user_gallery_recent_records
    for insert
    to authenticated
    with check (auth.uid() = user_id);

    create policy "Users can update own recent gallery records"
    on public.user_gallery_recent_records
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

    create policy "Users can delete own recent gallery records"
    on public.user_gallery_recent_records
    for delete
    to authenticated
    using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if to_regclass('public.user_gallery_marked_records') is not null then
    alter table public.user_gallery_marked_records enable row level security;

    revoke all on public.user_gallery_marked_records from anon;
    revoke all on public.user_gallery_marked_records from authenticated;
    grant select, insert, delete on public.user_gallery_marked_records to authenticated;

    drop policy if exists "Users can view their own marked gallery records" on public.user_gallery_marked_records;
    drop policy if exists "Users can create their own marked gallery records" on public.user_gallery_marked_records;
    drop policy if exists "Users can delete their own marked gallery records" on public.user_gallery_marked_records;
    drop policy if exists "Users can select own marked gallery records" on public.user_gallery_marked_records;
    drop policy if exists "Users can insert own marked gallery records" on public.user_gallery_marked_records;
    drop policy if exists "Users can delete own marked gallery records" on public.user_gallery_marked_records;

    create policy "Users can select own marked gallery records"
    on public.user_gallery_marked_records
    for select
    to authenticated
    using (auth.uid() = user_id);

    create policy "Users can insert own marked gallery records"
    on public.user_gallery_marked_records
    for insert
    to authenticated
    with check (auth.uid() = user_id);

    create policy "Users can delete own marked gallery records"
    on public.user_gallery_marked_records
    for delete
    to authenticated
    using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if to_regclass('public.user_visual_trail_fragments') is not null then
    alter table public.user_visual_trail_fragments enable row level security;

    revoke all on public.user_visual_trail_fragments from anon;
    revoke all on public.user_visual_trail_fragments from authenticated;
    grant select, insert on public.user_visual_trail_fragments to authenticated;

    drop policy if exists "Users can view their own visual trail fragments" on public.user_visual_trail_fragments;
    drop policy if exists "Users can recover their own visual trail fragments" on public.user_visual_trail_fragments;
    drop policy if exists "Users can select own visual trail fragments" on public.user_visual_trail_fragments;
    drop policy if exists "Users can insert own visual trail fragments" on public.user_visual_trail_fragments;
    drop policy if exists "Users can delete own visual trail fragments" on public.user_visual_trail_fragments;

    create policy "Users can select own visual trail fragments"
    on public.user_visual_trail_fragments
    for select
    to authenticated
    using (auth.uid() = user_id);

    create policy "Users can insert own visual trail fragments"
    on public.user_visual_trail_fragments
    for insert
    to authenticated
    with check (auth.uid() = user_id);
  end if;
end $$;
