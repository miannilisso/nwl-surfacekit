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

const navigation = [
  { label: "Overview", href: "#overview", active: true },
  { label: "Projects", href: "#projects", badge: 12 },
  { label: "Reports", href: "#reports" },
  { label: "Billing", href: "#billing" },
]
function ShellExample({
  collapsed = false,
  mobile = false,
  routerLinks = false,
  embedded = false,
}: {
  collapsed?: boolean
  mobile?: boolean
  routerLinks?: boolean
  embedded?: boolean
}) {
  return (
    <AppShell
      className={mobile ? "max-w-md" : undefined}
      mobileNavigation={{ title: "Workspace navigation" }}
      mainProps={embedded ? { role: "presentation" } : undefined}
      topbar={<AppTopbar title="Production workspace" eyebrow="SurfaceKit" />}
      sidebar={
        collapsed ? undefined : (
          <AppSidebar
            label="Workspace navigation"
            items={navigation}
            renderItem={
              routerLinks
                ? (item, props) => (
                    <a {...props} href={item.href} data-router-link="true" />
                  )
                : undefined
            }
          />
        )
      }
    >
      <div className="space-y-6">
        <IncidentBanner
          severity="warning"
          title="Maintenance scheduled"
          description="A rolling database upgrade begins at 22:00 UTC."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <ResourceStatus
            title="Compute quota"
            value="62%"
            progress={62}
            detail="22 of 35 nodes active"
          />
          <Card>
            <CardHeader>
              <CardTitle>Team activity</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTableToolbar title="Projects" count={12} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
const meta = {
  title: "SurfaceKit/Patterns/App Shell",
  component: ShellExample,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Composes enterprise topbar, responsive sidebar navigation, active routes, action content, and the primary application landmark.",
      },
    },
  },
} satisfies Meta<typeof ShellExample>
export default meta
type Story = StoryObj<typeof meta>
export const Desktop: Story = {}
export const CollapsedNavigation: Story = { args: { collapsed: true } }
export const MobileContent: Story = { args: { mobile: true } }
export const RouterIntegration: Story = { args: { routerLinks: true } }
export const Embedded: Story = { args: { embedded: true } }
