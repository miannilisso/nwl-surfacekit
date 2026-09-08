import { render, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { PwaRegistrar } from "./pwa-registrar"

const originalServiceWorker = navigator.serviceWorker

afterEach(() => {
  vi.unstubAllEnvs()
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: originalServiceWorker,
  })
})

describe("PwaRegistrar", () => {
  it("registers the root worker with fresh update checks in production", async () => {
    const register = vi.fn(async () => ({ scope: "http://localhost/" }))
    vi.stubEnv("NODE_ENV", "production")
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { register },
    })

    render(<PwaRegistrar />)

    await waitFor(() =>
      expect(register).toHaveBeenCalledWith("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      })
    )
  })

  it("does not register a service worker outside production", async () => {
    const register = vi.fn()
    vi.stubEnv("NODE_ENV", "development")
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { register },
    })

    render(<PwaRegistrar />)
    await Promise.resolve()

    expect(register).not.toHaveBeenCalled()
  })

  it("contains registration failures so they cannot disrupt the application", async () => {
    const containFailure = vi.fn()
    const register = vi.fn(() => ({ catch: containFailure }))
    vi.stubEnv("NODE_ENV", "production")
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { register },
    })

    render(<PwaRegistrar />)

    await waitFor(() => expect(register).toHaveBeenCalledOnce())
    expect(containFailure).toHaveBeenCalledWith(expect.any(Function))
  })
})
