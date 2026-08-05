import * as ComponentModule from "./separator"
import { describe, expect, it } from "vitest"

describe("Separator", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
