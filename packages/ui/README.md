# @nwl/surfacekit

@nwl/surfacekit is the shared React source package for SurfaceKit. It exports
60 components, 10 enterprise patterns, Tailwind CSS v4 tokens, hooks, and
utilities without importing the Next.js reference application or Storybook.

## Package surface

```text
@nwl/surfacekit/globals.css
@nwl/surfacekit/components/<component>
@nwl/surfacekit/patterns
@nwl/surfacekit/patterns/<pattern>
@nwl/surfacekit/hooks/<hook>
@nwl/surfacekit/lib/<utility>
```

Modules use folder-based source with colocated tests:

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
pnpm test:storybook
```

## API compatibility

- Preserve existing @nwl/surfacekit/components/* and
  @nwl/surfacekit/patterns/* entry points for compatible releases.
- Prefer additive optional props over application-specific forks.
- Keep Next.js types and imports out of the package. Integration points such as
  AppSidebar.renderItem allow an app to supply its router-aware link.
- Record removals, renames, or incompatible behavior changes as breaking
  changes before publishing.

See [USAGE.md](USAGE.md) for consumer setup and examples.
