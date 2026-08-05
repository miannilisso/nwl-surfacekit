import * as ComponentModule from "./navigation-menu"
import { describe, expect, it } from "vitest"

describe("Navigation Menu", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
