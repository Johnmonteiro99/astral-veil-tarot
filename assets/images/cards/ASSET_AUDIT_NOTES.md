# Tarot Card Asset Audit Notes

## Existing Legacy Deck Folders Found

- `blood-moon`
- `Cyber-hacked`
- `dreamy`
- `lost_chamber`
- `moonveil`
- `original`
- `veilwalker`

These folders are legacy/current assets and should remain untouched until a full path audit and migration plan are complete.

## New Full Deck Folders Found

- `astral-veil-tarot`
- `astral-veil-crimson`

Both new full deck folders include:

- `back/`
- `major/`
- `wands/`
- `cups/`
- `swords/`
- `pentacles/`

## Potential Cleanup Issues

Do not fix these yet without a path audit:

- `assets/images/background _images` contains a space in the folder name.
- `assets/images/cards/Cyber-hacked` uses uppercase.
- `assets/images/cards/blood-moon/loodmoon-world.webp` may be a typo.
- `lost_chamber` and `veilwalker` card folders appear empty or currently unused.
- Old Major Arcana decks are flat folders while new full decks are suit-based.

