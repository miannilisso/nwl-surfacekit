import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu"

function Example({ onOpen = vi.fn() }: { onOpen?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onOpen}>Open</DropdownMenuItem>
        <DropdownMenuItem disabled>Export</DropdownMenuItem>
        <DropdownMenuCheckboxItem checked>Autosave</DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup value="team">
          <DropdownMenuRadioItem value="team">Team</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Email</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

describe("DropdownMenu", () => {
  it("opens, exposes item variants, and restores focus on Escape", async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole("button", { name: "Actions" })
    trigger.focus()
    await user.keyboard("{ArrowDown}")
    expect(screen.getByRole("menuitem", { name: "Export" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
    expect(
      screen.getByRole("menuitemcheckbox", { name: "Autosave" })
    ).toBeChecked()
    expect(screen.getByRole("menuitemradio", { name: "Team" })).toBeChecked()
    await user.keyboard("{Escape}")
    expect(trigger).toHaveFocus()
  })
  it("selects items and opens a keyboard submenu", async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<Example onOpen={onOpen} />)
    const trigger = screen.getByRole("button", { name: "Actions" })
    trigger.focus()
    await user.keyboard("{ArrowDown}{Enter}")
    expect(onOpen).toHaveBeenCalledOnce()
    trigger.focus()
    await user.keyboard("{ArrowDown}")
    const share = screen.getByRole("menuitem", { name: "Share" })
    share.focus()
    await user.keyboard("{ArrowRight}")
    expect(await screen.findByRole("menuitem", { name: "Email" })).toBeVisible()
  })
})
