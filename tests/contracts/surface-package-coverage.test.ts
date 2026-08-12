import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { describe, expect, it } from "vitest"

const repositoryRoot = process.cwd()
const componentsRoot = path.join(repositoryRoot, "packages/ui/src/components")
const patternsRoot = path.join(repositoryRoot, "packages/ui/src/patterns")
const storiesRoot = path.join(repositoryRoot, "apps/web/stories")

async function directories(root: string) {
  return (await readdir(root, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

async function storyIds() {
  return (await readdir(storiesRoot))
    .filter((name) => name.endsWith(".stories.tsx"))
    .map((name) => name.replace(".stories.tsx", ""))
    .sort()
}

describe("SurfaceKit package coverage", () => {
  it("keeps source, colocated tests, and stories in exact sync", async () => {
    const components = await directories(componentsRoot)
    const patterns = await directories(patternsRoot)
    const surface = [...components, ...patterns].sort()

    expect(components).toHaveLength(60)
    expect(patterns).toHaveLength(10)
    expect(await storyIds()).toEqual(surface)

    for (const [kind, ids] of [
      ["components", components],
      ["patterns", patterns],
    ] as const) {
      for (const id of ids) {
        const testPath = path.join(
          repositoryRoot,
          `packages/ui/src/${kind}/${id}/${id}.test.tsx`
        )
        const source = await readFile(testPath, "utf8")
        expect(source, testPath).not.toContain("Object.keys(ComponentModule)")
        expect(source, testPath).toContain("@testing-library")
      }
    }
  })
})
