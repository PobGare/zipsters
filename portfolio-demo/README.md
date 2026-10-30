# Zipsters portfolio demo

A standalone, Vercel-ready showcase of the existing Zipsters Shopify theme. The original `../theme` is untouched. This folder includes its own templates, assets, catalog, dependency lockfile, server, and tests; it can be copied into a separate repository without the parent project.

## Run locally

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:4174. Set `PORT` to choose a different port. The local server binds to loopback only.

```sh
npm test
npm run audit
npm run build
npm run verify:function
```

The build verifies the main routes and copies static files into `dist`. Dynamic storefront pages are rendered by the Node function; `dist` by itself is not the complete deployment. `verify:function` uses the pinned official Vercel Node builder to create and cold-start standalone and nested function packages locally, without an account or deployment. It requires the development dependencies installed by `npm ci`. Browser QA evidence and the tested flows are documented in `qa/REPORT.md`.

## Vercel configuration

When deployment is authorized, import this folder as a Vercel project, or select **Root Directory: `portfolio-demo`** if importing the parent repository.

| Setting | Value |
| --- | --- |
| Framework preset | Other |
| Node.js | 24.x |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variables | None required |

`vercel.json` routes storefront URLs to `api/storefront.js` and serves `/assets/*` from the static output. Its `includeFiles` string explicitly covers `data/**/*.json`, `theme/**/*.json`, and `theme/**/*.liquid`. All runtime filesystem paths resolve relative to `server/catalog.mjs`, so they work whether Vercel places the app at the function root or preserves a `portfolio-demo/` prefix. Product deep links, search queries, filter queries, and 404s are handled on the server. Configuration follows Vercel's [configuration reference](https://vercel.com/docs/project-configuration/vercel-json) and [function file inclusion guidance](https://vercel.com/kb/guide/how-can-i-use-files-in-serverless-functions).

No Shopify token, merchant account, database, external image CDN, or payment provider is needed. This repair does not commit, push, or deploy. The user-reported deployment at `https://zipsters-demo.vercel.app` must be redeployed with the fix before a hosted smoke test can confirm it. See `qa/DEPLOYMENT-FIX.md` for the reproduced startup failure, full runtime inventory, and package verification results.

## What is preserved

- Original Liquid-rendered layout, palette, typography, local fonts, brand photos, image crops, responsive image sources, and campaign films.
- Homepage campaigns, category panels, best sellers, Get the Look, reels and footer.
- Desktop/mobile navigation, predictive search with keyboard selection, collections, sorting, filters, empty states and browser history.
- Eight product detail pages, galleries, thumbnails, mobile scrolling galleries, animated accordions and related products.
- Original responsive and reduced-motion rules, drawer transitions and focus restoration. The hero auto-advances every five seconds with three navigation dots; separate campaign films retain their pause controls.

The original copy already distinguishes separate colors as separate product pages; the demo retains that structure and supplies size variants. No replacement or AI-generated imagery was used.

## Clearly labeled demo services

Prices (PKR), size choices, stock, best-selling order, fit/care text, delivery, and size-guide measurements are **sample data**, not confirmed merchant information. Product titles, color labels and image associations come from the repository's preview catalog. Descriptions retained from its editorial catalog are supplemented with demo notices.

- **Bag:** IDs and quantities persist in this browser's local storage, with stock caps, sold-out behavior, multi-variant lines, quantity updates and removal. Monetary values are always recalculated from the catalog. Changes synchronize across tabs; if storage is unavailable, the page explains that persistence is unavailable.
- **Checkout:** Add to Bag and Buy Now reach a simulated order summary. Completion clears the bag and displays a temporary demo reference. There is no payment, personal-data form, real order, shipment, or persistent order history.
- **Newsletter:** validates the email field, displays a demo acknowledgement, and does not send or save the address.
- **Social/help:** original Instagram links are preserved and open real external pages. Customer accounts are disabled, matching the source preview configuration.
- **Indexing:** pages send `noindex, nofollow` to distinguish this portfolio copy from the real store.

## Source map

| Path | Purpose |
| --- | --- |
| `theme/` | Independent copy of Liquid templates, with limited demo-specific additions |
| `public/assets/` | Original media/fonts/styles plus browser-local commerce and demo CSS |
| `data/` | Source catalog, editorial descriptions and image provenance |
| `server/catalog.mjs` | Sample prices/stock/variants, search and filtering |
| `server/render.mjs` | Shopify-compatible Liquid rendering adapted from the existing preview |
| `api/storefront.js` | Vercel Node function and HTTP behavior |
| `server/dev.mjs` | Local server with video byte-range support |
| `tests/` | Catalog, cart, rendering and HTTP regression checks |
| `qa/` | Test evidence, screenshots and original-theme hash baseline |

Font license files are retained with the fonts. Brand/creator imagery remains attributed in `data/image-provenance.json`; the demo does not grant new ownership or distribution rights to those assets.
