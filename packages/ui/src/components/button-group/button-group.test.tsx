import * as ComponentModule from "./button-group"
import { describe, expect, it } from "vitest"

describe("Button Group", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
