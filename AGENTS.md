# LakeBoard website

This is the static public showcase, separate from the LakeBoard application repository.

- Source: `src/`. Build: `npm run build`. Preview: `npm run dev` after a build.
- No package dependencies. Node 22+. Keep assets local and project-relative so GitHub Pages' `/LakeBoard_website/` base works.
- `src/vendor/scrollcraft.*` is upstream code; do not alter it for site-specific choreography. Use `app.js` and `styles.css`.
- Preserve actual screenshot evidence, privacy cropping and truthful claims. Never invent customer quotes, cost savings or native-mobile support.
- `src/features/` summarises the LakeBoard repository. Check each claim, field name and command against its docs and `docs/decisions/` before changing it, and keep every feature card paired with its `how-it-works` section. Run `npm run sync:update` only after the pages reflect the listed decision records; never just to turn the LakeBoard sync check green.
- Distinguish Genie One MCP authoring from optional runtime curated Genie Agents. The metric-view migration diagram is a pilot pattern, not an automatic semantic converter.
- Verify `npm run check`, rebuild, then inspect desktop, mobile and reduced-motion in a real browser. Test gallery, screenshot dialog, keyboard focus, copy action and anchor links.
- GitHub Actions publishes `main` to Pages. Use a feature branch and pull request for subsequent changes.
- Scroll story rationale and evidence live under `scrollcraft/builds/lakeboard/`.
