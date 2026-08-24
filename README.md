# nwl-surfacekit

SurfaceKit is a pnpm monorepo containing the framework-consumable
@nwl/surfacekit React package, its Storybook, and a Next.js reference
application. The repository treats source, behavioral tests, stories, catalog
metadata, and live demos as one checked contract.

## Verified surface

| Surface             | Inventory | Repository evidence                                                              |
| ------------------- | --------: | -------------------------------------------------------------------------------- |
| Components          |        60 | Colocated Vitest test, Storybook story, catalog record, and live demo per module |
| Enterprise patterns |        10 | Colocated Vitest test, Storybook story, catalog record, and live demo per module |
| Application routes  |        10 | Production smoke and automated accessibility checks                              |
| Visual baselines    |        30 | All routes at desktop light, desktop dark, and mobile light                      |

Automated axe checks cover every application route and every tested Storybook
story. A passing result means no violations were detected for the configured
rules and states; it does not establish complete WCAG conformance or replace
manual keyboard, screen-reader, and assistive-technology review.

## Requirements

- Node.js `^20.19.0 || ^22.13.0 || >=24.0.0`
- pnpm `11.23.0`

```bash
pnpm install --frozen-lockfile
pnpm dev
```

The web app runs at <http://localhost:3000>. Storybook runs separately and
opens on the SurfaceKit Introduction overview:

```bash
pnpm storybook
```

## Repository layout

```text
apps/web/
  app/(marketing)/       public landing and capabilities pages
  app/(playground)/      catalog overview and category playgrounds
  components/playground/ route-local live demos
  stories/               stories for all 70 public modules
packages/ui/
  src/components/        60 component modules
  src/patterns/          10 enterprise-pattern modules
tests/
  contracts/             exact inventory and artifact-set checks
  e2e/                   smoke, accessibility, workflow, and visual suites
```

Public imports use stable module paths:

```tsx
import { Button } from "@nwl/surfacekit/components/button"
import { AppShell } from "@nwl/surfacekit/patterns/app-shell"
import "@nwl/surfacekit/globals.css"
```

See [packages/ui/USAGE.md](packages/ui/USAGE.md) for composition examples and
consumer guidance.

## Route map

| Route                        | Purpose                                                        |
| ---------------------------- | -------------------------------------------------------------- |
| /                            | Product landing page and representative operations composition |
| /marketing                   | Searchable capability inventory and evidence language          |
| /playground                  | Searchable overview of all 70 modules                          |
| /playground/form-inputs      | 18 form and selection components                               |
| /playground/navigation       | 5 navigation components                                        |
| /playground/dialogs-overlays | 11 dialog and overlay components                               |
| /playground/data-display     | 13 data-display components                                     |
| /playground/feedback         | 4 feedback components                                          |
| /playground/layout-utilities | 9 layout and utility components                                |
| /playground/patterns         | 10 enterprise patterns                                         |

The catalog in `apps/web/lib/surfacekit/catalog.ts` owns names, descriptions,
counts, categories, routes, and stable anchors. Do not duplicate those values in
application code.

The former root-level category URLs remain permanent redirects to these
canonical nested routes so existing links continue to resolve. The playground
shell provides a bottom-of-sidebar Home action, an application footer, and its
existing top-bar theme control. The public marketing navbar uses the same
package `ThemeSwitcher`, so the persisted light/dark preference is shared
between the marketing and playground surfaces.

Storybook opens `SurfaceKit/Introduction` by default. Its global toolbar
switches all stories between light and dark themes; the Introduction overview
links reviewers onward to the component stories, playground, and repository
documentation.

## Supported repository toolchain

The current verified cohorts are React `19.2.8`, Next.js `16.3.2`, Storybook
`10.5.10`, Vite `8.2.2`, Vitest `4.1.11`, ESLint `10.9.0`, Turbo `2.10.11`,
and TypeScript `5.9.3`. Shared exact versions live in the root
`pnpm-workspace.yaml` catalog.

TypeScript intentionally remains at `5.9.3`: typescript-eslint `8.67.0`
supports TypeScript below `6.1.0`, so the registry's newer TypeScript major is
not currently actionable. The shared ESLint configuration uses
`@eslint/compat` for `eslint-plugin-react@7.37.5`, whose published peer range
has not yet added ESLint 10. Both exceptions are recorded in the current
[enterprise-readiness audit](docs/audits/2026-08-24-surfacekit-enterprise-readiness.md).

## Verification

Use focused checks during development:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test:contracts
pnpm test:components:coverage
pnpm --filter web build
pnpm build-storybook
pnpm test:storybook
pnpm test:env
pnpm playwright test tests/e2e/workflows.spec.ts --project=chromium
pnpm audit --prod
```

Install the browser binaries once:

```bash
pnpm exec playwright install chromium firefox webkit
```

`pnpm verify` and `pnpm verify:ci` are intentionally equivalent. They run
formatting, lint, types, exact inventory contracts, package coverage, Next.js
and Storybook production builds, Storybook browser tests, client-environment
checks, and the complete production-server Playwright suite.

Vitest ignores `.worktrees/**`, and Playwright resolves tests only from
`tests/e2e`. These boundaries keep verification hermetic when another linked
checkout has its own React or Playwright installation.

## Visual snapshot review

Visual baselines are Chromium-specific and committed under
tests/e2e/visual.spec.ts-snapshots/.

```bash
pnpm --filter web build
pnpm playwright test tests/e2e/visual.spec.ts \
  --config playwright.production.config.ts \
  --project=chromium
```

When a visual change is intentional, rerun with --update-snapshots, inspect
every changed image in light, dark, and mobile contexts, then rerun without the
flag. Do not accept regenerated snapshots solely because the command exits
successfully.

## Adding or changing a public module

A public module is complete only when these five sets remain synchronized:

1. source module, index export, and package export path;
2. meaningful colocated behavioral test;
3. Storybook story with useful states or interaction coverage;
4. typed catalog record with a unique ID, category, route, and anchor;
5. route-local demo registry entry using the public API.

Run pnpm test:contracts first to catch missing or stale artifacts. Preserve
existing public import paths and prop behavior for compatible changes; treat
removals, renames, and incompatible prop changes as explicit breaking changes.

Dependency versions are centralized in pnpm-workspace.yaml. Workspace
manifests use catalog: for shared versions and workspace:* for local packages.

## Distribution status

`@nwl/surfacekit` remains a private, workspace-consumed source package. React
and React DOM `^19.0.0` are required peers, but the package does not yet emit
JavaScript, declarations, or compiled CSS and does not have a release-grade
files allowlist or immutable GitHub release workflow. Its current tarball is an
audit artifact, not a supported external distribution.

The reference Next.js app, Storybook, and manual disposable-consumer probes
show that the source can compile in the repository's tested configurations.
They do not establish general external-app compatibility, complete WCAG
conformance, security compliance, or a stable release contract. See the
[2026-08-24 enterprise-readiness audit](docs/audits/2026-08-24-surfacekit-enterprise-readiness.md)
for the blockers and dependency-ordered roadmap.
