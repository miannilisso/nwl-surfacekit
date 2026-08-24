import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { WebShellActions } from "./web-shell-actions"

const theme = vi.hoisted(() => ({
  resolvedTheme: "light",
  setTheme: vi.fn(),
}))

vi.mock("next-themes", () => ({
  useTheme: () => theme,
}))

describe("WebShellActions", () => {
  it("keeps the shared theme control and playground route available", () => {
    render(<WebShellActions />)

    expect(screen.getByRole("button", { name: "Toggle theme" })).toBeVisible()
    expect(screen.getByRole("link", { name: "Playground" })).toHaveAttribute(
      "href",
      "/playground"
    )
  })
})
