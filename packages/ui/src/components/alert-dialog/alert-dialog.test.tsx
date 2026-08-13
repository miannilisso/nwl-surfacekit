import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog"

function Example({ onAction = vi.fn() }: { onAction?: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete workspace</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>!</AlertDialogMedia>
          <AlertDialogTitle>Delete Acme?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes the workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

describe("AlertDialog", () => {
  it("names the alert dialog and exposes action composition", async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const { container } = render(<Example onAction={onAction} />)
    await user.click(screen.getByRole("button", { name: "Delete workspace" }))
    expect(
      await screen.findByRole("alertdialog", {
        name: "Delete Acme?",
        description: "This permanently deletes the workspace.",
      })
    ).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Delete" }))
    expect(onAction).toHaveBeenCalledOnce()
    expect(
      container.ownerDocument.querySelector('[data-slot="alert-dialog-media"]')
    ).toBeInTheDocument()
  })
  it("cancels and restores focus to the trigger", async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole("button", { name: "Delete workspace" })
    await user.click(trigger)
    await user.click(await screen.findByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
