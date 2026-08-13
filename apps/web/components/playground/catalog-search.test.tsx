import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { describe, expect, it } from "vitest"

import { surfaceCatalog } from "../../lib/surfacekit/catalog"
import { CatalogSearch } from "./catalog-search"

describe("CatalogSearch", () => {
  it("filters entries and links directly to the matching example", async () => {
    const user = userEvent.setup()
    render(<CatalogSearch entries={surfaceCatalog} />)
    await user.type(
      screen.getByRole("searchbox", { name: "Search SurfaceKit" }),
      "otp"
    )
    expect(screen.getByRole("link", { name: /Input OTP/ })).toHaveAttribute(
      "href",
      "/form-inputs#input-otp"
    )
    expect(
      screen.queryByRole("link", { name: /Accordion/ })
    ).not.toBeInTheDocument()
  })

  it("shows counts, category filtering, no results, and query clearing", async () => {
    const user = userEvent.setup()
    render(<CatalogSearch entries={surfaceCatalog} />)
    expect(screen.getByText("70 results")).toBeVisible()

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Filter by category" }),
      "feedback"
    )
    expect(screen.getByText("4 results")).toBeVisible()
    expect(screen.getByRole("link", { name: /Spinner/ })).toBeVisible()

    await user.type(
      screen.getByRole("searchbox", { name: "Search SurfaceKit" }),
      "no matching surface"
    )
    expect(
      screen.getByText("No SurfaceKit modules match your filters.")
    ).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Clear search" }))
    expect(screen.getByText("4 results")).toBeVisible()
  })
})
