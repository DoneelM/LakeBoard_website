# Cost and governance examples

Requested scenario: 50 dashboards, Azure Australia East, prices in USD, one non-leap year of continuous operation (8,760 hours). Public list-price estimates checked on 18 November 2026 (Pacific/Auckland), before tax, discounts and customer-specific commitments. This is a worked model, not a claim that the pilot has measured these savings or benchmarked 50 dashboards on Medium.

## Price evidence

The exact public API responses used are reduced to their relevant meter records in [pricing-snapshot.json](pricing-snapshot.json), with reproducible source query URLs.

- Fabric capacity PAYG: **$0.21/CU-hour**. API base capacity meter: `Fabric_Capacity_CU_Hour`.
- Fabric 1-year reservation: **$1,094/CU for the full year**. Despite the API unit-of-measure field saying `1 Hour`, this Reservation row is the term price; do not multiply it by 8,760.
- Databricks Apps: **$1.00/DBU** for Azure Premium, Australia East. Verified by selecting that cloud and region on the [Apps pricing page](https://www.databricks.com/product/pricing/databricks-apps); its FAQ maps app billing to Interactive Serverless / All-Purpose Serverless. Azure Retail Prices independently returns $1.00 for `Premium Interactive Serverless Compute DBU` in Australia East.
- [Medium compute](https://learn.microsoft.com/en-us/azure/databricks/dev-tools/databricks-apps/compute-size): 0.5 DBU/hour per instance, up to 2 vCPU and 6 GB RAM.

Sources: [Fabric pricing](https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/), [Azure Retail Prices API documentation](https://learn.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices). Pricing rates can change; refresh the captured evidence and cost model together.

## Annual calculations

| Capacity | PAYG (CU × $0.21 × 8,760) | 1-year reservation (CU × $1,094) |
| --- | ---: | ---: |
| F64 | $117,734.40 | $70,016.00 |
| F128 | $235,468.80 | $140,032.00 |
| F256 | $470,937.60 | $280,064.00 |
| Extra cost: F128 → F256 | $235,468.80 | $140,032.00 |
| Potential reduction: F128 → F64 | $117,734.40 | $70,016.00 |
| Potential reduction: F256 → F64 | $353,203.20 | $210,048.00 |

The F64 scenario depends on remaining Fabric workloads, semantic-model memory, concurrency and actual workload migration. Existing reservation commitments do not automatically disappear after downsizing.

| App-hosting model | Annual app compute |
| --- | ---: |
| One Medium instance, 24/7 | $4,380 |
| 50 separate Medium instances | $219,000 |
| 50 dashboards sharing one Medium instance | $4,380 |
| Difference in app hosting | $214,620 (98%) |

Average month = 730 hours: one instance costs $365/month; fifty cost $18,250/month. Shared cost allocated over 50 dashboards = $87.60/dashboard/year. This is allocation arithmetic, not a per-dashboard licence or unlimited capacity guarantee.

If F64 works, F64 + one Medium instance = $122,114.40 PAYG or $74,396 with a Fabric reservation. The existing Databricks warehouse/data-platform cost supported the Fabric reports too; it is held constant on both sides, rather than charged again as an incremental LakeBoard cost. The modelled annual reductions versus F128 are therefore $113,354.40 and $65,636 before adjusting for any change in operating costs. These are **potential savings, not a measured outcome**.

The model holds the existing Databricks warehouse and data-platform spend constant because it was already incurred with Fabric. Net savings should be adjusted for the **difference** in warehouse/query usage, optional Genie/model calls, storage, networking, retained licensing, migration effort and support. It must not subtract the entire pre-existing warehouse bill only from the LakeBoard option. Dev/test/prod apps, horizontal replicas or a larger app add cost. `50 dashboards` says nothing by itself about active viewers, cached result size or CPU demand. Measure those before selecting Medium.

## Governance: identity and caching are separate decisions

Checked against LakeBoard's `src/portal/auth.py`, `src/app.py`, `src/portal/data.py`, `src/portal/registry.py`, `docs/OPERATIONS.md` and decisions 0002, 0003, 0006, 0009 in the application repository. No application behaviour was changed in this website update.

| Choice | Query identity and UC enforcement | Cache / audience |
| --- | --- | --- |
| Default `auth: user` | Viewer token passed through Databricks Apps. Grants, row filters and masks evaluated as that viewer when SQL runs | Per viewer + SQL parameter combination by default |
| `auth: app` | App service principal and its grants/policies; not the viewer's UC context | Shared result for authorised dataset viewers; fixed SQL, no SQL parameters; can refresh in background |
| User mode + `cache: shared` | First query still uses a viewer identity; scheduled warming can use the app SP | One result reused across viewers; only suitable when the whole authorised audience may see the same rows |

The choice is per **dataset** in each dashboard's manifest, not a global switch for the whole host. Dataset/dashboard group gates still determine who may open it. App mode is deliberately publishing an approved result to that audience; it does not preserve each viewer's personal row/column entitlements. UC enforcement still applies to the executing service principal.

App-mode datasets currently cannot use SQL parameters, and a dashboard containing app-mode data cannot enable Ask Genie. Ask Genie always uses the viewer's identity. A cached response is not a fresh UC authorization evaluation; choose TTLs and cache invalidation procedures for policy changes. Neither user mode nor app mode promises immediate revocation of already cached results.

Official context: [Databricks Apps authorization](https://learn.microsoft.com/en-us/azure/databricks/dev-tools/databricks-apps/auth).

## Freshness: decide whether refreshing is useful

The tightened real screenshot contains only the first complete dataset block, including its expanded source-table list. It was captured directly from the existing product screenshot through the browser, with no text or UI generated or altered. Original crop: 510 × 556; new crop: 378 × 229.

The panel exposes fetch time, expiry, cache scope, source notes and underlying table names/change metadata for datasets the viewer may open. Metadata lookups use the app SP and UC APIs, not another warehouse query. It is source-table visibility, not a claim of a complete interactive UC lineage explorer.

- `source unchanged`: tracked source timestamps do not show a write after the result was fetched; a refresh is unlikely to add data.
- `newer data available`: a tracked source has a later write; the refresh may pick up a change, though identical-data rewrites also count.
- `source never changes`: explicitly configured static catalogs such as the sample data.
- Mixed live/external sources may produce `tracked sources unchanged`, an unknown cue, or no cue. SQL depending on time can change without a table write.

This is an advisory signal. Metadata caches and polling can lag changes. Refresh is still available, bypasses the result cache and runs the loaded queries. It is not automatically blocked or skipped when sources appear unchanged.

## Size the shared host, or split by department

[Official Azure Databricks sizes](https://learn.microsoft.com/en-us/azure/databricks/dev-tools/databricks-apps/compute-size), checked 18 November 2026:

| One instance | Memory | CPU (up to) | DBU/hour | Annual app hosting at $1/DBU, 24/7 |
| --- | ---: | ---: | ---: | ---: |
| Medium | 6 GB | 2 vCPU | 0.5 | $4,380 |
| Large | 12 GB | 4 vCPU | 1 | $8,760 |
| XLarge | 48 GB | 12 vCPU | 3 | $26,280 |

XLarge exists only in some regions. Its cost above applies the verified Australia East DBU price to its documented consumption, conditional on that size being available in the workspace. This is not a claim of confirmed XLarge availability in Australia East.

A dedicated Medium app for a lightweight report can leave memory/CPU headroom unused. Consolidating multiple dashboard folders can make better use of those resources. A heavy report can still justify a dedicated app. Select Medium, Large or XLarge based on measured demand; changing size is **scaling up**, distinct from adding horizontal instances.

The shared host need not be organisation-wide. Separate LakeBoard deployments for Sales, Marketing, Finance and Operations can each contain many dashboards, with independent sizing, deployments and caches, while referencing common governed UC data and metric definitions. Four Medium department apps cost $17,520/year in app compute under the same assumptions (a $201,480 app-hosting difference versus 50 Medium apps).

Every Databricks app has its own service principal; separate apps do not automatically share its grants or cached results. UC policies follow the querying identity: the viewer in user mode, or that department app's explicitly granted SP in app mode. Configure the deployed dashboard folders, audience groups and app resources for each portal. This is a deployment pattern, not an automatic department-partitioning feature. One portal with department audience gates remains another option.
