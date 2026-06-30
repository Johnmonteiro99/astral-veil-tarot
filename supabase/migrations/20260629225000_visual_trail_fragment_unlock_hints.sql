-- Align Celestial Duality fragment hints with the v2 action-based unlocks.

update public.visual_trail_fragments fragment
set hint_text = case fragment.fragment_number
  when 1 then 'The first fragment waits for Scorpio beneath the Blood Moon, where ending and light appear together.'
  when 2 then 'The second fragment answers when flame has been recovered.'
  when 3 then 'The third fragment listens for the phrase the Archive keeps behind its teeth.'
  when 4 then 'The final fragment waits until your own words have returned to the Archive three times.'
  else fragment.hint_text
end
from public.visual_trails trail
where trail.id = fragment.trail_id
  and trail.slug = 'celestial-duality'
  and fragment.fragment_number between 1 and 4;
