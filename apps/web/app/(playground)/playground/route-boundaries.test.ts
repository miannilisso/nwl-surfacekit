import { access } from "node:fs/promises"
import path from "node:path"
import { describe, expect, it } from "vitest"

const routeGroup = path.join(process.cwd(), "apps/web/app/(playground)")
const playgroundSegment = path.join(routeGroup, "playground")

describe("playground route boundaries", () => {
  it("keeps loading and error UI inside the segment owned by PlaygroundShell", async () => {
    for (const boundary of ["loading.tsx", "error.tsx"]) {
      await expect(
        access(path.join(playgroundSegment, boundary))
      ).resolves.toBe(undefined)
      await expect(access(path.join(routeGroup, boundary))).rejects.toThrow()
    }
  })
})
