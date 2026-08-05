import * as ComponentModule from "./kbd"
import { describe, expect, it } from "vitest"

describe("Kbd", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
