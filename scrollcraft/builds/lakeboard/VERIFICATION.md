# Verification

18 November 2026. Browser QA used the supported Computer Use browser interface against the built `dist/` site at `/LakeBoard_website/`, matching the GitHub Pages project base.

## Checks completed

- `npm run check`: unique IDs, local asset existence, project-relative URLs, section anchors, seven gallery mappings, alt attributes, one h1, viewport/language declarations, motion/dialog hooks, JavaScript syntax and a 2 MB asset budget.
- `npm run build`: dependency-free static output. All raster assets together are about 703 KiB; the full output is about 1.2 MB on disk.
- Desktop: 1440 × 900 and 1280 × 720. Inspected hero depth, origin, assembly entry/intermediate/settled frames, gallery, authoring and detail surfaces.
- Phone: 390 × 844 and 360 × 640. No document-level horizontal overflow. The gallery selector intentionally scrolls horizontally. Assembly uses normal flow, with no pinned spacer.
- All seven gallery choices update image, caption, accessible label and selected state. Exactly one choice remains pressed.
- All four file choices update their description and selected state.
- Gallery, refresh and mobile image dialogs open. Native modal focus is contained; Escape closes and returns focus to the opening link. Phone dialog stays within the viewport.
- Copy command action reports success. Clipboard contents were not independently confirmed by pasting into another application.
- Reduced-motion mode tested using the site's footer control: parallax is removed, assembly is settled, stage is relative and the tall pinned spacer is removed. System `prefers-reduced-motion` is handled in both CSS and JavaScript; the browser interface did not provide OS media emulation, so that system preference was reviewed in source rather than separately emulated.
- Browser console inspection returned no warnings or errors during the tested local journey.
- Core palette contrast: ink/paper 14.43:1; secondary body text/paper 4.92:1; secondary text/navy 9.04:1; lavender/navy 7.71:1; indigo/paper 5.66:1.
- Authoring-guide GitHub link resolved to the existing public file.
- Without-JavaScript fallback was inspected in source: all essential prose, settled assembly, GitHub links and direct screenshot links remain available. JavaScript-disabled browser behavior was not separately emulated.

## Visual evidence

- `evidence/desktop-1280.jpg`
- `evidence/mobile-390.jpg`
- `evidence/mobile-360.jpg`
- `evidence/assembly-start.jpg`
- `evidence/assembly-mid.jpg`
- `evidence/assembly-end.jpg`
- `evidence/reduced-motion.jpg`

These are browser captures, not generated product mockups. `src/assets/social-preview.jpg` is a capture of the finished page for link previews.

The upstream `shoot.mjs` harness was not run: it uses a separate browser automation path. Equivalent visual sampling and functional interaction checks were performed through the supported browser interface. No video scrub, generated-image pipeline, external font request or paid generation service is used.

## Feel check

Intended: possibility → recognition → relief (peak) → curiosity → confidence → agency → readiness.

Observed: the layered hero makes the software tangible; the quiet origin gives a reason for the shared host; converging screens explain the architecture without a long description. Gallery choices and actual freshness/mobile captures supply evidence after the motion peak. The file inspector makes the repository handoff concrete.

Changes from inspection: scaled the assembly by available viewport height so cards clear its bottom copy at 720 px; kept mobile and reduced-motion layouts in ordinary flow; corrected a missing space in the small-screen heading; removed quotation marks from the authored paraphrase of the creator's story. No invented quotation remains.

## Scope and limits

This verifies the public static showcase, not LakeBoard's backend, user permissions, warehouse query correctness or mobile native-app compatibility. No Lighthouse performance score, pixel-perfect cross-browser guarantee, screen-reader audit or independent savings benchmark is claimed. The site has no Databricks connection or secrets.

## 18 November cost/governance update

- Added Azure Australia East USD price evidence, queried from Microsoft's public Retail Prices API. Independently selected Azure Premium / Australia East on the official Databricks Apps pricing page, which displayed $1.00/DBU.
- Added `npm test` with five domain checks: captured rates, PAYG annualization versus reservation term pricing, capacity deltas, the 50-to-1 hosting example, and 1/100-dashboard boundaries plus invalid counts. All passed. Static checks and build passed after the changes.
- The public model holds existing warehouse/data-platform spend constant on both sides, per user clarification. It adjusts potential savings only for changes in operating costs.
- Tested the new desktop sections at 1280 × 720 and phones at 390 × 844 / 360 × 640. No page-level horizontal overflow; the Fabric table and identity routes fit the phone widths.
- Keyboard-operated the dashboard-count slider at 1, 50, 51 and 100. Observed $0 saving at 1, $214,620 at 50 and $438,000 standalone hosting at 100. Shared-instance cost stays $4,380/year.
- Opened and closed the sources/method disclosure. Added a page-level layout event so following reveal positions are recalculated after its height changes.
- Tested the reduced-motion control again; the assembly is relative and the cost values remain available.
- Opened the new refresh crop in the image dialog on desktop and phone; confirmed the source image is 378 × 229. Escape closes it. No generated UI or altered text.
- Browser console inspection returned no warnings or errors in the tested local update.
- Additional evidence: `evidence/costs-desktop.jpg`. Earlier screenshot evidence and the initial asset-size figure above describe the initial release; the updated image assets total about 674 KiB.

Sizing/department extension: six cost-model tests now pass, including Large ($8,760/year), conditional XLarge ($26,280/year) and four Medium department apps ($17,520/year). The department-to-UC diagram and sizing table were inspected at 1280 × 720 and 360 × 640; both fit without document overflow. `evidence/departments-desktop.jpg` records the deployment option. The headline/description now allow one team portal or separate department portals. XLarge's regional availability remains explicitly unverified, rather than implied by its price.


## Portfolio styling, business hours and fresh capture revision

18 November 2026. This amendment supersedes the initial paper/navy colour direction and the earlier refresh crop above; earlier evidence remains historical.

- Matched aiagents.nz's consistent dark canvas (#06080C), cyan/teal highlights, Plus Jakarta Sans headings and Inter body type. Both fonts are self-hosted, with OFL licences. Every main section uses the dark canvas; actual product captures keep the app's real colours.
- Replaced the refresh asset with freshly captured live UI, excluding the account email and background charts. The primary 381 × 301 capture shows the expanded source table and the no-new-data message; the alternate 381 × 233 capture shows the panel heading and first dataset. The primary displays at native width on desktop and fits smaller screens. These are CSS-pixel captures, not verified high-DPI assets. Accessible page prose explains the same example.
- Added 24/7/business-hours selection, applying 2,600 planning hours to both app-hosting alternatives. Documented production start/stop Jobs and failure-safe dev/test cleanup as operating patterns; no live Databricks schedule or app state was changed.
- Tested at 1280 × 720, 390 × 844 and 360 × 640 with no page overflow. The 360px headline now takes two lines. Matching fonts loaded successfully. Increased small-phone business-table headers and estimate notes.
- Browser-selected the business schedule: 50 separate Medium apps $65,000/year, one shared Medium $1,300/year, difference $63,700 and $26/dashboard. Fabric capacity figures stay unchanged. Eight domain tests cover pricing, capacities, sizing and both schedules.
- Rechecked all seven gallery choices and four file choices. Each gallery view has one selected choice. Gallery and both new refresh image links open dialogs; Escape closes and restores opener focus. Fixed the new text-only source-image link to use its href when it has no nested image.
- Reduced-motion control removes the assembly pin; stage is relative. Copy action reports success (cross-app clipboard paste was not independently checked). Final local browser console returned no warnings or errors.
- Independent sub-agent judged rendered desktop/phone views and source: first 8.0/10, then **8.4/10** after compact headline, readability and evidence corrections. It did not independently drive a browser or verify high-DPI capture/animation smoothness. Optional remaining polish: shorter pricing notes and larger tertiary microcopy.
- Updated the social preview to the dark hero. The vendor Scroll Craft engine is unchanged.

Current evidence: `evidence/portfolio-desktop-hero.jpg`, `portfolio-desktop-calculator.jpg`, `portfolio-desktop-refresh.jpg`, `portfolio-mobile-360.jpg`, `portfolio-mobile-calculator.jpg`.
