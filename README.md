# nwl-surfacekit

nwl-surfacekit is a polished monorepo scaffold for building a versioned design system and UI library with Next.js, shadcn/ui, Tailwind CSS v4, semantic design tokens, and accessible primitives.

## What this scaffold includes

- A monorepo layout with a Next.js app and a shared UI package.
- A design-system-ready package surface for components, utilities, and primitives.
- Tailwind CSS v4 with semantic CSS-variable tokens and RTL support.
- A base component foundation built with shadcn/ui patterns, class-variance-authority, and utility helpers.
- A structure that is ready for Storybook, testing, accessibility checks, and release automation.

## Recommended SurfaceKit stack

```text
@nwl/surfacekit
├── shadcn/ui component source
├── Base UI primitives
├── Tailwind CSS v4
├── Semantic CSS-variable design tokens
├── class-variance-authority
├── TanStack Table
├── React Hook Form
├── Zod
├── Storybook
└── axe accessibility checks + Playwright visual and interaction tests
```

## Repository structure

```text
apps/
  web/                # Next.js application shell and demo surface
packages/
  ui/                 # Shared design-system package
```

## Getting started

```bash
pnpm install
pnpm dev
```

The web app runs from the app workspace, while the shared UI package is the foundation for reusable components and styling.

## Development workflow

- Build and type-check the workspace with `pnpm build` and `pnpm typecheck`.
- Add components and primitives to the shared package so the app consumes them consistently.
- Keep styling centralized in the UI package and let the app compose against those primitives.
- Extend the scaffold with Storybook, tests, and CI checks as the library grows.

## SurfaceKit CI expectations

- Type-check and package-build.
- Component tests.
- Accessibility checks.
- Storybook or equivalent documentation build.
- Visual regression in light and dark themes.
- Supported-browser smoke tests.

## Versioning

This scaffold is prepared as a versioned library foundation. The shared package is exposed as `@nwl/surfacekit` and can be published and versioned independently as the component system matures.
