import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "./message"

describe("Message", () => {
  it("preserves conversation ordering and region composition", () => {
    const { container } = render(
      <MessageGroup aria-label="Support thread">
        <Message align="start">
          <MessageAvatar aria-label="Amina">A</MessageAvatar>
          <MessageContent>
            <MessageHeader>Amina</MessageHeader>
            <div>How can I help?</div>
            <MessageFooter>09:41</MessageFooter>
          </MessageContent>
        </Message>
        <Message align="end">
          <MessageContent>
            <div>I need an invoice.</div>
          </MessageContent>
        </Message>
      </MessageGroup>
    )
    expect(screen.getByLabelText("Support thread")).toHaveAttribute(
      "data-slot",
      "message-group"
    )
    const messages = container.querySelectorAll('[data-slot="message"]')
    expect(messages).toHaveLength(2)
    expect(messages[0]).toHaveAttribute("data-align", "start")
    expect(messages[1]).toHaveAttribute("data-align", "end")
    expect(messages[0]).toHaveTextContent("How can I help?")
    expect(messages[1]).toHaveTextContent("I need an invoice.")
    for (const slot of [
      "message-avatar",
      "message-content",
      "message-header",
      "message-footer",
    ]) {
      expect(
        container.querySelector(`[data-slot="${slot}"]`)
      ).toBeInTheDocument()
    }
  })

  it("accepts long unbroken content without changing its data contract", () => {
    const content = "a".repeat(200)
    const { container } = render(
      <Message>
        <MessageContent>{content}</MessageContent>
      </Message>
    )
    expect(
      container.querySelector('[data-slot="message-content"]')
    ).toHaveTextContent(content)
  })
})
