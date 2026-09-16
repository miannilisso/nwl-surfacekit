import { readFileSync } from "node:fs"
import path from "node:path"

import { expect, test, type Page } from "@playwright/test"

import {
  auditStoryDocument,
  installStorybookLifecycleObserver,
  loadStorybookStory,
  waitForStoryLayoutStability,
} from "./storybook-mobile-support"

const storybookOrigin = "http://127.0.0.1:6006"
const mobileWidths = [320, 375] as const
const coarseTabletWidths = [768] as const

interface StorybookIndex {
  entries: Record<
    string,
    { id: string; type: string; title: string; name: string }
  >
}

const index = JSON.parse(
  readFileSync(path.join(process.cwd(), "storybook-static/index.json"), "utf8")
) as StorybookIndex
const stories = Object.values(index.entries)
  .filter((entry) => entry.type === "story")
  .sort((left, right) => left.id.localeCompare(right.id))
const chunkSize = 36
const storyChunks = Array.from(
  { length: Math.ceil(stories.length / chunkSize) },
  (_, index) => stories.slice(index * chunkSize, (index + 1) * chunkSize)
)

async function prepareStory(page: Page, storyId: string, width: number) {
  await page.setViewportSize({ width, height: 844 })
  const storyUrl = `${storybookOrigin}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`
  const lifecycle = await loadStorybookStory(page, storyUrl, storyId)
  expect(
    lifecycle.status,
    `Storybook did not finish ${storyId}: ${JSON.stringify(lifecycle.failedReports ?? [])}`
  ).toBe("success")
  await page.locator("body.sb-show-main").waitFor({ state: "visible" })
  await page
    .locator("#storybook-root > *")
    .first()
    .waitFor({ state: "attached" })
  await page.evaluate(async () => {
    await document.fonts.ready
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    )
  })
  await waitForStoryLayoutStability(page)
}

function registerStoryAudit(widths: readonly number[], coarsePointer = false) {
  for (const width of widths) {
    for (const [chunkIndex, chunk] of storyChunks.entries()) {
      test(`stories ${chunkIndex + 1}/${storyChunks.length} fit and expose ${width}px hit targets`, async ({
        page,
      }) => {
        expect(stories).toHaveLength(283)
        await page.addInitScript(installStorybookLifecycleObserver)
        if (coarsePointer) {
          expect(
            await page.evaluate(() => matchMedia("(pointer: coarse)").matches)
          ).toBe(true)
        }
        const overflowFailures: string[] = []
        const targetFailures: string[] = []
        const invalidExemptionFailures: string[] = []
        const usedExemptions: string[] = []

        for (const story of chunk) {
          await prepareStory(page, story.id, width)
          const result = await page.evaluate(auditStoryDocument)

          if (result.overflow > 0) {
            overflowFailures.push(`${story.id} (+${result.overflow}px)`)
          }
          if (result.undersized.length > 0) {
            targetFailures.push(`${story.id}: ${result.undersized.join(" | ")}`)
          }
          if (result.invalidExemptions.length > 0) {
            invalidExemptionFailures.push(
              `${story.id}: ${result.invalidExemptions.join(" | ")}`
            )
          }
          usedExemptions.push(
            ...result.exemptions.map((exemption) => `${story.id}: ${exemption}`)
          )
        }

        expect(
          overflowFailures,
          `Document overflow at ${width}px:\n${overflowFailures.join("\n")}`
        ).toEqual([])
        expect(
          targetFailures,
          `Sub-44px hit targets at ${width}px:\n${targetFailures.join("\n")}`
        ).toEqual([])
        expect(
          invalidExemptionFailures,
          `Invalid mobile target exemptions at ${width}px:\n${invalidExemptionFailures.join("\n")}`
        ).toEqual([])
        expect(
          usedExemptions,
          `Every mobile target exemption must be explicitly approved at ${width}px`
        ).toEqual([])
      })
    }
  }
}

test.describe("mobile Storybook contract", () => {
  test.describe.configure({ mode: "parallel", timeout: 5 * 60_000 })
  test.beforeEach(({ browserName }) => {
    test.skip(
      browserName !== "chromium",
      "The exhaustive audit is Chromium-only"
    )
  })

  registerStoryAudit(mobileWidths)
})

test.describe("coarse-pointer tablet Storybook contract", () => {
  test.describe.configure({ mode: "parallel", timeout: 5 * 60_000 })
  test.use({ hasTouch: true })
  test.beforeEach(({ browserName }) => {
    test.skip(
      browserName !== "chromium",
      "The exhaustive audit is Chromium-only"
    )
  })

  registerStoryAudit(coarseTabletWidths, true)
})
