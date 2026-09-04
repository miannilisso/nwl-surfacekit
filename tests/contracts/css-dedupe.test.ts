import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import postcss from "postcss"
import { afterEach, describe, expect, it } from "vitest"

import { dedupeSurfaceKitCss } from "../../apps/web/postcss/dedupe-surfacekit-css.mjs"

const temporaryRoots: string[] = []

async function processReferenceCss(packageCss: string, referenceCss: string) {
  const root = await mkdtemp(path.join(tmpdir(), "surfacekit-css-dedupe-"))
  temporaryRoots.push(root)
  const packageCssPath = path.join(root, "package.css")
  const referenceCssPath = path.join(root, "reference.css")
  await writeFile(packageCssPath, packageCss)

  return postcss([
    dedupeSurfaceKitCss({ packageCssPath, referenceCssPath }),
  ]).process(referenceCss, { from: referenceCssPath })
}

afterEach(async () => {
  await Promise.all(
    temporaryRoots
      .splice(0)
      .map((root) => rm(root, { recursive: true, force: true }))
  )
})

describe("SurfaceKit reference CSS deduplication", () => {
  it("removes matching selectors from lists while preserving app-only siblings", async () => {
    const result = await processReferenceCss(
      ".bg-card,.bg-muted{background-color:var(--surface)}",
      ".bg-card,.review-only{background-color:var(--surface)}"
    )

    expect(result.css).not.toContain(".bg-card")
    expect(result.css).toContain(
      ".review-only{background-color:var(--surface)}"
    )
  })

  it("fails when the package and reference app define conflicting declarations", async () => {
    await expect(
      processReferenceCss(
        ".text-foreground{color:black}",
        ".text-foreground{color:white}"
      )
    ).rejects.toThrow(/Conflicting SurfaceKit CSS selector.*text-foreground/)
  })

  it("preserves only app-owned declarations when a selector safely extends the package", async () => {
    const result = await processReferenceCss(
      ".review-extension{color:red}",
      ".review-extension{color:red;background:blue}"
    )

    expect(result.css).toBe(".review-extension{background:blue}")
  })

  it("removes source longhands folded into an owned canonical shorthand", async () => {
    const declarations = [
      "margin-top:1rem",
      "margin-right:2rem",
      "margin-bottom:1rem",
      "margin-left:2rem",
    ].join(";")
    const result = await processReferenceCss(
      `.review-folding{${declarations}}`,
      `.review-folding{${declarations};color:blue}`
    )

    expect(result.css).toBe(".review-folding{color:blue}")
  })

  it("treats a fallback matching a package-owned custom property as equivalent", async () => {
    const result = await processReferenceCss(
      ":root{--spacing:.25rem}@layer utilities{.mt-2{margin-top:calc(var(--spacing)*2)}}",
      "@layer utilities{.mt-2{margin-top:calc(var(--spacing,0.25rem)*2)}}"
    )

    expect(result.css).not.toContain(".mt-2")
  })

  it("deduplicates only within the same complete at-rule context", async () => {
    const result = await processReferenceCss(
      "@media (width >= 40rem){.bg-card{display:block}}",
      [
        ".bg-card{display:block}",
        "@media (width >= 40rem){.bg-card{display:block}}",
        "@media (width >= 60rem){.bg-card{display:block}}",
      ].join("\n")
    )

    expect(result.css).toContain(".bg-card{display:block}")
    expect(result.css).not.toContain(
      "@media (width >= 40rem){.bg-card{display:block}}"
    )
    expect(result.css).toContain(
      "@media (width >= 60rem){.bg-card{display:block}}"
    )
  })

  it("canonicalizes equivalent selector and at-rule syntax", async () => {
    const result = await processReferenceCss(
      "@supports ((display: grid)){.owned,*:before{color:red}}",
      "@supports (display:grid){.owned,*::before,.review-only{color:red}}"
    )

    expect(result.css).not.toContain(".owned")
    expect(result.css).not.toContain("*::before")
    expect(result.css).toContain(".review-only{color:red}")
  })

  it("removes matching generated at-rules while preserving app-only at-rules", async () => {
    const result = await processReferenceCss(
      '@property --tw-owned{syntax:"*";inherits:false;initial-value:0}',
      [
        '@property --tw-owned{syntax:"*";inherits:false;initial-value:0}',
        '@property --review-only{syntax:"*";inherits:false;initial-value:0}',
      ].join("\n")
    )

    expect(result.css).not.toContain("--tw-owned")
    expect(result.css).toContain("@property --review-only")
  })

  it("canonicalizes typed custom-property initial values", async () => {
    const result = await processReferenceCss(
      '@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}',
      '@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0px}'
    )

    expect(result.css).not.toContain("--tw-ring-offset-width")
  })

  it("never compares keyframe steps belonging to different keyframes", async () => {
    const result = await processReferenceCss(
      "@keyframes package-only{to{opacity:1}}",
      "@keyframes review-only{to{opacity:1}}"
    )

    expect(result.css).toContain("@keyframes review-only{to{opacity:1}}")
  })
})
