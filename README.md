# nwl-surfacekit

nwl-surfacekit is a pnpm workspace for a Next.js product surface and a shared `@nwl/surfacekit` UI package. The current implementation uses Tailwind CSS v4 tokens, shadcn source conventions, Base UI primitives, Storybook, Vitest, Playwright smoke/visual checks, and axe accessibility checks.

## Current Structure

```text
apps/
  web/                         # Next.js App Router demo surface
    app/(marketing)/           # Public route family using WebShell
    app/(playground)/          # Component/pattern route family using AppShell
    stories/                   # Storybook stories for package components and patterns
packages/
  ui/                          # Shared SurfaceKit package
    src/components/button/     # Single button source and tests
    src/components/card/       # Card source and tests
    src/patterns/              # AppShell, AuthShell, WebShell and tests
```

## Dependency Management

Package versions are centralized in `pnpm-workspace.yaml` using pnpm catalog conventions. Workspace manifests should reference shared dependency versions with `catalog:` unless a workspace package is referenced with `workspace:*`.

When adding a runtime or test dependency, install it with pnpm and keep the catalog as the source of truth. Do not add undeclared transitive imports.

## Component Conventions

- Component source lives in folder-based modules, for example `packages/ui/src/components/button/button.tsx`.
- The deprecated duplicate `packages/ui/src/components/button.tsx` source is removed.
- shadcn-style component source is kept in `packages/ui`; `apps/web/components.json` points generation aliases back to `@nwl/surfacekit` to avoid app-local duplicates.
- Base UI primitives are used for interactive primitives. The button uses `@base-ui/react/button` with shadcn-style variants and Base UI's `render` composition API.
- Component and pattern tests stay next to their source files.

## Web App Routes

- `/` and `/marketing` are the marketing route family and use `WebShell`.
- `/playground` is the component and pattern playground route family and uses `AppShell`.
- The app consumes package exports from `@nwl/surfacekit` rather than copying UI source into the app.

## Storybook

Storybook is configured at `apps/web/.storybook`. The Vite config explicitly includes `@vitejs/plugin-react` so TSX stories use the React JSX runtime correctly and do not fail with `React is not defined`.

```bash
pnpm storybook
pnpm build-storybook
```

## Verification

Use the focused gates while developing:

```bash
pnpm typecheck
pnpm build:packages
pnpm --filter web build
pnpm test:components
pnpm test:a11y
pnpm build-storybook
pnpm test:visual
pnpm test:browser
pnpm test
pnpm test:env
```

`pnpm verify` runs the full workspace verification chain. Playwright browser checks require installed browsers:

```bash
pnpm exec playwright install
```

The current browser gates cover:

- axe WCAG 2 A/AA checks on `/`, `/marketing`, and `/playground`.
- Chromium visual regression snapshots for `/playground` in light and dark themes.
- Chromium, Firefox, and WebKit smoke checks for the marketing and playground route families.
- Client bundle scanning for server-only environment variable markers after a web build.
