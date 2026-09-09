import { readFileSync } from "node:fs"
import path from "node:path"

import { expect, test, type Page } from "@playwright/test"

const storybookOrigin = "http://127.0.0.1:6006"
const mobileWidths = [320, 375] as const

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
  await page.goto(
    `${storybookOrigin}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`,
    { waitUntil: "domcontentloaded" }
  )
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
  // Several primitives enter with a 150–400ms scale transition. Measuring
  // their boxes mid-transition reports a target below its settled 44px size.
  await page.waitForTimeout(450)
}

test.describe("mobile Storybook contract", () => {
  test.describe.configure({ mode: "parallel", timeout: 5 * 60_000 })
  test.beforeEach(({ browserName }) => {
    test.skip(
      browserName !== "chromium",
      "The exhaustive audit is Chromium-only"
    )
  })

  for (const width of mobileWidths) {
    for (const [chunkIndex, chunk] of storyChunks.entries()) {
      test(`stories ${chunkIndex + 1}/${storyChunks.length} fit and expose ${width}px hit targets`, async ({
        page,
      }) => {
        expect(stories).toHaveLength(283)
        const overflowFailures: string[] = []
        const targetFailures: string[] = []

        for (const story of chunk) {
          await prepareStory(page, story.id, width)
          const result = await page.evaluate(() => {
            const root = document.documentElement
            const overflow = Math.ceil(root.scrollWidth - root.clientWidth)
            const selector = [
              "a[href]",
              "button",
              "input:not([type='hidden'])",
              "select",
              "textarea",
              "[role='button']",
              "[role='tab']",
              "[role='menuitem']",
              "[role='menuitemcheckbox']",
              "[role='menuitemradio']",
              "[role='option']",
              "[role='checkbox']",
              "[role='radio']",
              "[role='switch']",
            ].join(",")
            const targets = [
              ...document.querySelectorAll<HTMLElement>(selector),
            ]
            const seen = new Set<HTMLElement>()
            const undersized = targets.flatMap((element) => {
              if (seen.has(element)) return []
              seen.add(element)
              const style = getComputedStyle(element)
              const rect = element.getBoundingClientRect()
              const disabled =
                element.matches(":disabled, [aria-disabled='true']") ||
                element.closest("[inert], [aria-hidden='true']") !== null
              const hidden =
                style.display === "none" ||
                style.visibility === "hidden" ||
                Number(style.opacity) === 0 ||
                rect.width === 0 ||
                rect.height === 0
              const inlineProseLink =
                element.matches("a[href]") &&
                style.display === "inline" &&
                element.closest(
                  "nav, [role='navigation'], [role='menu'], form"
                ) === null
              if (disabled || hidden || inlineProseLink) return []
              if (rect.width >= 43.5 && rect.height >= 43.5) return []

              return [
                `${element.tagName.toLowerCase()}${element.getAttribute("data-slot") ? `[data-slot=${element.getAttribute("data-slot")}]` : ""}${element.getAttribute("role") ? `[role=${element.getAttribute("role")}]` : ""} ${Math.round(rect.width)}x${Math.round(rect.height)} ${element.getAttribute("aria-label") ?? element.textContent?.trim().slice(0, 40) ?? ""}`,
              ]
            })

            return { overflow, undersized }
          })

          if (result.overflow > 0) {
            overflowFailures.push(`${story.id} (+${result.overflow}px)`)
          }
          if (result.undersized.length > 0) {
            targetFailures.push(`${story.id}: ${result.undersized.join(" | ")}`)
          }
        }

        expect(
          overflowFailures,
          `Document overflow at ${width}px:\n${overflowFailures.join("\n")}`
        ).toEqual([])
        expect(
          targetFailures,
          `Sub-44px hit targets at ${width}px:\n${targetFailures.join("\n")}`
        ).toEqual([])
      })
    }
  }
})
