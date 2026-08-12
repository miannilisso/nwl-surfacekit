import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "./progress"

describe("Progress", () => {
  it("provides an accessible value with one consumer-composed track", () => {
    const { container } = render(
      <Progress value={64}>
        <ProgressLabel>Upload progress</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    )
    const progress = screen.getByRole("progressbar", {
      name: "Upload progress",
    })
    expect(progress).toHaveAttribute("aria-valuenow", "64")
    expect(progress).toHaveTextContent("64%")
    expect(
      container.querySelectorAll('[data-slot="progress-track"]')
    ).toHaveLength(1)
    expect(
      container.querySelectorAll('[data-slot="progress-indicator"]')
    ).toHaveLength(1)
  })

  it("supports an indeterminate accessible state", () => {
    render(<Progress aria-label="Preparing export" value={null} />)
    const progress = screen.getByRole("progressbar", {
      name: "Preparing export",
    })
    expect(progress).not.toHaveAttribute("aria-valuenow")
    expect(
      progress.querySelector('[data-slot="progress-track"]')
    ).toBeInTheDocument()
  })
})
