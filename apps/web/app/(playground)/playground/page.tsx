import { Badge } from "@nwl/surfacekit/components/badge"
import { Button } from "@nwl/surfacekit/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"
import { Input } from "@nwl/surfacekit/components/input"
import { Progress } from "@nwl/surfacekit/components/progress"
import {
  AppShell,
  AppSidebar,
  AppTopbar,
} from "@nwl/surfacekit/patterns/app-shell"
import { AuthPanel, AuthShell } from "@nwl/surfacekit/patterns/auth-shell"
import {
  WebHero,
  WebShell,
  WebShellFooter,
  WebShellHeader,
} from "@nwl/surfacekit/patterns/web-shell"
import { ConfirmDangerAction } from "@nwl/surfacekit/patterns/confirm-danger-action"
import { DataTableToolbar } from "@nwl/surfacekit/patterns/data-table-toolbar"
import { ErrorSummary } from "@nwl/surfacekit/patterns/error-summary"
import { IncidentBanner } from "@nwl/surfacekit/patterns/incident-banner"
import { PermissionGate } from "@nwl/surfacekit/patterns/permission-gate"
import { ResourceStatus } from "@nwl/surfacekit/patterns/resource-status"
import { StepUpDialog } from "@nwl/surfacekit/patterns/step-up-dialog"

const navItems = [
  { label: "Components", active: true },
  { label: "App shell" },
  { label: "Auth shell" },
  { label: "Web shell" },
  { label: "Patterns" },
]

export default function PlaygroundPage() {
  return (
    <AppShell
      topbar={<AppTopbar title="Component playground" eyebrow="SurfaceKit" />}
      sidebar={<AppSidebar items={navItems} />}
    >
      <div className="space-y-8">
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary">Playground</Badge>
                <CardTitle>Component system showcase</CardTitle>
              </div>
              <CardDescription>
                All patterns and key primitives from the shared package are
                shown here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <Button>Primary</Button>
                <Button variant="outline">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input placeholder="Search playground" className="w-full" />
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">
                    Usage progress
                  </span>
                  <Progress value={62} className="min-w-50" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <IncidentBanner
              title="Service alert"
              description="We’re monitoring a partial outage for a subset of internal APIs. Most pages are still available."
              actionLabel="View status"
            />
            <DataTableToolbar title="Team access" />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard status</CardTitle>
              <CardDescription>
                Resource and usage metrics for enterprise surfaces.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ResourceStatus
                title="Compute usage"
                value="62%"
                progress={62}
                detail="22 of 35 nodes active"
              />
              <Card className="rounded-3xl border border-border bg-muted p-4">
                <CardHeader>
                  <CardTitle>Service health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>API latency</span>
                    <span className="font-semibold">120ms</span>
                  </div>
                  <Progress value={74} />
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security & access</CardTitle>
              <CardDescription>
                Permission gating, verification, and error-handling workflows.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <PermissionGate
                title="Access restricted"
                description="Your current role does not allow changes to this workspace. Request access to continue."
              />
              <StepUpDialog
                headline="Verify your identity"
                description="Confirm your identity before making sensitive changes."
                primaryLabel="Verify now"
                secondaryLabel="Remind me later"
              />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Error summary</CardTitle>
              <CardDescription>
                Validation and system error reporting for product forms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorSummary
                title="Submission failed"
                messages={[
                  "Billing address is required",
                  "Payment method must be verified",
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Destructive action</CardTitle>
              <CardDescription>
                Confirmation flow for high-risk user actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConfirmDangerAction
                title="Delete workspace"
                description="This action is permanent. All workspace data will be removed."
                confirmLabel="Delete"
                cancelLabel="Cancel"
              />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Auth shell preview</CardTitle>
              <CardDescription>
                Composable sign-in surface for workspace access.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-hidden rounded-3xl border border-border">
              <AuthShell
                title="Secure access"
                subtitle="Authenticate to continue"
              >
                <AuthPanel title="Sign in">
                  <Button className="w-full">Sign in with SSO</Button>
                </AuthPanel>
              </AuthShell>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Web shell preview</CardTitle>
              <CardDescription>
                Marketing page layout for public routes.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-hidden rounded-3xl border border-border">
              <WebShell
                header={
                  <WebShellHeader
                    title="SurfaceKit"
                    links={[{ label: "Components", href: "/playground" }]}
                  />
                }
                footer={
                  <WebShellFooter links={[{ label: "Docs", href: "/" }]} />
                }
              >
                <WebHero
                  eyebrow="Naneware Labs"
                  title="Public shell preview"
                  description="A responsive marketing surface for top-level pages."
                >
                  <Button>Explore docs</Button>
                </WebHero>
              </WebShell>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  )
}
