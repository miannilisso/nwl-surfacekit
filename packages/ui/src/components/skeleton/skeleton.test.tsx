import * as ComponentModule from "./skeleton"
import { describe, expect, it } from "vitest"

describe("Skeleton", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
