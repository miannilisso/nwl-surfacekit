import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "./bubble"

describe("Bubble", () => {
  it("groups sent and received content with explicit alignment and variants", () => {
    const { container } = render(
      <BubbleGroup aria-label="Conversation">
        <Bubble variant="secondary" align="start">
          <BubbleContent>Can you review this?</BubbleContent>
        </Bubble>
        <Bubble variant="default" align="end">
          <BubbleContent>Already approved.</BubbleContent>
        </Bubble>
      </BubbleGroup>
    )
    expect(screen.getByLabelText("Conversation")).toHaveAttribute(
      "data-slot",
      "bubble-group"
    )
    const bubbles = container.querySelectorAll('[data-slot="bubble"]')
    expect(bubbles[0]).toHaveAttribute("data-align", "start")
    expect(bubbles[0]).toHaveAttribute("data-variant", "secondary")
    expect(bubbles[1]).toHaveAttribute("data-align", "end")
    expect(bubbles[1]).toHaveAttribute("data-variant", "default")
  })

  it("composes interactive content and reactions", () => {
    const onReact = vi.fn()
    render(
      <Bubble variant="outline">
        <BubbleContent render={<a href="/release" />}>
          View release
        </BubbleContent>
        <BubbleReactions side="bottom" align="end">
          <button type="button" onClick={onReact}>
            👍 3
          </button>
        </BubbleReactions>
      </Bubble>
    )
    expect(screen.getByRole("link", { name: "View release" })).toHaveAttribute(
      "href",
      "/release"
    )
    fireEvent.click(screen.getByRole("button", { name: "👍 3" }))
    expect(onReact).toHaveBeenCalledOnce()
  })
})
