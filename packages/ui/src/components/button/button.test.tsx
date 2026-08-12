import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Button } from "./button"

describe("Button", () => {
  it("handles activation and forwards variant, size, and custom classes", () => {
    const onClick = vi.fn()
    render(
      <Button
        variant="destructive"
        size="lg"
        className="confirm-action"
        onClick={onClick}
      >
        Delete record
      </Button>
    )

    const button = screen.getByRole("button", { name: "Delete record" })
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
    expect(button).toHaveClass("bg-destructive", "h-9", "confirm-action")
  })

  it("prevents activation when disabled", () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    )

    const button = screen.getByRole("button", { name: "Save" })
    fireEvent.click(button)
    expect(button).toBeDisabled()
    expect(onClick).not.toHaveBeenCalled()
  })

  it("composes as a link with native button behavior disabled", () => {
    render(
      <Button render={<a href="/docs" />} nativeButton={false} variant="link">
        Read docs
      </Button>
    )

    const link = screen.getByRole("button", { name: "Read docs" })
    expect(link).toHaveAttribute("href", "/docs")
    expect(link).toHaveAttribute("data-slot", "button")
    expect(link).toHaveClass("hover:underline")
  })
})
