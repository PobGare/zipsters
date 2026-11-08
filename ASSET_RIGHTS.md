# Asset Provenance and Permission Status

**Updated:** 8 November 2026

This document records the provenance and known permission status of the media, branding, fonts, and code used in the ZIPSTERS Shopify theme and standalone portfolio demo.

## Brand Confirmation

ZIPSTERS has confirmed permission for the developer to showcase the ZIPSTERS storefront project publicly as portfolio work.

The confirmation was received through private correspondence and should be retained privately as supporting evidence.

This confirmation establishes permission for the agreed portfolio showcase. It does not automatically establish ownership, unrestricted redistribution rights, or separate permissions from third-party photographers and content creators.

Any uses beyond the scope of the original approval should be confirmed separately.

## Asset Permissions

| Asset Group | Source / Attribution | Permission Status |
|---|---|---|
| ZIPSTERS brand name and logos | Existing storefront branding | ZIPSTERS has confirmed permission for the project to be showcased publicly. Uses beyond the agreed showcase are not established. |
| Brand photography and creator collaborations | `research/image-provenance.json` | Brand approval for the portfolio showcase is recorded. Independent third-party ownership and redistribution rights have not been fully verified. |
| Campaign videos | Video records in the provenance manifest | Brand showcase approval is recorded. Separate creator rights and broader redistribution permissions remain unverified. |
| Portfolio screenshots | Captured from the storefront implementation | May be used within the scope of the confirmed portfolio showcase. Underlying media rights remain applicable. |
| Fonts | Included OFL license files | Governed by their respective open-source font licenses. |
| Project code | Shopify theme and standalone demo implementation | No repository-wide open-source license has been selected. Brand showcase approval does not grant third parties unrestricted code reuse rights. |

## Asset Provenance

`research/image-provenance.json` remains the primary source of truth for asset acquisition and processing history.

`portfolio-demo/data/image-provenance.json` is a self-contained snapshot used by the standalone demo, not an independent permission grant.

The manifest contains 30 image entries and four video entries.

Thirteen images currently lack exact source-post URLs:

- henley-white
- henley-grey
- henley-grey-alt
- henley-long-white
- story-garden
- look-riverside
- mesh-black
- mesh-white
- pleated-pants
- tee-black
- look-studio
- henley-macro
- hero-mesh

These records should remain unchanged until accurate provenance information is available.

## Permission Documentation

The ZIPSTERS confirmation is retained privately.

For future reference, permission records should identify:

- The party granting approval
- The date of confirmation
- The authorized uses and platforms
- Any restrictions or attribution requirements
- A private reference to the original correspondence

Do not publish private client conversations, personal contact details, or confidential permission records in this repository.

Where third-party ownership or redistribution rights remain uncertain, obtain additional permission or use appropriately licensed replacement assets.

## Asset Management

The Shopify theme and standalone portfolio demo intentionally maintain independent media copies.

`portfolio-demo/qa/asset-review.json` documents duplicate asset groups and large files.

The largest retained MP4 fallback is 11,935,779 bytes. Original media, showcase screenshots, and other archived assets also contribute to repository size.

No assets were removed or replaced during the previous maintenance review.

Future media optimization should preserve original files and provenance records, with visual verification before replacing display assets.

---

**Summary:** ZIPSTERS has confirmed public portfolio showcase permission. Third-party media ownership, broader redistribution rights, and uses beyond the agreed scope are not independently established by that confirmation.

This document is a record of the project's known permissions and provenance, not a legal determination.
