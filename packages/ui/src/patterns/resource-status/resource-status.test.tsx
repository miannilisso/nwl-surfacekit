import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ResourceStatus } from "./resource-status"

describe("ResourceStatus", () => {
  it("labels resource values, detail, progress, and tone", () => {
    const { container } = render(
      <ResourceStatus
        title="Storage"
        value="78%"
        progress={78}
        detail="4.2 TB used"
        tone="warning"
      />
    )
    expect(screen.getByText("Storage")).toBeVisible()
    expect(screen.getByText("78%")).toBeVisible()
    expect(screen.getByText("4.2 TB used")).toBeVisible()
    expect(
      screen.getByRole("progressbar", { name: "Storage progress" })
    ).toHaveAttribute("aria-valuenow", "78")
    expect(
      container.querySelector('[data-slot="resource-status"]')
    ).toHaveAttribute("data-tone", "warning")
  })

  it("supports indeterminate progress", () => {
    render(<ResourceStatus title="Provisioning" value="Starting" />)
    expect(
      screen.getByRole("progressbar", { name: "Provisioning progress" })
    ).not.toHaveAttribute("aria-valuenow")
  })
})
