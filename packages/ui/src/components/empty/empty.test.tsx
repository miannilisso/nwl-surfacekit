import * as ComponentModule from "./empty"
import { describe, expect, it } from "vitest"

describe("Empty", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
