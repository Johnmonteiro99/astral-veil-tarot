# Tarot Card Asset Conventions

This folder contains current live deck assets, legacy fallback copies, and the new standard folders for future tarot decks.

Do not move, rename, or delete existing deck folders unless a path audit has been completed first. Live UI may reference current asset paths directly.

## New Deck Folder Naming

Use lowercase kebab-case only.

Examples:

- `astral-veil-tarot`
- `astral-veil-crimson`
- `future-paid-deck`

## Full Deck Folder Structure

Use this structure for full 78-card tarot decks:

```text
deck-slug/
  back/
  major/
  wands/
  cups/
  swords/
  pentacles/
```

## Major-Only Deck Folder Structure

Use this structure for future Major Arcana-only decks:

```text
deck-slug/
  back/
  major/
```

## Card Image Naming

Use lowercase kebab-case filenames.

Major Arcana:

```text
major/00-the-fool.png
major/01-the-magician.png
major/02-the-high-priestess.png
...
major/21-the-world.png
```

Minor Arcana:

```text
wands/01-ace-of-wands.png
wands/02-two-of-wands.png
...
wands/14-king-of-wands.png

cups/01-ace-of-cups.png
cups/02-two-of-cups.png
...
cups/14-king-of-cups.png

swords/01-ace-of-swords.png
swords/02-two-of-swords.png
...
swords/14-king-of-swords.png

pentacles/01-ace-of-pentacles.png
pentacles/02-two-of-pentacles.png
...
pentacles/14-king-of-pentacles.png
```

## Card Backs

Use one of these patterns:

```text
back/deck-slug-card-back.png
back/astral-veil-card-back.png
```

Use `back/astral-veil-card-back.png` only when a paired deck intentionally shares the same card back naming convention.

## Meaning And Protected Content

Do not store meanings, premium lore, unlock codes, or paid deck extras in image folders.

Reusable card meanings live in Supabase `tarot_card_meanings`.

Deck-specific extras live in Supabase `tarot_deck_card_extras`.

Real Noctis unlock codes must never be stored in public assets or frontend JavaScript.

## Legacy Folders

Existing top-level deck folders are treated as legacy/current fallback assets and are not being removed yet.

Copied legacy deck assets live under:

```text
legacy/
  original/
  blood-moon/
  moonveil/
  dreamy/
  cyber-hacked/
  lost-chamber/
  veilwalker/
```

Any future migration should be done with a path audit first.

## Current Full Deck Folders

The new full deck folders remain outside `legacy/`:

```text
astral-veil-tarot/
  back/
  major/
  wands/
  cups/
  swords/
  pentacles/

astral-veil-crimson/
  back/
  major/
  wands/
  cups/
  swords/
  pentacles/
```

