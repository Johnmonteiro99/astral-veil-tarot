# Third-Party Notices

This inventory records third-party materials confirmed in the repository. It is informational and does not replace the applicable upstream license or service terms.

## Runtime and Package Dependencies

| Name | Purpose | Source | License | Loading | Attribution |
| --- | --- | --- | --- | --- | --- |
| Supabase JavaScript client (`@supabase/supabase-js` 2.110.2) | Supabase API, authentication, database, realtime, functions, and storage client | npm and [Supabase JavaScript](https://github.com/supabase/supabase-js); also imported from jsDelivr in `src/services/supabase-client.js` | MIT (confirmed by `package-lock.json`) | Local npm dependency and externally loaded ESM bundle | Preserve upstream copyright and license notice in copies or substantial portions |
| Supabase SSR (`@supabase/ssr` 0.12.0) | Server-side authentication and cookie integration | npm and [Supabase SSR](https://github.com/supabase/ssr) | MIT (confirmed by `package-lock.json`) | Local npm dependency | Preserve upstream copyright and license notice in copies or substantial portions |
| Supabase transitive packages (`auth-js`, `functions-js`, `phoenix`, `postgrest-js`, `realtime-js`, `storage-js`) | Components used by the Supabase client | npm packages recorded in `package-lock.json` | MIT (confirmed by `package-lock.json`) | Local transitive dependencies | Preserve upstream copyright and license notice in copies or substantial portions |
| `cookie` 1.1.1 | Cookie parsing/serialization used by Supabase SSR | npm | MIT (confirmed by `package-lock.json`) | Local transitive dependency | Preserve upstream copyright and license notice in copies or substantial portions |
| `iceberg-js` 0.8.1 | Storage-client support dependency | npm | MIT (confirmed by `package-lock.json`) | Local transitive dependency | Preserve upstream copyright and license notice in copies or substantial portions |
| `tslib` 2.8.1 | TypeScript runtime helpers | npm | 0BSD (confirmed by `package-lock.json`) | Local transitive dependency | Follow the upstream 0BSD notice terms |

## Externally Loaded Services and Fonts

| Name | Purpose | Source | License / terms | Loading | Attribution |
| --- | --- | --- | --- | --- | --- |
| Google Fonts | Web typography | `fonts.googleapis.com` / `fonts.gstatic.com` | License verification required for each font family and served file | Externally loaded | Verify and retain any attribution or license files required by each font |
| Google Analytics (`gtag.js`) | Site analytics | `www.googletagmanager.com` | Governed by Google service terms; software license verification required | Externally loaded | License verification required |
| jsDelivr | CDN delivery of the Supabase JavaScript ESM bundle | `cdn.jsdelivr.net` | Service terms apply; delivered Supabase code is MIT per the package lockfile | Externally loaded | Preserve the Supabase license notice as applicable |

The Google Fonts families requested by repository HTML include Caveat, Cinzel, Cormorant Garamond, DM Mono, DM Sans, Exo 2, Fraunces, IM Fell English SC, Inter, Literata, Lora, Manrope, Marcellus, Orbitron, Oxanium, Playfair Display, Playwrite USA Modern, Quicksand, Rajdhani, Space Grotesk, and Spectral. Their individual licenses and attribution requirements require verification.

## Build and Hosting Tooling

| Name | Purpose | Source | License / terms | Loading | Attribution |
| --- | --- | --- | --- | --- | --- |
| Netlify edge bootstrap modules | Netlify edge-function runtime support recorded in `deno.lock` | `edge.netlify.com/bootstrap/` | License verification required | Externally resolved by the hosting/build toolchain | License verification required |

## Repository Assets Requiring Provenance Review

No separate license, credit, or attribution files were found for the image, texture, or icon files under `assets/` or `public/`. The repository does not provide enough provenance to determine whether every such file is original or third-party. Any externally sourced files in those directories require source and license verification before redistribution.

The README mentions Bootstrap in the technology stack, but no Bootstrap package, stylesheet, script, or CDN import was found during this inventory. Its use and licensing therefore require verification before it can be listed as a confirmed dependency.
