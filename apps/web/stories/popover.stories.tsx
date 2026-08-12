import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { Button } from "@nwl/surfacekit/components/button"
import { Input } from "@nwl/surfacekit/components/input"
import { Label } from "@nwl/surfacekit/components/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@nwl/surfacekit/components/popover"

function PopoverExample({
  form = false,
  controlled = false,
}: {
  form?: boolean
  controlled?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover
      open={controlled ? open : undefined}
      onOpenChange={controlled ? setOpen : undefined}
    >
      <PopoverTrigger render={<Button variant="outline" />}>
        Open filters
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>
            {form ? "Invite member" : "Audit filters"}
          </PopoverTitle>
          <PopoverDescription>
            {form
              ? "Send a workspace invitation."
              : "Refine events shown in the audit log."}
          </PopoverDescription>
        </PopoverHeader>
        {form ? (
          <div className="grid gap-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="name@company.com"
            />
            <Button size="sm">Send invite</Button>
          </div>
        ) : (
          <Button size="sm">Apply filters</Button>
        )}
      </PopoverContent>
    </Popover>
  )
}
const meta = {
  title: "SurfaceKit/Components/Overlays & Dialogs/Popover",
  component: PopoverExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Anchors compact interactive content to a trigger with accessible naming, controlled state, and dismissible focus management.",
      },
    },
  },
} satisfies Meta<typeof PopoverExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Open filters",
    })
    await userEvent.click(trigger)
    const dialog = within(canvasElement.ownerDocument.body).getByRole(
      "dialog",
      {
        name: "Audit filters",
      }
    )
    await waitFor(() => expect(dialog).toBeVisible())
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
export const FormPopover: Story = { args: { form: true } }
export const Controlled: Story = { args: { controlled: true } }
