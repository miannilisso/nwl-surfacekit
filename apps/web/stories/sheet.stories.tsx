import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { Button } from "@nwl/surfacekit/components/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@nwl/surfacekit/components/sheet"

type Side = "top" | "right" | "bottom" | "left"
function SheetExample({ side = "right" }: { side?: Side }) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Open settings
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Workspace settings</SheetTitle>
          <SheetDescription>
            Manage workspace policy and membership defaults.
          </SheetDescription>
        </SheetHeader>
        <div className="p-6 text-sm">Settings content for the {side} side.</div>
        <SheetFooter>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
const meta = {
  title: "SurfaceKit/Components/Overlays & Dialogs/Sheet",
  component: SheetExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Slides a modal task surface from a selected viewport edge while preserving dialog semantics and focus restoration.",
      },
    },
  },
} satisfies Meta<typeof SheetExample>
export default meta
type Story = StoryObj<typeof meta>
export const Right: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Open settings",
    })
    await userEvent.click(trigger)
    const dialog = within(canvasElement.ownerDocument.body).getByRole(
      "dialog",
      {
        name: "Workspace settings",
      }
    )
    await waitFor(() => expect(dialog).toBeVisible())
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
export const Left: Story = { args: { side: "left" } }
export const Top: Story = { args: { side: "top" } }
export const Bottom: Story = { args: { side: "bottom" } }
