import * as ComponentModule from "./dropdown-menu"
import { describe, expect, it } from "vitest"

describe("Dropdown Menu", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
