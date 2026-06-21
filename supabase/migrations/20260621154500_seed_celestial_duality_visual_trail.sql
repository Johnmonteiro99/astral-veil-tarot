-- Seed the first real Visual Trail with Supabase Storage image URLs.
-- The Gallery reads these URLs from visual_trails and visual_trail_fragments.

update public.visual_trails
set is_active = false,
    updated_at = now()
where slug = 'the-spiral-beyond-the-veil';

insert into public.visual_trails (
  title,
  slug,
  description,
  lore_note,
  full_image_url,
  preview_image_url,
  total_fragments,
  is_active,
  sort_order
) values (
  'Celestial Duality',
  'celestial-duality',
  'A four-part visual trail recovered from opposing celestial signatures.',
  'Two lights answer from opposite sides of the veil. The Archive will not say which one arrived first.',
  'https://ankqhjibihyakcmfncge.supabase.co/storage/v1/object/public/gallery-records/duality-fragment-full.png',
  'https://ankqhjibihyakcmfncge.supabase.co/storage/v1/object/public/gallery-records/duality-fragment-full.png',
  4,
  true,
  0
)
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  lore_note = excluded.lore_note,
  full_image_url = excluded.full_image_url,
  preview_image_url = excluded.preview_image_url,
  total_fragments = excluded.total_fragments,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.visual_trail_fragments (
  trail_id,
  fragment_number,
  title,
  fragment_image_url,
  hint_text,
  sort_order
)
select
  trail.id,
  fragment.fragment_number,
  fragment.title,
  fragment.fragment_image_url,
  fragment.hint_text,
  fragment.fragment_number
from public.visual_trails trail
cross join (
  values
    (1, 'Duality Fragment 01', 'https://ankqhjibihyakcmfncge.supabase.co/storage/v1/object/public/gallery-records/duality-fragment-01.png', 'The first piece remembers the upper light.'),
    (2, 'Duality Fragment 02', 'https://ankqhjibihyakcmfncge.supabase.co/storage/v1/object/public/gallery-records/duality-fragment-02.png', 'The second piece answers from the lower dark.'),
    (3, 'Duality Fragment 03', 'https://ankqhjibihyakcmfncge.supabase.co/storage/v1/object/public/gallery-records/duality-fragment-03.png', 'The third piece holds the dividing veil.'),
    (4, 'Duality Fragment 04', 'https://ankqhjibihyakcmfncge.supabase.co/storage/v1/object/public/gallery-records/duality-fragment-04.png', 'The fourth piece waits for restoration.')
) as fragment(fragment_number, title, fragment_image_url, hint_text)
where trail.slug = 'celestial-duality'
on conflict (trail_id, fragment_number) do update
set
  title = excluded.title,
  fragment_image_url = excluded.fragment_image_url,
  hint_text = excluded.hint_text,
  sort_order = excluded.sort_order;
