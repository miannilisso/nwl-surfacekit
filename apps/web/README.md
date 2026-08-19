# SurfaceKit web reference

This Next.js 16 App Router application is the reference consumer for
@nwl/surfacekit. It renders two public marketing routes and eight playground
routes from the same typed catalog used by repository contracts.

## Requirements and commands

Use Node.js >=20.19.0 and pnpm 11.18.0 from the monorepo root.

```bash
pnpm install --frozen-lockfile
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web start
```

The local URL is http://localhost:3000.

## Application routes

| Route             | Content                                                 |
| ----------------- | ------------------------------------------------------- |
| /                 | SurfaceKit landing page and live operations composition |
| /marketing        | Capability explorer for all components and patterns     |
| /playground       | Searchable catalog overview                             |
| /form-inputs      | 18 live component examples                              |
| /navigation       | 5 live component examples                               |
| /dialogs-overlays | 11 live component examples                              |
| /data-display     | 13 live component examples                              |
| /feedback         | 4 live component examples                               |
| /layout-utilities | 9 live component examples                               |
| /patterns         | 10 live enterprise-pattern examples                     |

Every catalog entry has a stable direct-link anchor, for example
/form-inputs#input-otp.

## Architecture

- Route pages and catalog metadata remain Server Components.
- Interactive demos are narrow Client Components loaded only by the category
  that owns them.
- The shared playground shell owns responsive navigation, active-route state,
  theme controls, loading boundaries, and error boundaries.
- Application code imports public @nwl/surfacekit entry points; it does not copy
  package source.
- AppSidebar.renderItem supplies Next.js Link semantics without coupling the
  package to Next.js.

## Storybook

Storybook 10.5.7 is configured in apps/web/.storybook; stories live in
apps/web/stories.

```bash
pnpm storybook
pnpm build-storybook
pnpm test:storybook
```

The Storybook browser suite runs interaction and automated accessibility checks
in Chromium.

## Browser verification

Build once, then exercise the production server:

```bash
pnpm --filter web build
pnpm playwright test --config playwright.production.config.ts
```

The suite covers all 10 routes, automated A/AA axe rules, representative
keyboard and pointer workflows in Chromium, Firefox, and WebKit, and 30
Chromium-specific visual baselines. Automated accessibility results identify
common detectable violations and do not replace manual assistive-technology
testing.

For a focused run:

```bash
pnpm playwright test tests/e2e/workflows.spec.ts \
  --config playwright.production.config.ts \
  --project=chromium
```

Visual updates require human review:

```bash
pnpm playwright test tests/e2e/visual.spec.ts \
  --config playwright.production.config.ts \
  --project=chromium \
  --update-snapshots
```

Inspect every changed desktop-light, desktop-dark, and mobile-light image, then
rerun without --update-snapshots.

## Adding a playground module

Keep the five-set contract synchronized:

1. package source and export;
2. colocated behavioral test;
3. Storybook story;
4. catalog record;
5. category demo registry entry.

pnpm test:contracts reports duplicates, missing artifacts, stale registrations,
and placeholder tests.
