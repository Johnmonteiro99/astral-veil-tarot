# Tarot Card Detail QA

Date: 2026-07-21  
Working tree: dirty — Tarot implementation and generated output are present as local changes.

## Status

PASS WITH MANUAL FOLLOW-UP

## Automated checks passed

- `npm run generate:cards` — generated 78 canonical Tarot pages and sitemap entries.
- `npm run validate:cards` — passed for 78 generated pages.
- `npm run validate:modal-routes` — passed for 78 canonical preview-modal routes.
- `npm test` — passed.
- `npm run build` — passed.

## Coverage

- Records: 78 total — 22 Major Arcana, 14 Wands, 14 Cups, 14 Swords, and 14 Pentacles.
- Generated routes: 78; sitemap includes the 78 canonical Tarot routes.
- Artwork variants: Veilrise and Veilfall assets are validated by the card-data validator.
- Preview modal: all 78 canonical slug routes are checked by `validate:modal-routes`; legacy internal deck prefixes are rejected by the modal resolver.
- Canonical navigation: generated from canonical sort order, including suit boundaries.
- SEO and FAQ schema: generated with every page and validated during page generation/card-data validation.

## Issues found and fixed today

- The quick-view modal was gated by the obsolete `meaningPageAvailable` flag and displayed a stale coming-soon fallback for completed pages.
- Legacy deck slugs such as `wands-04-four-of-wands` could be selected before the canonical slug, producing 404s.
- The modal now resolves canonical clean paths and route validation covers all 78 generated pages.

## Manual follow-up

The in-app browser is unavailable in this environment, so the following require an interactive local review:

- Desktop and mobile widths: 1440, 1024, 768, 430, 390, and 360 px.
- Sun, Moon, and Blood Moon visual variants; no stale variant copy after switching.
- Keyboard tab, toggle, accordion, modal-focus, Escape, tilt, scroll-snap, reduced-motion, and live console behavior.
- Netlify Dev clean-route refreshes at `localhost:8888`.

No blocking automated regression remains.

## Repeat

Run: `npm run generate:cards && npm run validate:cards && npm run validate:modal-routes && npm test && npm run build`
