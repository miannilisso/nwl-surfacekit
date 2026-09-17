import { describe, expect, it } from "vitest"

import {
  getSurfaceCounts,
  getSurfacesByCategory,
  surfaceCatalog,
  surfaceCategories,
} from "./catalog"

describe("surface catalog", () => {
  it("uses canonical nested playground routes for every category", () => {
    expect(surfaceCategories.map(({ route }) => route)).toEqual([
      "/playground/form-inputs",
      "/playground/navigation",
      "/playground/dialogs-overlays",
      "/playground/data-display",
      "/playground/feedback",
      "/playground/layout-utilities",
      "/playground/patterns",
    ])
  })

  it("contains 61 components and 12 patterns exactly once", () => {
    expect(getSurfaceCounts()).toEqual({
      components: 61,
      patterns: 12,
      total: 73,
    })
    expect(new Set(surfaceCatalog.map((entry) => entry.id)).size).toBe(73)
  })

  it("assigns every entry to its declared route", () => {
    for (const category of surfaceCategories) {
      const entries = getSurfacesByCategory(category.id)
      expect(entries.length).toBeGreaterThan(0)
      expect(entries.every((entry) => entry.route === category.route)).toBe(
        true
      )
    }
  })

  it("is safe to serialize from a Server Component", () => {
    expect(() => JSON.stringify(surfaceCatalog)).not.toThrow()
    expect(JSON.parse(JSON.stringify(surfaceCatalog))).toEqual(surfaceCatalog)
  })
})
