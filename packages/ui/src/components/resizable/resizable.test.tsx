import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable"

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(800)
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(400)
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(800)
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(400)
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 800,
    bottom: 400,
    width: 800,
    height: 400,
    toJSON: () => ({}),
  })
})

afterEach(() => vi.restoreAllMocks())

describe("Resizable", () => {
  it("composes horizontal panels with an accessible keyboard handle", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <ResizablePanelGroup
        defaultLayout={{ navigation: 40, content: 60 }}
        aria-label="Workspace layout"
        orientation="horizontal"
        style={{ width: 800, height: 400 }}
      >
        <ResizablePanel id="navigation" defaultSize="40%">
          Navigation
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="content" defaultSize="60%">
          Content
        </ResizablePanel>
      </ResizablePanelGroup>
    )
    expect(screen.getByLabelText("Workspace layout")).toHaveAttribute(
      "data-slot",
      "resizable-panel-group"
    )
    expect(
      container.querySelectorAll('[data-slot="resizable-panel"]')
    ).toHaveLength(2)
    const handle = screen.getByRole("separator")
    expect(handle).toHaveAttribute("aria-orientation", "vertical")
    expect(handle.firstElementChild).toBeInTheDocument()
    await waitFor(() => expect(handle).toHaveAttribute("aria-valuenow"))
    handle.focus()
    await user.keyboard("{ArrowRight}")
    await waitFor(() =>
      expect(handle).not.toHaveAttribute("aria-valuenow", "40")
    )
  })

  it("maps vertical groups to a horizontal separator", () => {
    render(
      <ResizablePanelGroup
        orientation="vertical"
        style={{ width: 400, height: 800 }}
      >
        <ResizablePanel>Top</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Bottom</ResizablePanel>
      </ResizablePanelGroup>
    )
    const handle = screen.getByRole("separator")
    expect(handle).toHaveAttribute("aria-orientation", "horizontal")
    expect(handle).toHaveAttribute("aria-valuenow", "50")
    handle.removeAttribute("aria-valuenow")
    return waitFor(() => expect(handle).toHaveAttribute("aria-valuenow", "50"))
  })
})
