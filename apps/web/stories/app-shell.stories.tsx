import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  AppShell,
  AppSidebar,
  AppTopbar,
} from "@nwl/surfacekit/patterns/app-shell"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"
import { DataTableToolbar } from "@nwl/surfacekit/patterns/data-table-toolbar"
import { IncidentBanner } from "@nwl/surfacekit/patterns/incident-banner"
import { ResourceStatus } from "@nwl/surfacekit/patterns/resource-status"

const meta = {
  title: "SurfaceKit/Patterns/AppShell",
  component: AppShell,
} satisfies Meta<typeof AppShell>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <AppShell
      topbar={<AppTopbar title="Workspace" eyebrow="Playground" />}
      sidebar={
        <AppSidebar
          items={[
            { label: "Overview", active: true },
            { label: "Projects" },
            { label: "Reports" },
            { label: "Settings" },
          ]}
        />
      }
    >
      <div className="space-y-6">
        <IncidentBanner
          title="Service alert"
          description="A scheduled maintenance window starts in 15 minutes. Some APIs may be unavailable during the update."
          actionLabel="View status"
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Resource usage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResourceStatus
                title="Compute quota"
                value="62%"
                progress={62}
                detail="22 of 35 nodes active"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team activity</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTableToolbar title="Projects" />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  ),
}
