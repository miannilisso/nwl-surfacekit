import { render, screen } from "@testing-library/react"
import * as React from "react"

import { getSurfaceById } from "../../lib/surfacekit/catalog"
import { DemoGrid } from "./demo-grid"

describe("DemoGrid", () => {
  it("renders the registered demo inside its catalog preview", () => {
    const entry = getSurfaceById("button")
    expect(entry).toBeDefined()

    render(
      <DemoGrid
        entries={[entry!]}
        demos={{ button: () => <button type="button">Run action</button> }}
      />
    )

    expect(
      screen.getByRole("group", { name: "Button example" })
    ).toContainElement(screen.getByRole("button", { name: "Run action" }))
  })
})
