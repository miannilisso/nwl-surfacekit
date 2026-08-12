# `@nwl/surfacekit` Usage

This package exports shared UI components, patterns, and utilities for use across web apps.

## Package surface

- `@nwl/surfacekit/globals.css`
- `@nwl/surfacekit/components/<component>`
- `@nwl/surfacekit/patterns/<pattern>`
- `@nwl/surfacekit/lib/<util>`

## Component imports

Import individual components from their own paths:

```tsx
import { Button } from "@nwl/surfacekit/components/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@nwl/surfacekit/components/card"
```

## Pattern imports

Use shell patterns for layout and page scaffolding:

```tsx
import { AppShell, AppTopbar, AppSidebar } from "@nwl/surfacekit/patterns/app-shell"
import { AuthShell, AuthPanel } from "@nwl/surfacekit/patterns/auth-shell"
import { WebShell, WebShellHeader, WebShellFooter, WebHero } from "@nwl/surfacekit/patterns/web-shell"
import { PermissionGate } from "@nwl/surfacekit/patterns/permission-gate"
import { StepUpDialog } from "@nwl/surfacekit/patterns/step-up-dialog"
import { ErrorSummary } from "@nwl/surfacekit/patterns/error-summary"
import { ResourceStatus } from "@nwl/surfacekit/patterns/resource-status"
import { DataTableToolbar } from "@nwl/surfacekit/patterns/data-table-toolbar"
import { ConfirmDangerAction } from "@nwl/surfacekit/patterns/confirm-danger-action"
import { IncidentBanner } from "@nwl/surfacekit/patterns/incident-banner"
```

## Example

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

## Local checks

Run the package checks from the monorepo root:

```bash
pnpm --filter @nwl/surfacekit typecheck
pnpm --filter @nwl/surfacekit build
pnpm test:components
```
