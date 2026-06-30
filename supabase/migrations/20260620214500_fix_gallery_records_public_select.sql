-- Ensure public Gallery records can be read by the public client.
-- This is intentionally scoped to gallery_records only; fragment collection
-- tables are not changed in this pass.

alter table public.gallery_records enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.gallery_records to anon, authenticated;

drop policy if exists "Anyone can read active gallery records" on public.gallery_records;
drop policy if exists "Anyone can view active gallery records" on public.gallery_records;

create policy "Anyone can view active gallery records"
on public.gallery_records
for select
to anon, authenticated
using (is_active = true);
