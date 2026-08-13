import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"

import { surfaceCatalog, surfaceCategories } from "../../lib/surfacekit/catalog"
import { CapabilityExplorer } from "./capability-explorer"

describe("CapabilityExplorer", () => {
  it("switches categories and links to the selected component", async () => {
    const user = userEvent.setup()
    render(
      <CapabilityExplorer
        categories={surfaceCategories}
        entries={surfaceCatalog}
      />
    )

    await user.click(screen.getByRole("tab", { name: "Feedback" }))
    expect(screen.getByRole("link", { name: "Alert" })).toHaveAttribute(
      "href",
      "/feedback#alert"
    )
    expect(
      screen.queryByRole("link", { name: "Combobox" })
    ).not.toBeInTheDocument()
  })
})
