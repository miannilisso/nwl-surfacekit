import { Button } from "@nwl/surfacekit/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@nwl/surfacekit/components/card"
import { Badge } from "@nwl/surfacekit/components/badge"
import {
  WebHero,
  WebShell,
  WebShellFooter,
  WebShellHeader,
} from "@nwl/surfacekit/patterns/web-shell"
import {
  CheckCircle2,
  Zap,
  Box,
  Accessibility,
  Code,
  Layers,
} from "lucide-react"

const links = [
  { label: "Marketing", href: "/marketing" },
  { label: "Playground", href: "/playground" },
]

export default function Page() {
  const features = [
    {
      icon: <Box className="h-5 w-5" />,
      title: "60+ Components",
      description: "Production-ready UI components built on Base UI primitives",
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: "10 Enterprise Patterns",
      description: "Complete workflows and layouts for complex applications",
    },
    {
      icon: <Accessibility className="h-5 w-5" />,
      title: "100% Accessible",
      description: "WCAG 2.1 compliant with comprehensive ARIA support",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "TypeScript First",
      description: "Full type safety with comprehensive definitions",
    },
    {
      icon: <Code className="h-5 w-5" />,
      title: "Well Documented",
      description: "Storybook stories and Vitest coverage for every component",
    },
    {
      icon: <Badge className="h-5 w-5" />,
      title: "Customizable",
      description: "Tailwind CSS v4 with shadcn/ui design tokens",
    },
  ]

  const stats = [
    { label: "Components", value: "60+" },
    { label: "Patterns", value: "10" },
    { label: "Test Coverage", value: "100%" },
    { label: "TypeScript", value: "✓" },
  ]

  return (
    <WebShell
      header={<WebShellHeader title="SurfaceKit" links={links} />}
      footer={<WebShellFooter links={links} />}
    >
      <div className="space-y-16 py-8">
        {/* Hero Section */}
        <WebHero
          eyebrow="Naneware Labs"
          title="SurfaceKit"
          description="A comprehensive UI library and Next.js shell system for production product surfaces, documentation, and component testing."
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button render={<a href="/playground" />} nativeButton={false}>
              Explore Components
            </Button>
            <Button
              variant="outline"
              render={<a href="/marketing" />}
              nativeButton={false}
            >
              Learn More
            </Button>
          </div>
        </WebHero>

        {/* Stats Section */}
        <section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-card p-4 text-center"
            >
              <div className="text-2xl font-bold text-primary">
                {stat.value}
              </div>
              <p className="mt-1 text-xs tracking-wider text-muted-foreground uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Features Grid */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Why SurfaceKit?</h2>
            <p className="mt-2 text-muted-foreground">
              Everything you need to build modern, accessible UIs
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-primary">{feature.icon}</div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-4xl px-6">
          <Card className="border-primary/20 bg-linear-to-br from-primary/10 to-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">Built for Teams</CardTitle>
              <CardDescription>
                Whether you are building a SaaS platform, internal tool, or
                marketing site, SurfaceKit has you covered.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Production Ready</p>
                    <p className="text-xs text-muted-foreground">
                      Battle-tested in real applications
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Developer Friendly</p>
                    <p className="text-xs text-muted-foreground">
                      Intuitive APIs and great DX
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Accessible by Default</p>
                    <p className="text-xs text-muted-foreground">
                      WCAG 2.1 AA compliant
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Fully Typed</p>
                    <p className="text-xs text-muted-foreground">
                      Complete TypeScript support
                    </p>
                  </div>
                </div>
              </div>
              <Button
                render={<a href="/playground" />}
                nativeButton={false}
                className="w-full sm:w-auto"
              >
                Start Exploring
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </WebShell>
  )
}
