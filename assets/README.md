# Astral Veil Asset Structure

This directory keeps public static assets for the Astral Veil site.

This migration is copy-first. Legacy folders remain in place as fallbacks until the site has been fully tested and a later cleanup pass removes old paths deliberately.

## Current Organization

```text
assets/
  icons/
    archive/
    noctis/
    symbols/
    tarot/
    ui/
    zodiac/

  images/
    archive/
      lumen/
      noctis/
    backgrounds/
    cards/
    concepts/
    readers/
    unlockables/
```

## Safety Rules

- Do not delete legacy folders in the same pass that updates references.
- Do not rename assets without checking every HTML, CSS, JS, data, and Supabase-stored reference.
- Keep public frontend assets separate from protected content.
- Do not store real Noctis unlock codes, paid deck lore, or premium-only tarot extras in public assets.
- Supabase-stored asset paths should be migrated through a deliberate database migration or admin workflow, not guessed from frontend code.

## Legacy Fallbacks

The previous folders are still present for rollback and compatibility while testing continues, including:

- `assets/images/background _images/`
- `assets/images/cards/original/`
- `assets/images/cards/blood-moon/`
- `assets/images/cards/moonveil/`
- `assets/images/cards/dreamy/`
- `assets/images/cards/Cyber-hacked/`
- `assets/images/lumen_archive_rooms/`
- `assets/images/noctis/`
- `assets/noctis/gallery/`

