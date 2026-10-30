# Zipsters demo QA

Tested locally on 30 October 2026. No deployment or push was performed.

## Automated checks

- `npm ci --offline` successfully installed the pinned dependencies from the existing local cache; the folder has its own lockfile and node_modules.
- `npm test`: 28 passing tests covering catalog data, multi-word search, combined filters, price bounds and sorting, stock caps, sold-out sizes, variant separation, removal, corrupt/tampered cart records, all product routes, local assets, escaped search text, section responses, variant deep links, 404s, and rejected transaction POSTs.
- `npm run build`: 16 main routes render successfully; assets copied into the Vercel static output.
- `npm run audit`: 17 linked route/query combinations, 100 referenced assets, no failures. All 165 original Shopify theme files match their recorded SHA-256 hashes.

- HTTP smoke checks: successful page and predictive-search responses; trailing-slash product deep link; real 404; POST refusal (405); MP4 byte ranges (206) and invalid ranges (416).

## Browser checks

Performed in the in-app Chromium browser. Responsive viewports: 320 × 740, 390 × 844, 768 × 1024, and 1440 × 900.

| Area | Verified behavior |
| --- | --- |
| Responsive layout | Homepage, collection, product, empty search, empty bag and checkout at 320/768/1440 widths; no horizontal overflow or broken visible images |
| Desktop search | Predictive multi-word/color search; ArrowDown + Enter navigates to matching product |
| Mobile menu/search | Menu opens; predictive search finds Pleated Suit Pants and navigates to its page |
| Collection | Brown filter returns one item; filter survives reload; clear restores all eight; price descending sorts correctly; browser Back restores collection URL; mobile Black filter returns three items |
| Product | Desktop gallery advances; mobile gallery scrolls to 2/3; description accordion expands; size guide opens/closes; sold-out XL disables purchasing; size variant is reflected in URL |
| Desktop commerce | Add two M/Black Henleys; increase to three; subtotal changes from PKR 6,580 to 9,870; full bag survives reload; complete demo order clears bag |
| Mobile commerce | Buy Now for size 32 Pleated Suit Pants opens demo checkout with PKR 4,990; Edit Bag and Remove return the empty state |
| Motion | Campaign navigation and pause; desktop WebM and mobile MP4 playback advance through reels; pause stops all videos |
| Keyboard/drawers | Escape closes the mobile menu and restores focus to Open menu |
| Newsletter | Sample address receives explicit no-subscription/no-transmission acknowledgement |

The campaign hero is sticky behind subsequent sections. Locator auto-scrolling initially moved a campaign control behind a category panel in the test driver; repeating the interaction through its accessibility control verified correct campaign selection and pause without changing the source design.

## Scope limits

Responsive viewport testing is not a test on physical iOS/Android devices. Safari and Firefox were not tested. Reduced-motion rules were retained and reviewed in source; OS-level reduced-motion emulation was not available in the browser interface. No real Shopify, payments, accounts, inventory or newsletter service is connected. Vercel configuration is prepared and the local build passes, but an actual hosted deployment has intentionally not been exercised.

Evidence: `audit-results.json`, `responsive-checks.json`, `original-theme-sha256.json`, and the PNG screenshots in this directory.

## UI follow-up — 31 October 2026

Removed the hero pause/play button and its event handling; retained the five-second interval, navigation dots, transitions, and separate film controls. Removed the announcement strip from the shared layout and its desktop/mobile spacing overrides, restoring the original fixed-navbar offsets. Earlier screenshots above describe the initial version.

Follow-up validation: all 28 existing tests, the build, and the 17-route/100-asset audit passed. All 165 original-theme hashes still match. Browser checks at 1440px and 390px confirmed zero announcement strips, no horizontal overflow, and page offsets equal to navbar height (76px desktop / 66px mobile) across collection, product, cart, search, checkout, and 404 pages. The homepage begins at the top beneath the overlay navbar, has three dots and no hero pause button, and still auto-advances. Separate film controls remain. Evidence: final-ui-spacing.json and final-ui-*-home.png. No push or deployment performed.
