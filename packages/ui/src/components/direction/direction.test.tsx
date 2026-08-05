import * as ComponentModule from "./direction"
import { describe, expect, it } from "vitest"

describe("Direction", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
