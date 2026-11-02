# Root script guide

Run supported commands from the repository root. These tools are separate from `portfolio-demo/scripts/`.

| Current command | Inputs | Outputs / effect |
| --- | --- | --- |
| `npm run dev` | `theme/`, `research/preview-catalog.json`, `research/catalog-editorial.json` | Loopback presentation server on port 4173; no merchant transactions |
| `npm run check` | Theme Liquid/JSON and configured image paths | Validation only |
| `npm run audit` | Running root preview on port 4173 | `research/qa/link-audit.json`; no theme edits |
| `npm run package` | `theme/` | Replaces `dist/zipsters-theme.zip`; no upload/deploy |

## Historical generators — maintenance only

These are one-off transformations for earlier theme revisions, not idempotent setup/build steps. They can overwrite approved work. Do not run without separately reviewing their inputs/outputs and obtaining authorization to modify the original theme. In particular, `asset-audit.mjs` is **not a read-only audit**.

| Script | Inputs | Writes / effects |
| --- | --- | --- |
| `configure.mjs` | Embedded original configuration | Theme settings/templates JSON |
| `prepare-assets.ps1`, `refinement-assets.ps1` | `assets/originals/*.jpg`, embedded mappings | Resized JPEGs in `theme/assets/` |
| `macro-crop.ps1` | Retained original photo | `theme/assets/henley-macro-*.jpg` |
| `fonts.mjs` | Google Fonts CSS and downloads, current layout/CSS | Font binaries, fonts CSS, theme CSS/layout |
| `provenance.mjs` | Mappings in `prepare-assets.ps1` | Overwrites `research/image-provenance.json`; may discard later researched entries |
| `asset-audit.mjs` | Existing theme assets, remote font license texts | Moves selected theme images to `assets/unused-renditions/`; writes research font licenses |
| `campaign-mobile.mjs` | Campaign section and layout | Rewrites those theme files |
| `hero-loading.mjs` | Hero and image snippet | Rewrites responsive loading markup |
| `final-polish.mjs` | Homepage JSON and header | Rewrites those theme files |
| `refine-sections.mjs` | Existing sections/templates | Rewrites theme sections and homepage/product JSON |
| `refine-interactions.mjs` | Theme JS, layout and refinements CSS | Rewrites those theme files |
| `refine-preview.mjs` | Preview server | Rewrites `scripts/preview.mjs` |
| `qa-refinements.mjs` | Theme snippets/layout/sections/CSS and preview | Rewrites theme and preview; despite its name, not a validation script |
| `qa-contact.ps1` | Existing `research/qa/homepage-*.jpg` screenshots | Review contact sheets in `research/qa/` |

The 2026-11-02 maintenance pass did not run any of these historical generators.
