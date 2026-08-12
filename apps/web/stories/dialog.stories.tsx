import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { Button } from "@nwl/surfacekit/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@nwl/surfacekit/components/dialog"
import { Input } from "@nwl/surfacekit/components/input"
import { Label } from "@nwl/surfacekit/components/label"

function DialogExample({
  form = false,
  long = false,
  initiallyOpen = false,
}: {
  form?: boolean
  long?: boolean
  initiallyOpen?: boolean
}) {
  return (
    <Dialog defaultOpen={initiallyOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        Edit profile
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile settings</DialogTitle>
          <DialogDescription>
            {long
              ? "Update the profile used across workspace membership, access reviews, audit exports, and support conversations. Changes are recorded in the organization audit log."
              : "Update account details."}
          </DialogDescription>
        </DialogHeader>
        {form && (
          <div className="grid gap-2">
            <Label htmlFor="display-name">Display name</Label>
            <Input id="display-name" defaultValue="Amina N." />
          </div>
        )}
        <DialogFooter showCloseButton>
          {form && <Button>Save changes</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
const meta = {
  title: "SurfaceKit/Components/Overlays & Dialogs/Dialog",
  component: DialogExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Hosts a focused task in a modal surface with accessible naming, focus containment, dismissal, and restoration.",
      },
    },
  },
} satisfies Meta<typeof DialogExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Edit profile",
    })
    await userEvent.click(trigger)
    const dialog = within(canvasElement.ownerDocument.body).getByRole(
      "dialog",
      {
        name: "Profile settings",
      }
    )
    await waitFor(() => expect(dialog).toBeVisible())
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
export const FormDialog: Story = { args: { form: true } }
export const LongContent: Story = { args: { long: true } }
export const InitiallyOpen: Story = { args: { initiallyOpen: true } }
