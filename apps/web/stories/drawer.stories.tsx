import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { Button } from "@nwl/surfacekit/components/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@nwl/surfacekit/components/drawer"
import { Input } from "@nwl/surfacekit/components/input"
import { Label } from "@nwl/surfacekit/components/label"

type Direction = "down" | "left" | "right" | "up"
function DrawerExample({
  direction = "down",
  form = false,
  initiallyOpen = false,
}: {
  direction?: Direction
  form?: boolean
  initiallyOpen?: boolean
}) {
  return (
    <Drawer
      swipeDirection={direction}
      showSwipeHandle
      defaultOpen={initiallyOpen}
    >
      <DrawerTrigger render={<Button variant="outline" />}>
        Open drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {form ? "Create environment" : "Audit filters"}
          </DrawerTitle>
          <DrawerDescription>
            {form
              ? "Configure the new runtime environment."
              : "Refine events shown in the audit log."}
          </DrawerDescription>
        </DrawerHeader>
        {form && (
          <div className="grid gap-2 p-4">
            <Label htmlFor="environment-name">Name</Label>
            <Input id="environment-name" placeholder="Production EU" />
          </div>
        )}
        <DrawerFooter>
          <DrawerClose render={<Button />}>
            {form ? "Create" : "Done"}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
const meta = {
  title: "SurfaceKit/Components/Overlays & Dialogs/Drawer",
  component: DrawerExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Presents a swipe-aware task surface from any viewport edge with accessible dialog naming and composable regions.",
      },
    },
  },
} satisfies Meta<typeof DrawerExample>
export default meta
type Story = StoryObj<typeof meta>
export const Bottom: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Open drawer",
    })
    await userEvent.click(trigger)
    const dialog = within(canvasElement.ownerDocument.body).getByRole(
      "dialog",
      { name: "Audit filters" }
    )
    await waitFor(() => expect(dialog).toBeVisible())
    await userEvent.click(within(dialog).getByRole("button", { name: "Done" }))
    await waitFor(() => expect(dialog).toHaveAttribute("data-closed", ""))
    await waitFor(() =>
      expect(
        within(dialog).queryByRole("button", { name: "Done" })
      ).not.toBeInTheDocument()
    )
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
export const Left: Story = { args: { direction: "left" } }
export const FormDrawer: Story = { args: { form: true } }
export const InitiallyOpen: Story = { args: { initiallyOpen: true } }
