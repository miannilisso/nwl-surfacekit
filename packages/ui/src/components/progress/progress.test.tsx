import * as ComponentModule from "./progress"
import { describe, expect, it } from "vitest"

describe("Progress", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
