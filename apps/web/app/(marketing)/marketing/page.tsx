import type { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@nwl/surfacekit/components/badge"
import { buttonVariants } from "@nwl/surfacekit/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"
import {
  WebHero,
  WebShell,
  WebShellFooter,
  WebShellHeader,
} from "@nwl/surfacekit/patterns/web-shell"

import { CapabilityExplorer } from "../../../components/marketing/capability-explorer"
import {
  getSurfaceCounts,
  getSurfacesByCategory,
  surfaceCatalog,
  surfaceCategories,
} from "../../../lib/surfacekit/catalog"

export const metadata: Metadata = {
  title: "SurfaceKit capabilities",
  description:
    "Review SurfaceKit components, enterprise patterns, testing evidence, and implementation guidance.",
}

const links = [
  { label: "Home", href: "/" },
  { label: "Playground", href: "/playground" },
]

export default function MarketingPage() {
  const counts = getSurfaceCounts()
  const patterns = getSurfacesByCategory("patterns")

  return (
    <WebShell
      header={
        <WebShellHeader
          title="SurfaceKit"
          links={links}
          cta={
            <Link
              href="/playground"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Playground
            </Link>
          }
        />
      }
      footer={<WebShellFooter links={links} />}
    >
      <WebHero
        eyebrow="Capabilities"
        title="Built for modern product development"
        description={`Explore ${counts.components} components and ${counts.patterns} enterprise patterns with behavioral tests, Storybook examples, and live playground implementations.`}
        className="[&>div]:min-h-[34rem]"
        action={
          <Link href="/playground" className={buttonVariants()}>
            Open the catalog
          </Link>
        }
      >
        <Card>
          <CardHeader>
            <CardTitle>Release contract</CardTitle>
            <CardDescription>
              Every public module must remain represented in five independent
              repository sets.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Source · behavior test · Storybook · catalog · live demo</p>
            <Badge variant="secondary">Exact equality enforced</Badge>
          </CardContent>
        </Card>
      </WebHero>

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-20">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary">Interactive inventory</Badge>
          <h2 className="text-3xl font-semibold tracking-tight">
            Explore by product responsibility
          </h2>
          <p className="leading-7 text-muted-foreground">
            Switch categories, review each module’s purpose, and follow a direct
            link to the live implementation.
          </p>
        </div>
        <CapabilityExplorer
          categories={surfaceCategories}
          entries={surfaceCatalog}
        />
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl space-y-8 px-6 py-20">
          <div className="max-w-3xl space-y-3">
            <Badge variant="outline">Workflow composition</Badge>
            <h2 className="text-3xl font-semibold tracking-tight">
              Enterprise patterns
            </h2>
            <p className="leading-7 text-muted-foreground">
              Pattern modules encode recurring product decisions such as
              permission denial, sensitive action confirmation, and operational
              status communication.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {patterns.map((pattern) => (
              <Card key={pattern.id} size="sm">
                <CardHeader>
                  <CardTitle>
                    <Link
                      href={`${pattern.route}#${pattern.id}`}
                      className="rounded-sm underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {pattern.name}
                    </Link>
                  </CardTitle>
                  <CardDescription>{pattern.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-20 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Theming and integration</CardTitle>
            <CardDescription>
              Tokenized styling and package-level entry points keep product
              composition explicit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-2xl bg-muted p-4 text-sm">
              <code>{`import { Button } from "@nwl/surfacekit/components/button"\nimport { AppShell } from "@nwl/surfacekit/patterns/app-shell"`}</code>
            </pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Accessibility evidence</CardTitle>
            <CardDescription>
              Automated axe checks target every application route and tested
              Storybook composition.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 leading-7 text-muted-foreground">
            <p>
              A passing result means no automatically detectable violations were
              found for the configured rules and states.
            </p>
            <p>
              Automated checks do not establish complete WCAG conformance and do
              not replace manual assistive-technology review.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="border-t">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Review the implementation, not just the claims
          </h2>
          <p className="max-w-2xl leading-7 text-muted-foreground">
            Open any of the {counts.total} live examples, inspect its Storybook
            states, and verify the behavior in the repository.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/playground" className={buttonVariants()}>
              Explore all examples
            </Link>
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              Back to SurfaceKit
            </Link>
          </div>
        </div>
      </section>
    </WebShell>
  )
}
