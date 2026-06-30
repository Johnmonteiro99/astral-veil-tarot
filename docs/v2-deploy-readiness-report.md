# Astral Veil v2 Deploy Readiness Report

## Summary
Audit pass completed on 2026-06-29 19:02:15 EDT.

Astral Veil v2 is close to deploy-ready from the static/code checks completed in this pass. JavaScript syntax, CSS brace balance, local page availability, local linked assets, auth guard code, user-owned Supabase query patterns, admin gating, protected media hooks, and reduced-motion/no-glow handling were reviewed.

Final recommendation: Ready after manual checks.

The main reason this is not marked fully ready is that this environment did not provide an in-app browser, Chrome, Playwright, or Puppeteer runtime, so real browser console capture, network waterfall validation, interactive auth testing, and responsive visual QA still need to be completed manually.

## Files Changed
- `docs/v2-deploy-readiness-report.md`

No app code was changed during this audit pass. The working tree already contained modified app files before this report was added; those pre-existing edits were not reverted or broadly refactored.

## Tests Performed
### Static Syntax And Structure
- Ran `node --check` across JavaScript files in `js`, `src`, and `data`.
- Checked CSS brace balance for:
  - `css/style.css`
  - `css/deck.css`
  - `css/journal.css`
  - `css/archive.css`
- Reviewed script, stylesheet, preload, image, and module references in the main HTML pages.

### Local HTTP Page And Asset Sweep
- Served the site locally at `http://localhost:4174/`.
- Checked these pages over HTTP:
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
  - `about.html`
- Checked 152 unique local linked page/asset requests from those pages and their linked CSS.
- Result: no HTTP 4xx/connection failures found in the checked local requests.

### Security And Auth Code Review
- Reviewed the Supabase client initialization.
- Verified frontend uses the publishable/anon key path and does not expose a service-role key.
- Reviewed `src/services/auth.js` for:
  - `getSession()` used only as a cheap presence check.
  - `getUser()` used before protected pages trust identity.
  - profile lookup scoped to the current user id.
  - `requireAdmin()` gating before admin dashboard content is shown.
- Reviewed account, journal, archive, saved readings, saved documents, room progress, artifact progress, and gallery user-state query patterns for `user_id` scoping.
- Reviewed admin dashboard startup gating and confirmed dashboard content stays hidden until `requireAdmin()` authorizes the session.

### Journal QA From Code
- Reviewed signed-out Journal behavior: the page locks instead of rendering private entry UI.
- Reviewed Journal save flow: save requires `activeUser`, writes to `user_journal_entries`, and includes `user_id: activeUser.id`.
- Reviewed recent reflections load: query is scoped by `user_id`.
- Reviewed attached reading load: query is scoped by both reading id and `user_id`.
- Reviewed mobile mood/dropdown and accordion code paths at a code level.
- Reviewed private card/protected media drag/context-menu prevention hooks.

### Decks QA From Code
- Reviewed deck collection locking, auth-locked decks, Coming Soon handling, and Blood Moon deck gating.
- Reviewed Blood Moon deck direct open path: `renderDeckGallery()` refuses locked collections and renders the Blood Moon locked prompt.
- Reviewed modal/View Deck handling: locked Blood Moon deck does not open from modal while not active.
- Reviewed Blood Moon mode change listener: active Blood Moon deck view is closed/re-rendered when access changes.
- Reviewed recent rounded image fitting changes at a CSS/code level.

### Lumen Archive QA From Code
- Reviewed Lumen page references and local HTTP assets.
- Reviewed room image preload/reference availability.
- Reviewed reduced-motion/no-glow coverage in Lumen styles.

### Noctis Archive / Gallery QA From Code
- Reviewed Noctis main, Entry Desk, Shelves, Gallery, Recovered Inventory, Archive Echoes, and Shelves hero copy paths.
- Confirmed Archive Echoes now uses general hint copy:
  - Entry Codes
  - Recovered Objects
  - Sealed Paths
- Confirmed Shelves hero copy no longer centers the Archive only on Zephyra.
- Reviewed Recovered Inventory rendering and modal/protected media attributes.
- Reviewed Gallery protected media rendering, marked records, recently viewed, visual trails, modal, swipe/touch handlers, and signed-in-only user progress paths at a code level.

### Terms / Privacy / Contact QA
- Confirmed `terms.html` and `privacy.html` return HTTP 200 locally.
- Confirmed support/privacy mailto links are present in `privacy.html`.
- Confirmed auth page links to Terms and Privacy.
- Confirmed privacy/account deletion language is present.

### Accessibility And Interaction Review
- Reviewed obvious button labels, dialog close labels, accordion `aria-expanded`, select/listbox labeling, protected image drag prevention, focusable modal dialog patterns, and `prefers-reduced-motion`/no-glow hooks.
- Confirmed many decorative icons/images are marked with empty alt text and/or `aria-hidden`.

### Performance Review
- Reviewed preloads, eager images, lazy images, protected/gallery image loading, and large image assets.
- Confirmed many offscreen/dynamic assets already use `loading="lazy"` and `decoding="async"`.
- Identified large PNG assets as a future optimization area, including several 2.5-3.2 MB images in reader, moonveil card, Lumen, and gallery assets.

## Fixes Made
- No app-code fixes were made in this pass.
- No broken local page or asset references were found in the HTTP sweep.
- No frontend service-role key or hardcoded private secret was found.
- No JavaScript syntax failures were found.
- No CSS brace-balance failures were found.

## Performance Improvements
- No code-level performance changes were applied in this pass because the safe checks did not reveal an obvious low-risk preload/lazy-loading fix.
- Future non-blocking optimization: compress or replace oversized PNG artwork where a visually equivalent optimized WebP/AVIF asset can be produced and manually approved.
- Future non-blocking optimization: run Lighthouse/WebPageTest on production-like hosting to measure LCP/CLS/INP and confirm whether current hero preloads are helping rather than creating unused-preload warnings.

## Security & Privacy Checks
- Frontend Supabase client uses the configured URL and publishable/anon key only.
- `src/services/supabase-client.js` includes an explicit comment that private data boundaries must be enforced by Supabase RLS.
- Account page waits for `getCurrentUserWithProfile()` before rendering private account content.
- Signed-out account users are redirected to `auth.html`.
- Journal page locks for signed-out users instead of loading/saving private entries.
- Saved readings query is scoped to `user_id` and `is_saved`.
- Journal entries and recent Journal reflections are scoped to `user_id`.
- Attached Journal reading query is scoped to `id` and `user_id`.
- Archive saved documents, room progress, artifacts, gallery marked/recent records, and visual trail fragments reviewed for active-user scoping in code.
- Protected/private media drag and context-menu prevention hooks exist globally and in account/journal/archive-specific paths.
- Admin dashboard calls `requireAdmin()` before revealing the admin shell.
- Admin dashboard still relies on Supabase RLS/admin policies for real authorization, as it should.

## Auth/session Checks Performed
- Reviewed sign-in/sign-up/sign-out helpers.
- Reviewed current-user resolution:
  - `getSession()` presence check.
  - `getUser()` JWT validation before protected-page trust.
- Reviewed account guard and pending-deletion sign-out behavior.
- Reviewed admin login/dashboard guard flow.
- Reviewed Journal signed-out lock modal behavior from code.
- Reviewed public auth nav state handling at a code level.

## Supabase/RLS Assumptions Or Manual Checks Required
These items require production Supabase dashboard verification or real account testing:
- RLS enabled on all private user tables.
- Owner-only policies for:
  - `user_journal_entries`
  - `user_readings`
  - `user_room_visits`
  - `user_discoveries`
  - `user_artifacts`
  - `user_noctis_saved_documents`
  - gallery user activity/progress tables
- Admin policies use `public.is_admin()` or equivalent and do not rely on frontend hiding.
- Storage policies for profile avatars and gallery uploads are correct.
- Auth redirect URLs include production domain and local development URLs as intended.
- Non-admin user cannot read/write admin-only tables.
- Signed-out user cannot read private user tables.

## Console/network Issues Found And Fixed
- Local HTTP sweep found no 4xx page or asset failures for the checked pages/assets.
- A true browser console/network panel pass could not be completed because no browser backend was available in this environment:
  - in-app browser list returned empty
  - Playwright unavailable
  - Puppeteer unavailable
  - Chrome/Chromium unavailable
- Manual browser console/network validation is still required before deploy.

## Accessibility/responsive Checks Performed
- Static/code review covered:
  - accordion `aria-expanded`
  - modal close labels
  - keyboard Escape handling in several modal flows
  - hidden/private states
  - decorative image alt patterns
  - protected media drag/context-menu prevention
  - reduced-motion and no-glow support
- Responsive visual validation at 360/390/430/768/1024/1280/1366/1440+ could not be completed without a browser runtime and must be done manually.

## Manual Checks Still Required
- Run the site in a real browser and check console/network errors on:
  - `index.html`
  - `auth.html`
  - `account.html`
  - `readers.html`
  - `deck.html`
  - `journal.html`
  - `lumen-archive.html`
  - `lumen-room.html`
  - `archive.html`
  - `noctis-room.html?room=entry-desk`
  - `noctis-room.html?room=shelves`
  - `noctis-room.html?room=gallery`
  - `terms.html`
  - `privacy.html`
  - `admin-login.html`
  - `admin.html`
- Test signed-out access:
  - account page redirects
  - journal locks and does not reveal entries
  - admin dashboard blocks/redirects
  - private readings/reflections do not appear
- Test signed-in standard user:
  - save reading
  - save journal entry
  - mood/prompt/guided answers persist
  - recent reflections only show that user
  - account saved readings and journal archive load correctly
  - non-admin user cannot access admin dashboard
- Test admin user:
  - admin login works
  - dashboard counts load
  - journal prompts/gallery/artifact/admin sections still load under admin RLS
  - non-admin writes remain blocked by RLS
- Test Blood Moon rules:
  - Blood Moon deck locked in Sun/Moon mode
  - direct hash/query/localStorage spoof attempts do not open locked Blood Moon content
  - Blood Moon mode opens intended Noctis/Blood Moon content
  - protected media remains non-draggable
- Test responsive layouts manually at:
  - 360px
  - 390px
  - 430px
  - 768px
  - 1024x768
  - 1280x720
  - 1366x768
  - 1440x900
  - large desktop
- Run Lighthouse or equivalent performance audit on production-like hosting.
- Confirm production analytics and external font requests are acceptable.

## Known Risks / Notes
- The repository has many large image assets. This is not a functional blocker, but production performance would benefit from approved asset optimization.
- Some pages load multiple Google font families for the thematic design system. This supports the current visual direction but should be watched in Lighthouse for font load cost.
- Browser-based console capture was not possible in this environment, so any runtime-only errors remain a manual QA responsibility.
- Supabase RLS cannot be proven solely from static frontend code; production policy verification remains required.
- The site file is `deck.html`; user-facing copy sometimes refers to “Decks page,” but local navigation consistently points to `deck.html`.

## Final Recommendation
Ready after manual checks.

The static/code/HTTP audit did not find a deploy-blocking issue, but final production approval should wait for real-browser console/network checks, signed-in/signed-out account tests, admin/non-admin tests, Blood Moon direct-access tests, responsive visual QA, and production Supabase RLS verification.
