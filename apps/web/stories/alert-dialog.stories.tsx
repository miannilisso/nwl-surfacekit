import type { Meta, StoryObj } from "@storybook/react-vite"
import { ShieldAlertIcon, Trash2Icon } from "lucide-react"
import { expect, userEvent, waitFor, within } from "storybook/test"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@nwl/surfacekit/components/alert-dialog"
import { Button } from "@nwl/surfacekit/components/button"

function AlertDialogExample({
  destructive = false,
  media = false,
  long = false,
}: {
  destructive?: boolean
  media?: boolean
  long?: boolean
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant={destructive ? "destructive" : "outline"} />}
      >
        {destructive ? "Delete workspace" : "Review policy"}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          {media && (
            <AlertDialogMedia>
              {destructive ? <Trash2Icon /> : <ShieldAlertIcon />}
            </AlertDialogMedia>
          )}
          <AlertDialogTitle>
            {destructive ? "Delete Acme?" : "Publish policy changes?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {long
              ? "This action changes production access for every member in the organization. Existing sessions remain active until their next policy evaluation, so coordinate the rollout with your security and support teams."
              : destructive
                ? "This permanently deletes the workspace and its audit history."
                : "The updated policy will apply to all new sessions."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant={destructive ? "destructive" : "default"}>
            {destructive ? "Delete" : "Publish"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
const meta = {
  title: "SurfaceKit/Components/Overlays & Dialogs/Alert Dialog",
  component: AlertDialogExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Interrupts a workflow for a consequential decision with alert-dialog semantics, explicit consequences, and safe cancellation.",
      },
    },
  },
} satisfies Meta<typeof AlertDialogExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Review policy",
    })
    await userEvent.click(trigger)
    const dialog = within(canvasElement.ownerDocument.body).getByRole(
      "alertdialog",
      { name: "Publish policy changes?" }
    )
    await waitFor(() => expect(dialog).toBeVisible())
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Cancel" })
    )
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
export const Destructive: Story = { args: { destructive: true } }
export const WithMedia: Story = { args: { media: true } }
export const LongContent: Story = { args: { long: true } }
