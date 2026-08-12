import { render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ScrollArea, ScrollBar } from "./scroll-area"

class OverflowResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {}
  observe(target: Element) {
    this.callback(
      [
        {
          target,
          contentRect: target.getBoundingClientRect(),
        } as ResizeObserverEntry,
      ],
      this as unknown as ResizeObserver
    )
  }
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", OverflowResizeObserver)
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(100)
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(100)
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(800)
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(800)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("ScrollArea", () => {
  it("places long content in a focusable viewport with a vertical bar", async () => {
    const { container } = render(
      <ScrollArea className="h-40" aria-label="Audit events">
        {Array.from({ length: 20 }, (_, index) => (
          <p key={index}>Event {index + 1}</p>
        ))}
      </ScrollArea>
    )
    expect(screen.getByLabelText("Audit events")).toHaveAttribute(
      "data-slot",
      "scroll-area"
    )
    expect(
      container.querySelector('[data-slot="scroll-area-viewport"]')
    ).toHaveTextContent("Event 20")
    await waitFor(() =>
      expect(
        container.querySelector('[data-slot="scroll-area-scrollbar"]')
      ).toHaveAttribute("data-orientation", "vertical")
    )
  })

  it("supports horizontal and vertical bars together", async () => {
    const { container } = render(
      <ScrollArea>
        <div className="w-[80rem]">Wide content</div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    )
    await waitFor(() =>
      expect(
        container.querySelectorAll('[data-slot="scroll-area-scrollbar"]')
      ).toHaveLength(2)
    )
    const bars = container.querySelectorAll(
      '[data-slot="scroll-area-scrollbar"]'
    )
    expect(bars).toHaveLength(2)
    expect(
      Array.from(bars, (bar) => bar.getAttribute("data-orientation")).sort()
    ).toEqual(["horizontal", "vertical"])
  })
})
