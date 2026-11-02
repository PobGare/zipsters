# ZIPSTERS — Shopify Liquid theme and standalone portfolio demo

**A fashion storefront implementation with editorial design, local demo commerce and a separately maintained Shopify theme.**

[**Live Website**](https://zipsters-demo.vercel.app) | [**GitHub Repository**](https://github.com/PobGare/zipsters)

**Demo checkout; no real orders or payments.** The linked website runs the standalone demo, not a connected Shopify store.

---

## Project Overview

ZIPSTERS presents a custom storefront implementation using Zipsters brand imagery. This repository documents the theme, frontend interactions and standalone demonstration; it does not establish commissioned engagement, brand endorsement or production merchant use.

The project focuses on creating a premium shopping experience through strong visual storytelling, responsive layouts, intuitive product discovery, and smooth interactions.

Built with a mobile-first mindset, the storefront combines fashion-focused presentation with practical e-commerce functionality.

## Preview

Captured from the standalone demo in Chromium at 2× device pixel ratio. Click any preview to view the full-resolution image.

### Desktop Homepage

<a href="portfolio-demo/showcase/desktop-home.png">
  <img src="portfolio-demo/showcase/desktop-home.png" alt="ZIPSTERS desktop homepage with the Henleys campaign and category previews" width="960">
</a>

### Mobile Experience

<p align="center">
  <a href="portfolio-demo/showcase/mobile-home.png">
    <img src="portfolio-demo/showcase/mobile-home.png" alt="ZIPSTERS mobile homepage with responsive navigation and the Henleys campaign" width="390">
  </a>
</p>

### Product Detail Page

<a href="portfolio-demo/showcase/desktop-product.png">
  <img src="portfolio-demo/showcase/desktop-product.png" alt="ZIPSTERS desktop product page with the Black Henley gallery, size selector, and purchase controls" width="960">
</a>

## Key Features

### Homepage & Visual Experience

- Automatic hero slideshow with smooth transitions
- Responsive product category navigation
- Best Sellers showcase
- Editorial product photography
- Get the Look section with fashion content
- Responsive header, navigation, and footer

### Product Pages

- Interactive product image galleries
- Thumbnail navigation and image controls
- Mobile-friendly product browsing
- Product information and details
- Add to Bag and Buy Now interfaces
- Related product recommendations

### Shopping Experience

- Product search and suggestions
- Collection filtering and sorting
- Interactive shopping bag drawer
- Persistent cart in the standalone demo
- Responsive navigation and mobile menu
- Smooth transitions and carefully managed scrolling

## Technology Stack

- **Shopify Liquid** — Custom theme templates and sections
- **HTML5** — Semantic page structure
- **CSS3** — Responsive layouts, styling, and animations
- **JavaScript** — Interactive storefront functionality
- **Node.js** — Standalone demo rendering and supporting functionality
- **Vercel** — Public deployment of the standalone demo

## Shopify Theme & Live Demo

The repository contains the original Shopify theme and a separate standalone portfolio demo.

The original theme is designed for integration with a Shopify store.

The [live demo](https://zipsters-demo.vercel.app) recreates the storefront experience independently of Shopify so visitors can explore its layout, product pages, navigation, search, filters, and shopping interactions.

**Note:** The standalone demo uses illustrative product data and simulated checkout functionality. It does not process real orders or payments.

## Responsive Design

ZIPSTERS is designed for desktop, tablet, and mobile browsing, with particular attention to:

- Responsive image presentation
- Touch-friendly navigation
- Consistent typography and spacing
- Mobile product galleries
- Smooth shopping interactions
- Usable layouts across screen sizes

## Development & Testing

Use Node.js 24 and npm. From the repository root:

```sh
cd portfolio-demo
npm ci
npm run dev
```

Open `http://localhost:4174`. In another terminal in `portfolio-demo`, run `npm test`, `npm run audit`, `npm run build`, and `npm run verify:function`. The build emits static assets; the Vercel Node function renders pages, so `dist` alone is not a complete website.

For the separate Shopify presentation preview, run `npm ci` and `npm run dev` at the repository root (port 4173). Root `npm run check` validates Liquid/JSON; root `npm run audit` requires that preview server running. Shopify production setup still requires a real catalog, inventory, policies, payments and shipping.

The hosted Vercel demo is working; the October startup error is a historical repaired issue, not its current status. See the [maintenance report](portfolio-demo/qa/MAINTENANCE.md) for current checks, dependency advisories, asset rights gaps and browser limitations. Checkout only simulates completion and never takes payment or creates a real order.

The Shopify theme is maintained separately from the demo implementation.

| Path | Purpose |
| --- | --- |
| `theme/` | Original Shopify Liquid theme; not modified in this maintenance pass |
| `portfolio-demo/` | Independently runnable Vercel demo, copied media, sample catalog and tests |
| `assets/` | Retained original photography and archival renditions |
| `research/` | Catalog/provenance, font licenses and dated historical QA |
| `scripts/` | Root preview/check/package tooling plus historical generators; see [script guide](scripts/README.md) |

The theme and demo intentionally retain independent asset copies. Do not delete duplicates or rerun historical generators as routine setup. [Asset rights](ASSET_RIGHTS.md) records permission gaps and the provenance source of truth.

Photo/video attribution is recorded in the provenance manifests, but attribution is not permission to redistribute. Written brand/creator authorization should be retained for public portfolio use; no such grant is established by this repository. Font license texts are included. No media was removed or replaced during maintenance.

## Developer

**Muhammad Bin Qasim**  
Web Developer

[Portfolio](https://pobgare.github.io/portfolio/) | [GitHub](https://github.com/PobGare)

---

*Developed as a custom fashion e-commerce storefront project.*
