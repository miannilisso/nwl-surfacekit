import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"
import { IncidentBanner } from "@nwl/surfacekit/patterns/incident-banner"
import {
  WebHero,
  WebShell,
  WebShellFooter,
  WebShellHeader,
} from "@nwl/surfacekit/patterns/web-shell"

const meta = {
  title: "SurfaceKit/Patterns/WebShell",
  component: WebShell,
} satisfies Meta<typeof WebShell>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <WebShell
      header={
        <WebShellHeader
          title="SurfaceKit"
          links={[
            { label: "Components", href: "/marketing" },
            { label: "Playground", href: "/playground" },
          ]}
        />
      }
      footer={
        <WebShellFooter
          links={[
            { label: "Docs", href: "/docs" },
            { label: "Pricing", href: "/pricing" },
            { label: "About", href: "/about" },
          ]}
        />
      }
    >
      <div className="space-y-8">
        <IncidentBanner
          title="Service alert"
          description="We’re monitoring a partial outage for a subset of internal APIs. Most pages are still available."
          actionLabel="Status page"
        />

        <WebHero
          eyebrow="Naneware Labs"
          title="SurfaceKit"
          description="A production-oriented component system for Next.js product surfaces."
        >
          <Card>
            <CardHeader>
              <CardTitle>Shell preview</CardTitle>
            </CardHeader>
            <CardContent>Marketing routes use this web shell.</CardContent>
          </Card>
        </WebHero>
      </div>
    </WebShell>
  ),
}
