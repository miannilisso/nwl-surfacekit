import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./context-menu"

function Example({ onOpen = vi.fn() }: { onOpen?: () => void }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger render={<div tabIndex={0} />}>
        Right-click workspace
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel inset>Workspace</ContextMenuLabel>
          <ContextMenuItem onClick={onOpen}>
            Open<ContextMenuShortcut>Enter</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem disabled>Export</ContextMenuItem>
        <ContextMenuCheckboxItem checked>Autosave</ContextMenuCheckboxItem>
        <ContextMenuRadioGroup value="team">
          <ContextMenuRadioItem value="team">Team</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Email</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
      <ContextMenuPortal>
        <span data-testid="context-menu-portal" />
      </ContextMenuPortal>
    </ContextMenu>
  )
}

describe("ContextMenu", () => {
  it("opens from the context-menu gesture and exposes item state", async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByText("Right-click workspace")
    await user.pointer({ target: trigger, keys: "[MouseRight]" })
    expect(
      await screen.findByRole("menuitem", { name: "Export" })
    ).toHaveAttribute("aria-disabled", "true")
    expect(
      screen.getByRole("menuitemcheckbox", { name: "Autosave" })
    ).toBeChecked()
    expect(screen.getByRole("menuitemradio", { name: "Team" })).toBeChecked()
    expect(screen.getByText("Workspace")).toHaveAttribute(
      "data-slot",
      "context-menu-label"
    )
    expect(screen.getByText("Enter")).toHaveAttribute(
      "data-slot",
      "context-menu-shortcut"
    )
    await user.keyboard("{Escape}")
    await waitFor(() => expect(trigger).toHaveFocus())
  })
  it("selects an item and supports nested menus", async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<Example onOpen={onOpen} />)
    const trigger = screen.getByText("Right-click workspace")
    await user.pointer({ target: trigger, keys: "[MouseRight]" })
    await user.click(screen.getByRole("menuitem", { name: /^Open/ }))
    expect(onOpen).toHaveBeenCalledOnce()
    await user.pointer({ target: trigger, keys: "[MouseRight]" })
    const share = screen.getByRole("menuitem", { name: "Share" })
    share.focus()
    await user.keyboard("{ArrowRight}")
    expect(await screen.findByRole("menuitem", { name: "Email" })).toBeVisible()
  })
})
