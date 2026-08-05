import * as ComponentModule from "./pagination"
import { describe, expect, it } from "vitest"

describe("Pagination", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
