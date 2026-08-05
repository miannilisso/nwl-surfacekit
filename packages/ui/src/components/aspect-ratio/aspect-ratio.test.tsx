import * as ComponentModule from "./aspect-ratio"
import { describe, expect, it } from "vitest"

describe("Aspect Ratio", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
