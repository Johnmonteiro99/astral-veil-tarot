-- Populate narrative lore for existing Noctis Gallery records.
-- This migration is intentionally slug-based and only updates descriptive text.

update public.gallery_records
set
  description = 'A portrait recovered from a room where the candles were still warm.',
  lore_note = 'A candlelit witness preserved in red shadow. The face appears only when the flame leans toward the glass, as if the portrait is waiting for the room to breathe again.',
  updated_at = now()
where slug = 'the-candlelit-witness';

update public.gallery_records
set
  description = 'A ruined coast under a blood-red moon, cataloged before the tide erased the stones.',
  lore_note = 'The moon returns to the shore that forgot its own name. This record was recovered from a fractured signal near the Memory Chamber.',
  updated_at = now()
where slug = 'the-red-shore-beneath-noctis';

update public.gallery_records
set
  description = 'An instrument of brass and shadow, recovered from a study that tracked impossible stars.',
  lore_note = 'An instrument found among dark charts and candle ash. Its rings suggest it measured more than stars.',
  updated_at = now()
where slug = 'the-astrolabe-of-noctis';

update public.gallery_records
set
  description = 'A moonlit forest path that resists daylight in every recovered exposure.',
  lore_note = 'No dawn has crossed this threshold and remained intact. Each copy of the image darkens at the path''s edge, as though the forest is still refusing the sun.',
  updated_at = now()
where slug = 'the-path-that-refused-the-sun';

update public.gallery_records
set
  description = 'Sea-battered gothic ruins revealed only when the storm pulls the water away.',
  lore_note = 'The stones remember each tide as a warning. The Archive marks this place as recovered, but not returned.',
  updated_at = now()
where slug = 'the-ruins-of-low-tide';

update public.gallery_records
set
  description = 'A solitary watcher appears beneath a moon that does not match any recorded sky.',
  lore_note = 'The origin of this image is uncertain. The Archive only marked it with one word: watcher.',
  updated_at = now()
where slug = 'the-figure-beneath-the-moon';

update public.gallery_records
set
  description = 'A recovered laboratory table left arranged as if its owner intended to return before morning.',
  lore_note = 'The final mixture still throws a blue shadow. Whatever was made here was removed before the Archive learned whether it was medicine, poison, or invitation.',
  updated_at = now()
where slug = 'the-alchemists-last-table';

update public.gallery_records
set
  description = 'A grimoire of star marks, sealed with a clasp that opens only under red light.',
  lore_note = 'The pages do not describe constellations. They remember them, and several marks repeat in rooms where no sky is visible.',
  updated_at = now()
where slug = 'the-bound-star-index';

update public.gallery_records
set
  description = 'A crowned figure whose adornment appears organic, thorned, and still growing.',
  lore_note = 'The crown did not descend onto the head. It climbed out of it, leaving the Archive uncertain whether this is portraiture or evidence.',
  updated_at = now()
where slug = 'the-crown-that-grew-backward';

update public.gallery_records
set
  description = 'A fiery spiral phenomenon recorded beyond the visible edge of the Veil.',
  lore_note = 'A visual anomaly recovered from a corrupted sequence. It bends inward, as if the image is looking for a door.',
  updated_at = now()
where slug = 'the-spiral-beyond-the-veil';

update public.gallery_records
set
  description = 'A crimson-sky fortress identified in older records as one of Noctis'' outer keeps.',
  lore_note = 'The keep is always seen from below, as though the image itself is kneeling. No record names who still watches from the highest window.',
  updated_at = now()
where slug = 'noctivar-keep';

update public.gallery_records
set
  description = 'A lone rider approaches a distant gothic fortress under hostile moonlight.',
  lore_note = 'The road lengthens each time the record is viewed. The rider never turns back, but the fortress does not appear to grow closer.',
  updated_at = now()
where slug = 'the-road-to-veilspire';

update public.gallery_records
set
  description = 'A cursed-land map connecting Noctis Castle and Veilspire Citadel through unmarked roads.',
  lore_note = 'The cartographer drew the warning first, then the path. Several roads on the map are absent until viewed by candlelight.',
  updated_at = now()
where slug = 'the-road-between-castles';

update public.gallery_records
set
  description = 'A recovered royal portrait from a throne room whose banners have been scratched from the image.',
  lore_note = 'The king is named only by what refuses to bow. The thorns around the crown appear sharper in every restored copy.',
  updated_at = now()
where slug = 'the-thorn-crowned-king';

update public.gallery_records
set
  description = 'A distant citadel fixed beneath a pale moon, indexed as a companion landmark to Noctivar Keep.',
  lore_note = 'The citadel appears closer in every copy, though the road never shortens. The Archive suspects the image records an approach, not a place.',
  updated_at = now()
where slug = 'veilspire-citadel';

update public.gallery_records
set
  description = 'A recovered portrait marked with a partial Noctis family name and no accompanying date.',
  lore_note = 'A portrait recovered from the dark wall of the Gallery. The name Alana Noctis appears in the frame record, but the Archive offers no date, lineage, or reason for why the image survived.',
  updated_at = now()
where slug = 'alana-noctis';

update public.gallery_records
set
  description = 'A second Noctis portrait with a near-matching name, preserved in warmer shadow.',
  lore_note = 'The Archive records the spelling twice and refuses to choose. This likeness may be a sister record, a damaged duplicate, or a deliberate contradiction.',
  updated_at = now()
where slug = 'alanah-noctis';

update public.gallery_records
set
  description = 'A solitary portrait recovered without surname, chamber mark, or witness notation.',
  lore_note = 'Her name arrived before the image did. No surname, chamber mark, or witness notation has answered from the frame.',
  updated_at = now()
where slug = 'veronica';
