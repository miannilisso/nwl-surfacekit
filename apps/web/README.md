# SurfaceKit web reference

This Next.js `16.3.2` App Router application is the reference consumer for
@nwl/surfacekit. It renders two public marketing routes and eight playground
routes from the same typed catalog used by repository contracts.

## Requirements and commands

Use Node.js `^20.19.0 || ^22.13.0 || >=24.0.0` and pnpm `11.23.0` from the
monorepo root. The app currently runs React `19.2.8`; Next uses Turbopack for
development and production builds.

```bash
pnpm install --frozen-lockfile
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web start
```

The local URL is <http://localhost:3000>.

## Application routes

| Route                        | Content                                                 |
| ---------------------------- | ------------------------------------------------------- |
| /                            | SurfaceKit landing page and live operations composition |
| /marketing                   | Capability explorer for all components and patterns     |
| /playground                  | Searchable catalog overview                             |
| /playground/form-inputs      | 18 live component examples                              |
| /playground/navigation       | 5 live component examples                               |
| /playground/dialogs-overlays | 11 live component examples                              |
| /playground/data-display     | 13 live component examples                              |
| /playground/feedback         | 4 live component examples                               |
| /playground/layout-utilities | 9 live component examples                               |
| /playground/patterns         | 10 live enterprise-pattern examples                     |

Every catalog entry has a stable direct-link anchor, for example
`/playground/form-inputs#input-otp`. The former root-level category URLs remain
permanent redirects to the corresponding nested routes.

## Architecture

- Route pages and catalog metadata remain Server Components.
- Interactive demos are narrow Client Components loaded only by the category
  that owns them.
- The shared playground shell owns responsive navigation, active-route state,
  theme controls, a bottom Home action, the application footer, loading
  boundaries, and error boundaries.
- The marketing navbar composes the package `ThemeSwitcher`, so its light/dark
  selection persists when a reviewer opens the playground.
- Application code imports public @nwl/surfacekit entry points; it does not copy
  package source.
- AppSidebar.renderItem supplies Next.js Link semantics without coupling the
  package to Next.js.

## Storybook

Storybook `10.5.10` with Vite `8.2.2` is configured in
`apps/web/.storybook`; all 70 public-module stories live in `apps/web/stories`,
with one additional Introduction story supplied by the Storybook configuration.

```bash
pnpm storybook
pnpm build-storybook
pnpm test:storybook
```

Storybook opens `SurfaceKit/Introduction` by default. Its global toolbar applies
light or dark mode to every story, and the Introduction overview directs
reviewers to the public-module stories, playground, and repository docs. The
Storybook browser suite runs interaction and automated accessibility checks in
Chromium.

## Browser verification

Build once, then exercise the production server:

```bash
pnpm --filter web build
pnpm playwright test --config playwright.production.config.ts
```

Or use the repository script that performs both steps:

```bash
pnpm test:e2e:production
```

The suite covers all 10 routes, automated A/AA axe rules, representative
keyboard and pointer workflows in Chromium, Firefox, and WebKit, and 30
Chromium-specific visual baselines. Automated accessibility results identify
common detectable violations and do not replace manual assistive-technology
testing.

Playwright's root is `tests/e2e`, so specs in linked worktrees are never loaded.
The production command builds the app before starting `next start`; running a
development server is not equivalent production verification.

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

This app proves the in-repository source integration. It does not prove that
the current private raw-source tarball is a stable external package; see the
[enterprise-readiness audit](../../docs/audits/2026-08-24-surfacekit-enterprise-readiness.md).
