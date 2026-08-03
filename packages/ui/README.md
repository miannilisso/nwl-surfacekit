# `@nwl/surfacekit`

Shared UI package for nwl-surfacekit.

## Package Surface

- `@nwl/surfacekit/globals.css`
- `@nwl/surfacekit/components/button`
- `@nwl/surfacekit/components/card`
- `@nwl/surfacekit/patterns/app-shell`
- `@nwl/surfacekit/patterns/auth-shell`
- `@nwl/surfacekit/patterns/web-shell`
- `@nwl/surfacekit/lib/utils`

## Source Conventions

Components use folder-based source with colocated tests:

```text
src/components/button/button.tsx
src/components/button/button.test.tsx
src/components/button/index.ts
```

The button source is intentionally singular at `src/components/button/button.tsx`. Do not reintroduce `src/components/button.tsx`.

Component styles follow shadcn source conventions with Tailwind CSS v4 tokens. Interactive primitives should come from Base UI where possible; the button uses `@base-ui/react/button`.

## Patterns

The package currently exports three shell patterns:

- `AppShell`, `AppTopbar`, and `AppSidebar` for authenticated product surfaces.
- `AuthShell` and `AuthPanel` for sign-in and account access layouts.
- `WebShell`, `WebShellHeader`, `WebShellFooter`, and `WebHero` for marketing/public pages.

Each pattern has a colocated Vitest test and a Storybook story under `apps/web/stories`.

## Local Checks

```bash
pnpm --filter @nwl/surfacekit typecheck
pnpm --filter @nwl/surfacekit build
pnpm test:components
```
