# @nwl/surfacekit

`@nwl/surfacekit` is the shared compiled React 19 package for SurfaceKit. It exports
61 components, 12 enterprise patterns, compiled Tailwind CSS v4 tokens, hooks, and
utilities without importing the Next.js reference application or Storybook.

## Current distribution contract

The package emits ESM JavaScript, source maps, declarations, declaration maps,
and minified framework-neutral CSS under `dist`. Public exports resolve only to
that compiled output, and `pnpm pack` is restricted to `dist`, package usage
documentation, and Apache-2.0 legal material. The workspace reference app uses
the same compiled export shape.

This artifact boundary and clean installed-tarball Next.js/Vite matrix are
implemented and locally tested. The immutable 1.0 GitHub Release and required
remote checks remain pending. A local tarball is a verification artifact.

Consuming code must provide exactly one compatible React installation. The
package declares `react` and `react-dom` `^19.0.0` as required peers and keeps
catalog-pinned `19.3.0` development copies for repository tests.

## Package surface

```text
@nwl/surfacekit/globals.css
@nwl/surfacekit/components/<component>
@nwl/surfacekit/patterns
@nwl/surfacekit/patterns/<pattern>
@nwl/surfacekit/hooks/<hook>
@nwl/surfacekit/lib/<utility>
```

The current hook is `use-mobile`; the utility is `utils`. The auth UI paths
include `components/password-input`, `patterns/auth-shell`,
`patterns/auth-form`, `patterns/security-challenge`, and
`patterns/step-up-dialog`. The `patterns` aggregate and every individual
pattern path are public; there is no package-root JavaScript export. The former
`postcss.config` subpath is not exported because consumers receive compiled CSS.

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

The 61 components are:

accordion, alert, alert-dialog, aspect-ratio, attachment, avatar, badge,
breadcrumb, bubble, button, button-group, calendar, card, carousel, chart,
checkbox, collapsible, combobox, command, context-menu, dialog, direction,
drawer, dropdown-menu, empty, field, hover-card, input, input-group, input-otp,
item, kbd, label, marker, menubar, message, message-scroller, native-select,
navigation-menu, pagination, password-input, popover, progress, radio-group,
resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, spinner,
switch, table, tabs, textarea, toast, toggle, toggle-group, and tooltip.

The 12 enterprise patterns are:

- app-shell — application frame, top bar, and navigation
- auth-form — controlled credential and account request states
- auth-shell — authentication and account-access composition
- confirm-danger-action — explicit destructive-action confirmation
- data-table-toolbar — search, filter, export, and create actions
- error-summary — linked validation and system failures
- incident-banner — severity-aware operational messaging
- permission-gate — denied and allowed permission states
- resource-status — resource health and progress
- security-challenge — controlled OTP and recovery-code requests
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
pnpm test:consumers
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
- Auth forms and challenges only render controlled state and invoke caller
  callbacks. The host application and its identity provider own transport,
  credential handling, verification, sessions, rate limits, and authorization;
  `PermissionGate` is display logic, not an access-control boundary.

See [USAGE.md](USAGE.md) for consumer setup and examples.

## Styling boundary

`globals.css` is compiled, minified CSS. Consumers import it once and do not
need Tailwind, PostCSS, shadcn CLI, or animation build tooling. The package build
uses those tools only as development dependencies and limits Tailwind source
discovery to package implementation files. Generic system fonts are the
distributable default; the reference application owns its brand-font override.

The package gate verifies a 30 KiB gzip ceiling for compiled CSS and a 15 KiB
gzip ceiling for a production, peer-externalized Button bundle built from the
exact tarball. The current local measurements are 30,697/30,720 bytes for CSS
and 13,516/15,360 bytes for Button. The CSS budget has only 23 bytes of headroom.
Clean Next.js 16.3.6 and Vite 8.3.0 fixtures install the same local tarball,
resolve all 76 JavaScript specifiers, and check builds, SSR, hydration, themes,
and React identity. The future supported external installation is the immutable
GitHub Release tarball after its SHA-256 is verified; no such release exists yet.
See the [enterprise-readiness audit](../../docs/audits/2026-08-24-surfacekit-enterprise-readiness.md).
