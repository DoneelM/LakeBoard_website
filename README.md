# LakeBoard showcase

A scroll-driven product tour for [LakeBoard](https://github.com/DoneelM/LakeBoard): many dashboard folders sharing a Databricks App, with separate department portals when useful.

**[Visit the website](https://doneelm.github.io/LakeBoard_website/)**

The showcase uses actual dashboard screenshots, an assembly interaction explaining the shared host, a seven-view gallery, a sourced 50-dashboard cost model with 24/7 and business-hours comparisons, query-identity and cache governance detail, refresh and mobile evidence, and an inspectable authoring contract. It is a static site; it does not connect to a Databricks workspace or expose account details.

## Features pages

`/LakeBoard_website/features/` lists every LakeBoard feature in plain language, grouped
into Build, Govern, Serve data and Run and deliver, with a status (built in, opt-in,
you set it up, in progress) and a list of what LakeBoard doesn't do. Each card drills
through to its section on `/LakeBoard_website/features/how-it-works/`: the mechanism,
the configuration and commands, the limits and the decision record behind it. Both
pages are static HTML. `npm run check` fails if a card and a technical section stop
matching one to one.

## Agent mode

Use the Human / Agent control in the site header to open the Markdown brief. The
Agent page can be shared directly at `/LakeBoard_website/agent/`, and its raw
Markdown is available as `agent/lakeboard.md`. Both outputs are generated from
`scripts/agent-context.mjs` during the build. Its example costs come from the
same model as the calculator.

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

All asset paths are relative. There is no framework, dependency install, external font service, analytics or backend. Fonts are self-hosted. The dark/cyan visual identity follows the creator’s [aiagents.nz](https://aiagents.nz/) portfolio. The public site publishes `dist/`, built from `src/` and the generated Agent brief.

## Design and verification

Built with the [Scroll Craft](https://github.com/nateherkai/scroll-craft) runtime, copied unchanged into `src/vendor/`. Page-specific choreography lives in `src/app.js` and `src/styles.css`.

- [Creative brief and scroll score](scrollcraft/builds/lakeboard/BRIEF.md)
- [Verification notes](scrollcraft/builds/lakeboard/VERIFICATION.md)
- [Cost model, pricing sources and governance detail](docs/COSTS_AND_GOVERNANCE.md)
- [Third-party notices](THIRD_PARTY_NOTICES.md)

Mobile and reduced-motion layouts show the same content in normal flow. A footer control also lets visitors reduce motion. Without JavaScript, the site keeps its reading order, direct image links and GitHub links.

License: Apache 2.0, except the separately licensed MIT Scroll Craft runtime.
