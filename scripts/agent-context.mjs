import { appAnnual, fabricAnnual, hostingEstimate, operatingHours, PRICING, usd } from '../src/cost-model.js';

const project = 'https://github.com/DoneelM/LakeBoard';
const website = 'https://doneelm.github.io/LakeBoard_website/';
const websiteRepo = 'https://github.com/DoneelM/LakeBoard_website';
const guide = (name) => `${project}/blob/main/docs/${name}.md`;
const number = new Intl.NumberFormat('en-US');

export function renderAgentContext(verifiedDate) {
  const dashboards = PRICING.defaultDashboards;
  const always = hostingEstimate(dashboards, 'always');
  const business = hostingEstimate(dashboards, 'business');
  const fabricChange = (from, to, basis) => usd(Math.abs(fabricAnnual(to, basis) - fabricAnnual(from, basis)));

  return `# LakeBoard

LakeBoard is an open-source framework for hosting multiple custom dashboards in one Databricks App. Each dashboard has its own folder in Git under src/dashboards/. Use one portal for a team and environment, or separate portals for departments that need independent deployment, sizing and access.

Project: ${project}
Showcase: ${website}
License: Apache 2.0

## Architecture and governance

- A dashboard folder contains a dashboard.yml manifest, read-only SQL and an HTML view. Coding agents share the same authoring instructions. Review the code and the numbers before deploying.
- By default, queries run as the signed-in viewer. Unity Catalog applies that viewer's grants, row filters and column masks at query time. LakeBoard caches results separately per viewer and filter combination by default.
- A dataset can opt into app authorization. Unity Catalog applies the app service principal's grants and policies, and approved viewers may share the cached result. Viewer-specific policies do not govern the shared result. Use shared caching only when the permitted audience can see the same data.
- The freshness panel shows the underlying source tables, cache timing and known source changes. This signal can help users decide whether to rerun a query.
- Databricks Genie One MCP can help authors find approved data. In-app Ask Genie is an optional feature backed by a configured Genie Agent and uses viewer authorization.

## Worked cost example

The project began when a Fabric capacity upgrade from F128 to F256 was needed and the reporting source data was already in Databricks. Hosting each report in its own Databricks App would add an app cost for every report.

Azure Australia East public list-price snapshot, ${verifiedDate} (NZ date). Amounts are annual USD estimates before tax.

| Fabric scenario | Pay as you go | One-year reservation |
| --- | ---: | ---: |
| F128 to F256 (additional capacity cost) | ${fabricChange(128, 256, 'payg')} | ${fabricChange(128, 256, 'reserved')} |
| F128 to F64 (potential capacity savings) | ${fabricChange(128, 64, 'payg')} | ${fabricChange(128, 64, 'reserved')} |

F64 remains under evaluation. Verify that the remaining Fabric workload fits before counting the savings.

| ${dashboards}-dashboard hosting scenario | 24/7 | Weekdays 08:00–18:00 |
| --- | ---: | ---: |
| ${dashboards} separate Medium apps | ${usd(always.separateAnnual)} | ${usd(business.separateAnnual)} |
| One shared Medium app | ${usd(always.sharedAnnual)} | ${usd(business.sharedAnnual)} |
| Four Medium department apps | ${usd(appAnnual('medium', 4))} | ${usd(appAnnual('medium', 4, 'business'))} |

Weekday scheduling models ${number.format(operatingHours('business'))} running hours per year. The shared-app example assumes the workload fits one Medium instance. Existing warehouse spend stays common to both scenarios. Budget for differences in query use, app warm-up and job execution.

[Pricing sources and assumptions](${websiteRepo}/blob/main/docs/COSTS_AND_GOVERNANCE.md) · [Interactive calculator](${website}#costs)

## Evaluate or build

- [Project README and quickstart](${project}#quickstart-about-10-minutes)
- [Dashboard authoring contract](${guide('AUTHORING')})
- [Business users and Genie One](${guide('BUSINESS_AUTHORS')})
- [Power BI migration and metric reconciliation](${guide('MIGRATION')})
- [Access, caching and operations](${guide('OPERATIONS')})

For a Power BI migration, start with one report, document its metrics and filters, and reconcile the output with the original. Review and provision any Unity Catalog metric views or Genie Agents separately. LakeBoard hosts the resulting dashboard folders. The sample gallery uses example data.
`;
}
