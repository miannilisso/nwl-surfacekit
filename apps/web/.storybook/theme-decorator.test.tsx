import { render, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { withSurfaceKitTheme } from "./theme-decorator"

describe("withSurfaceKitTheme", () => {
  it("synchronizes the selected theme and restores the preview document", async () => {
    const root = document.documentElement
    const body = document.body
    root.className = "preview-root"
    root.style.colorScheme = "only light"
    body.style.background = "canvas"

    const Story = () => <p>SurfaceKit story</p>
    const { rerender, unmount } = render(
      withSurfaceKitTheme(Story, { globals: { theme: "dark" } } as never)
    )

    await waitFor(() => expect(root).toHaveClass("dark"))
    expect(root.style.colorScheme).toBe("dark")

    rerender(
      withSurfaceKitTheme(Story, { globals: { theme: "light" } } as never)
    )

    await waitFor(() => expect(root).not.toHaveClass("dark"))
    expect(root.style.colorScheme).toBe("light")

    unmount()

    expect(root.className).toBe("preview-root")
    expect(root.style.colorScheme).toBe("only light")
    expect(body.style.background).toBe("canvas")
  })

  it("keeps the remaining story theme active when another story unmounts", async () => {
    const root = document.documentElement
    const body = document.body
    root.className = "preview-root"
    root.style.colorScheme = "only light"
    body.style.background = "canvas"

    const Story = () => <p>SurfaceKit story</p>
    const darkStory = withSurfaceKitTheme(Story, {
      globals: { theme: "dark" },
    } as never)
    const lightStory = withSurfaceKitTheme(Story, {
      globals: { theme: "light" },
    } as never)
    const { rerender, unmount } = render(
      <>
        <div key="dark">{darkStory}</div>
        <div key="light">{lightStory}</div>
      </>
    )

    await waitFor(() => expect(root.style.colorScheme).toBe("light"))

    rerender(<div key="light">{lightStory}</div>)

    await waitFor(() => expect(root.style.colorScheme).toBe("light"))
    expect(body.style.background).toBe("var(--background)")

    unmount()

    expect(root.className).toBe("preview-root")
    expect(root.style.colorScheme).toBe("only light")
    expect(body.style.background).toBe("canvas")
  })
})
