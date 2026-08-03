import { Button } from "@nwl/surfacekit/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@nwl/surfacekit/components/card"
import { WebHero, WebShell, WebShellFooter, WebShellHeader } from "@nwl/surfacekit/patterns/web-shell"

const links = [
  { label: "Marketing", href: "/marketing" },
  { label: "Playground", href: "/playground" },
]

export default function Page() {
  return (
    <WebShell
      header={<WebShellHeader title="SurfaceKit" links={links} />}
      footer={<WebShellFooter links={links} />}
    >
      <WebHero
        eyebrow="Naneware Labs"
        title="SurfaceKit"
        description="A shared UI package and Next.js shell system for production product surfaces, documentation, and component testing."
      >
        <Card>
          <CardHeader>
            <CardTitle>Current package surface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>Components are sourced from folder-based shadcn conventions and Base UI primitives.</p>
            <Button render={<a href="/playground" />} nativeButton={false}>
              Explore playground
            </Button>
          </CardContent>
        </Card>
      </WebHero>
    </WebShell>
  )
}
