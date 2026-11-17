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
