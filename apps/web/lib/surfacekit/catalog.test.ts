import { describe, expect, it } from "vitest"

import {
  getSurfaceCounts,
  getSurfacesByCategory,
  surfaceCatalog,
  surfaceCategories,
} from "./catalog"

describe("surface catalog", () => {
  it("contains 60 components and 10 patterns exactly once", () => {
    expect(getSurfaceCounts()).toEqual({
      components: 60,
      patterns: 10,
      total: 70,
    })
    expect(new Set(surfaceCatalog.map((entry) => entry.id)).size).toBe(70)
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
