import { render, screen } from "@testing-library/react"
import * as React from "react"
import { describe, expect, it } from "vitest"

import { getSurfaceById } from "../../lib/surfacekit/catalog"
import { ComponentPreview } from "./component-preview"

describe("ComponentPreview", () => {
  it("gives each preview a stable directly linkable section", () => {
    const entry = getSurfaceById("button")!
    render(
      <ComponentPreview entry={entry}>
        <button>Example</button>
      </ComponentPreview>
    )
    expect(screen.getByRole("region", { name: "Button" })).toHaveAttribute(
      "id",
      "button"
    )
    expect(
      screen.getByRole("group", { name: "Button example" })
    ).toContainElement(screen.getByRole("button", { name: "Example" }))
  })
})
