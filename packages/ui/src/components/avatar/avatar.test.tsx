import * as ComponentModule from "./avatar"
import { describe, expect, it } from "vitest"

describe("Avatar", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
