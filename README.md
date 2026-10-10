# ZIPSTERS — client presentation

A custom Shopify Online Store 2.0 theme with a local presentation server. The preview renders the same Liquid sections used by the theme.

## View and run

- Open http://localhost:4173 while the preview process is running.
- `npm install` then `npm run dev` starts the local preview.
- `npm run check` validates Liquid/JSON structure and bundled image references.
- `npm run audit` checks internal pages and asset links (preview server must be running).
- `npm run package` creates `dist/zipsters-theme.zip` for Shopify theme upload.
- Official validation: `npx --offline --cache .npm-cache @shopify/cli theme check --path theme` (uses the CLI cached during this build).

## Presentation scope

Complete homepage, responsive navigation/mega menu, mobile navigation, editorial lookbook, search, collection filtering/sorting, product galleries and bag drawer. Preview merchandising uses product names observed on the official Instagram account. No prices, stock assertions, promotions, reviews or material specifications have been invented.

The local preview does not accept orders or store newsletter submissions. The production theme uses Shopify product objects, variants, cart endpoints and customer forms. Backend behavior must be tested on the actual store before launch.

## Merchant setup before live launch

1. Upload the theme as an unpublished Shopify theme.
2. Select real products and collections in the homepage sections. Update navigation and presentation fallback links to match actual store handles.
3. Supply verified prices, variants, size guides, descriptions, fit, care and material data through the catalog and optional product metafields.
4. Configure real policies, payment methods, shipping, taxes, markets and domain.
5. Verify add/change/remove cart operations, checkout, newsletter consent and submission, filters, accounts if enabled, and localization in the real Shopify environment.
6. Replace the typeset wordmark with an approved logo file if the brand supplies one. Image picker controls accept merchant-managed desktop/mobile campaign photography.

Homepage order and editorial copy/images are controlled by JSON templates and section settings. Social photographs link to their Instagram sources. Help links and store policies only render when configured.

## Files

- `theme/`: uploadable Shopify theme.
- `assets/originals/`: genuine Instagram downloads retained unchanged.
- `assets/unused-renditions/`: excluded generated sizes, retained locally.
- `research/image-provenance.json`: original-to-theme image mapping.
- `research/qa/`: full-page browser screenshots, breakpoint and link audit results.
- `research/QA.md`: final validation and presentation notes.

No fashion photography was generated or sourced from stock libraries or reference brands. Reference sites informed composition and ecommerce UX only.
