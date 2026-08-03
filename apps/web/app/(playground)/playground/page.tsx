import { Button } from "@nwl/surfacekit/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nwl/surfacekit/components/card"
import { AppShell, AppSidebar, AppTopbar } from "@nwl/surfacekit/patterns/app-shell"
import { AuthPanel, AuthShell } from "@nwl/surfacekit/patterns/auth-shell"
import { WebHero, WebShell, WebShellFooter, WebShellHeader } from "@nwl/surfacekit/patterns/web-shell"

const navItems = [
  { label: "Components", active: true },
  { label: "App shell" },
  { label: "Auth shell" },
  { label: "Web shell" },
]

export default function PlaygroundPage() {
  return (
    <AppShell
      topbar={<AppTopbar title="Component playground" eyebrow="SurfaceKit" />}
      sidebar={<AppSidebar items={navItems} />}
    >
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-3">
          {["Default", "Outline", "Destructive"].map((variant) => (
            <Card key={variant}>
              <CardHeader>
                <CardTitle>{variant} button</CardTitle>
                <CardDescription>Base UI primitive with shadcn-style variants.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant={variant === "Outline" ? "outline" : variant === "Destructive" ? "destructive" : "default"}>
                  {variant}
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">Auth shell composition</h2>
            <p className="text-sm text-muted-foreground">Embedded preview for authentication layouts.</p>
          </div>
          <div className="overflow-hidden rounded-lg border border-border">
            <AuthShell className="min-h-144 md:grid-cols-1" title="Welcome back" subtitle="Use a workspace credential.">
              <AuthPanel title="Secure access">
                <Button className="w-full">Continue with SSO</Button>
              </AuthPanel>
            </AuthShell>
          </div>
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">Web shell composition</h2>
            <p className="text-sm text-muted-foreground">Embedded preview for public marketing layouts.</p>
          </div>
          <div className="overflow-hidden rounded-lg border border-border">
            <WebShell
              header={<WebShellHeader title="SurfaceKit" />}
              footer={<WebShellFooter links={[{ label: "Home", href: "/" }]} />}
            >
              <WebHero
                className="border-b-0"
                title="Marketing preview"
                description="Public routes use the web shell package export."
              />
            </WebShell>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
