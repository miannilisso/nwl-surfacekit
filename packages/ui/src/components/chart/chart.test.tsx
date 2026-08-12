import { render, renderHook, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  ChartContainer,
  ChartLegendContent,
  ChartStyle,
  ChartTooltipContent,
} from "./chart"

const config = {
  requests: { label: "API requests", color: "#5b6ee1" },
  errors: { label: "Errors", theme: { light: "#c0262d", dark: "#ff6b72" } },
}

class SizedResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {}
  observe(target: Element) {
    this.callback(
      [
        {
          target,
          contentRect: {
            width: 480,
            height: 240,
          },
        } as ResizeObserverEntry,
      ],
      this as unknown as ResizeObserver
    )
  }
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", SizedResizeObserver)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("Chart", () => {
  it("emits scoped theme variables for configured series", () => {
    const { container } = render(<ChartStyle id="release" config={config} />)
    const css = container.querySelector("style")?.textContent
    expect(css).toContain("[data-chart=release]")
    expect(css).toContain("--color-requests: #5b6ee1")
    expect(css).toContain(".dark [data-chart=release]")
    expect(css).toContain("--color-errors: #ff6b72")
  })

  it("renders fixed container, tooltip, legend, and empty payload states", () => {
    const payload = [
      {
        name: "requests",
        dataKey: "requests",
        value: 12400,
        color: "#5b6ee1",
        payload: { requests: 12400 },
      },
    ]
    const { container } = render(
      <ChartContainer
        id="traffic"
        config={config}
        initialDimension={{ width: 480, height: 240 }}
      >
        <div>
          <ChartTooltipContent
            active
            label="Monday"
            payload={payload as never}
          />
          <ChartLegendContent payload={payload as never} />
        </div>
      </ChartContainer>
    )
    expect(
      container.querySelector('[data-chart="chart-traffic"]')
    ).toBeInTheDocument()
    expect(screen.getAllByText("API requests")).toHaveLength(2)
    expect(screen.getByText("12,400")).toBeVisible()
    expect(container.querySelector("style")?.textContent).toContain(
      "--color-requests"
    )
  })

  it("guards chart context and renders no content for empty series", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined)
    expect(() =>
      renderHook(() => ChartTooltipContent({ active: true, payload: [] }))
    ).toThrow(/ChartContainer/)
    consoleError.mockRestore()
    const { container } = render(
      <ChartContainer config={{}}>
        <div>
          <ChartTooltipContent active payload={[]} />
          <ChartLegendContent payload={[]} />
        </div>
      </ChartContainer>
    )
    expect(container.querySelector("style")).not.toBeInTheDocument()
    expect(screen.queryByText("API requests")).not.toBeInTheDocument()
  })
})
