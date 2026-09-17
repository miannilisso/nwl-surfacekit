import { expect, test } from "@playwright/test"

import {
  auditStoryDocument,
  installStorybookLifecycleObserver,
  loadStorybookStory,
  waitForStorybookLifecycleOutcome,
  waitForStoryLayoutStability,
} from "./storybook-mobile-support"

test.describe("Storybook mobile audit harness", () => {
  test.beforeEach(({ browserName }) => {
    test.skip(browserName !== "chromium", "Harness evidence is Chromium-only")
  })

  test("only exempts explicitly marked inline prose links in paragraphs", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 700 })
    await page.setContent(`
      <p>
        Read the
        <a id="approved" href="#approved" data-mobile-target-exemption="inline-prose">release guide</a>.
      </p>
      <a id="unmarked" href="#unmarked">Open settings</a>
      <nav>
        <a id="invalid" href="#invalid" data-mobile-target-exemption="inline-prose">Billing</a>
      </nav>
    `)

    const result = await page.evaluate(auditStoryDocument)

    expect(result.exemptions).toEqual(["a 84x17 release guide"])
    expect(result.invalidExemptions).toEqual(["a 44x17 Billing"])
    expect(result.undersized).toContain("a 88x17 Open settings")
    expect(result.undersized).toContain("a 44x17 Billing")
  })

  test("records the official storyFinished result after a late channel install", async ({
    page,
  }) => {
    await page.setContent("<main>Lifecycle fixture</main>")
    await page.evaluate(installStorybookLifecycleObserver)
    await page.evaluate(() => {
      type Listener = (payload: unknown) => void
      const listeners = new Map<string, Listener[]>()
      const channel = {
        on(event: string, listener: Listener) {
          listeners.set(event, [...(listeners.get(event) ?? []), listener])
        },
        emit(event: string, payload: unknown) {
          for (const listener of listeners.get(event) ?? []) listener(payload)
        },
      }
      ;(
        globalThis as typeof globalThis & {
          __STORYBOOK_PREVIEW__?: { channel: typeof channel }
        }
      ).__STORYBOOK_PREVIEW__ = { channel }

      window.setTimeout(() => {
        channel.emit("storyFinished", {
          storyId: "surfacekit-fixture--default",
          status: "success",
          reporters: [],
        })
      }, 75)
    })

    await expect
      .poll(() =>
        page.evaluate(() => {
          return (
            globalThis as typeof globalThis & {
              __SURFACEKIT_STORY_LIFECYCLE__?: {
                storyId?: string
                status?: string
              }
            }
          ).__SURFACEKIT_STORY_LIFECYCLE__
        })
      )
      .toEqual({
        storyId: "surfacekit-fixture--default",
        status: "success",
      })
  })

  test("records Storybook render failures instead of declaring the DOM ready", async ({
    page,
  }) => {
    await page.setContent("<main>Lifecycle fixture</main>")
    await page.evaluate(() => {
      type Listener = (payload: unknown) => void
      const listeners = new Map<string, Listener[]>()
      const channel = {
        on(event: string, listener: Listener) {
          listeners.set(event, [...(listeners.get(event) ?? []), listener])
        },
        emit(event: string, payload: unknown) {
          for (const listener of listeners.get(event) ?? []) listener(payload)
        },
      }
      ;(
        globalThis as typeof globalThis & {
          __STORYBOOK_PREVIEW__?: { channel: typeof channel }
        }
      ).__STORYBOOK_PREVIEW__ = { channel }
      ;(
        globalThis as typeof globalThis & {
          __surfacekitEmitStoryFinished?: typeof channel.emit
        }
      ).__surfacekitEmitStoryFinished = channel.emit.bind(channel)
    })
    await page.evaluate(installStorybookLifecycleObserver)
    await page.evaluate(() => {
      ;(
        globalThis as typeof globalThis & {
          __surfacekitEmitStoryFinished?: (
            event: string,
            payload: unknown
          ) => void
        }
      ).__surfacekitEmitStoryFinished?.("storyFinished", {
        storyId: "surfacekit-fixture--broken",
        status: "error",
        reporters: [],
      })
    })

    await expect
      .poll(() =>
        page.evaluate(() => {
          return (
            globalThis as typeof globalThis & {
              __SURFACEKIT_STORY_LIFECYCLE__?: {
                storyId?: string
                status?: string
              }
            }
          ).__SURFACEKIT_STORY_LIFECYCLE__
        })
      )
      .toEqual({
        storyId: "surfacekit-fixture--broken",
        status: "error",
      })
  })

  test("detects Storybook pre-render errors without waiting for a lifecycle event", async ({
    page,
  }) => {
    await page.setContent(`
      <div id="storybook-root">
        <h1>Failed to fetch dynamically imported module: http://127.0.0.1:6006/assets/example.js</h1>
        <code>TypeError: Failed to fetch dynamically imported module</code>
      </div>
    `)

    await expect(
      waitForStorybookLifecycleOutcome(
        page,
        "surfacekit-fixture--unavailable",
        1_000
      )
    ).resolves.toEqual({
      kind: "render-error",
      message:
        "Failed to fetch dynamically imported module: http://127.0.0.1:6006/assets/example.js TypeError: Failed to fetch dynamically imported module",
    })
  })

  test("retries one transient dynamic-import failure for the same story", async ({
    page,
  }) => {
    const storyId = "surfacekit-fixture--transient"
    let requests = 0
    await page.route("http://surfacekit.test/story", async (route) => {
      requests += 1
      await route.fulfill({
        contentType: "text/html",
        body:
          requests === 1
            ? `<h1>Failed to fetch dynamically imported module: http://surfacekit.test/assets/example.js</h1>`
            : `<script>globalThis.__SURFACEKIT_STORY_LIFECYCLE__ = { storyId: ${JSON.stringify(storyId)}, status: "success" }</script>`,
      })
    })

    await expect(
      loadStorybookStory(page, "http://surfacekit.test/story", storyId, 1_000)
    ).resolves.toEqual({ storyId, status: "success" })
    expect(requests).toBe(2)
  })

  test("stops after one retry when the same dynamic-import failure persists", async ({
    page,
  }) => {
    const storyId = "surfacekit-fixture--persistent-chunk-failure"
    let requests = 0
    await page.route("http://surfacekit.test/story", async (route) => {
      requests += 1
      await route.fulfill({
        contentType: "text/html",
        body: `<h1>Failed to fetch dynamically imported module: http://surfacekit.test/assets/example.js</h1>`,
      })
    })

    await expect(
      loadStorybookStory(page, "http://surfacekit.test/story", storyId, 1_000)
    ).rejects.toThrow(
      `Storybook could not render ${storyId}: Failed to fetch dynamically imported module: http://surfacekit.test/assets/example.js`
    )
    expect(requests).toBe(2)
  })

  test("settles layout without waiting forever on continuous transforms", async ({
    page,
  }) => {
    await page.setContent(`
      <style>
        @keyframes spin { to { transform: rotate(360deg); } }
        #spinner { width: 24px; height: 12px; animation: spin 1s linear infinite; }
      </style>
      <div id="storybook-root">
        <main id="spinner" role="status" aria-label="Loading"></main>
      </div>
    `)

    await waitForStoryLayoutStability(page)

    await expect(page.locator("#spinner")).toBeVisible()
  })

  test("treats scroll-driven effects as stable layout", async ({ page }) => {
    await page.setContent(`
      <style>
        @keyframes reveal { from { opacity: 0.5; } to { opacity: 1; } }
        #scroller {
          width: 100px;
          height: 50px;
          overflow: auto;
          animation: reveal linear both;
          animation-timeline: scroll(self);
        }
      </style>
      <div id="storybook-root">
        <div id="scroller" data-scroll-boundary="fixture">
          <div style="height: 200px">Scrollable content</div>
        </div>
      </div>
    `)

    await waitForStoryLayoutStability(page)

    await expect(page.locator("#scroller")).toBeVisible()
  })
})
