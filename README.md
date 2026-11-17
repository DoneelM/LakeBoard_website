# LakeBoard showcase

A scroll-driven product tour for [LakeBoard](https://github.com/DoneelM/LakeBoard): many dashboard folders sharing a Databricks App, with separate department portals when useful.

**[Visit the website](https://doneelm.github.io/LakeBoard_website/)**

The showcase uses actual dashboard screenshots, an assembly interaction explaining the shared host, a seven-view gallery, a sourced 50-dashboard cost model, query-identity and cache governance detail, refresh and mobile evidence, and an inspectable authoring contract. It is a static site; it does not connect to a Databricks workspace or expose account details.

## Local development

Node 22 or later. No dependencies or API keys.

```sh
npm run check
npm test
npm run build
npm run dev
```

Open the printed URL, which includes the GitHub Pages project path. After editing `src/`, rebuild and refresh.

## Publication

This public repository uses free GitHub Pages. `.github/workflows/pages.yml` checks and builds pull requests, then deploys pushes to `main` using the Pages artifact workflow. In repository Settings → Pages, the source is **GitHub Actions**. Subsequent updates should use a feature branch and pull request.

All asset paths are relative. There is no framework, dependency install, external font service, analytics or backend. The public site exposes only the static files in `src/`.

## Design and verification

Built with the [Scroll Craft](https://github.com/nateherkai/scroll-craft) runtime, copied unchanged into `src/vendor/`. Page-specific choreography lives in `src/app.js` and `src/styles.css`.

- [Creative brief and scroll score](scrollcraft/builds/lakeboard/BRIEF.md)
- [Verification notes](scrollcraft/builds/lakeboard/VERIFICATION.md)
- [Cost model, pricing sources and governance detail](docs/COSTS_AND_GOVERNANCE.md)
- [Third-party notices](THIRD_PARTY_NOTICES.md)

Mobile and reduced-motion layouts show the same content in normal flow. A footer control also lets visitors reduce motion. Without JavaScript, the site keeps its reading order, direct image links and GitHub links.

License: Apache 2.0, except the separately licensed MIT Scroll Craft runtime.
