# Vercel startup repair — 31 October 2026

## Root cause and reproduction

`server/catalog.mjs` previously selected `process.cwd()` whenever `VERCEL` was set. With a project rooted at `portfolio-demo` inside a larger Git repository, Vercel's Node builder can preserve that prefix in the function bundle. The handler then lives at `/var/task/portfolio-demo/api/storefront.js`, and its data lives at `/var/task/portfolio-demo/data/`, while the process working directory remains `/var/task`.

Consequently, the application attempted `/var/task/data/preview-catalog.json`. That path does not exist even though the actual catalog is packaged under the app directory. Catalog reads run during module initialization, before the handler's `try/catch`, which explains the platform-level `FUNCTION_INVOCATION_FAILED` rather than the application's normal error response.

This was reproduced locally with the official `@vercel/node` 29.0.0 builder **before** applying the fix: the standalone package passed, but the nested package failed at cold start with `ENOENT .../nested.func/data/preview-catalog.json`. Its manifest already contained `portfolio-demo/data/preview-catalog.json`. This reproduces the reported failure without accessing or changing the live deployment. The live deployment artifact itself was not downloaded.

The former `{theme,data}/**` include glob was valid and matched 41 files in the builder. The evidence does not support blaming brace expansion or missing source files. The primary bug was the runtime root assumption. The inclusion rule is now more explicit so the required file types are directly reviewable and checked by the verifier.

## Changes

- `server/catalog.mjs`: use `fileURLToPath(new URL('../', import.meta.url))` in both local and Vercel environments. The Node builder preserves the `.mjs` modules and their relative directory structure.
- `server/render.mjs`: continue using that shared root for Liquid; document why it must not be replaced with `cwd`.
- `vercel.json`: explicitly include `{data/**/*.json,theme/**/*.json,theme/**/*.liquid}` for `api/storefront.js`, using the supported string-valued glob configuration.
- `tests/runtime-paths.test.mjs`: fresh-process regression coverage from an unrelated working directory, both with and without `VERCEL=1`.
- `scripts/verify-function.mjs` and `scripts/smoke-function.mjs`: build real Node function artifacts, inspect file membership, extract them, then cold-import and exercise each packaged handler with `VERCEL=1` and cwd at the bundle root. The smoke test also records every application filesystem read and rejects reads outside the package.
- `package.json` and lockfile: pin the official builder and build utilities as development-only verification tools; add `npm run verify:function`. Production dependency remains `liquidjs`.
- `.gitignore`: ignore the project-local npm cache. Temporary build fixtures stay under the already-ignored `.vercel/` directory.

`api/storefront.js` was inspected; its routing and response behavior need no change. No API rewrite changes, client scripts, CSS, imagery, Liquid design markup, commerce behavior, or source data edits were required. The original Shopify theme outside this folder is unchanged.

## Runtime file inventory

The extracted packages exercised all page types and recorded these **27 application file reads**. Every path below is relative to the app root, which may itself be nested inside the function root.

| Reader | Files |
| --- | --- |
| Catalog module initialization | `data/preview-catalog.json`, `data/catalog-editorial.json` |
| Render context | `theme/config/settings_data.json`, `theme/templates/index.json` |
| Product section configuration | `theme/templates/product.json` |
| Shared page layout | `theme/layout/theme.liquid` |
| Dynamic section rendering | All 16 section files listed below |
| Liquid `render` filesystem adapter | All five snippet files listed below |

Sections under `theme/sections/`:

```text
best-sellers-pair.liquid
demo-checkout.liquid
ending-strip.liquid
footer.liquid
header.liquid
hero.liquid
main-404.liquid
main-cart.liquid
main-collection.liquid
main-product.liquid
main-search.liquid
predictive-search.liquid
product-categories.liquid
product-recommendations.liquid
reels.liquid
social-editorial.liquid
```

Snippets under `theme/snippets/`:

```text
cart-drawer.liquid
icon.liquid
image.liquid
predictive-search-form.liquid
product-card.liquid
```

Liquid also checks file existence through `fs.access` while resolving snippets. The inclusion glob conservatively packages every theme JSON/Liquid file, including currently unused sections, locale/schema files and other template JSON files, plus all three data JSON files (the provenance file is documentation, not a runtime read).

Node itself loads the three application modules and traced Liquid dependency files; these are listed in `function-package.json`. Images, fonts, styles, browser scripts and videos are served from `dist/assets` on Vercel's CDN. Only `server/dev.mjs` reads `public/assets/*` at runtime in local development; it is not the deployed function entry point. Build/audit scripts and QA files are not application runtime dependencies.

## Verification

- `npm test`: **30 passed**, including the two new cold-start/path regression tests.
- `npm run build`: **16 routes** rendered; static output generated successfully.
- `npm run audit`: **17 linked route/query combinations**, **100 referenced assets**, no failures; **165 original-theme hashes unchanged**.
- `npm run verify:function`: official Node builder generated both standalone and nested **Node.js 24** artifacts. Each contained **47 files**, including **all 41 data/template files**. Each passed **23 route/method checks** (46 total), covering eight products, collections, search, predictive results, filter fragments, bag, checkout, 404s, HEAD and POST refusal. The latest hero still has three dots, no pause button or announcement strip, and the separate film control remains.
- Manifest and actual filesystem reads: `qa/function-package.json`.

Verification runs on local Windows with actual Vercel builder artifacts and fresh Node processes, not on a hosted Linux function. No Vercel credentials, linking, upload, push or deployment occurred. A hosted check remains for the user's next deployment.

References: [Vercel function inclusion configuration](https://vercel.com/docs/project-configuration/vercel-json), [Node builder source](https://github.com/vercel/vercel/blob/main/packages/node/src/build.ts). The builder includes explicit files relative to the project work path and preserves paths relative to the repository base in the resulting function.
