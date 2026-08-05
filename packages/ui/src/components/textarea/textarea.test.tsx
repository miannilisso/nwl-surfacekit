import * as ComponentModule from "./textarea"
import { describe, expect, it } from "vitest"

describe("Textarea", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
