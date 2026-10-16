# ZIPSTERS final review — 15 October 2026

## Final requested changes

- Heading: AFTER HOURS, IN HENLEYS.
- Subheading: A sharper take on dressing down.
- Button: SHOP HENLEYS. All three elements remain centered at desktop and mobile sizes.
- Desktop now selects the highest observed official 1080 × 1920, 30 fps video streams, remuxed to WebM without recompression or resizing. All 360 encoded video packets per clip match the retained official original. H.264 CRF 18 / 30 fps compatibility fallbacks are included. Existing mobile video files and crop remain unchanged.
- Three 12-second clips rotate by hard cut: brown Henley (DaudVaYtcpS), white Henley (DVi9uSjjEKW), dark Henley with brown trousers (DNknE9HtSiX). Only one plays at a time; the next buffers two seconds before the cut. Offscreen playback pauses. No controls or social icon were added.
- Fixed one real QA issue: the local preview's legacy /favicon.ico request now redirects to the existing brand favicon.

## Rendered and interaction QA

- 56 recorded route/viewport checks: homepage, all four collections, black short-sleeve Henley PDP, white long-sleeve Henley PDP, raw denim PDP at 1440, 1280, 1024, 768, 430, 390 and 360px.
- No recorded horizontal overflow or broken images. Final video copy/crop rechecked at every listed width after the copy/source change; screenshots saved in research/qa/final-video-*.png.
- Hero: 5000ms duration, three visible centered indicators, manual selection resets timer, arrows/keyboard and mobile swipe work. Hero height stays stable; category begins at its bottom and overtakes after natural initial scroll. No visible pause/play controls.
- Best Sellers: two visible images at desktop/tablet; one on mobile. Get the Look: four images, 2×2 mobile, hover seam corrected in the preceding pass; Instagram CTA centered.
- Navbar search autofocuses. Shop search does not autofocus; results remain inside the drawer. Keyboard result selection, empty/no-results state and full search route verified. No black input focus box.
- AJAX filters, sort, Clear All and browser Back/Forward verified. Server logs confirm section requests rather than document reloads. Rapid color changes settle on the latest selection. View control absent.
- Three PDPs: Next/Previous and keyboard navigation passed; desktop thumbnail 3→2 and native mobile horizontal swipe passed. Add to Bag and Buy Now both correctly display the preview purchase notice. Empty cart drawer opens/closes correctly.
- No browser console errors/warnings observed in final storefront checks. Historical network log found one favicon 404; fixed and independently retested as HTTP 200 after redirect. All six desktop video endpoints return HTTP 206 with correct MIME types.
- Old “ZIPSTERS / Clothes with character.” content absent from theme files.

## Validation

- Shopify CLI Theme Check: 37 files inspected, no offenses (zero errors/warnings).
- npm run check: 37 Liquid/JSON files and configured media validated.
- npm run audit: 16 linked pages, 95 referenced assets, zero errors.
- JavaScript syntax checks and git diff --check passed.
- No commit or release package created.

## Remaining limitations

- Instagram only exposes 1080px-wide portrait sources for these reels. The desktop stream now preserves that source exactly, but full-width 1280/1440 display and the wide crop still magnify its inherent optical/compression softness. A genuinely sharper master requires original higher-resolution or landscape footage from Zipsters; no artificial upscaling/sharpening was used.
- Live Shopify catalog, variants, availability, prices, cart mutation and checkout are not connected in this presentation. Preview interactions are verified; a real transaction and inventory behavior cannot be certified yet.
- QA used the connected Chromium in-app browser at requested viewport sizes. Physical iOS/Safari/Android and the H.264 fallback in a non-VP9 browser were not separately exercised.

## Exact files changed in the final video/QA continuation

- theme/sections/reels.liquid
- theme/templates/index.json
- theme/assets/reels.js
- theme/assets/reel-brown-desktop.webm
- theme/assets/reel-brown-desktop.mp4
- theme/assets/reel-white-desktop.webm
- theme/assets/reel-white-desktop.mp4
- theme/assets/reel-navy-desktop.webm
- theme/assets/reel-navy-desktop.mp4
- scripts/preview.mjs
- scripts/check.mjs
- research/image-provenance.json
- research/FINAL-REVIEW.md

QA captures/logs are ignored local evidence under research/qa, not theme files.

## Complete uncommitted build manifest

The following includes work carried forward from earlier approved client passes, not just the final video changes. Existing revisions were preserved.

```text
 M research/catalog-editorial.json
 M research/image-provenance.json
 M scripts/check.mjs
 M scripts/preview.mjs
 M theme/assets/theme.js
 M theme/layout/theme.liquid
 M theme/sections/featured-collection.liquid
 M theme/sections/footer.liquid
 M theme/sections/header.liquid
 M theme/sections/hero.liquid
 M theme/sections/main-cart.liquid
 M theme/sections/main-collection.liquid
 M theme/sections/main-product.liquid
 M theme/sections/main-search.liquid
 M theme/sections/product-recommendations.liquid
 M theme/sections/social-editorial.liquid
 M theme/snippets/cart-drawer.liquid
 M theme/snippets/image.liquid
 M theme/snippets/product-card.liquid
 M theme/templates/index.json
 M theme/templates/product.json
?? assets/originals/reel-black.mp4
?? assets/originals/reel-brown.mp4
?? assets/originals/reel-navy.mp4
?? assets/originals/reel-white.mp4
?? assets/originals/wardrobe-cafe.jpg
?? assets/originals/wardrobe-studio.jpg
?? assets/originals/wardrobe-urban.jpg
?? research/preview-catalog.json
?? theme/assets/campaign-slider.js
?? theme/assets/collection-filters.js
?? theme/assets/commerce.css
?? theme/assets/hero-mesh-1200.jpg
?? theme/assets/hero-mesh-2400.jpg
?? theme/assets/hero-mesh-480.jpg
?? theme/assets/hero-mesh-960.jpg
?? theme/assets/hero-wardrobe-1200.jpg
?? theme/assets/hero-wardrobe-2400.jpg
?? theme/assets/hero-wardrobe-480.jpg
?? theme/assets/hero-wardrobe-960.jpg
?? theme/assets/look-studio-1200.jpg
?? theme/assets/look-studio-480.jpg
?? theme/assets/look-studio-960.jpg
?? theme/assets/predictive-search.js
?? theme/assets/reel-black-poster.jpg
?? theme/assets/reel-black.mp4
?? theme/assets/reel-brown-desktop.mp4
?? theme/assets/reel-brown-desktop.webm
?? theme/assets/reel-brown-poster.jpg
?? theme/assets/reel-brown.mp4
?? theme/assets/reel-navy-desktop.mp4
?? theme/assets/reel-navy-desktop.webm
?? theme/assets/reel-navy-poster.jpg
?? theme/assets/reel-navy.mp4
?? theme/assets/reel-white-desktop.mp4
?? theme/assets/reel-white-desktop.webm
?? theme/assets/reel-white-poster.jpg
?? theme/assets/reel-white.mp4
?? theme/assets/reels.js
?? theme/sections/best-sellers-pair.liquid
?? theme/sections/ending-strip.liquid
?? theme/sections/predictive-search.liquid
?? theme/sections/product-categories.liquid
?? theme/sections/reels.liquid
?? theme/snippets/predictive-search-form.liquid
?? research/FINAL-REVIEW.md
```
