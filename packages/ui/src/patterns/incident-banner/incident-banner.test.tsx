import "@testing-library/jest-dom/vitest"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { IncidentBanner } from "./incident-banner"

describe("IncidentBanner", () => {
  it("renders the incident banner with action", () => {
    render(
      <IncidentBanner
        title="Service outage"
        description="Some features may be degraded."
      />
    )

    expect(screen.getByText("Service outage")).toBeInTheDocument()
    expect(
      screen.getByText("Some features may be degraded.")
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "View status" })
    ).toBeInTheDocument()
  })
})
