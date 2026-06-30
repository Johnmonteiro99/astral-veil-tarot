# Astral Veil v2 Final Deploy Readiness Report

Pass completed: 2026-06-29 22:46:39 EDT

## Summary

This pass focused on safe deployment-readiness checks that can be verified from the local repository without live production credentials. The codebase passed JavaScript syntax checks, local HTML/CSS asset-reference checks, frontend secret scans, stale admin route scans, and targeted privacy/RLS code review.

One safe cleanup was made: stale Noctis Documents admin diagnostic code and unused admin-side canonical Tide seed/upsert helpers were removed from the runtime admin dashboard bundle. Public Shelves fallback/static content was not removed.

Final recommendation: Ready after manual checks.

## Files Changed

- `src/admin/admin-dashboard.js`
  - Removed temporary Noctis admin debug logging helpers and call sites.
  - Removed unused runtime canonical Tide document body/upsert helpers from admin code.
- `docs/v2-final-deploy-readiness-report.md`
  - Added this final deployment-readiness report.

## Tests Performed

- Ran `node --check` for every repository JavaScript file outside `.git` and `test-results`.
- Ran a focused `node --check src/admin/admin-dashboard.js` after cleanup.
- Scanned HTML/CSS local `src`, `href`, and `url(...)` references; no missing local HTML/CSS refs found.
- Scanned for `console.log` and `console.debug`; none remain in JS/HTML.
- Scanned for service-role/secret-like frontend patterns; no service role key or obvious backend secret was found.
- Scanned for stale Admin Journals route/function names such as `loadJournals`, `renderJournals`, `journalsState`, and `data-admin-view="journals"`; none found.
- Scanned for stale `user_profile1.svg`; none found.
- Reviewed public Shelves query path for `public.noctis_documents` and `is_published = true`.
- Reviewed Admin Noctis Documents query path for `public.noctis_documents` without a default published-only filter.
- Reviewed admin gate/login code paths and shared admin gate keys.
- Reviewed private user data query paths for current-user scoping in account, journal, reading save, gallery interactions, progression, and saved Noctis documents.
- Reviewed Supabase migrations for `public.is_admin()`, private-table RLS, Noctis Documents RLS, Veilwalker foundation RLS, gallery interaction RLS, and profile restriction policies.

## Bugs Fixed

- Removed production-reachable temporary Noctis Documents diagnostic logging behind `noctisDebug=1` / `astral_noctis_admin_debug`.
- Removed unused admin runtime helpers that could seed/upsert “The Tide That Moves Within.” Admin list loading now stays clearly read/render oriented and does not carry stale restoration code.
- Removed the embedded Tide body from the admin dashboard JavaScript bundle.

## Security & Privacy Checks

- No frontend service role key pattern was found.
- Frontend Supabase setup uses a publishable/anon key configuration path.
- `user_journal_entries` public code paths reviewed are scoped with `user_id = activeUser.id`.
- `user_readings` public code paths reviewed are scoped with `user_id`.
- `user_artifacts`, progression, profile unlocks, room visits, and discoveries reviewed are scoped by the active user.
- Saved Noctis Documents are scoped through `user_noctis_saved_documents.user_id`.
- Gallery marked/recent/visual trail user interaction paths are scoped by `user_id`.
- Profile updates reviewed are scoped to the active profile/user id.
- Account status moderation is implemented in admin code and backed by admin/RLS policy migrations; normal users are not given frontend controls for ban/restrict/restore.
- No private journal body/reflection logging was found in the static scans.

Manual privacy test still required: User A/User B isolation must be verified against the deployed Supabase project with real accounts.

## Supabase / RLS Checks

- `public.is_admin()` exists in migrations and is used for admin policies.
- Private tables reviewed have owner-based RLS migrations, including readings, journal entries, artifacts, rooms/visits, discoveries, profile unlocks, saved Noctis documents, gallery interactions, and visual trail fragments.
- `public.noctis_documents` migrations include public select for published records and admin CRUD policies using `public.is_admin()`.
- Public Shelves code queries `noctis_documents` with `is_published = true`.
- Admin Noctis Documents code queries `noctis_documents` and admin visibility relies on Supabase/RLS admin policies.
- Veilwalker foundation migrations include public active/available read policies and admin CRUD policies.

Manual Supabase checks still required:
- Confirm production migrations are applied in order.
- Confirm production RLS policies match the repo.
- Confirm storage bucket policies for gallery uploads and protected media.
- Confirm Supabase Auth redirect URLs for public auth, reset password, and admin login.

## Admin Checks

- Static review confirms `admin.html` loads `src/admin/admin-dashboard.js`.
- Admin gate keys are shared through `src/services/auth.js`: `astral_admin_verified` and `astral_admin_verified_at`.
- `admin.html` calls `requireAdminGate()` and `requireAdmin()` before showing the dashboard shell.
- Failed optional overview/user-progress stats are isolated with settled/guarded handling in the current admin code.
- Admin Users search/pagination code parses cleanly.
- Admin Noctis Documents filters use `__all` as no-filter values and the query path targets `public.noctis_documents`.
- No Noctis debug JSON panel or admin Journals route symbols were found.

Manual admin checks still required:
- Sign in through `admin-login.html` as an admin.
- Open `admin.html` directly without session storage and confirm redirect/resolution.
- Verify non-admin access is denied.
- Click each admin section and confirm live Supabase results.
- Exercise Users View/Restrict/Ban/Restore Active.
- Exercise Noctis Documents View/Edit/Publish/Unpublish/Make Featured/Delete confirmation.

## Performance Improvements

- Removed stale debug logging and unused canonical Tide helper code from the admin bundle.
- Removed the embedded Tide document body from runtime admin JavaScript.
- Local asset-reference scan found no missing HTML/CSS assets that would create obvious 404 noise.

Future performance recommendations:
- Run Lighthouse/WebPageTest on production URLs after deploy.
- Audit large image assets for compression opportunities.
- Verify non-critical images have `loading="lazy"` and `decoding="async"` in live page contexts.
- Check production cache headers for static assets.

## Duplicate / Dead Code Removed

- Removed unused Noctis Documents debug helpers.
- Removed unused Noctis Documents debug call sites.
- Removed unused canonical Tide payload/upsert helpers from admin runtime code.
- Removed the unused `canonicalTideDocumentBody` runtime constant from admin JavaScript.

No intentional public/static fallback content was removed.

## Static Fallback Content Preserved

- Public static content and guest fallback behavior were left intact.
- Public Shelves fallback/static structures were not removed.
- Veilwalkers public page static behavior was not changed.
- Lumen, Noctis Archive, decks, readings, and journal static/front-end content were not redesigned or removed.

## Manual Checks Still Required

- Full browser console/network pass on the primary pages:
  - `index.html`
  - `auth.html`
  - `account.html`
  - `readers.html`
  - `deck.html`
  - `journal.html`
  - `lumen-archive.html`
  - `lumen-room.html`
  - `archive.html`
  - `noctis-room.html`
  - `terms.html`
  - `privacy.html`
  - `admin-login.html`
  - `admin.html`
- Auth lifecycle:
  - Sign up.
  - Email confirmation.
  - Sign in after confirmation.
  - Sign out.
  - Password reset if enabled.
  - Account page protected-state behavior while auth resolves.
- User A/User B privacy isolation for readings, journal entries, artifacts/progression, gallery interactions, saved Noctis documents, and profile updates.
- Production Supabase/RLS and storage policy verification.
- Admin live QA with an admin and non-admin account.
- Public Shelves live QA for published-only behavior, Featured default filter, category filters, search, Reading Desk previous/next, Read Fragment, and View Details.
- Journal save/load, Recent Reflections, View All Entries, guided reflection, quick tags, and mobile layout.
- Decks/readings QA including Blood Moon deck gating and saved reading flow.
- Lumen Archive room interactions and no-glow/reduced-motion behavior.
- Noctis Archive room/chamber/gallery interactions.
- Gallery Visual Records filters, pagination, modal, marked/recent state, and protected media behavior.
- Responsive browser pass at 360, 390, 430, 768, 1024x768, 1280x720, 1366x768, and 1440x900.
- Accessibility browser pass for focus order, modal focus behavior, keyboard interactions, and screen-reader labels.

## Known Risks / Future Improvements

- This pass did not authenticate against production Supabase, so live RLS behavior still needs manual confirmation.
- This pass did not run a real browser console/network audit; it used static and syntax checks only.
- Supabase storage policies cannot be fully validated from local code alone.
- Production auth redirect URL configuration must be checked in the Supabase dashboard.
- Large visual assets should be audited after deployment with real network waterfall data.

## Final Recommendation

Ready after manual checks.

The local codebase passed static readiness checks and one safe cleanup was completed, but the release should wait for manual authenticated QA, User A/User B privacy isolation testing, production RLS/storage verification, and a real browser console/network pass.
