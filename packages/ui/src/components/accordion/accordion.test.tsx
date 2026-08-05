import * as ComponentModule from "./accordion"
import { describe, expect, it } from "vitest"

describe("Accordion", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
