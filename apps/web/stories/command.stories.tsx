import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, within } from "storybook/test"
import { Button } from "@nwl/surfacekit/components/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@nwl/surfacekit/components/command"

function PaletteContent({ empty = false }: { empty?: boolean }) {
  return (
    <Command label="Search commands">
      <CommandInput placeholder="Search commands..." />
      <CommandList>
        {!empty && <CommandEmpty>No commands found.</CommandEmpty>}
        {empty ? (
          <CommandGroup heading="Results">
            <CommandItem value="no commands found" disabled>
              No commands found.
            </CommandItem>
          </CommandGroup>
        ) : (
          <>
            <CommandGroup heading="Workspace">
              <CommandItem value="open settings">
                Open settings<CommandShortcut>⌘,</CommandShortcut>
              </CommandItem>
              <CommandItem value="invite member">
                Invite member<CommandShortcut>⌘I</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Navigation">
              <CommandItem value="view audit log">View audit log</CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  )
}
function CommandExample({
  empty = false,
  dialog = false,
}: {
  empty?: boolean
  dialog?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  if (dialog)
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open palette
        </Button>
        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          title="Quick actions"
          description="Run a workspace action"
        >
          <PaletteContent />
        </CommandDialog>
      </>
    )
  return (
    <div className="w-96 max-w-full rounded-3xl border">
      <PaletteContent empty={empty} />
    </div>
  )
}
const meta = {
  title: "SurfaceKit/Components/Command & Menus/Command",
  component: CommandExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Filters and executes keyboard-oriented commands in an inline list or accessible dialog palette.",
      },
    },
  },
} satisfies Meta<typeof CommandExample>
export default meta
type Story = StoryObj<typeof meta>
export const Palette: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole("combobox", { name: "Search commands" })
    await userEvent.type(input, "open")
    await expect(
      canvas.getByRole("option", { name: /Open settings/ })
    ).toBeVisible()
    await expect(
      canvas.queryByRole("option", { name: /Invite member/ })
    ).not.toBeInTheDocument()
  },
}
export const Empty: Story = { args: { empty: true } }
export const Groups: Story = {}
export const Dialog: Story = { args: { dialog: true } }
