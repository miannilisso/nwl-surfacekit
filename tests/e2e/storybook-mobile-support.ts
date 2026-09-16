import type { Page } from "@playwright/test"

interface StoryAuditResult {
  overflow: number
  undersized: string[]
  invalidExemptions: string[]
  exemptions: string[]
}

interface StorybookLifecycleResult {
  storyId: string
  status: "error" | "success"
  failedReports?: unknown[]
}

type StorybookLifecycleOutcome =
  | { kind: "lifecycle"; lifecycle: StorybookLifecycleResult }
  | { kind: "render-error"; message: string }

function auditStoryDocument(): StoryAuditResult {
  const describe = (element: HTMLElement, width: number, height: number) =>
    `${element.tagName.toLowerCase()}${element.getAttribute("data-slot") ? `[data-slot=${element.getAttribute("data-slot")}]` : ""}${element.getAttribute("role") ? `[role=${element.getAttribute("role")}]` : ""} ${Math.round(width)}x${Math.round(height)} ${element.getAttribute("aria-label") ?? element.textContent?.trim().slice(0, 40) ?? ""}`
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
  const targets = [...document.querySelectorAll<HTMLElement>(selector)]
  const seen = new Set<HTMLElement>()
  const undersized: string[] = []
  const invalidExemptions: string[] = []
  const exemptions: string[] = []

  for (const element of targets) {
    if (seen.has(element)) continue
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
    if (disabled || hidden) continue

    const description = describe(element, rect.width, rect.height)
    const exemption = element.getAttribute("data-mobile-target-exemption")
    if (exemption !== null) {
      const isInlineProse =
        exemption === "inline-prose" &&
        element.matches("a[href]") &&
        style.display === "inline" &&
        element.closest("p") !== null &&
        element.closest(
          "nav, [role='navigation'], [role='menu'], form, [role='alert']"
        ) === null

      if (isInlineProse) {
        exemptions.push(description)
        continue
      }
      invalidExemptions.push(description)
    }

    if (rect.width < 43.5 || rect.height < 43.5) {
      undersized.push(description)
    }
  }

  return { overflow, undersized, invalidExemptions, exemptions }
}

function installStorybookLifecycleObserver() {
  type StoryFinishedPayload = {
    storyId: string
    status: "error" | "success"
    reporters?: Array<{ result: unknown; status: string; type: string }>
  }
  type Channel = {
    on(event: string, listener: (payload: StoryFinishedPayload) => void): void
  }
  type Scope = typeof globalThis & {
    __STORYBOOK_PREVIEW__?: { channel?: Channel }
    __SURFACEKIT_STORY_LIFECYCLE__?: {
      storyId: string
      status: "error" | "success"
      failedReports?: Array<{ result: unknown; status: string; type: string }>
    }
  }

  const scope = globalThis as Scope
  const attach = () => {
    const channel = scope.__STORYBOOK_PREVIEW__?.channel
    if (!channel) return false

    channel.on("storyFinished", ({ storyId, status, reporters }) => {
      const failedReports = reporters?.filter(
        (report) => report.status === "failed"
      )
      scope.__SURFACEKIT_STORY_LIFECYCLE__ = {
        storyId,
        status,
        ...(failedReports?.length ? { failedReports } : {}),
      }
    })
    return true
  }

  if (attach()) return
  const interval = window.setInterval(() => {
    if (attach()) window.clearInterval(interval)
  }, 0)
}

async function waitForStorybookLifecycleOutcome(
  page: Page,
  storyId: string,
  timeout = 15_000
): Promise<StorybookLifecycleOutcome> {
  const handle = await page.waitForFunction(
    (expectedStoryId) => {
      const scope = globalThis as typeof globalThis & {
        __SURFACEKIT_STORY_LIFECYCLE__?: StorybookLifecycleResult
      }
      const lifecycle = scope.__SURFACEKIT_STORY_LIFECYCLE__
      if (lifecycle?.storyId === expectedStoryId) {
        return { kind: "lifecycle", lifecycle }
      }

      const heading = [...document.querySelectorAll("h1")].find((element) =>
        element.textContent
          ?.trim()
          .startsWith("Failed to fetch dynamically imported module:")
      )
      if (!heading) return false

      const code = document.querySelector("code")?.textContent?.trim()
      return {
        kind: "render-error",
        message: [heading.textContent?.trim(), code].filter(Boolean).join(" "),
      }
    },
    storyId,
    { timeout }
  )
  const outcome = (await handle.jsonValue()) as StorybookLifecycleOutcome
  await handle.dispose()
  return outcome
}

async function loadStorybookStory(
  page: Page,
  storyUrl: string,
  storyId: string,
  timeout = 15_000
): Promise<StorybookLifecycleResult> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    await page.goto(storyUrl, { waitUntil: "domcontentloaded" })
    const outcome = await waitForStorybookLifecycleOutcome(
      page,
      storyId,
      timeout
    )
    if (outcome.kind === "lifecycle") return outcome.lifecycle

    const isTransientChunkFetch = outcome.message.startsWith(
      "Failed to fetch dynamically imported module:"
    )
    if (!isTransientChunkFetch || attempt === 1) {
      throw new Error(
        `Storybook could not render ${storyId}: ${outcome.message}`
      )
    }
  }

  throw new Error(`Storybook did not report a result for ${storyId}`)
}

async function waitForStoryLayoutStability(page: Page) {
  await page.waitForFunction(
    () => {
      type StabilityScope = typeof globalThis & {
        __SURFACEKIT_LAYOUT_STABILITY__?: {
          signature: string
          stableSamples: number
        }
      }

      const root = document.documentElement
      const hasRunningFiniteAnimation = document
        .getAnimations()
        .some((animation) => {
          if (animation.playState !== "running") return false
          if (animation.timeline !== document.timeline) return false
          const iterations = animation.effect?.getComputedTiming().iterations
          return iterations !== Infinity
        })
      if (hasRunningFiniteAnimation) return false

      const elements = [
        ...document.querySelectorAll<HTMLElement>(
          [
            "#storybook-root > *",
            "[data-scroll-boundary]",
            "a[href]",
            "button",
            "input:not([type='hidden'])",
            "select",
            "textarea",
            "[role='button']",
            "[role='tab']",
            "[role='menuitem']",
            "[role='option']",
          ].join(",")
        ),
      ].filter((element) => {
        const style = getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 0 &&
          rect.height > 0
        )
      })
      const signature = JSON.stringify([
        root.scrollWidth,
        root.scrollHeight,
        ...elements.map((element) => {
          return [
            element.offsetLeft,
            element.offsetTop,
            element.offsetWidth,
            element.offsetHeight,
            element.scrollWidth,
            element.scrollHeight,
          ]
        }),
      ])
      const scope = globalThis as StabilityScope
      const previous = scope.__SURFACEKIT_LAYOUT_STABILITY__
      const stableSamples =
        previous?.signature === signature ? previous.stableSamples + 1 : 0
      scope.__SURFACEKIT_LAYOUT_STABILITY__ = { signature, stableSamples }
      return stableSamples >= 3
    },
    undefined,
    { polling: 100, timeout: 5_000 }
  )
}

export {
  auditStoryDocument,
  installStorybookLifecycleObserver,
  loadStorybookStory,
  waitForStorybookLifecycleOutcome,
  waitForStoryLayoutStability,
}
export type {
  StoryAuditResult,
  StorybookLifecycleOutcome,
  StorybookLifecycleResult,
}
