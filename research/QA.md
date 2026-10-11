# Final pre-client QA — 12 October 2026

## Baseline and eight scoped changes

Started with a clean working tree at committed baseline `274d23a`. No destructive Git commands or new commits were made. Changes remain uncommitted for review. Approved identity, homepage hero, image grid, typography and mobile editorial layouts are preserved.

1. **Shop close artifact:** the fixed header wrapper no longer paints a border beneath the expanded dropdown. The dropdown owns its background and bottom border, so they disappear together. Existing JavaScript motion is unchanged: 240ms open, 220ms close.
2. **Header flash:** the main bar owns its background and responds independently to the existing scroll-state class. Shop no longer transfers the background between two overlapping surfaces. The scrolled header remains opaque through closure.
3. **Everyday Uniform:** desktop detail photography extends toward the central image boundary without a restrictive maximum width. Final widths are approximately 530px at 1440, 470px at 1280 and 393px at 1024. Its 16:9 crop contains the wider inset without an oversized vertical block. Mobile composition is unchanged. Responsive image sizing was updated.
4. **Zipsters Edit:** desktop copy and its CTA move one column inward, with more usable text width and separation from the preceding caption. Image positions, type sizes and mobile layout are unchanged.
5. **T-shirts & mesh:** replaced the hero with the sharper real Zipsters `mesh-black` cafe photograph, from retained 3072x4096 original `747743820.jpg`. Added a 1600px responsive rendition without upscaling and updated provenance. Merchant-selected photography still takes precedence.
6. **Pants & denim:** restored base collection sizing: 55svh, minimum 440px, maximum 590px. The original denim image uses cover and a waist-focused crop. At a 900px desktop viewport height, Pants, Henleys and T-shirts measure 495px. The separately approved Wardrobe hero retains its existing taller treatment. Mobile Pants uses the standard 260px image area; text wrapping can make total mobile hero heights differ.
7. **Footer JOIN:** the arrow shifts 4px right and 2px up using the established CTA timing. The existing field border brightens without adding a second line. Keyboard focus uses the same treatment; reduced-motion preferences disable transitions.
8. **Mobile drawers:** menu and cart leave an 18px exposed edge. Menu is left-anchored; cart is right-anchored. Both retain full height. Desktop cart remains 480px wide.

## Current rendered verification

Actual Chromium checks covered **1440, 1280, 1024, 768, 430, 390 and 360px**. The homepage and both changed collection pages were inspected at every width. Desktop story and Edit compositions were reviewed at all requested desktop sizes; preserved mobile compositions were also visually checked.

- Seven-width matrix: no horizontal document overflow or broken loaded images.
- Header cycles at scroll positions 0px, 450px, 900px and deep in the homepage: no change to body width, logo position, scroll position or header height. Below the hero, the observed bar background remained `rgb(247, 246, 242)` through Shop, Search and cart cycles.
- Shop toggle, Escape, outside click and six repeated toggles settle to hidden/closed with `aria-expanded=false`. The wrapper has no border; the panel owns the fading border. Direct Shop-to-Search and Shop-to-cart transitions also pass.
- Mobile menu/cart at 430/390/360: 18px exposed edge, full 844px test height, stable page/header position and released scroll lock after closing. Backdrop dismissal and Escape restore the originating control. Menu-to-Search restores focus to the menu opener on close. Keyboard Tab reaches links inside the active modal.
- Scrolling the background while the cart is open does not move the page. No interaction-induced content shift was observed. Fixed overlay geometry does not reflow content. This is not a Lighthouse CLS score or cross-browser certification.
- JOIN hover in/out, repeated hover and keyboard focus preserve button dimensions and the single border width; only border color and arrow transform change.
- Final browser console: **zero errors and zero warnings**.

Evidence: `research/qa/final-final-*` contains seven homepage captures, fourteen collection captures, mobile drawer captures, desktop editorial captures, `final-final-header.json` and `final-final-responsive.json`. Generated evidence is Git-ignored.

## Current technical results

- Official Shopify Theme Check: **31 files, zero offenses**.
- `npm run check`: Liquid/JSON and configured imagery passed.
- `npm run audit`: **15 pages, 92 referenced assets, zero errors**.
- Both theme JavaScript files pass syntax checks; neither changed this pass.
- `git diff --check`: passed; only normal Windows line-ending notices.

Changed files: `theme/assets/final-polish.css`, new `theme/assets/mesh-black-1600.jpg`, `theme/sections/editorial-story.liquid`, `theme/sections/main-collection.liquid`, `theme/snippets/image.liquid`, `research/image-provenance.json`, and `research/QA.md`.

## Current presentation status

No known issue from these checks blocks presenting this build to Zipsters. `http://localhost:4173/` is local: remote client review needs a hosted preview or screen-share, not that address alone.

Live launch still requires the real Shopify catalog, prices, inventory, policies, payments and shipping configuration. Cart mutations, checkout and newsletter submission need verification against that store. No commerce data was invented and no real order or subscription was created. Physical mobile devices and Safari remain part of live-store verification.

---

# Previous pass record — 11 October 2026

## Scope and baseline

The final polish pass started from clean, committed baseline `fc5a142` (Refine product pages, galleries and responsive storefront). No destructive Git commands were used. Final polish changes remain uncommitted for review.

The approved homepage hero, fonts, palette, navigation structure, merchandising, garment detail section, social section, footer and product page design were preserved. Photography remains genuine Zipsters imagery. No prices, inventory, promotions or specifications were invented.

## Final changes

- Editorial text CTAs paint one 1px underline. A single background fill animates across that row, eliminating the competing border and transformed pseudo-element. Hover and keyboard focus finish in a stable state without changing link dimensions.
- The Everyday Uniform secondary photograph is wider and reaches farther left. Its main photograph, copy and mobile composition remain intact.
- Off the Clock retains both approved photographs. A localized desktop gradient improves the reading area while leaving the left side untreated. Tablet typography and mobile contrast were reviewed separately.
- The Zipsters Edit uses a twelve-column desktop spread: a dominant architecture portrait, a smaller café portrait, and a landscape image bridging the lower-right gutter without covering the model. Captions and copy follow the grid. Mobile uses its own sequential composition. The CTA has a separate row, including a verified 22–24px gap after the copy at tablet/desktop sizes.
- Henleys uses the white Henley close-up, emphasizing neckline and placket. T-shirts & mesh uses the clear black 86 mesh styling photograph. The Wardrobe uses the full white-Henley/black-trouser architecture portrait. Pants & denim retains its photograph with corrected canvas ratio and focal position to preserve the waistband and hems. Collection typography and split structure are retained.
- Four 1600px renditions were produced from retained originals without upscaling. Responsive sources and the provenance manifest were updated.
- Shop keeps its original 240ms opening animation. Closing reverses over 220ms, keeps the panel mounted until completion, and handles interrupted animations from their current visual frame. The panel becomes inert while closing.
- Search separates the muted EXPLORE eyebrow from stronger interactive links, with subtle arrow and underline states.

## Validation

- Official Shopify Theme Check: **31 files inspected, zero offenses**.
- `npm run check`: Liquid, JSON and configured imagery validation passed.
- `npm run audit`: **15 pages, 91 referenced assets, zero errors**.
- JavaScript syntax checks passed for both theme scripts.
- `git diff --check`: passed; Git only reported normal Windows line-ending normalization notices.
- Browser console: no errors or warnings in the final local QA session.

## Browser checks

Homepage and all four collections were checked at **1440, 1280, 1024, 768, 430, 390 and 360px**. No horizontal document overflow or broken loaded images were found. Story, campaign, Edit and collection captures were reviewed, followed by targeted retests of final crop and spacing adjustments.

The mobile homepage is shorter than the approved baseline: 430px went from 7392 to 7330px; 390px from 7077 to 7041px; 360px from 6838 to 6803px, at the same 844px viewport height. At 1440×1000 the homepage decreased from 7789 to 7469px.

Interaction checks:

- All seven homepage editorial CTAs and four collection CTAs: hover in/out and consistent shared 1px styling. Repeated enter/leave and keyboard focus were additionally checked on the Henley collection link; its bounding rectangle remained unchanged.
- Shop close through its toggle, Escape, outside click and opening Search; repeated toggles settle correctly. The closing panel was observed with `hidden=false`, its closing state and fading opacity, then `hidden=true` after completion.
- Desktop Search caused zero change to body width, logo x-coordinate or scroll position. Mobile menu-to-Search transitions were checked at 430, 390 and 360px.
- Existing product galleries, related products, preview purchase dialogs, filters, sorting, mobile navigation and bag behavior were exercised during the preceding approved refinement pass. No product-page implementation changes were made in this final surgical pass.

Evidence is stored under `research/qa/final-polish/`: responsive matrices, interaction results, section captures, collection captures, Search captures and final full-page screenshots. Generated QA files are intentionally Git-ignored.

## Presentation and launch status

No known visual or interaction issue remains that blocks the local client presentation. The preview is a presentation build, not a configured live store.

Live launch still requires the actual Shopify catalog, prices, variants, availability, policies, payment/shipping configuration and store access. Cart mutations, checkout and newsletter/customer submissions must be verified against that real store. Local purchase controls and newsletter forms intentionally explain the preview limitation; no real order or subscriber was created during QA.

QA used Chromium viewport emulation. Physical iOS/Android and Safari testing remain part of live-store launch verification. No Lighthouse score or universal error-free guarantee is claimed.
