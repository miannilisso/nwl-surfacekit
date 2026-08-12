import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@nwl/surfacekit/components/card"
import { Button } from "@nwl/surfacekit/components/button"
import { Badge } from "@nwl/surfacekit/components/badge"
import {
  WebShell,
  WebShellFooter,
  WebShellHeader,
} from "@nwl/surfacekit/patterns/web-shell"
import {
  ArrowRight,
  GitBranch,
  Palette,
  Zap,
  Package,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

const links = [
  { label: "Home", href: "/" },
  { label: "Playground", href: "/playground" },
]

const coreFeatures = [
  {
    icon: <Package className="h-6 w-6" />,
    title: "Composable shells",
    description:
      "Pre-built layout patterns for authentication, data tables, and application shells. Mix and match components to create complex UIs.",
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: "Tokenized styling",
    description:
      "Comprehensive design token system with Tailwind CSS v4. Consistent spacing, colors, typography across all components.",
  },
  {
    icon: <AlertCircle className="h-6 w-6" />,
    title: "Accessible primitives",
    description:
      "Built on Base UI with full ARIA support. Every component meets WCAG 2.1 AA standards for inclusive design.",
  },
]

const componentCategories = [
  {
    name: "Form Inputs",
    count: 14,
    description: "Input, Select, Checkbox, Toggle, Calendar, and more",
  },
  {
    name: "Navigation",
    count: 5,
    description: "Breadcrumb, Tabs, Pagination, Menu",
  },
  {
    name: "Dialogs & Overlays",
    count: 10,
    description: "Dialog, Sheet, Toast, Popover, Tooltip",
  },
  {
    name: "Data Display",
    count: 8,
    description: "Table, List, Card, Badge, Progress",
  },
  {
    name: "Feedback",
    count: 4,
    description: "Alert, Spinner, Skeleton, Empty",
  },
  {
    name: "Layout & Utilities",
    count: 18,
    description: "Container, Grid, Flex, Spacing primitives",
  },
]

const useCases = [
  {
    title: "SaaS Applications",
    description:
      "Enterprise-ready patterns for dashboards, data management, and user workflows.",
  },
  {
    title: "Internal Tools",
    description:
      "Rapid development with pre-built layouts and components optimized for productivity.",
  },
  {
    title: "Marketing Sites",
    description:
      "Flexible marketing components and patterns for modern web experiences.",
  },
  {
    title: "Documentation",
    description:
      "Built-in patterns for guides, tutorials, and component showcases.",
  },
]

export default function MarketingPage() {
  return (
    <WebShell
      header={<WebShellHeader title="SurfaceKit" links={links} />}
      footer={<WebShellFooter links={links} />}
    >
      <div className="space-y-16 py-8">
        {/* Core Features Section */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="mb-8">
            <Badge className="mb-4">Core Features</Badge>
            <h2 className="mb-2 text-3xl font-bold">
              Built for modern product development
            </h2>
            <p className="text-muted-foreground">
              Everything you need, nothing you do not. Modular, flexible, and
              production-ready.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {coreFeatures.map((feature, idx) => (
              <Card
                key={idx}
                className="border-border/50 transition-colors hover:border-border"
              >
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
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

        {/* Component Categories */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="mb-8">
            <Badge className="mb-4">Component Library</Badge>
            <h2 className="mb-2 text-3xl font-bold">
              Comprehensive component toolkit
            </h2>
            <p className="text-muted-foreground">
              60+ carefully crafted components organized by purpose
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {componentCategories.map((category) => (
              <Card key={category.name} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className="flex h-8 w-8 items-center justify-center p-0 text-lg"
                    >
                      {category.count}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="mb-8">
            <Badge className="mb-4">Use Cases</Badge>
            <h2 className="mb-2 text-3xl font-bold">Perfect for any project</h2>
            <p className="text-muted-foreground">
              From small projects to enterprise applications
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {useCases.map((useCase) => (
              <Card
                key={useCase.title}
                className="group transition-all hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between transition-colors group-hover:text-primary">
                    {useCase.title}
                    <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {useCase.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Highlights Section */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="rounded-lg border border-border/50 bg-card p-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Performance</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Optimized components with minimal bundle impact
                </p>
              </div>
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Developer Experience</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Intuitive APIs, full TypeScript support, excellent
                  documentation
                </p>
              </div>
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Badge className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Consistency</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Design tokens ensure visual and behavioral consistency
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="rounded-lg border border-primary/20 bg-linear-to-br from-primary/10 to-primary/5 p-8 text-center">
            <h2 className="mb-3 text-2xl font-bold">Ready to get started?</h2>
            <p className="mb-6 text-muted-foreground">
              Explore all 60+ components and 10 patterns in the interactive
              playground.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button render={<a href="/playground" />} nativeButton={false}>
                Open Playground
              </Button>
              <Button
                variant="outline"
                render={<Link href="/" />}
                nativeButton={false}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </section>
      </div>
    </WebShell>
  )
}
