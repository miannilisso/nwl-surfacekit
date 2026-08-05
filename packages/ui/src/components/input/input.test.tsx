import * as ComponentModule from "./input"
import { describe, expect, it } from "vitest"

describe("Input", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
