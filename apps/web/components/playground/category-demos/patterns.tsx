"use client"

import * as React from "react"
import { Button, buttonVariants } from "@nwl/surfacekit/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"
import { Input } from "@nwl/surfacekit/components/input"
import { Label } from "@nwl/surfacekit/components/label"
import {
  AppShell,
  AppSidebar,
  AppTopbar,
} from "@nwl/surfacekit/patterns/app-shell"
import { AuthPanel, AuthShell } from "@nwl/surfacekit/patterns/auth-shell"
import { ConfirmDangerAction } from "@nwl/surfacekit/patterns/confirm-danger-action"
import { DataTableToolbar } from "@nwl/surfacekit/patterns/data-table-toolbar"
import { ErrorSummary } from "@nwl/surfacekit/patterns/error-summary"
import { IncidentBanner } from "@nwl/surfacekit/patterns/incident-banner"
import { PermissionGate } from "@nwl/surfacekit/patterns/permission-gate"
import { ResourceStatus } from "@nwl/surfacekit/patterns/resource-status"
import { StepUpDialog } from "@nwl/surfacekit/patterns/step-up-dialog"
import {
  WebHero,
  WebShell,
  WebShellFooter,
  WebShellHeader,
} from "@nwl/surfacekit/patterns/web-shell"

export function AppShellDemo() {
  const navigation = [
    { label: "Overview", href: "#app-overview", active: true },
    { label: "Projects", href: "#app-projects", badge: 12 },
    { label: "Reports", href: "#app-reports" },
  ]
  return (
    <AppShell
      className="min-h-0 w-full overflow-hidden rounded-2xl border"
      mainProps={{ role: "presentation", className: "p-0" }}
    >
      <div className="overflow-hidden rounded-xl border bg-background">
        <AppTopbar title="Production workspace" eyebrow="SurfaceKit" />
        <div className="grid min-h-72 md:grid-cols-[14rem_1fr]">
          <div className="hidden border-r bg-sidebar p-3 md:block">
            <AppSidebar label="Workspace navigation" items={navigation} />
          </div>
          <div className="space-y-4 p-4">
            <IncidentBanner
              severity="warning"
              title="Maintenance scheduled"
              description="A rolling database upgrade begins at 22:00 UTC."
            />
            <ResourceStatus
              title="Compute quota"
              value="62%"
              progress={62}
              detail="22 of 35 nodes active"
            />
          </div>
        </div>
      </div>
    </AppShell>
  )
}

export function AuthShellDemo() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Use your managed work account to continue."
      className="min-h-0 w-full overflow-hidden rounded-2xl border md:grid-cols-1 [&>div]:min-h-0 [&>div]:px-6 [&>div]:py-8"
    >
      <AuthPanel
        title="Secure access"
        subtitle="Authentication is recorded in the audit log."
      >
        <form aria-label="Authentication" className="space-y-3">
          <Label htmlFor="pattern-work-email">Work email</Label>
          <Input id="pattern-work-email" type="email" />
          <Button className="w-full">Continue with SSO</Button>
        </form>
      </AuthPanel>
    </AuthShell>
  )
}

export function ConfirmDangerActionDemo() {
  const [open, setOpen] = React.useState(false)
  const [status, setStatus] = React.useState("No action taken")
  return (
    <div className="w-full max-w-xl space-y-4">
      <Button onClick={() => setOpen(true)}>Delete project</Button>
      {open && (
        <ConfirmDangerAction
          title="Delete production project?"
          description="This permanently removes deployments, audit history, and access policies."
          confirmLabel="Delete project"
          onCancel={() => {
            setStatus("Deletion cancelled")
            setOpen(false)
          }}
          onConfirm={() => {
            setStatus("Project deletion confirmed")
            setOpen(false)
          }}
        />
      )}
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {status}
      </p>
    </div>
  )
}

export function DataTableToolbarDemo() {
  const [searchValue, setSearchValue] = React.useState("")
  return (
    <div className="w-full">
      <DataTableToolbar
        title="Team access"
        count={24}
        searchLabel="Search team access"
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onCreate={() => undefined}
        onFilter={() => undefined}
        onExport={() => undefined}
      />
    </div>
  )
}

export function ErrorSummaryDemo() {
  return (
    <ErrorSummary
      className="w-full max-w-xl"
      title="Submission failed"
      messages={[]}
      errors={[
        {
          id: "billing",
          message: "Review billing address",
          href: "#billing-address",
        },
        {
          id: "payment",
          message: "Verify payment method",
          href: "#payment-method",
        },
      ]}
    />
  )
}

export function IncidentBannerDemo() {
  const [visible, setVisible] = React.useState(true)
  return visible ? (
    <IncidentBanner
      className="w-full"
      severity="critical"
      title="Production API unavailable"
      description="Requests are failing and automated recovery is in progress."
      onAction={() => undefined}
      onDismiss={() => setVisible(false)}
    />
  ) : (
    <Button variant="outline" onClick={() => setVisible(true)}>
      Restore incident banner
    </Button>
  )
}

export function PermissionGateDemo() {
  const [allowed, setAllowed] = React.useState(false)
  return (
    <div className="w-full max-w-xl">
      <PermissionGate
        allowed={allowed}
        title="Billing access required"
        description="Ask an owner to grant billing permissions."
        onRequestAccess={() => setAllowed(true)}
      >
        <section className="rounded-3xl border bg-card p-6">
          <h3 className="text-lg font-medium">Billing controls</h3>
          <p className="mt-2 text-sm">Annual enterprise plan · Active</p>
        </section>
      </PermissionGate>
    </div>
  )
}

export function ResourceStatusDemo() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      <ResourceStatus
        title="Compute usage"
        value="62%"
        detail="22 of 35 nodes active"
        tone="healthy"
        progress={62}
      />
      <ResourceStatus
        title="Storage usage"
        value="84%"
        detail="6 TB remaining"
        tone="warning"
        progress={84}
      />
    </div>
  )
}

export function StepUpDialogDemo() {
  const [open, setOpen] = React.useState(false)
  const [status, setStatus] = React.useState("Verification not requested")
  return (
    <div className="w-full max-w-xl space-y-4">
      <Button onClick={() => setOpen(true)}>Edit security policy</Button>
      {open && (
        <StepUpDialog
          headline="Action authorization required"
          description="Verify your identity before editing sensitive settings."
          secondaryLabel="Cancel"
          onCancel={() => {
            setStatus("Verification cancelled")
            setOpen(false)
          }}
          onVerify={() => {
            setStatus("Identity verified")
            setOpen(false)
          }}
        />
      )}
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {status}
      </p>
    </div>
  )
}

export function WebShellDemo() {
  return (
    <WebShell
      className="min-h-0 w-full overflow-hidden rounded-2xl border"
      mainProps={{ role: "presentation" }}
      header={
        <WebShellHeader
          title="SurfaceKit"
          links={[
            { label: "Components", href: "#components" },
            { label: "Patterns", href: "#patterns" },
          ]}
          cta={
            <a
              href="#docs"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Documentation
            </a>
          }
        />
      }
      footer={
        <WebShellFooter links={[{ label: "Security", href: "#security" }]} />
      }
    >
      <WebHero
        eyebrow="Naneware Labs"
        title="Production UI without the guesswork"
        description="A governed component and pattern system for enterprise product surfaces."
        className="[&>div]:min-h-0 [&>div]:py-10"
        action={
          <a href="#components" className={buttonVariants()}>
            Explore components
          </a>
        }
      >
        <Card>
          <CardHeader>
            <CardTitle>Release evidence</CardTitle>
          </CardHeader>
          <CardContent>
            60 components · 10 patterns · browser verified
          </CardContent>
        </Card>
      </WebHero>
    </WebShell>
  )
}
