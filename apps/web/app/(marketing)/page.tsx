import type { Metadata } from "next"
import Image from "next/image"
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

import { OperationsPreview } from "../../components/marketing/operations-preview"
import { WebShellActions } from "../../components/marketing/web-shell-actions"
import {
  getSurfaceCounts,
  surfaceCategories,
} from "../../lib/surfacekit/catalog"

export const metadata: Metadata = {
  title: "SurfaceKit — Production UI foundations",
  description:
    "Explore 60 components and 10 enterprise patterns for accessible product interfaces.",
}

const links = [
  { label: "Capabilities", href: "/marketing" },
  { label: "Playground", href: "/playground" },
]

export default function Page() {
  const counts = getSurfaceCounts()
  const componentCategories = surfaceCategories.filter(
    (category) => category.id !== "patterns"
  ).length

  return (
    <WebShell
      header={
        <WebShellHeader
          title="SurfaceKit"
          links={links}
          cta={<WebShellActions />}
          mobileNavigation={{
            title: "SurfaceKit navigation",
            closeLabel: "Close site navigation",
          }}
        />
      }
      footer={<WebShellFooter links={links} />}
    >
      <WebHero
        eyebrow="Naneware Labs"
        title="SurfaceKit"
        description="A governed component and enterprise-pattern system for building clear, resilient product interfaces."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/playground" className={buttonVariants()}>
              Explore the playground
            </Link>
            <Link
              href="/marketing"
              className={buttonVariants({ variant: "outline" })}
            >
              Review capabilities
            </Link>
          </div>
        }
      >
        <Card className="border-primary/20 bg-card/90">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Image
                src="/favicons/nwl-surfacekit.svg"
                alt="NWL SurfaceKit mark"
                width={48}
                height={48}
                className="size-12 rounded-xl"
              />
              <Badge className="w-fit" variant="secondary">
                Verified inventory
              </Badge>
            </div>
            <CardTitle>One source-to-demo contract</CardTitle>
            <CardDescription>
              Behavioral tests, Storybook documentation, catalog metadata, and
              live examples stay in exact sync.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            <Metric value={counts.components} label="Components" />
            <Metric value={counts.patterns} label="Patterns" />
            <Metric value={componentCategories} label="Categories" />
          </CardContent>
        </Card>
      </WebHero>

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-20">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary">Product foundations</Badge>
          <h2 className="text-3xl font-semibold tracking-tight">
            Designed for operational product work
          </h2>
          <p className="leading-7 text-muted-foreground">
            SurfaceKit combines composable primitives, workflow-level patterns,
            and evidence-backed release gates without prescribing your product
            architecture.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [
              "Governed composition",
              "Compound APIs preserve semantics while supporting complex enterprise layouts.",
            ],
            [
              "Typed integration",
              "Public exports, catalog metadata, and route ownership are checked as code.",
            ],
            [
              "Reviewable evidence",
              "Behavior, accessibility automation, stories, and browser examples are independently inspectable.",
            ],
          ].map(([title, description]) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="leading-6 text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl space-y-8 px-6 py-20">
          <div className="max-w-3xl space-y-3">
            <Badge variant="outline">Live composition</Badge>
            <h2 className="text-3xl font-semibold tracking-tight">
              A realistic operations workspace
            </h2>
            <p className="leading-7 text-foreground/80">
              Search fixed project data and exercise toolbar actions in a
              client-side preview built entirely from SurfaceKit modules.
            </p>
          </div>
          <OperationsPreview />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Evidence with explicit limits
        </h2>
        <p className="mx-auto mt-4 max-w-3xl leading-7 text-muted-foreground">
          Repository contracts cover every module, and automated axe checks
          detect common accessibility violations. Automated results support
          review; they do not replace manual keyboard, screen-reader, or
          assistive-technology evaluation.
        </p>
      </section>
    </WebShell>
  )
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border bg-background p-3 text-center">
      <p className="text-2xl font-semibold text-primary">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
