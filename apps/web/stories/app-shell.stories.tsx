import type { Meta, StoryObj } from "@storybook/react"

import { AppShell, AppSidebar, AppTopbar } from "@nwl/surfacekit/patterns/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@nwl/surfacekit/components/card"

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
      sidebar={<AppSidebar items={[{ label: "Overview", active: true }, { label: "Projects" }, { label: "Reports" }]} />}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {["Components", "Patterns", "Tokens"].map((item) => (
          <Card key={item}>
            <CardHeader>
              <CardTitle>{item}</CardTitle>
            </CardHeader>
            <CardContent>Production-ready shell content.</CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  ),
}
