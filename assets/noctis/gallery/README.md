# Noctis Gallery Image Staging

These folders are the local source and staging area for Noctis Gallery images before they are uploaded for live use.

Live dynamic Gallery images should be uploaded to the Supabase Storage bucket named `gallery-records`.

For this static site, browser image paths should use `/assets/noctis/gallery/...`, and the images should live under the root folder `assets/noctis/gallery/...`.

Use lowercase kebab-case file names.

Example file names:

- `watchers-at-veilfall.png`
- `sealed-portrait-no-17.png`
- `watcher-estate-landscape.png`
- `astral-seal-symbol-record.png`
- `blood-moon-rift-anomaly.png`
- `unknown-visual-record-01-preview.png`
- `unknown-visual-record-01-full.png`
- `unknown-visual-record-01-fragment-01.png`

Suggested Supabase bucket folder paths:

- `featured/`
- `portraits/`
- `places/`
- `symbols/`
- `maps/`
- `anomalies/`
- `unknown/`
- `recovered/`
- `fragments/`

Future data mapping:

- `gallery_records` stores metadata and image URLs.
- `gallery_fragments` stores collectible fragment image URLs and links them to gallery records/documents.
- `user_gallery_fragments` stores user collection progress.
