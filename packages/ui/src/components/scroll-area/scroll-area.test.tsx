import * as ComponentModule from "./scroll-area"
import { describe, expect, it } from "vitest"

describe("Scroll Area", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
