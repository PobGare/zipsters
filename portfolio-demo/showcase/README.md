# README showcase screenshots

Captured on 31 October 2026 from the current local standalone demo using Playwright and Chromium at **2× device pixel ratio**. These are viewport screenshots with no resizing, retouching, injected styles, or changes to the website design.

| Screenshot | CSS viewport | PNG pixels | Main README display width |
| --- | --- | --- | --- |
| [Desktop homepage](desktop-home.png) | 1440 × 900 | 2880 × 1800 | 960 |
| [Mobile homepage](mobile-home.png) | 390 × 844 | 780 × 1688 | 390 |
| [Desktop product](desktop-product.png) | 1440 × 1000 | 2880 × 2000 | 960 |

The homepage captures show the initial Henleys campaign. The product capture shows `/products/textured-half-sleeve-henley-black` with the complete main gallery and purchase panel. The main README uses explicit image widths, preserves aspect ratios, and links to the original PNGs. GitHub can shrink previews to fit its content column without enlarging them beyond these widths.

## Reproduce

Start the demo with `npm run dev` from `portfolio-demo`, then run from the repository root:

```sh
node portfolio-demo/showcase/capture.mjs
```

The script requires an available `playwright` installation and its Chromium browser. To reuse external tooling without adding storefront dependencies, set `PLAYWRIGHT_MODULE` to the absolute path of Playwright's `index.mjs` and, if needed, `CHROMIUM_PATH` to a Chromium executable. `SHOWCASE_URL` defaults to `http://127.0.0.1:4174`.

Each capture uses a fresh browser context, light color scheme, and the site's existing reduced-motion support to settle the hero on its first slide. The script waits for fonts, decodes all current page images and video posters, and waits for two animation frames before saving lossless PNGs. It verifies the 2× dimensions, loaded fonts, zero broken images, zero horizontal overflow, no open dialogs, no running animations, and no browser or request errors. Results and the browser version are in [capture-manifest.json](capture-manifest.json).

All three images were visually inspected for framing and legibility. Validation also included the demo tests, build, route/asset audit, and original Shopify theme hash audit. The original theme and storefront source were not modified.
