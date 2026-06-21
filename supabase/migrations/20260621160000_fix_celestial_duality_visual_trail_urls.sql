-- Correct Celestial Duality Visual Trail image URLs to match the Supabase
-- Storage folder path in the gallery-records bucket.

update public.visual_trails
set
  full_image_url = 'https://ankqhjibihyakcmfncge.supabase.co/storage/v1/object/public/gallery-records/visual-trails/celestial-duality/duality-fragment-full.png',
  preview_image_url = 'https://ankqhjibihyakcmfncge.supabase.co/storage/v1/object/public/gallery-records/visual-trails/celestial-duality/duality-fragment-full.png',
  updated_at = now()
where slug = 'celestial-duality';

update public.visual_trail_fragments fragment
set fragment_image_url = case fragment.fragment_number
  when 1 then 'https://ankqhjibihyakcmfncge.supabase.co/storage/v1/object/public/gallery-records/visual-trails/celestial-duality/duality-fragment-01.png'
  when 2 then 'https://ankqhjibihyakcmfncge.supabase.co/storage/v1/object/public/gallery-records/visual-trails/celestial-duality/duality-fragment-02.png'
  when 3 then 'https://ankqhjibihyakcmfncge.supabase.co/storage/v1/object/public/gallery-records/visual-trails/celestial-duality/duality-fragment-03.png'
  when 4 then 'https://ankqhjibihyakcmfncge.supabase.co/storage/v1/object/public/gallery-records/visual-trails/celestial-duality/duality-fragment-04.png'
  else fragment.fragment_image_url
end
from public.visual_trails trail
where fragment.trail_id = trail.id
  and trail.slug = 'celestial-duality';
