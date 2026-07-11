-- Reconcile duplicate legacy RLS policies without changing their intended
-- access model. Profile authorization remains enforced by the existing
-- prevent_profile_authorization_self_update trigger.

-- storage.objects / avatars
-- Superseded policies omitted the one-level path and owner checks. Replace
-- both policy generations with one canonical policy per operation.
drop policy if exists "Anyone can view avatars" on storage.objects;
drop policy if exists "Public can read avatar images" on storage.objects;
drop policy if exists "Users can upload own avatars" on storage.objects;
drop policy if exists "Users can upload own avatar images" on storage.objects;
drop policy if exists "Users can update own avatars" on storage.objects;
drop policy if exists "Users can update own avatar images" on storage.objects;
drop policy if exists "Users can delete own avatars" on storage.objects;
drop policy if exists "Users can delete own avatar images" on storage.objects;

create policy "Public can read avatar images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'avatars');

create policy "Users can upload own avatar images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
  and cardinality(storage.foldername(name)) = 1
  and owner_id = auth.uid()::text
);

create policy "Users can update own avatar images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
  and cardinality(storage.foldername(name)) = 1
  and owner_id = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
  and cardinality(storage.foldername(name)) = 1
  and owner_id = auth.uid()::text
);

create policy "Users can delete own avatar images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
  and cardinality(storage.foldername(name)) = 1
  and owner_id = auth.uid()::text
);

-- public.profiles
-- Retain one owner policy per action plus the protected-membership admin
-- policies. The authorization trigger—not an RLS column list—enforces safe
-- profile-field updates.
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can select own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can update own safe profile fields" on public.profiles;
drop policy if exists "Admins can read all profiles" on public.profiles;
drop policy if exists "Admins can select all profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;

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

create policy "Users can update own safe profile fields"
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

create policy "Admins can update all profiles"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Deployment verification: each query should return the canonical policies
-- below and no legacy avatar/profile policy names.
select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and (
    qual like '%avatars%'
    or with_check like '%avatars%'
  )
order by cmd, policyname;

select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'profiles'
order by cmd, policyname;
