import * as ComponentModule from "./breadcrumb"
import { describe, expect, it } from "vitest"

describe("Breadcrumb", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
