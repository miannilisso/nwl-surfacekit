import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@nwl/surfacekit/components/context-menu"

function ContextExample({
  checkbox = false,
  radio = false,
  submenu = false,
}: {
  checkbox?: boolean
  radio?: boolean
  submenu?: boolean
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={
          <div
            tabIndex={0}
            className="grid h-40 w-80 max-w-[calc(100vw-2rem)] place-items-center rounded-2xl border border-dashed px-3 text-center text-sm text-muted-foreground"
          />
        }
      >
        Right-click this workspace
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem disabled>Export</ContextMenuItem>
        {checkbox && (
          <>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem checked>Autosave</ContextMenuCheckboxItem>
          </>
        )}
        {radio && (
          <>
            <ContextMenuSeparator />
            <ContextMenuRadioGroup value="team">
              <ContextMenuRadioItem value="personal">
                Personal
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="team">Team</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </>
        )}
        {submenu && (
          <>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>Email</ContextMenuItem>
                <ContextMenuItem>Copy link</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
const meta = {
  title: "SurfaceKit/Components/Command & Menus/Context Menu",
  component: ContextExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Provides contextual actions from the pointer context-menu gesture with full keyboard menu behavior and choice variants.",
      },
    },
  },
} satisfies Meta<typeof ContextExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByText(
      "Right-click this workspace"
    )
    await userEvent.pointer({ target: trigger, keys: "[MouseRight]" })
    await waitFor(() =>
      expect(
        within(canvasElement.ownerDocument.body).getByRole("menuitem", {
          name: "Open",
        })
      ).toBeVisible()
    )
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
export const Checkbox: Story = { args: { checkbox: true } }
export const Radio: Story = { args: { radio: true } }
export const Submenu: Story = { args: { submenu: true } }
