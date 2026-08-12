import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "./attachment"

describe("Attachment", () => {
  it("composes file metadata with primary and secondary actions", () => {
    const onOpen = vi.fn()
    const onRemove = vi.fn()
    render(
      <Attachment state="done">
        <AttachmentMedia variant="icon">PDF</AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
          <AttachmentDescription>2.4 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentTrigger
          aria-label="Open quarterly report"
          onClick={onOpen}
        />
        <AttachmentActions>
          <AttachmentAction
            aria-label="Remove quarterly report"
            onClick={onRemove}
          >
            ×
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    )

    expect(screen.getByText("quarterly-report.pdf")).toBeVisible()
    fireEvent.click(
      screen.getByRole("button", { name: "Open quarterly report" })
    )
    fireEvent.click(
      screen.getByRole("button", { name: "Remove quarterly report" })
    )
    expect(onOpen).toHaveBeenCalledOnce()
    expect(onRemove).toHaveBeenCalledOnce()
  })

  it("exposes group, state, size, and orientation hooks", () => {
    const { container } = render(
      <AttachmentGroup aria-label="Uploads">
        <Attachment state="uploading" size="sm" orientation="vertical">
          Uploading
        </Attachment>
        <Attachment state="error">Failed</Attachment>
      </AttachmentGroup>
    )
    expect(screen.getByLabelText("Uploads")).toHaveAttribute(
      "data-slot",
      "attachment-group"
    )
    const attachments = container.querySelectorAll('[data-slot="attachment"]')
    expect(attachments[0]).toHaveAttribute("data-state", "uploading")
    expect(attachments[0]).toHaveAttribute("data-size", "sm")
    expect(attachments[0]).toHaveAttribute("data-orientation", "vertical")
    expect(attachments[1]).toHaveAttribute("data-state", "error")
  })
})
