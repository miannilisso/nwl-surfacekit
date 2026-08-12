import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@nwl/surfacekit/components/resizable"

function ResizableExample({
  vertical = false,
  withHandle = false,
}: {
  vertical?: boolean
  withHandle?: boolean
}) {
  return (
    <div className="h-80 w-[42rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border">
      <ResizablePanelGroup
        aria-label="Workspace layout"
        orientation={vertical ? "vertical" : "horizontal"}
        defaultLayout={{ navigation: 35, content: 65 }}
      >
        <ResizablePanel id="navigation" defaultSize="35%">
          <div className="flex size-full items-center justify-center bg-muted/50 p-6">
            Navigation
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle={withHandle} />
        <ResizablePanel id="content" defaultSize="65%">
          <div className="flex size-full items-center justify-center p-6">
            Workspace content
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
const meta = {
  title: "SurfaceKit/Components/Advanced/Resizable",
  component: ResizableExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Creates mouse, touch, and keyboard-resizable panel layouts with horizontal or vertical orientation and an optional visible grip.",
      },
    },
  },
} satisfies Meta<typeof ResizableExample>
export default meta
type Story = StoryObj<typeof meta>
export const Horizontal: Story = {}
export const Vertical: Story = { args: { vertical: true } }
export const WithHandle: Story = {
  args: { withHandle: true },
  play: async ({ canvasElement }) => {
    const handle = within(canvasElement).getByRole("separator")
    const before = handle.getAttribute("aria-valuenow")
    handle.focus()
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() =>
      expect(handle.getAttribute("aria-valuenow")).not.toBe(before)
    )
  },
}
