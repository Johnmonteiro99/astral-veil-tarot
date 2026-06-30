# Astral Veil v2 Pre-release QA Notes

Last updated: 2026-06-28

## Security Fixes Added In This Pass

- Added `supabase/migrations/20260628193000_v2_security_foundation.sql`.
- Added `supabase/migrations/20260628200000_cleanup_v2_private_rls_policies.sql`.
- Defines `public.is_admin()` for admin RLS policies that already reference it.
- Enables owner-only RLS, when tables exist, for:
  - `profiles`
  - `user_readings`
  - `user_journal_entries`
  - `user_artifacts`
  - `user_rooms`
- Keeps admin read policies for account-support views where needed.
- Deduplicates private user-table policies into one readable owner policy per action where safe.
- Recreates `user_visual_trail_fragments` SELECT/INSERT policies as authenticated-only owner policies.
- Does not create new app data models or infer missing schemas.

## Verified From Local Code

- Auth pages use Supabase Auth sign in/sign up/reset APIs.
- Auth redirects reject external return URLs and block protected return targets.
- Account page does not show account content until `getCurrentUserWithProfile()` resolves.
- Journal page does not render/save private entries until a signed-in user is resolved.
- Saved readings are written and queried with the active user id.
- Admin dashboard calls `requireAdmin()` before revealing the dashboard shell.
- Private journal/account cards and protected media use drag/contextmenu protections.
- Blood Moon deck access in `js/deck.js` requires active Blood Moon mode before opening.
- Public frontend uses a publishable/anon Supabase key only.

## Manual Supabase Security Checks Required

These must be verified in the Supabase dashboard or by running SQL against the deployed project:

- Confirm the new `20260628193000_v2_security_foundation.sql` migration has been applied.
- Confirm the new `20260628200000_cleanup_v2_private_rls_policies.sql` migration has been applied.
- Confirm `public.is_admin()` exists and returns true only for intended admin profiles.
- Confirm RLS is enabled on all private user tables in production:
  - `profiles`
  - `user_readings`
  - `user_journal_entries`
  - `user_artifacts`
  - `user_rooms`
  - `user_room_visits`
  - `user_discoveries`
  - `user_profile_unlocks`
  - `user_noctis_saved_documents`
  - `user_gallery_fragments`
  - `user_gallery_recent_records`
  - `user_gallery_marked_records`
  - `user_visual_trail_fragments`
- Confirm no private table has unrestricted `anon` select/insert/update/delete grants.
- Confirm `user_visual_trail_fragments` has no PUBLIC/anon SELECT or INSERT policies.
- Confirm duplicate owner policies were removed from private user tables after the cleanup migration.
- Confirm admin-managed tables and storage buckets use `public.is_admin()` or equivalent server-side policies, not only frontend UI.
- Confirm avatar storage policies restrict writes to each user's own path.
- Confirm Supabase Auth redirect URLs include deployed auth/account URLs.

## Manual Browser QA Required

Run with real test accounts before release:

- Signed-out user cannot open account, private journal entries, saved readings, or admin dashboard.
- Signed-in non-admin cannot open admin features or write admin-managed content.
- Signed-in user A cannot see user B journal entries, saved readings, artifacts, gallery interactions, or profile unlocks.
- Forgot/reset password email flow returns to `account.html#privacy-security`.
- Blood Moon deck cannot be opened in Sun/Moon mode, including direct URL/hash attempts.
- Mobile and compact desktop layouts have no horizontal overflow at 360, 390, 768, 1024, 1280, and 1366 px widths.

## Console / Asset Notes

- Fixed stale navbar image references from `sun-moon-toggle-transparent.png` to `sun-moon-transparent.png`.
- Repointed missing local gallery placeholder images to existing Noctis visual-record assets.
- Removed the empty initial Deck Details modal image `src`.
- Disabled production reader-line/gallery/progression debug logs.
