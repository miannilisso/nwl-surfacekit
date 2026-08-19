import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@nwl/surfacekit/components/menubar"

function MenubarExample({
  checked = false,
  radio = false,
  submenu = false,
}: {
  checked?: boolean
  radio?: boolean
  submenu?: boolean
}) {
  return (
    <Menubar aria-label="Workspace commands">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New document<MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>Export</MenubarItem>
          {checked && (
            <>
              <MenubarSeparator />
              <MenubarCheckboxItem checked>Autosave</MenubarCheckboxItem>
            </>
          )}
          {radio && (
            <>
              <MenubarSeparator />
              <MenubarRadioGroup value="team">
                <MenubarRadioItem value="personal">Personal</MenubarRadioItem>
                <MenubarRadioItem value="team">Team</MenubarRadioItem>
              </MenubarRadioGroup>
            </>
          )}
          {submenu && (
            <>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Share</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Email link</MenubarItem>
                  <MenubarItem>Copy link</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </>
          )}
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo<MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

const meta = {
  title: "SurfaceKit/Components/Navigation & Disclosure/Menubar",
  component: MenubarExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Groups application commands into keyboard-navigable menus with checked, radio, disabled, shortcut, and submenu states.",
      },
    },
  },
} satisfies Meta<typeof MenubarExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("menuitem", {
      name: "File",
    })
    trigger.focus()
    await userEvent.keyboard("{ArrowDown}")
    const item = within(canvasElement.ownerDocument.body).getByRole(
      "menuitem",
      { name: /New document/ }
    )
    await waitFor(() => expect(item).toBeVisible())
    await userEvent.click(item)
    await waitFor(() =>
      expect(
        within(canvasElement.ownerDocument.body).queryByRole("menu", {
          hidden: true,
        })
      ).not.toBeInTheDocument()
    )
  },
}
export const CheckedItems: Story = { args: { checked: true } }
export const RadioItems: Story = { args: { radio: true } }
export const Submenu: Story = { args: { submenu: true } }
