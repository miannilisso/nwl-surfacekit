import * as ComponentModule from "./badge"
import { describe, expect, it } from "vitest"

describe("Badge", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
