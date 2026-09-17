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
import { PasswordInput } from "@nwl/surfacekit/components/password-input"
import {
  AppShell,
  AppSidebar,
  AppTopbar,
} from "@nwl/surfacekit/patterns/app-shell"
import { AuthPanel, AuthShell } from "@nwl/surfacekit/patterns/auth-shell"
import {
  AuthForm,
  type AuthFormState,
} from "@nwl/surfacekit/patterns/auth-form"
import { ConfirmDangerAction } from "@nwl/surfacekit/patterns/confirm-danger-action"
import { DataTableToolbar } from "@nwl/surfacekit/patterns/data-table-toolbar"
import { ErrorSummary } from "@nwl/surfacekit/patterns/error-summary"
import { IncidentBanner } from "@nwl/surfacekit/patterns/incident-banner"
import { PermissionGate } from "@nwl/surfacekit/patterns/permission-gate"
import { ResourceStatus } from "@nwl/surfacekit/patterns/resource-status"
import {
  SecurityChallenge,
  type SecurityChallengeMethod,
} from "@nwl/surfacekit/patterns/security-challenge"
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
        subtitle="The consuming application validates each request."
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

const authFlowOptions = [
  ["password", "Password login"],
  ["sso", "SSO login"],
  ["passkey", "Passkey login"],
  ["signup", "Open signup"],
  ["invitation", "Invitation acceptance"],
  ["verify-email", "Email verification"],
  ["recovery", "Password recovery"],
  ["reset", "Password reset"],
] as const

export function AuthFormDemo() {
  const [flow, setFlow] =
    React.useState<(typeof authFlowOptions)[number][0]>("password")
  const [state, setState] = React.useState<AuthFormState>("idle")
  const [password, setPassword] = React.useState("")
  const [visible, setVisible] = React.useState(false)
  const needsPassword = ["password", "signup", "invitation", "reset"].includes(
    flow
  )
  const newPassword = ["signup", "invitation", "reset"].includes(flow)
  const titles = {
    password: "Sign in with a password",
    sso: "Continue with your organization",
    passkey: "Continue with a passkey",
    signup: "Create an account",
    invitation: "Accept invitation",
    "verify-email": "Verify your email",
    recovery: "Recover access",
    reset: "Choose a new password",
  }
  return (
    <div className="grid w-full gap-4 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
      <div className="space-y-2" aria-label="Authentication examples">
        {authFlowOptions.map(([value, label]) => (
          <Button
            key={value}
            type="button"
            variant={flow === value ? "secondary" : "outline"}
            className="w-full justify-start"
            aria-pressed={flow === value}
            onClick={() => {
              setFlow(value)
              setState("idle")
            }}
          >
            {label}
          </Button>
        ))}
      </div>
      <div className="rounded-lg bg-card p-6 shadow-sm">
        <AuthForm
          title={titles[flow]}
          description="This demonstration emits requests only. The consuming application verifies them server-side."
          state={state}
          statusMessage={
            state === "error"
              ? "We could not complete that request. Try again."
              : state === "locked"
                ? "This request is temporarily unavailable. Try again later."
                : state === "expired"
                  ? "This request expired. Start again."
                  : state === "success"
                    ? "The request was accepted for processing."
                    : undefined
          }
          submitLabel="Send request"
          onSubmit={(event) => {
            event.preventDefault()
            setState("success")
          }}
          alternativeActions={
            flow === "password" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFlow("sso")}
                >
                  Request SSO sign in
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFlow("passkey")}
                >
                  Request passkey sign in
                </Button>
              </>
            ) : undefined
          }
          secondaryActions={
            <>
              {(
                [
                  "idle",
                  "pending",
                  "success",
                  "error",
                  "locked",
                  "expired",
                ] as const
              ).map((nextState) => (
                <Button
                  key={nextState}
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setState(nextState)}
                >
                  {nextState}
                </Button>
              ))}
            </>
          }
        >
          <div className="space-y-2">
            <Label htmlFor="auth-demo-username">Email or username</Label>
            <Input
              id="auth-demo-username"
              name="username"
              type="text"
              autoComplete={
                flow === "passkey" ? "username webauthn" : "username"
              }
            />
          </div>
          {needsPassword ? (
            <div className="space-y-2">
              <Label htmlFor="auth-demo-password">
                {newPassword ? "New password" : "Password"}
              </Label>
              <PasswordInput
                id="auth-demo-password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                visible={visible}
                onVisibleChange={setVisible}
                autoComplete={newPassword ? "new-password" : "current-password"}
              />
            </div>
          ) : null}
        </AuthForm>
      </div>
    </div>
  )
}

export function SecurityChallengeDemo() {
  const [method, setMethod] = React.useState<SecurityChallengeMethod>("otp")
  const [values, setValues] = React.useState({
    otp: "",
    "recovery-code": "RECOVERY7",
  })
  const [status, setStatus] = React.useState("")
  return (
    <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-sm">
      <SecurityChallenge
        method={method}
        methods={["otp", "recovery-code"]}
        onMethodChange={setMethod}
        value={values[method]}
        onValueChange={(value) =>
          setValues((current) => ({ ...current, [method]: value }))
        }
        statusMessage={status}
        onSubmit={() =>
          setStatus("Verification requested. Await the application response.")
        }
        onResend={() => setStatus("Another code was requested.")}
        footer="SurfaceKit never validates or stores the supplied code."
      />
    </div>
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
      <p role="status" className="text-sm text-muted-foreground">
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
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  return (
    <div className="w-full max-w-xl space-y-4">
      <Button ref={triggerRef} onClick={() => setOpen(true)}>
        Edit security policy
      </Button>
      <StepUpDialog
        open={open}
        onOpenChange={setOpen}
        finalFocus={triggerRef}
        headline="Action authorization required"
        description="Request another verification check before editing sensitive settings."
        secondaryLabel="Cancel"
        onCancel={() => setStatus("Verification cancelled")}
        onVerify={() => setStatus("Verification requested")}
      />
      <p role="status" className="text-sm text-muted-foreground">
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
            61 components · 12 patterns · browser verified
          </CardContent>
        </Card>
      </WebHero>
    </WebShell>
  )
}
