import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@nwl/surfacekit/components/tabs"

function TabsExample({
  underline = false,
  disabled = false,
  overflow = false,
}: {
  underline?: boolean
  disabled?: boolean
  overflow?: boolean
}) {
  const tabs = overflow
    ? ["Overview", "Members", "Roles", "Policies", "Sessions", "Audit events"]
    : ["Overview", "Activity", "Audit"]
  return (
    <Tabs defaultValue="Overview" className="w-[34rem] max-w-full">
      <div className={overflow ? "overflow-x-auto pb-1" : undefined}>
        <TabsList
          aria-label="Workspace sections"
          variant={underline ? "line" : "default"}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              disabled={disabled && tab === "Audit"}
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {tabs.map((tab) => (
        <TabsContent key={tab} value={tab} className="rounded-xl border p-4">
          {tab} workspace content
        </TabsContent>
      ))}
    </Tabs>
  )
}

const meta = {
  title: "SurfaceKit/Components/Navigation & Disclosure/Tabs",
  component: TabsExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Switches between peer content panels with accessible tab relationships, keyboard control, variants, and overflow handling.",
      },
    },
  },
} satisfies Meta<typeof TabsExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const activity = canvas.getByRole("tab", { name: "Activity" })
    await userEvent.click(activity)
    await expect(activity).toHaveAttribute("aria-selected", "true")
    await expect(
      canvas.getByRole("tabpanel", { name: "Activity" })
    ).toHaveTextContent("Activity workspace content")
  },
}
export const Underline: Story = { args: { underline: true } }
export const DisabledTab: Story = { args: { disabled: true } }
export const Overflow: Story = { args: { overflow: true } }
