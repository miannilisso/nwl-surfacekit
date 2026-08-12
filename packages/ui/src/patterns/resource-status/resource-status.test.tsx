import "@testing-library/jest-dom/vitest"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ResourceStatus } from "./resource-status"

describe("ResourceStatus", () => {
  it("renders a resource status card", () => {
    render(
      <ResourceStatus
        title="Storage"
        value="78%"
        progress={78}
        detail="4.2 TB used"
      />
    )

    expect(screen.getByText("Storage")).toBeInTheDocument()
    expect(screen.getByText("78%")).toBeInTheDocument()
    expect(screen.getByText("4.2 TB used")).toBeInTheDocument()
  })
})
