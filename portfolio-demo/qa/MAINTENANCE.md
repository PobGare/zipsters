# Final maintenance — 2 November 2026

Scope: findings Z-01–Z-09 from the supplied account audit, reviewed as reference material. Starting HEAD: `c87bf7a44973e276c99b6e23527db40bb62f4001`; changes remain local and uncommitted. No original `theme/` file was edited, and nothing was committed, pushed or deployed. The supplied audit itself was not edited or published.

## Findings and disposition

| Finding | Result |
| --- | --- |
| Z-01 | Owner's no-visible-hero-Pause/Play decision preserved. No carousel code, markup, timing, imagery or animation changed. Accessibility tradeoff and alternatives below remain open. |
| Z-02 | Fixed false-success reporting and missing-baseline handling; established revision-backed, cross-platform text hashes after comparing all old hashes and Git contents. The reported 12 substantive changes are mixed-newline artifacts, not content changes. |
| Z-03 | Compatible patch updates: `@vercel/node` 29.0.0 → 29.0.1 and matching peer `@vercel/build-utils` 15.2.0 → 15.2.1. Both package layouts pass. Full audit still has 11 affected development packages (4 high, 7 moderate); production-only and root audits have zero. |
| Z-04 | Root/demo README and QA history now distinguish the working hosted demo, historical startup repair and current local changes. Current suite: 35 passing tests. |
| Z-05 | Root opening now says Shopify Liquid theme plus standalone portfolio demo, with simulated checkout beside the live link. Removed the unsupported commissioned-work implication; actual engagement/endorsement remains unverified. No remote repository metadata was changed. |
| Z-06 | Retained intentional independent copies, originals and full-resolution previews. Added read-only `audit:media` plus an explicit reviewed export option, using the same revision-backed manifest; all 117 media/font/license files match and provenance snapshots agree. No export/recompression/deletion was performed. |
| Z-07 | Added root `ASSET_RIGHTS.md`: attribution, source gaps, font-license boundaries and a recommended permission-record format. No permission evidence invented or private correspondence published. |
| Z-08 | Added tested CSP, `frame-ancestors 'none'`, X-Frame-Options and restricted device permissions to the demo handler and Vercel headers. Existing bootstrap allowed by exact SHA-256 hash; no template changes. Not yet deployed. |
| Z-09 | Root quick-start, source map and `scripts/README.md` identify safe validation commands and historical mutating generators with inputs/outputs. None of those generators was run. |

## Hash investigation

The old baseline was introduced in `9941d9b`. Original theme history ends at `c3056ab0daf180985d68c3efd445504ea079d698` ("Finalize Zipsters client-requested commerce redesign"), supported by the dated requested-change record in `research/FINAL-REVIEW.md`. `git diff c3056ab HEAD -- theme` is empty. This is the repository's established design revision, not new evidence of merchant endorsement.

Before writing any baseline changes, all **165 local raw hashes matched the old manifest**, all **165 normalized local contents matched that Git revision**, and the manifest path set matched its Git tree. Of the old hashes, 152 matched Git blobs directly; one was uniform CRLF (`dmsans-OFL.txt`); the other 12 captured mixed LF/CRLF. Testing only all-LF and all-CRLF versions cannot reproduce a mixed-newline byte hash. This explains why a clean audit clone reported 12 residual mismatches and this original working tree did not.

The 12 mixed files are `assets/campaign-slider.js`, `assets/commerce.css`, `assets/reels.js`, `assets/refinements.css`, `assets/refinements.js`, `assets/theme.css`, `sections/best-sellers-pair.liquid`, `sections/ending-strip.liquid`, `sections/hero.liquid`, `sections/main-product.liquid`, `sections/product-recommendations.liquid`, and `sections/reels.liquid`. Old hash, revision hash and CRLF/bare-LF counts are retained in `theme-baseline-investigation.json`.

The new schema records the full revision and normalization rule. Only known UTF-8 text formats normalize CRLF → LF. BOMs, lone CRs, whitespace, final newlines and all binary bytes stay significant. No `.gitattributes` rewrite or theme renormalization was needed. The audit counts actual matches and reports changed, missing, unexpected and unreadable files. Missing/corrupt baseline data fails when the theme exists; a genuinely independent demo checkout reports the original-theme check as skipped. Tests cover mixed endings, substantive edits, binary differences, missing files/baseline, malformed data and unsafe/duplicate entries.

## Dependency review

Saved current npm responses: `npm-audit-full.json` and `npm-audit-production.json`. Root full and production-only audits also returned zero on this date. Advisories count affected packages, including transitive propagation, not independently demonstrated exploits.

The remaining tool graph includes `@fastify/busboy`, `@ts-morph/common`, `@vercel/nft`, `@vercel/node`, `@vercel/static-config`, `ajv`, `glob`, `minimatch`, `ts-morph`, `path-to-regexp` and `undici`. The patch builder still pins affected `path-to-regexp` 6.1.0 and `undici` 5.28.4; static-config pins AJV 8.6.3. A compatible `npm update ajv` made no change because of that upstream pin. No broad overrides, forced fixes or breaking downgrade to builder 4 were applied. Further remediation needs an upstream compatible graph change or separately reviewed tool isolation; zero production advisories does not make build tooling risk-free. Do not run it on untrusted projects.

## Verification

| Check | Fresh result |
| --- | --- |
| Demo `npm test` | 35 passed, zero failures; includes integrity and security-policy regression coverage |
| Demo `npm run audit` | 17 routes, 100 assets, 165/165 original files, zero failures |
| Demo `npm run audit:media` | 117 media/font/license files match the baseline; provenance snapshots equal |
| Demo `npm run build` | 16 routes rendered, static output generated |
| Demo `npm run verify:function` | Node 24 standalone and nested packages: 41 data/template files each, 48 bundle files each, 23 route/method checks each; cold starts work |
| Root `npm run check` | 37 Liquid/JSON files and configured imagery validated |
| Root `npm run audit` | 16 pages, 95 assets, zero errors with root preview running; initial run without the required server correctly failed connection |
| `git diff --check` | Passed; Git's Windows line-ending notices are informational |
| Hosted smoke | Seven storefront URLs return 200; intentional missing page returns 404; no render-error markers |

Hosted URL: https://zipsters-demo.vercel.app. `maintenance-hosted.json` records requests and time. Hosted deployment commit/version parity is **not independently identified**; these local maintenance changes were not deployed. The earlier `FUNCTION_INVOCATION_FAILED` is a historical fixed runtime-path problem, not the current hosted result.

Browser checks used the in-app Chromium browser. Homepage, collection and black-Henley product at **320, 390, 768 and 1440px**: 12 checks, no horizontal document overflow or broken loaded images. This checks loaded images, not a full download of every lazy asset. Screenshots were captured/reviewed for desktop home, mobile home and mobile product; a simulated checkout receipt is retained. Existing README showcase PNGs remain unchanged.

Fresh interaction checks: predictive “black henley” search with ArrowDown/Enter; product gallery; unavailable XL disables Add to Bag; M/Black add; quantity increase and PKR 6,580 total; reload persistence; simulated completion clears bag; mobile menu/Escape restores Open menu focus after the closing transition; Brown filter returns one item; descending sort orders prices correctly. With CSP enabled, Buy Now and simulated checkout completion, sorting, navigation and film playback were checked. Hero auto-advancement remains observable, with three dots and no hero pause control. The separate pre-existing film control pauses/resumes loaded mobile MP4 playback. Browser console samples show zero warnings/errors (`maintenance-console.json`).

The CSP constrains script/connect/media/font origins and framing; only the fixed bootstrap hash permits executable inline script. Inline styles remain allowed because existing design settings use style attributes/CSS variables. The inert JSON catalog remains data, not executable JavaScript. Policy parity and all rendered executable bootstrap hashes are tested. References: [MDN script-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src), [Vercel header configuration](https://vercel.com/docs/project-configuration/vercel-json#headers).

## Assets, secrets and accessibility limitations

`asset-review.json` inventories the starting 477 tracked files: 251,055,959 working-tree bytes at scan time, 159 duplicate groups and 73,639,462 duplicate bytes beyond each first copy. Differences from the earlier audit's byte totals include line-ending and maintenance-file changes; this is not an optimization claim. The largest MP4 is 11,935,779 bytes. Copies preserve the demo's independence; originals and showcase PNGs preserve source/evidence quality. Optimization remains optional, subject to provenance, visual checks and measured transfer needs.

A targeted tracked-working-tree scan found no private-key, AWS/GitHub/Stripe token or suspicious long credential-assignment candidates. It did not scan all history, ignored environment files, binary metadata or remote deployment secrets and is not a no-secrets guarantee. No credential values were saved. The original supplied account audit's broader historical scan is historical evidence, not a scan repeated here.

No visible hero Pause/Play button was added, and no slideshow behavior was changed. Existing reduced-motion handling and temporary focus/dialog/background/offscreen pauses reduce motion but do not provide every visitor with a persistent in-page stop mechanism. WCAG 2.2.2 covers auto-updating content even at five-second intervals; focus-only stopping is not sufficient. See [W3C's explanation](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).

Possible future alternatives, **not implemented**: a discoverable “Motion preferences” setting in the menu/footer that persists while users browse; a keyboard-accessible “Static presentation” option; or stopping automatic rotation after deliberate slide selection. The first two can avoid a visible Pause/Play button in the hero; each still needs usability/accessibility testing and explicit behavior approval. OS reduced motion alone and hidden keyboard shortcuts should not be presented as universal conformance fixes. Existing separate film controls were retained.

Outstanding: written media/brand permission, 13 missing exact photo post links, code-license choice, developer-tool advisories, physical-device/Safari/Firefox/screen-reader/zoom/contrast/reduced-motion browser testing, and measured performance. No new official Shopify Theme Check, merchant admin, live inventory, payment, order, shipping or newsletter integration was exercised. No complete WCAG or security certification is claimed.

## Modified-file inventory

- Root: `README.md`, `ASSET_RIGHTS.md` (new), `scripts/README.md` (new), `research/QA.md`.
- Demo implementation/config: `api/storefront.js`, `server/security.mjs` (new), `vercel.json`, `package.json`, `package-lock.json`.
- Demo tools/tests: `scripts/audit.mjs`, `scripts/theme-integrity.mjs` (new), `scripts/media-parity.mjs` (new), `scripts/verify-function.mjs`, `tests/theme-integrity.test.mjs` (new), `tests/security.test.mjs` (new).
- Demo docs/evidence: `README.md`, `qa/REPORT.md`, `qa/DEPLOYMENT-FIX.md`, this report, `qa/original-theme-sha256.json`, `qa/audit-results.json`, `qa/function-package.json`, plus the new `qa/theme-baseline-investigation.json`, `qa/asset-review.json`, `qa/npm-audit-{full,production}.json`, `qa/maintenance-{hosted,responsive,console}.json`, and `qa/maintenance-{desktop-home,mobile-home,mobile-product,checkout}.png`.
- Generated ignored local outputs: demo `dist/`, `.vercel/` verification fixtures, npm caches and root `research/qa/link-audit.json`. The user-supplied `GITHUB_FULL_AUDIT.md` remains reference-only and is not part of the implementation change.
