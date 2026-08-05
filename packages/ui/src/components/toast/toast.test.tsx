import * as ComponentModule from "./toast"
import { describe, expect, it } from "vitest"

describe("Toast", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
