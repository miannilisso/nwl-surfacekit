import * as ComponentModule from "./sheet"
import { describe, expect, it } from "vitest"

describe("Sheet", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
