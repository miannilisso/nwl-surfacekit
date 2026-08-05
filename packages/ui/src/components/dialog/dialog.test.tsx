import * as ComponentModule from "./dialog"
import { describe, expect, it } from "vitest"

describe("Dialog", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
