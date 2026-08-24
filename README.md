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

- Node.js >=20.19.0
- pnpm 11.18.0

```bash
pnpm install --frozen-lockfile
pnpm dev
```

The web app runs at <http://localhost:3000>. Storybook runs separately:

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

| Route             | Purpose                                                        |
| ----------------- | -------------------------------------------------------------- |
| /                 | Product landing page and representative operations composition |
| /marketing        | Searchable capability inventory and evidence language          |
| /playground       | Searchable overview of all 70 modules                          |
| /form-inputs      | 18 form and selection components                               |
| /navigation       | 5 navigation components                                        |
| /dialogs-overlays | 11 dialog and overlay components                               |
| /data-display     | 13 data-display components                                     |
| /feedback         | 4 feedback components                                          |
| /layout-utilities | 9 layout and utility components                                |
| /patterns         | 10 enterprise patterns                                         |

The catalog in apps/web/lib/surfacekit-catalog.ts owns names, descriptions,
counts, categories, routes, and stable anchors. Do not duplicate those values in
application code.

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
```

Install the browser binaries once:

```bash
pnpm exec playwright install chromium firefox webkit
```

pnpm verify and pnpm verify:ci are intentionally equivalent. They run
formatting, lint, types, exact inventory contracts, package coverage, Next.js
and Storybook production builds, Storybook browser tests, client-environment
checks, and the complete production-server Playwright suite.

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
