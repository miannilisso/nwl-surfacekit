import { render, renderHook, screen } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
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
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
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

  it("keeps the caller id separate from an opaque chart scope", () => {
    const { container } = render(
      <ChartContainer id="customer-visible-id" config={config}>
        <div />
      </ChartContainer>
    )

    const chart = container.querySelector("[data-slot=chart]")
    const scope = chart?.getAttribute("data-chart")

    expect(chart).toHaveAttribute("id", "customer-visible-id")
    expect(scope).toMatch(/^chart-[A-Za-z_][A-Za-z0-9_-]*$/)
    expect(scope).not.toBe("chart-customer-visible-id")
    expect(container.querySelector("style")?.textContent).toContain(
      `[data-chart=${scope}]`
    )
  })

  it("keeps a hostile native id out of the client chart scope and markup", () => {
    const hostileId = 'native"><img data-native-id-pwned="true">'
    const { container } = render(
      <ChartContainer id={hostileId} config={config}>
        <div />
      </ChartContainer>
    )
    const chart = container.querySelector("[data-slot=chart]")
    const scope = chart?.getAttribute("data-chart") ?? ""

    expect(chart?.getAttribute("id")).toBe(hostileId)
    expect(scope).toMatch(/^chart-[A-Za-z_][A-Za-z0-9_-]*$/)
    expect(scope).not.toContain(hostileId)
    expect(container.querySelector("[data-native-id-pwned]")).toBeNull()
    expect(container.querySelector("style")?.textContent).not.toContain(
      hostileId
    )
  })

  it("keeps a hostile native id inert in SSR output", () => {
    const hostileId = 'native"><img data-native-id-pwned="true">'
    const markup = renderToStaticMarkup(
      <ChartContainer id={hostileId} config={config}>
        <div />
      </ChartContainer>
    )
    const serverDocument = document.implementation.createHTMLDocument()
    serverDocument.body.innerHTML = markup
    const chart = serverDocument.querySelector("[data-slot=chart]")
    const scope = chart?.getAttribute("data-chart") ?? ""

    expect(chart?.getAttribute("id")).toBe(hostileId)
    expect(scope).toMatch(/^chart-[A-Za-z_][A-Za-z0-9_-]*$/)
    expect(scope).not.toContain(hostileId)
    expect(markup.match(/<style\b/g)).toHaveLength(1)
    expect(markup).not.toMatch(/<img\b/i)
    expect(serverDocument.querySelector("[data-native-id-pwned]")).toBeNull()
  })

  it("does not serialize hostile chart values into SSR or client stylesheet output", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
    const hostileConfig = {
      safe: { color: "rebeccapurple" },
      "bad;key": { color: "#f00" },
      hostileColor: { color: "</StYlE><img src=x onerror=alert(1)>" },
      hostileTheme: {
        theme: { light: "var(--chart-accent)", dark: "rgb(0 0 0); color:red" },
      },
    }

    const ssr = renderToStaticMarkup(
      <ChartStyle id="release" config={hostileConfig} />
    )
    const { container } = render(
      <ChartStyle id="release" config={hostileConfig} />
    )
    const css = container.querySelector("style")?.textContent ?? ""

    expect(ssr.match(/<style/g)).toHaveLength(1)
    expect(ssr.match(/<\/style>/gi)).toHaveLength(1)
    expect(ssr).not.toMatch(/<img\b/i)
    expect(css).toContain("--color-safe: rebeccapurple")
    expect(css).toContain("--color-hostileTheme: var(--chart-accent)")
    expect(css).not.toContain("bad;key")
    expect(css).not.toContain("hostileColor")
    expect(css).not.toContain("color:red")
    expect(warn).toHaveBeenCalled()
  })

  it("omits a direct stylesheet with an invalid scope id", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
    const { container } = render(
      <ChartStyle id={'release"] {} <style'} config={config} />
    )

    expect(container.querySelector("style")).not.toBeInTheDocument()
    expect(warn).toHaveBeenCalled()
  })

  it("does not warn about omitted unsafe values in production", () => {
    vi.stubEnv("NODE_ENV", "production")
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)

    render(
      <ChartStyle
        id="release"
        config={{ unsafe: { color: "red; background: black" } }}
      />
    )

    expect(warn).not.toHaveBeenCalled()
  })

  it("preserves legitimate hex, named, current, transparent, and balanced color functions", () => {
    const legitimateConfig = {
      hex: { color: "#1234ab" },
      named: { color: "rebeccapurple" },
      current: { color: "currentColor" },
      transparent: { color: "transparent" },
      function: {
        color: "color-mix(in srgb, var(--accent) 70%, rgb(0 0 0 / 20%))",
      },
      themed: {
        theme: { light: "hsl(210 40% 50%)", dark: "var(--chart-dark)" },
      },
    }

    const { container } = render(
      <ChartStyle id="release" config={legitimateConfig} />
    )
    const css = container.querySelector("style")?.textContent ?? ""

    expect(css).toContain("--color-hex: #1234ab")
    expect(css).toContain("--color-named: rebeccapurple")
    expect(css).toContain("--color-current: currentColor")
    expect(css).toContain("--color-transparent: transparent")
    expect(css).toContain(
      "--color-function: color-mix(in srgb, var(--accent) 70%, rgb(0 0 0 / 20%))"
    )
    expect(css).toContain("--color-themed: hsl(210 40% 50%)")
    expect(css).toContain("--color-themed: var(--chart-dark)")
  })

  it("accepts only 3, 4, 6, or 8 hex digits in direct and container styles on server and client", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
    const hexConfig = {
      three: { color: " #AbC " },
      four: { color: "#aBcD" },
      six: { color: "#12aBcD" },
      eight: { theme: { light: "#12aBcDeF", dark: "#Ff00aA80" } },
      zero: { color: "#" },
      one: { color: "#a" },
      two: { color: "#ab" },
      five: { color: "#abcde" },
      seven: { color: "#abcdef0" },
      nine: { color: "#abcdef012" },
      nonhex: { color: "#ggg" },
    }
    const expected = [
      "--color-three: #AbC;",
      "--color-four: #aBcD;",
      "--color-six: #12aBcD;",
      "--color-eight: #12aBcDeF;",
      "--color-eight: #Ff00aA80;",
    ]
    const rejected = ["zero", "one", "two", "five", "seven", "nine", "nonhex"]
    const direct = <ChartStyle id="release" config={hexConfig} />
    const contained = (
      <ChartContainer config={hexConfig}>
        <div />
      </ChartContainer>
    )

    for (const element of [direct, contained]) {
      const server = renderToStaticMarkup(element)
      const { container } = render(element)
      for (const css of [
        server,
        container.querySelector("style")?.textContent ?? "",
      ]) {
        for (const declaration of expected) expect(css).toContain(declaration)
        for (const key of rejected) expect(css).not.toContain(`--color-${key}:`)
      }
    }
    expect(warn).toHaveBeenCalled()
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
    expect(container.querySelector('[data-slot="chart"]')).toHaveAttribute(
      "id",
      "traffic"
    )
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
