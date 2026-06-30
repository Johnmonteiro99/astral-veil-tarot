-- Allow authenticated admins to manage Noctis Gallery records and upload images.
-- This is scoped to gallery_records and the existing gallery-records storage bucket.

grant select, insert, update on public.gallery_records to authenticated;

drop policy if exists "Admins can read all gallery records" on public.gallery_records;
drop policy if exists "Admins can create gallery records" on public.gallery_records;
drop policy if exists "Admins can update gallery records" on public.gallery_records;

create policy "Admins can read all gallery records"
on public.gallery_records
for select
to authenticated
using (public.is_admin());

create policy "Admins can create gallery records"
on public.gallery_records
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update gallery records"
on public.gallery_records
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read gallery record uploads" on storage.objects;
drop policy if exists "Admins can upload gallery record images" on storage.objects;
drop policy if exists "Admins can update gallery record images" on storage.objects;
drop policy if exists "Admins can delete gallery record images" on storage.objects;

create policy "Admins can read gallery record uploads"
on storage.objects
for select
to authenticated
using (bucket_id = 'gallery-records' and public.is_admin());

create policy "Admins can upload gallery record images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'gallery-records' and public.is_admin());

create policy "Admins can update gallery record images"
on storage.objects
for update
to authenticated
using (bucket_id = 'gallery-records' and public.is_admin())
with check (bucket_id = 'gallery-records' and public.is_admin());

create policy "Admins can delete gallery record images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'gallery-records' and public.is_admin());
