import * as ComponentModule from "./switch"
import { describe, expect, it } from "vitest"

describe("Switch", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
