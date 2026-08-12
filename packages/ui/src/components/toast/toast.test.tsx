import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { Toaster, createToastManager } from "./toast"

describe("Toast", () => {
  it("adds, updates, and dismisses a toast through the public manager", async () => {
    const user = userEvent.setup()
    const manager = createToastManager()
    render(<Toaster toastManager={manager} />)
    let id = ""
    act(() => {
      id = manager.add({
        title: "Saved",
        description: "Changes published",
        timeout: 0,
        type: "success",
      })
    })
    expect(await screen.findByText("Saved")).toBeVisible()
    act(() => manager.update(id, { description: "Changes are live" }))
    expect(await screen.findByText("Changes are live")).toBeVisible()
    await user.click(screen.getByLabelText("Close toast"))
    await waitFor(() =>
      expect(screen.queryByText("Saved")).not.toBeInTheDocument()
    )
  })
  it("renders actions, enforces the provider limit, and closes by id", async () => {
    const manager = createToastManager()
    render(<Toaster toastManager={manager} limit={1} />)
    let first = ""
    act(() => {
      first = manager.add({
        title: "First",
        actionProps: { children: "Undo" },
        timeout: 0,
      })
      manager.add({ title: "Second", timeout: 0 })
    })
    expect(await screen.findByText("Second")).toBeVisible()
    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument()
    act(() => manager.close(first))
    await waitFor(() =>
      expect(screen.queryByText("First")).not.toBeInTheDocument()
    )
  })
})
