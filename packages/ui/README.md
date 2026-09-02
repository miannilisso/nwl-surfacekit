# @nwl/surfacekit

`@nwl/surfacekit` is the shared compiled React 19 package for SurfaceKit. It exports
60 components, 10 enterprise patterns, Tailwind CSS v4 tokens, hooks, and
utilities without importing the Next.js reference application or Storybook.

## Current distribution contract

The package emits ESM JavaScript, source maps, declarations, declaration maps,
and minified framework-neutral CSS under `dist`. Public exports resolve only to
that compiled output, and `pnpm pack` is restricted to `dist`, package usage
documentation, and Apache-2.0 legal material. The workspace reference app uses
the same compiled export shape.

This artifact boundary is implemented and tested, but the immutable 1.0 GitHub
Release and the full Next.js/Vite consumer matrix are separate readiness gates.
Do not treat an arbitrary local tarball as the official 1.0 release.

Consuming code must provide exactly one compatible React installation. The
package declares `react` and `react-dom` `^19.0.0` as required peers and keeps
catalog-pinned `19.2.8` development copies for repository tests.

## Package surface

```text
@nwl/surfacekit/globals.css
@nwl/surfacekit/components/<component>
@nwl/surfacekit/patterns
@nwl/surfacekit/patterns/<pattern>
@nwl/surfacekit/hooks/<hook>
@nwl/surfacekit/lib/<utility>
```

Source modules use folders with colocated tests; the equivalent public export
resolves to compiled files in `dist`:

```text
src/components/button/button.tsx
src/components/button/button.test.tsx
src/components/button/index.ts
```

Interactive primitives are built on Base UI where appropriate and expose
shadcn-style, Tailwind-tokenized APIs. Consumers should import the narrow module
path they use rather than a private source file.

## Inventory

The 60 components are:

accordion, alert, alert-dialog, aspect-ratio, attachment, avatar, badge,
breadcrumb, bubble, button, button-group, calendar, card, carousel, chart,
checkbox, collapsible, combobox, command, context-menu, dialog, direction,
drawer, dropdown-menu, empty, field, hover-card, input, input-group, input-otp,
item, kbd, label, marker, menubar, message, message-scroller, native-select,
navigation-menu, pagination, popover, progress, radio-group, resizable,
scroll-area, select, separator, sheet, sidebar, skeleton, slider, spinner,
switch, table, tabs, textarea, toast, toggle, toggle-group, and tooltip.

The 10 enterprise patterns are:

- app-shell — application frame, top bar, and navigation
- auth-shell — authentication and account-access composition
- confirm-danger-action — explicit destructive-action confirmation
- data-table-toolbar — search, filter, export, and create actions
- error-summary — linked validation and system failures
- incident-banner — severity-aware operational messaging
- permission-gate — denied and allowed permission states
- resource-status — resource health and progress
- step-up-dialog — additional verification before sensitive actions
- web-shell — public header, hero, content, and footer composition

The typed catalog and contract tests are the authoritative inventory. Counts in
documentation describe the current repository state, not an open-ended support
guarantee.

## Evidence contract

Each public component and pattern has:

- a meaningful colocated Vitest test;
- a Storybook entry under apps/web/stories;
- a typed catalog record;
- a live route demo that imports its public package path.

pnpm test:contracts compares these sets exactly. Package coverage has enforced
statement, branch, function, and line thresholds; a passing threshold does not
imply every possible state or integration has been exercised.

```bash
pnpm test:contracts
pnpm test:components:coverage
pnpm --filter @nwl/surfacekit typecheck
pnpm --filter @nwl/surfacekit build
pnpm --dir packages/ui pack
pnpm test:storybook
```

## API compatibility

- Preserve existing @nwl/surfacekit/components/< component > and
  @nwl/surfacekit/patterns/< pattern > entry points for compatible releases.
- Prefer additive optional props over application-specific forks.
- Keep Next.js types and imports out of the package. Integration points such as
  AppSidebar.renderItem allow an app to supply its router-aware link.
- `ThemeSwitcher` is the shared light/dark theme action for application and web
  navigation. It consumes the surrounding `next-themes` provider rather than
  owning a second theme store.
- `AppShell.footer` adds an optional content-information region after the main
  content, while `AppSidebar.footer` adds optional navigation-adjacent content
  after the item list. Both APIs are additive React-node composition slots.
- Record removals, renames, or incompatible behavior changes as breaking
  changes before publishing.

See [USAGE.md](USAGE.md) for consumer setup and examples.

## Styling boundary

`globals.css` is compiled, minified CSS. Consumers import it once and do not
need Tailwind, PostCSS, shadcn CLI, or animation build tooling. The package build
uses those tools only as development dependencies and limits Tailwind source
discovery to package implementation files. Generic system fonts are the
distributable default; the reference application owns its brand-font override.

The package gate verifies a 30 KB gzip ceiling for compiled CSS and a 15 KB
gzip ceiling for a production, peer-externalized Button bundle built from the
exact tarball. Full disposable Next.js 16.3.2 and Vite 8.2.2 consumer fixtures
remain tracked in the
[enterprise-readiness audit](../../docs/audits/2026-08-24-surfacekit-enterprise-readiness.md).
