-- Reproducible Supabase Storage configuration.
--
-- avatars object names: <auth.uid()>/<filename>
-- gallery-records object names: <collection>/<filename> (for example,
-- featured/record-name.webp or visual-trails/trail-id/fragment-01.png).

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'avatars',
    'avatars',
    true,
    2097152,
    array['image/jpeg', 'image/png', 'image/webp']::text[]
  ),
  (
    'gallery-records',
    'gallery-records',
    true,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp']::text[]
  )
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Remove the prior gallery-only policy names so the complete policy set below
-- is reproducible. Public buckets still need object policies for metadata/API
-- reads; the public flag also permits public object URL delivery.
drop policy if exists "Public can read avatar images" on storage.objects;
drop policy if exists "Users can upload own avatar images" on storage.objects;
drop policy if exists "Users can update own avatar images" on storage.objects;
drop policy if exists "Users can delete own avatar images" on storage.objects;
drop policy if exists "Public can read gallery record images" on storage.objects;
drop policy if exists "Admins can read gallery record uploads" on storage.objects;
drop policy if exists "Admins can upload gallery record images" on storage.objects;
drop policy if exists "Admins can update gallery record images" on storage.objects;
drop policy if exists "Admins can delete gallery record images" on storage.objects;

-- Avatars are publicly readable because profiles store and render their public
-- object URLs. Authenticated users can only write objects directly beneath
-- their own UUID folder, and must own those objects to replace or delete them.
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

-- Gallery images are intentionally public because Gallery/Visual Trail records
-- use public object URLs. Only protected admin membership can manage objects.
create policy "Public can read gallery record images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'gallery-records');

create policy "Admins can upload gallery record images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'gallery-records'
  and cardinality(storage.foldername(name)) >= 1
  and public.is_admin()
);

create policy "Admins can update gallery record images"
on storage.objects
for update
to authenticated
using (bucket_id = 'gallery-records' and public.is_admin())
with check (
  bucket_id = 'gallery-records'
  and cardinality(storage.foldername(name)) >= 1
  and public.is_admin()
);

create policy "Admins can delete gallery record images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'gallery-records' and public.is_admin());
