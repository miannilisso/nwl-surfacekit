import { render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "./avatar"

describe("Avatar", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("renders an identified image after it loads", async () => {
    class LoadedImage {
      complete = false
      naturalWidth = 100
      onerror: null | (() => void) = null
      onload: null | (() => void) = null
      crossOrigin: string | null = null
      referrerPolicy = ""
      sizes = ""
      srcset = ""

      set src(_value: string) {
        queueMicrotask(() => this.onload?.())
      }
    }
    vi.stubGlobal("Image", LoadedImage)

    render(
      <Avatar>
        <AvatarImage src="/ada.png" alt="Ada Lovelace" />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    )

    const image = await screen.findByAltText("Ada Lovelace")
    expect(image).toHaveAttribute("src", "/ada.png")
    expect(screen.queryByText("AL")).not.toBeInTheDocument()
  })

  it("shows meaningful fallback content when no image is available", () => {
    render(
      <Avatar aria-label="Ada Lovelace">
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    )

    expect(screen.getByLabelText("Ada Lovelace")).toHaveTextContent("AL")
  })

  it("composes sized groups, overflow counts, and status badges", () => {
    const { container } = render(
      <AvatarGroup aria-label="Project team">
        <Avatar size="lg">
          <AvatarFallback>MN</AvatarFallback>
          <AvatarBadge aria-label="Online" />
        </Avatar>
        <AvatarGroupCount aria-label="3 more members">+3</AvatarGroupCount>
      </AvatarGroup>
    )

    expect(screen.getByLabelText("Project team")).toHaveAttribute(
      "data-slot",
      "avatar-group"
    )
    expect(screen.getByText("MN").parentElement).toHaveAttribute(
      "data-size",
      "lg"
    )
    expect(screen.getByLabelText("Online")).toHaveAttribute(
      "data-slot",
      "avatar-badge"
    )
    expect(screen.getByLabelText("3 more members")).toHaveTextContent("+3")
    expect(container.querySelectorAll('[data-slot="avatar"]')).toHaveLength(1)
  })
})
