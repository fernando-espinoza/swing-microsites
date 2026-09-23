# Sunday Edit — implementation handoff

## What is delivered

A standalone static campaign at `/campaign/johnmontgomery/`, with three main sections, 24 campaign photographs, six product photographs, and one silent supplied film. All product descriptions are copied from the product sheet. The C06 embedded wordmark remains unchanged by explicit user instruction. “Lusia back.webp” is explicitly mapped to the supplied “Luisa back.webp”.

The source is on `codex/sunday-edit` in `.worktrees/sunday-edit`. No parent site, product pages, live deployment, tracking, API, account, or cart was created. The full Git history preserves task boundaries.

## Build and test

Use Node 24.21.0 (`.nvmrc`) and `npm ci`. Dependencies are exact-locked build/test tools only: Sharp, Playwright, axe integration, and parse5. The published page has no dependency loader or framework runtime.

```sh
npm run build
npm run preview
npm run check
```

Preview: `http://127.0.0.1:4173/campaign/johnmontgomery/`. `npm run preview` binds loopback only and serves the generated artifact. It is a QA server, not a production process manager.

`npm run check` needs the browser engines installed by `npx playwright install chromium firefox webkit`. See [QA](qa.md) for actual evidence and limits.

## Original assets and reproducibility

Original media stays out of Git and the public artifact. Existing files are staged in `assets-source/sunday-edit/`. For a fresh checkout:

1. Open the ordinary authenticated Drive URLs in [the source inventory](../superpowers/reference/2026-09-23-asset-inventory.json), or use an authorized Drive connector. Never save a short-lived signed download URL in source control.
2. Save each used original under its `sourcePath` in `content/sunday-edit/assets.json`. This is C01.jpg through C24.jpg, P01.webp through P06.webp, and V01.mp4. Use the manifest's Drive ID, not a filename search, to avoid mismatches.
3. Preserve the approved V01 derivatives from `assets-source/sunday-edit/film/` in the private handoff bundle, or regenerate them with FFmpeg 7.1 using the exact commands below.
4. Run `npm run build`. It verifies original source hashes before generating responsive image variants. A changed or missing original stops the build with its asset ID. Image variants are generated each build from the originals; the optional `npm run media` produces a review set in ignored source storage.

The film uses all of V01 (10.946667 seconds), without audio. Its source is 964×2094 HEVC; its web derivative is 720×1564 H.264, 30fps, yuv420p, CRF 23. Use the local FFmpeg binary as `ffmpeg`:

```sh
ffmpeg -hide_banner -loglevel error -i assets-source/sunday-edit/V01.mp4 \
  -an -vf 'scale=720:-2,fps=30' -c:v libx264 -crf 23 \
  -pix_fmt yuv420p -movflags +faststart /tmp/swing-film.mp4
ffmpeg -hide_banner -loglevel error -ss 0.5 \
  -i assets-source/sunday-edit/V01.mp4 -frames:v 1 \
  -vf 'scale=720:-2' /tmp/swing-poster.jpg
```

Compare the resulting SHA-256 values with `srcSha256` and `posterSrcSha256` in campaign.json. Copy verified outputs into `assets-source/sunday-edit/film/` using the basename of the corresponding `src`/`posterSrc`. Do not overwrite an approved hash just to make a different encoder's output pass. A different binary/version may produce different bytes and requires reviewed derivative regeneration. The build checks derivatives against their recorded hashes.

## Approved content updates

Campaign copy is in campaign.json; approved text is also recorded in review.json. Product records are in products.json and checked against the approved records in review.json. The duplication is an intentional review boundary: update the approval record only after reviewing the changed facts/copy, not automatically during a build.

An image replacement needs an updated source inventory, manifest ID/hash/dimensions, descriptive alt text, and an assigned layout role. Review source and derivative together. The output audit requires all 30 approved image IDs exactly once, and changed source bytes cannot silently enter a build.

For product destinations, add the exact approved HTTPS URL to the product's href and to review.json's approvedProductUrls. Only origin `https://wearswing.com` is allowed, with no credentials, query string, or fragment. This implementation does not assert that any product route exists. Verify it with the parent team before adding it. Null values render plain images/titles, with no dead “Shop” control.

## Typography and final approval

System type stacks currently use Snell Roundhand/Apple Chancery for expressive type and Baskerville/Iowan/Palatino/Georgia for serif text. No font was downloaded, licensed, or embedded. Rendering on another operating system may differ. Before production, Marketing must supply licensed WOFF2 files or explicitly approve the system fallback. Add approved local font resources to the build, validate them in the output audit, and repeat layout/performance checks.

Final visual approval and real iOS Safari/touch/screen-reader review remain release checks. WebKit automation does not substitute for a physical iPhone.

## Host contract

Mount only `dist/campaign/johnmontgomery/` at the campaign route. Send a 308 redirect from `/campaign/johnmontgomery` to `/campaign/johnmontgomery/`. Preserve every other parent route; do not install a catch-all rewrite or a root homepage.

The generated page uses campaign-prefixed asset URLs. Serve appropriate MIME types for HTML, CSS, JavaScript modules, JPEG, WebP, and MP4, and implement HEAD/byte Range responses for the film. A request such as `Range: bytes=0-1023` should receive 206 and a correct Content-Range.

Apply these headers only to the campaign page/resources after checking the host's integration:

```text
Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; media-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

Use `Cache-Control: no-cache` for HTML and `public, max-age=31536000, immutable` for content-hashed assets. Keep files beginning with a dot inaccessible; `.swing-generated` is a local build ownership marker.

A path under the same domain is not an origin security boundary. This page never reads/writes cookies or local storage and registers no service worker, but browsers can still send first-party cookies on same-origin requests. The parent owner must assess its cookie scope. A pre-existing parent service worker can also affect a shared-origin route and must be checked by that owner before launch.

The page currently declares `noindex,nofollow`; an orphaned route is not inherently private. Marketing must explicitly choose search visibility before changing the metadata. No root robots.txt was created.

## Release and rollback

1. Review the artifact and current QA record with Marketing and the technical owner.
2. Resolve font and real-device checks, then validate the route and headers on the actual staging host.
3. Obtain a separate deployment instruction. Nothing in this handoff publishes the site.
4. Upload a versioned static artifact, verify the three-section page, representative responsive images, film playback/ranges, and absence of third-party requests.
5. Record artifact checksum, release commit, and deployed URL. If verification fails, restore the previous campaign directory atomically; do not revert or replace the entire parent site.

An ignored local `artifacts/` directory may contain the packaged public page. The private source-media bundle is distinct and must never be uploaded as public web content.
