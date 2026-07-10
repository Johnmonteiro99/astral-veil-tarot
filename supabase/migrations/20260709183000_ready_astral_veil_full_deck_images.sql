-- Mark the full 78-card Astral Veil deck image sets as ready.
-- This migration only updates existing tarot_deck_cards rows for:
-- - astral-veil-tarot
-- - astral-veil-crimson
--
-- It does not insert cards, delete data, change meanings, or touch legacy decks.

with target_decks(deck_slug) as (
  values
    ('astral-veil-tarot'),
    ('astral-veil-crimson')
),
major_cards(card_number, slug) as (
  values
    (0, 'the-fool'),
    (1, 'the-magician'),
    (2, 'the-high-priestess'),
    (3, 'the-empress'),
    (4, 'the-emperor'),
    (5, 'the-hierophant'),
    (6, 'the-lovers'),
    (7, 'the-chariot'),
    (8, 'strength'),
    (9, 'the-hermit'),
    (10, 'wheel-of-fortune'),
    (11, 'justice'),
    (12, 'the-hanged-man'),
    (13, 'death'),
    (14, 'temperance'),
    (15, 'the-devil'),
    (16, 'the-tower'),
    (17, 'the-star'),
    (18, 'the-moon'),
    (19, 'the-sun'),
    (20, 'judgement'),
    (21, 'the-world')
),
minor_suits(suit) as (
  values
    ('cups'),
    ('wands'),
    ('pentacles'),
    ('swords')
),
minor_ranks(card_number, rank_slug) as (
  values
    (1, 'ace'),
    (2, 'two'),
    (3, 'three'),
    (4, 'four'),
    (5, 'five'),
    (6, 'six'),
    (7, 'seven'),
    (8, 'eight'),
    (9, 'nine'),
    (10, 'ten'),
    (11, 'page'),
    (12, 'knight'),
    (13, 'queen'),
    (14, 'king')
),
expected_images as (
  select
    format('major-%s-%s', lpad(card_number::text, 2, '0'), slug) as card_id,
    'major' as folder,
    lpad(card_number::text, 2, '0') as file_number,
    slug as file_slug
  from major_cards

  union all

  select
    format('%s-%s-%s-of-%s', suit, lpad(card_number::text, 2, '0'), rank_slug, suit) as card_id,
    suit as folder,
    lpad(card_number::text, 2, '0') as file_number,
    format('%s-of-%s', rank_slug, suit) as file_slug
  from minor_suits
  cross join minor_ranks
),
target_images as (
  select
    target_decks.deck_slug,
    expected_images.card_id,
    format(
      'assets/images/cards/%s/%s/%s-%s.png',
      target_decks.deck_slug,
      expected_images.folder,
      expected_images.file_number,
      expected_images.file_slug
    ) as image_path
  from target_decks
  cross join expected_images
)
update public.tarot_deck_cards as deck_card
set
  image_path = target_images.image_path,
  status = 'ready',
  updated_at = now()
from target_images
where deck_card.deck_slug = target_images.deck_slug
  and deck_card.card_id = target_images.card_id;

-- Verification query: should return 78 ready cards for each listed deck.
-- with target_decks(deck_slug) as (
--   values ('astral-veil-tarot'), ('astral-veil-crimson')
-- )
-- select
--   target_decks.deck_slug,
--   count(deck_card.id) filter (where deck_card.status = 'ready') as ready_cards
-- from target_decks
-- left join public.tarot_deck_cards as deck_card
--   on deck_card.deck_slug = target_decks.deck_slug
-- group by target_decks.deck_slug
-- order by target_decks.deck_slug;

-- Verification query: should return 0 null image paths for each listed deck.
-- with target_decks(deck_slug) as (
--   values ('astral-veil-tarot'), ('astral-veil-crimson')
-- )
-- select
--   target_decks.deck_slug,
--   count(deck_card.id) filter (where deck_card.image_path is null) as null_image_paths
-- from target_decks
-- left join public.tarot_deck_cards as deck_card
--   on deck_card.deck_slug = target_decks.deck_slug
-- group by target_decks.deck_slug
-- order by target_decks.deck_slug;
