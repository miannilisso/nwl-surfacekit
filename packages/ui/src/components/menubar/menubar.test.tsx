import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "./menubar"

function Example({ onOpen = vi.fn() }: { onOpen?: () => void }) {
  return (
    <Menubar aria-label="Application">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={onOpen}>Open</MenubarItem>
          <MenubarItem disabled>Export</MenubarItem>
          <MenubarCheckboxItem checked>Autosave</MenubarCheckboxItem>
          <MenubarRadioGroup value="team">
            <MenubarRadioItem value="team">Team</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

describe("Menubar", () => {
  it("opens a menu, exposes item state, and invokes a selection", async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<Example onOpen={onOpen} />)
    const trigger = screen.getByRole("menuitem", { name: "File" })
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
    await user.click(screen.getByRole("menuitem", { name: "Open" }))
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("supports keyboard opening and nested menus", async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole("menuitem", { name: "File" })
    trigger.focus()
    await user.keyboard("{ArrowDown}")
    const share = screen.getByRole("menuitem", { name: "Share" })
    share.focus()
    await user.keyboard("{ArrowRight}")
    expect(await screen.findByRole("menuitem", { name: "Email" })).toBeVisible()
  })
})
