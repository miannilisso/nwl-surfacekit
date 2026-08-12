import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { Button } from "@nwl/surfacekit/components/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@nwl/surfacekit/components/dropdown-menu"

function DropdownExample({
  checkbox = false,
  radio = false,
  submenu = false,
}: {
  checkbox?: boolean
  radio?: boolean
  submenu?: boolean
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Open</DropdownMenuItem>
        <DropdownMenuItem disabled>Export</DropdownMenuItem>
        {checkbox && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>
              Autosave
            </DropdownMenuCheckboxItem>
          </>
        )}
        {radio && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value="team">
              <DropdownMenuRadioItem value="personal">
                Personal
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="team">Team</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </>
        )}
        {submenu && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Copy link</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
const meta = {
  title: "SurfaceKit/Components/Command & Menus/Dropdown Menu",
  component: DropdownExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Presents keyboard-accessible actions, checked choices, radio choices, disabled items, and nested menus from a trigger.",
      },
    },
  },
} satisfies Meta<typeof DropdownExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Actions",
    })
    trigger.focus()
    await userEvent.keyboard("{ArrowDown}")
    const item = within(canvasElement.ownerDocument.body).getByRole(
      "menuitem",
      {
        name: "Open",
      }
    )
    await waitFor(() => expect(item).toBeVisible())
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
export const Checkbox: Story = { args: { checkbox: true } }
export const Radio: Story = { args: { radio: true } }
export const Submenu: Story = { args: { submenu: true } }
