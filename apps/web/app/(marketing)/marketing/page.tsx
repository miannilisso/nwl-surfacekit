import { Card, CardContent, CardHeader, CardTitle } from "@nwl/surfacekit/components/card"
import { WebShell, WebShellFooter, WebShellHeader } from "@nwl/surfacekit/patterns/web-shell"

const links = [
  { label: "Home", href: "/" },
  { label: "Playground", href: "/playground" },
]

const sections = ["Composable shells", "Tokenized styling", "Accessible primitives"]

export default function MarketingPage() {
  return (
    <WebShell
      header={<WebShellHeader title="SurfaceKit" links={links} />}
      footer={<WebShellFooter links={links} />}
    >
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-3">
        {sections.map((section) => (
          <Card key={section}>
            <CardHeader>
              <CardTitle>{section}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Built as reusable package exports consumed by the web app.
            </CardContent>
          </Card>
        ))}
      </section>
    </WebShell>
  )
}
