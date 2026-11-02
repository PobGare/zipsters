# Asset provenance and permission status

Reviewed 2 November 2026. No new ownership, permission or client relationship is asserted here. This is a documentation inventory, not a legal determination.

| Asset group | Source / attribution | Owner and permitted use | Permission evidence |
| --- | --- | --- | --- |
| Brand photography and creator collaborations | Per-image source profiles/posts in `research/image-provenance.json` | Relevant photographers/creators/brand rights holders need confirmation; public portfolio redistribution permission is not established | No written grant found in reviewed repository records |
| Campaign films | Four entries under `videos` in the same manifest; source posts and processing notes retained | Rights holder and permission for hosted copies/derivatives need confirmation | No written grant found |
| ZIPSTERS names/logos | Existing theme branding | Brand affiliation/endorsement not established by source files | No trademark-use approval recorded |
| Barlow Condensed, DM Sans, Libre Caslon Display fonts | Included OFL texts in `research/font-licenses/`, theme assets and demo assets | Governed by their respective included font license terms | License texts present; these do not cover photographs, video, brand or project code |
| README and QA screenshots | Captures of this storefront | Include underlying brand/media content and inherit its unresolved permissions | A screenshot does not create new rights to the depicted media |
| Project code | Repository implementation | No repository-wide code reuse license has been chosen here | Owner must intentionally choose terms; no license invented during maintenance |

`research/image-provenance.json` is the source of truth for acquisition and processing history. `portfolio-demo/data/image-provenance.json` is its self-contained demo snapshot, not an independent grant. The manifest has 30 image entries and four video entries; 13 images have no exact source-post URL. Preserve honest `null` values until researched: henley-white, henley-grey, henley-grey-alt, henley-long-white, story-garden, look-riverside, mesh-black, mesh-white, pleated-pants, tee-black, look-studio, henley-macro and hero-mesh.

Recommended rights record per asset: confirmed rights holder, original post/file ID, authorized uses (public repository, hosted portfolio, derivatives, screenshots), attribution requirements, restrictions/expiry, approval date and a private permission-reference ID. Retain private correspondence privately; publish only a non-sensitive reference and confirmed scope. If permission cannot be established, obtain permission or plan approved licensed replacements. No infringement finding or permission claim follows from the current evidence.

Independent theme/demo media copies are intentional. `portfolio-demo/qa/asset-review.json` inventories duplicate groups and large files. The largest retained MP4 fallback is 11,935,779 bytes; originals and showcase PNGs also contribute substantially. No assets were deleted, recompressed or substituted. Future responsive display derivatives must preserve archival originals/provenance and pass visual comparison; no performance gain is claimed without measurement.
