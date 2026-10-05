# SurfaceKit web reference

This Next.js `16.3.8` App Router application is the reference consumer for
@nwl/surfacekit. It renders two public marketing routes and eight playground
routes from the same typed catalog used by repository contracts.

## Requirements and commands

Use Node.js `^20.19.0 || ^22.13.0 || >=24.0.0` and pnpm `12.5.1` from the
monorepo root. The app currently runs React `19.3.0`; Next uses Turbopack for
development and production builds.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm dev` builds the package before starting the web app and package watcher.
For a production build and server from a fresh install, run:

```bash
pnpm build:packages
pnpm --filter web build
pnpm --filter web start
```

The local URL is <http://localhost:3000>.

## Application routes

| Route                        | Content                                                 |
| ---------------------------- | ------------------------------------------------------- |
| /                            | SurfaceKit landing page and live operations composition |
| /marketing                   | Capability explorer for all components and patterns     |
| /playground                  | Searchable catalog overview of 73 modules               |
| /playground/form-inputs      | 19 live component examples                              |
| /playground/navigation       | 5 live component examples                               |
| /playground/dialogs-overlays | 11 live component examples                              |
| /playground/data-display     | 13 live component examples                              |
| /playground/feedback         | 4 live component examples                               |
| /playground/layout-utilities | 9 live component examples                               |
| /playground/patterns         | 12 live enterprise-pattern examples                     |

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
- The app owns the supplied Outfit, Geist, and Geist Mono variable font files
  under `public/fonts` and overrides the package's system-font tokens in
  `app/reference-fonts.css`. Storybook uses that same local stylesheet. The
  package tarball contains no app brand fonts.
- `app/manifest.ts` supplies a root-scoped standalone manifest starting at
  `/playground`. `PwaRegistrar` registers `/sw.js` only in production. Its
  network-first navigation fallback is a static offline shell; live data,
  authentication responses, API responses, and sensitive routes are outside
  the cache boundary. Storybook does not register the app service worker.
- Auth pages are demonstrations of controlled package UI; this app does not
  authenticate users or issue sessions.

## Storybook

Storybook `10.6.1` with Vite `8.3.2` is configured in
`apps/web/.storybook`; all 73 public-module stories live in `apps/web/stories`,
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
Chromium. The Vite build uses a split Storybook runtime chunk and a targeted
upstream eval-warning exception; current builds have no chunk-size warning.

## Browser verification

Build the package, web app, and static Storybook before Playwright starts both
production servers:

```bash
pnpm test:e2e:production
```

The suite covers all 10 routes, automated A/AA axe rules, representative
keyboard and pointer workflows in Chromium, Firefox, and WebKit, and 30
Chromium-specific visual baselines. Separate mobile checks render every
Storybook story at 320px, 375px, and 768px and exercise safe-area navigation,
scrollbars, and touch targets. Automated accessibility results identify common
detectable violations and do not replace manual assistive-technology testing.

Playwright's root is `tests/e2e`, so specs in linked worktrees are never loaded.
The production command builds the package, app, and Storybook before starting
production servers. The latest full-gate attempt after Task 6C is blocked by
WebKit page creation on this host; see the
[readiness audit](../../docs/audits/2026-08-24-surfacekit-enterprise-readiness.md).

After that build, a focused run can reuse the production outputs:

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

The reference app uses compiled package exports. Separate clean Next/Vite
fixtures install the local tarball and verify builds, SSR, hydration, themes,
and React identity. This evidence does not constitute a published release;
see the [enterprise-readiness audit](../../docs/audits/2026-08-24-surfacekit-enterprise-readiness.md).
