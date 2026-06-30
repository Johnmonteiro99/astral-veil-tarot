# Astral Veil v2 Final Smoke Test

Date/time: 2026-06-29 23:27 EDT

## Scope

This was a quick release smoke pass against a local static server at `http://localhost:4180/`.

Browser coverage used local headless Chrome through the DevTools protocol because the Codex in-app browser backend was not available in this session. Credentialed Supabase auth/admin success paths still require a final manual pass with real accounts.

## Pages Tested

- `index.html`
- `auth.html`
- `account.html`
- `journal.html`
- `readers.html`
- `deck.html`
- `lumen-archive.html`
- `archive.html`
- `noctis-room.html?room=entry-desk`
- `noctis-room.html?room=shelves`
- `noctis-room.html?room=gallery`
- `admin-login.html`
- `admin.html`
- `terms.html`
- `privacy.html`
- Extra route sanity: `about.html`, `lumen-room.html`

## Automated Checks Run

- HTTP route availability for the listed pages: all returned `200`.
- Local `src`/`href` asset references in checked HTML: no missing local references found.
- JavaScript syntax check for all files under `js/` and `src/`: passed.
- Headless Chrome load pass at mobile `390px` and laptop `1366px`: no runtime exceptions, no critical failed local assets, no failed critical Supabase requests captured.
- Responsive overflow spot checks at `390px`, `768px`, `1366px`, and `1440px` on readings, journal, decks, Shelves, and admin login: no horizontal overflow found.
- Direct signed-out `admin.html`: redirected/rendered `admin-login.html`; no stuck “Checking admin access...” state observed.
- Direct signed-out `account.html`: rendered public auth screen; no account-private content observed in the captured state.
- Blood Moon protected routes cold-opened correctly to the access gate.
- Noctis routes smoke-tested with an isolated temporary Chrome profile and existing Blood Moon access flags:
  - Archive main loaded.
  - Entry Desk loaded.
  - Shelves loaded.
  - Gallery loaded.
- Shelves focused checks:
  - Featured default UI present.
  - Public unpublished document titles checked were not visible.
  - Search `Tide` found `The Tide That Moves Within`.
  - Recovered Journals filter found `The Tide That Moves Within`.
  - `Read Fragment` opened a modal.
- Deck focused check:
  - Gifted filter click worked and content updated.
- Gallery fragment UI check:
  - Normal public Gallery view did not expose `Recover Next Fragment`.

## Issues Found

- No release-blocking issue found in the automated smoke pass.
- Non-blocking Chrome warning observed on Noctis pages:
  - `assets/images/noctis-header.webp` was preloaded but not used within a few seconds after load.
  - This is a performance warning, not a broken route or missing asset. I did not change it because the preload appears intentional for the Noctis shell and the request was to avoid broad cleanup.
- The Codex in-app browser backend was unavailable, so screenshots and direct visual inspection inside the in-app browser were not possible from this session.

## Fixes Made

- None. No source code changes were required by this smoke pass.
- Created this report: `docs/v2-final-smoke-test.md`.

## Auth Checks

Observed:

- `auth.html` loads the sign-in/sign-up UI without console/runtime blockers.
- `account.html` while signed out resolves to the auth screen.
- No private account data was observed before auth resolution in the signed-out smoke state.

Still manual with real credentials:

- Signup confirmation screen.
- Sign in.
- Sign out.
- Account page after sign-in.
- Verify no private data flash on a slower real network.

## Admin Checks

Observed:

- `admin-login.html` loads.
- `admin.html` while unsigned/ungated resolves to admin login and does not hang on Access Check.
- No admin dashboard content was exposed before admin verification.

Still manual with real admin/non-admin accounts:

- Admin login success.
- Admin dashboard shell after login.
- Non-admin denial.
- Users page loads.
- Noctis Documents loads, filters, search, and pagination.
- User Progress loads.
- Gallery admin loads.
- Confirm no credentialed Supabase 400/401/403 errors beyond expected unauthenticated gating.

## Noctis Documents / Shelves

Observed:

- Public Shelves loaded from the gated Noctis room under Blood Moon access.
- Featured/default behavior rendered published featured content.
- Search `Tide` found `The Tide That Moves Within`.
- Recovered Journals filter found `The Tide That Moves Within`.
- Checked unpublished titles were not visible publicly.
- `Read Fragment` opened the reader modal.

Still manual:

- Admin Noctis Documents list with live admin session.
- Admin filters/search/pagination with the actual admin account.
- Confirm the exact featured document ordering desired for launch.

## Journal

Observed:

- `journal.html` loads at mobile/laptop widths without runtime errors or overflow.
- Prompt/check-in UI appears.
- Blood Moon greeting text appears in the current local time context.

Still manual:

- Save entry with a signed-in account.
- Mood/check-in/prompt/tags persistence.
- Recent reflections after multiple saves.
- Third-entry Gallery fragment unlock and toast.

## Gallery Fragments

Observed:

- Public Gallery does not show `Recover Next Fragment`.
- Gallery route loads under Blood Moon access without captured runtime/network errors.
- Protected full media remains gated by fragment recovery logic from prior implementation.

Still manual:

- Fragment 1 unlock after Blood Moon Zephyra/Scorpio reading containing Death and The Sun.
- Fragment 2 unlock after Ember Key recovery.
- Fragment 3 unlock after Entry Desk code `The Veil`.
- Fragment 4 unlock after third journal entry.
- Confirm duplicate unlock attempts do not duplicate rows or repeat the toast.
- Confirm full restored image only appears after all 4 fragments.

## Decks / Blood Moon

Observed:

- `deck.html` loads without runtime errors.
- Gifted filter interaction works.
- Blood Moon protected Noctis routes remain gated when opened cold.

Still manual:

- Deck detail/card view interaction.
- Card meanings mobile accordion duplicate check.
- Blood Moon deck lock/unlock behavior through the real Blood Moon activation flow.
- Thumbnail rail and individual card image inspection.

## Console / Network

Observed:

- No red runtime exceptions captured during the headless route pass.
- No missing JS/CSS files found.
- No missing local HTML asset references found.
- No critical failed Supabase requests captured in the public smoke paths.
- No leftover visible debug panel detected in the smoke output.
- One expected safe admin Noctis query `console.error` remains in source for real query failures; it is not a temporary debug log.

## Performance / Preferences

Observed:

- No huge debug logs captured.
- Responsive checks showed no horizontal overflow in the sampled pages.
- Reduced-motion/no-glow classes are still present in the app preference system.

Remaining warning:

- Noctis header preload timing warning, non-blocking.

## Final Recommendation

Looks ready to publish after your final manual credentialed check.

The automated smoke did not find an obvious blocker, broken route, missing local asset, syntax error, public unpublished document leak, admin Access Check hang, or critical console/network failure. The remaining checks are the ones that require real Supabase sessions and real admin/non-admin credentials.
