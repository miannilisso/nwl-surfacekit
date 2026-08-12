import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
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
} from "./command"

function Palette({ onSelect = vi.fn() }: { onSelect?: () => void }) {
  return (
    <Command label="Search commands">
      <CommandInput />
      <CommandList>
        <CommandEmpty>No commands found.</CommandEmpty>
        <CommandGroup heading="Workspace">
          <CommandItem value="open settings" onSelect={onSelect}>
            Open settings<CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
          <CommandSeparator />
          <CommandItem value="invite member">Invite member</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

describe("Command", () => {
  it("filters items, shows empty state, and composes groups", async () => {
    const user = userEvent.setup()
    const { container } = render(<Palette />)
    const input = screen.getByRole("combobox", { name: "Search commands" })
    expect(
      container.querySelector('[data-slot="command-separator"]')
    ).toBeInTheDocument()
    await user.type(input, "invite")
    expect(screen.getByText("Invite member")).toBeVisible()
    expect(screen.queryByText("Open settings")).not.toBeInTheDocument()
    await user.clear(input)
    await user.type(input, "unknown")
    expect(screen.getByText("No commands found.")).toBeVisible()
  })
  it("selects with the keyboard and renders a named command dialog", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const { rerender } = render(<Palette onSelect={onSelect} />)
    await user.click(screen.getByRole("combobox", { name: "Search commands" }))
    await user.keyboard("{Enter}")
    expect(onSelect).toHaveBeenCalledOnce()
    rerender(
      <CommandDialog
        open
        title="Quick actions"
        description="Run a workspace action"
      >
        <Palette />
      </CommandDialog>
    )
    expect(
      await screen.findByRole("dialog", {
        name: "Quick actions",
        description: "Run a workspace action",
      })
    ).toBeVisible()
  })
})
