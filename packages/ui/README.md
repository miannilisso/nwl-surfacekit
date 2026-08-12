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

## Package exports

- Components: `@nwl/surfacekit/components/<component>`
- Patterns: `@nwl/surfacekit/patterns/<pattern>`
- Utility helpers: `@nwl/surfacekit/lib/<util>`

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

The package currently exports enterprise-ready layout and utility patterns:

- `AppShell`, `AppTopbar`, and `AppSidebar` for authenticated product surfaces.
- `AuthShell` and `AuthPanel` for sign-in and account access layouts.
- `WebShell`, `WebShellHeader`, `WebShellFooter`, and `WebHero` for marketing/public pages.
- `PermissionGate` for permission-required workflows.
- `StepUpDialog` for second-factor and verification prompts.
- `ErrorSummary` for validation and system error reporting.
- `ResourceStatus` for live resource and capacity dashboards.
- `DataTableToolbar` for table search/action toolbars.
- `ConfirmDangerAction` for destructive action confirmation.
- `IncidentBanner` for service-impact and outage notifications.

Each pattern has a colocated Vitest test and a Storybook story under `apps/web/stories`.

- All package UI components now include scaffolded Vitest test files and Storybook stories. `button` and `card` continue to be the only components with full render assertions and custom story variants.

## Component list

- accordion
- alert
- alert-dialog
- aspect-ratio
- attachment
- avatar
- badge
- breadcrumb
- bubble
- button
- button-group
- calendar
- card
- carousel
- chart
- checkbox
- collapsible
- combobox
- command
- context-menu
- dialog
- direction
- drawer
- dropdown-menu
- empty
- field
- hover-card
- input
- input-group
- input-otp
- item
- kbd
- label
- marker
- menubar
- message
- message-scroller
- native-select
- navigation-menu
- pagination
- popover
- progress
- radio-group
- resizable
- scroll-area
- select
- separator
- sheet
- sidebar
- skeleton
- slider
- spinner
- switch
- table
- tabs
- textarea
- toast
- toggle
- toggle-group
- tooltip

## Pattern list

- app-shell
- auth-shell
- web-shell
- permission-gate
- step-up-dialog
- error-summary
- resource-status
- data-table-toolbar
- confirm-danger-action
- incident-banner

## Example usage

```tsx
import { Button } from "@nwl/surfacekit/components/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@nwl/surfacekit/components/card"
import {
  AppShell,
  AppTopbar,
  AppSidebar,
} from "@nwl/surfacekit/patterns/app-shell"

export default function Page() {
  return (
    <AppShell
      topbar={<AppTopbar>SurfaceKit</AppTopbar>}
      sidebar={<AppSidebar>Navigation</AppSidebar>}
    >
      <Card>
        <CardHeader>
          <CardTitle>Shared UI</CardTitle>
          <CardDescription>Reusable components and patterns.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Get started</Button>
        </CardContent>
      </Card>
    </AppShell>
  )
}
```

## Local Checks

```bash
pnpm --filter @nwl/surfacekit typecheck
pnpm --filter @nwl/surfacekit build
pnpm test:components
```

## More docs

See `packages/ui/USAGE.md` for package consumer usage, import patterns, and example snippets.

```bash
pnpm --filter @nwl/surfacekit typecheck
pnpm --filter @nwl/surfacekit build
pnpm test:components
```
