# Asset Migration Notes

This pass copied assets into cleaner folders, updated hardcoded frontend references, and kept all old folders/files as fallback.

No existing asset files were deleted, moved, or renamed.

## Path Migrations

| Old path | New path |
| --- | --- |
| `assets/images/background _images/` | `assets/images/backgrounds/` |
| `assets/images/cards/original/` | `assets/images/cards/legacy/original/` |
| `assets/images/cards/blood-moon/` | `assets/images/cards/legacy/blood-moon/` |
| `assets/images/cards/moonveil/` | `assets/images/cards/legacy/moonveil/` |
| `assets/images/cards/dreamy/` | `assets/images/cards/legacy/dreamy/` |
| `assets/images/cards/Cyber-hacked/` | `assets/images/cards/legacy/cyber-hacked/` |
| `assets/images/cards/lost_chamber/` | `assets/images/cards/legacy/lost-chamber/` |
| `assets/images/cards/veilwalker/` | `assets/images/cards/legacy/veilwalker/` |
| `assets/images/readers/phase1/` | `assets/images/readers/phases/phase-1/` |
| `assets/images/readers/phase2/` | `assets/images/readers/phases/phase-2/` |
| `assets/images/lumen_archive_rooms/` | `assets/images/archive/lumen/rooms/` |
| `assets/images/noctis-header.webp` | `assets/images/archive/noctis/noctis-header.webp` |
| `assets/images/noctis/` | `assets/images/archive/noctis/` |
| `assets/noctis/gallery/` | `assets/images/archive/noctis/gallery/` |
| `assets/images/concepts-ideas/` | `assets/images/concepts/` |
| `assets/icons/noctis_icons/` | `assets/icons/noctis/` |

## Files Updated

- `about.html`
- `admin-login.html`
- `admin.html`
- `archive.html`
- `auth.html`
- `css/archive.css`
- `css/deck.css`
- `css/lumen-archive.css`
- `css/style.css`
- `daily-tarot-reading.html`
- `data/archiveSections.js`
- `data/cards.js`
- `data/decks.js`
- `deck.html`
- `free-daily-tarot-reading.html`
- `free-tarot-reading.html`
- `index.html`
- `js/archive.js`
- `js/lumen-archive.js`
- `js/reading.js`
- `lumen-archive.html`
- `noctis-room.html`
- `one-card-tarot-reading.html`
- `online-tarot-reading.html`
- `readers.html`
- `src/public/account.js`

## Paths Not Rewritten Automatically

These are intentionally left for a separate pass:

- Supabase migration seed paths under `supabase/migrations/`, because those represent stored database values and should be migrated deliberately.
- Historical/generated notes such as `docs/v2-final-smoke-test.md`, `assets-structure.txt`, and gallery README notes under old gallery folders.
- Existing `public/assets/noctis/gallery/` fallback paths.

## Potential Cleanup Issues

Do not fix these until after a full visual QA and path audit:

- `assets/images/background _images/` remains as a fallback but contains a space in the folder name.
- `assets/images/cards/Cyber-hacked/` remains as a fallback but uses uppercase.
- `assets/images/cards/blood-moon/loodmoon-world.webp` may be a typo.
- `assets/images/cards/lost_chamber/` and `assets/images/cards/veilwalker/` appear empty or currently unused.
- Old Major Arcana decks are flat folders while new full decks are suit-based.
- Empty future buckets were created with `.gitkeep`: `assets/icons/ui/`, `assets/icons/tarot/`, `assets/icons/archive/`, `assets/images/archive/lumen/seals/`, `assets/images/archive/lumen/artifacts/`, and `assets/images/archive/noctis/rooms/`.

## Possibly Unused Asset Review

A follow-up review folder was added at:

```text
assets/_review/possibly-unused/
```

High-confidence unused concept/design images were moved there with their original relative paths preserved. See:

```text
assets/images/UNUSED_ASSET_REVIEW.md
```

No active deck/card images, reader images, Noctis gallery/reward images, Lumen room images, Supabase-seeded images, README files, `.gitkeep` files, or new Astral Veil full-deck folders were moved in that review.
