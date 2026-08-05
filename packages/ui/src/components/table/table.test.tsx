import * as ComponentModule from "./table"
import { describe, expect, it } from "vitest"

describe("Table", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
