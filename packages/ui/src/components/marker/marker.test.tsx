import * as ComponentModule from "./marker"
import { describe, expect, it } from "vitest"

describe("Marker", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
