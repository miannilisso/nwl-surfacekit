import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

function Example() {
  return (
    <Dialog>
      <DialogTrigger>Edit profile</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile settings</DialogTitle>
          <DialogDescription>Update account details.</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}

describe("Dialog", () => {
  it("provides an accessible name, description, overlay, and close control", async () => {
    const user = userEvent.setup()
    const { container } = render(<Example />)
    await user.click(screen.getByRole("button", { name: "Edit profile" }))
    expect(
      await screen.findByRole("dialog", {
        name: "Profile settings",
        description: "Update account details.",
      })
    ).toBeVisible()
    expect(
      container.ownerDocument.querySelector('[data-slot="dialog-overlay"]')
    ).toBeInTheDocument()
    await user.click(screen.getAllByRole("button", { name: "Close" })[0]!)
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    )
  })
  it("restores focus after Escape dismissal", async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole("button", { name: "Edit profile" })
    await user.click(trigger)
    await screen.findByRole("dialog")
    await user.keyboard("{Escape}")
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
