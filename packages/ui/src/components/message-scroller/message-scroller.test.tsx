import { fireEvent, render, renderHook, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "./message-scroller"

function Probe() {
  const controls = useMessageScroller()
  const scrollable = useMessageScrollerScrollable()
  const visibility = useMessageScrollerVisibility()
  return (
    <output data-testid="probe">
      {JSON.stringify({
        end: scrollable.end,
        anchor: visibility.currentAnchorId,
        canScroll: controls.scrollToEnd(),
      })}
    </output>
  )
}

function Example() {
  return (
    <MessageScrollerProvider defaultScrollPosition="end">
      <MessageScroller>
        <MessageScrollerViewport aria-label="Conversation">
          <MessageScrollerContent>
            {["one", "two", "three"].map((message, index) => (
              <MessageScrollerItem
                messageId={message}
                scrollAnchor={index === 2}
                key={message}
              >
                Message {message}
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
      <Probe />
    </MessageScrollerProvider>
  )
}

describe("MessageScroller", () => {
  it("guards hooks outside the provider", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined)
    expect(() => renderHook(() => useMessageScroller())).toThrow(
      /within a MessageScroller/
    )
    consoleError.mockRestore()
  })

  it("composes provider, viewport, content, items, hooks, and latest button", () => {
    const { container } = render(<Example />)
    expect(screen.getByLabelText("Conversation")).toHaveAttribute(
      "data-slot",
      "message-scroller-viewport"
    )
    expect(screen.getByLabelText("Conversation")).toHaveAttribute(
      "data-scroll-boundary",
      "message-scroller"
    )
    expect(screen.getByLabelText("Conversation")).toHaveClass(
      "surface-scrollbar"
    )
    expect(
      container.querySelectorAll('[data-slot="message-scroller-item"]')
    ).toHaveLength(3)
    expect(screen.getByTestId("probe")).toHaveTextContent('"anchor":')
    const button = screen.getByRole("button", {
      name: "Scroll to end",
      hidden: true,
    })
    expect(button).toHaveAttribute("data-direction", "end")
    fireEvent.click(button)
  })
})
