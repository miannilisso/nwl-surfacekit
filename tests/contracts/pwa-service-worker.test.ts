import { readFile } from "node:fs/promises"
import vm from "node:vm"

import { beforeEach, describe, expect, it, vi } from "vitest"

type WaitableEvent = { waitUntil(promise: Promise<unknown>): void }
type FetchEvent = WaitableEvent & {
  request: Request
  respondWith(response: Promise<Response> | Response): void
}
type MessageEvent = WaitableEvent & { data: unknown }
type ListenerEvent = WaitableEvent | FetchEvent | MessageEvent
type Listener = (event: ListenerEvent) => void

class MemoryCache {
  readonly entries = new Map<string, Response>()

  constructor(private readonly network: typeof fetch) {}

  async addAll(urls: string[]) {
    for (const url of urls) {
      const response = await this.network(
        new Request(new URL(url, "https://surfacekit.test"))
      )
      if (!response.ok) throw new Error(`Unable to cache ${url}`)
      this.entries.set(url, response.clone())
    }
  }

  async match(request: Request | string) {
    const key =
      typeof request === "string"
        ? request
        : new URL(request.url).pathname + new URL(request.url).search
    return this.entries.get(key)?.clone()
  }

  async put(request: Request | string, response: Response) {
    const key =
      typeof request === "string"
        ? request
        : new URL(request.url).pathname + new URL(request.url).search
    this.entries.set(key, response.clone())
  }

  async keys() {
    return [...this.entries.keys()].map(
      (key) => new Request(new URL(key, "https://surfacekit.test"))
    )
  }

  async delete(request: Request | string) {
    const key =
      typeof request === "string"
        ? request
        : new URL(request.url).pathname + new URL(request.url).search
    return this.entries.delete(key)
  }
}

type WorkerOptions = {
  revision?: string
  stores?: Map<string, MemoryCache>
}

async function loadServiceWorker(
  network: typeof fetch,
  { revision, stores = new Map<string, MemoryCache>() }: WorkerOptions = {}
) {
  const listeners = new Map<string, Listener>()
  if (!stores.has("unrelated-cache")) {
    stores.set("unrelated-cache", new MemoryCache(network))
  }

  const cacheStorage = {
    async open(name: string) {
      const cache = stores.get(name) ?? new MemoryCache(network)
      stores.set(name, cache)
      return cache
    },
    async keys() {
      return [...stores.keys()]
    },
    async delete(name: string) {
      return stores.delete(name)
    },
  }
  const skipWaiting = vi.fn(async () => undefined)
  const claim = vi.fn(async () => undefined)
  const worker = {
    location: {
      href: "https://surfacekit.test/sw.js",
      origin: "https://surfacekit.test",
    },
    registration: { scope: "https://surfacekit.test/" },
    clients: { claim },
    skipWaiting,
    addEventListener(type: string, listener: Listener) {
      listeners.set(type, listener)
    },
  }
  let source = await readFile("apps/web/public/sw.js", "utf8")
  if (revision) {
    const replaced = source.replace(
      /const CACHE_REVISION = "[a-f0-9-]+"/,
      `const CACHE_REVISION = "${revision}"`
    )
    if (replaced === source) {
      throw new Error("The generated worker does not expose a cache revision")
    }
    source = replaced
  }
  vm.runInNewContext(source, {
    URL,
    Request,
    Response,
    caches: cacheStorage,
    fetch: network,
    self: worker,
    setTimeout,
  })

  async function dispatch(type: string, event: ListenerEvent) {
    const listener = listeners.get(type)
    if (!listener) throw new Error(`Missing ${type} listener`)
    listener(event)
  }

  return { claim, dispatch, listeners, skipWaiting, stores }
}

function waitableEvent() {
  const pending: Promise<unknown>[] = []
  return {
    event: {
      waitUntil(promise: Promise<unknown>) {
        pending.push(promise)
      },
    },
    async settled() {
      await Promise.all(pending)
    },
  }
}

function fetchEvent(request: Request) {
  const pending: Promise<unknown>[] = []
  let response: Promise<Response> | undefined
  return {
    event: {
      request,
      respondWith(value: Promise<Response> | Response) {
        response = Promise.resolve(value)
      },
      waitUntil(promise: Promise<unknown>) {
        pending.push(promise)
      },
    },
    pending,
    response: () => response,
  }
}

describe("SurfaceKit service worker", () => {
  let network: ReturnType<typeof vi.fn<typeof fetch>>
  const iconPaths = [
    "/favicon.ico",
    "/favicons/apple-icon.png",
    "/favicons/icon0.svg",
    "/favicons/icon1.png",
    "/favicons/nwl-surfacekit.png",
    "/favicons/nwl-surfacekit.svg",
    "/favicons/web-app-manifest-192x192.png",
    "/favicons/web-app-manifest-512x512.png",
  ]

  beforeEach(() => {
    network = vi.fn(async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input)
      const response = new Response(`online:${new URL(request.url).pathname}`, {
        headers: { "Content-Type": "text/plain" },
        status: 200,
      })
      Object.defineProperty(response, "url", { value: request.url })
      return response
    })
  })

  it("pre-caches only explicit supplied icons and claims the first generation", async () => {
    const runtime = await loadServiceWorker(network)
    const install = waitableEvent()
    await runtime.dispatch("install", install.event)
    await install.settled()

    const cacheNames = [...runtime.stores.keys()]
    const currentName = cacheNames.find((name) =>
      name.startsWith("surfacekit-precache-")
    )
    expect(currentName).toBeDefined()
    expect(
      [...runtime.stores.get(currentName!)!.entries.keys()].sort()
    ).toEqual(iconPaths.toSorted())

    expect(network).toHaveBeenCalledTimes(iconPaths.length)
    for (const [request] of network.mock.calls) {
      expect(request).toBeInstanceOf(Request)
      expect((request as Request).cache).toBe("reload")
      expect((request as Request).redirect).toBe("error")
      expect(new URL((request as Request).url).origin).toBe(
        "https://surfacekit.test"
      )
    }

    const activate = waitableEvent()
    await runtime.dispatch("activate", activate.event)
    await activate.settled()
    expect(runtime.stores.has("unrelated-cache")).toBe(true)
    expect(runtime.claim).toHaveBeenCalledOnce()
  })

  it.each([
    [
      "redirected",
      (request: Request) => {
        const response = new Response("redirected", { status: 200 })
        Object.defineProperties(response, {
          redirected: { value: true },
          url: { value: request.url },
        })
        return response
      },
    ],
    [
      "cross-origin",
      () => {
        const response = new Response("foreign", { status: 200 })
        Object.defineProperty(response, "url", {
          value: "https://cdn.example.test/icon.svg",
        })
        return response
      },
    ],
    [
      "failed",
      (request: Request) => {
        const response = new Response("error", { status: 503 })
        Object.defineProperty(response, "url", { value: request.url })
        return response
      },
    ],
  ])(
    "rejects a %s response while installing supplied icons",
    async (_case, invalidResponse) => {
      network.mockImplementationOnce(async (input) => {
        const request = input instanceof Request ? input : new Request(input)
        return invalidResponse(request)
      })
      const runtime = await loadServiceWorker(network)
      const install = waitableEvent()

      await runtime.dispatch("install", install.event)

      await expect(install.settled()).rejects.toThrow(
        /pre-cache supplied icon/i
      )
      expect(
        [...runtime.stores.keys()].some((name) =>
          name.startsWith("surfacekit-precache-")
        )
      ).toBe(false)
    }
  )

  it("keeps documents network-first and falls back to a branded non-sensitive shell", async () => {
    network.mockRejectedValueOnce(new TypeError("offline"))
    const runtime = await loadServiceWorker(network)
    const navigation = fetchEvent(
      new Request("https://surfacekit.test/playground", { method: "GET" })
    )
    Object.defineProperty(navigation.event.request, "mode", {
      value: "navigate",
    })

    await runtime.dispatch("fetch", navigation.event)
    const response = await navigation.response()?.then((value) => value)
    expect(response?.status).toBe(503)
    await expect(response?.text()).resolves.toContain("NWL SurfaceKit")
    expect(response?.headers.get("Cache-Control")).toBe("no-store")
    expect(
      [...runtime.stores.values()].some((cache) =>
        [...cache.entries.keys()].some((key) => key.includes("playground"))
      )
    ).toBe(false)
  })

  it("ignores sensitive and non-GET request classes before any cache lookup", async () => {
    const runtime = await loadServiceWorker(network)
    const excluded = [
      new Request("https://surfacekit.test/api/profile"),
      new Request("https://surfacekit.test/auth/session"),
      new Request("https://surfacekit.test/security-challenge"),
      new Request("https://surfacekit.test/playground", { method: "POST" }),
      new Request("https://other.test/favicons/icon0.svg"),
      new Request("https://surfacekit.test/playground", {
        headers: { RSC: "1" },
      }),
      new Request("https://surfacekit.test/playground", {
        headers: { "Next-Action": "action-id" },
      }),
    ]

    for (const request of excluded) {
      const event = fetchEvent(request)
      await runtime.dispatch("fetch", event.event)
      expect(event.response(), request.url).toBeUndefined()
    }
    expect(network).not.toHaveBeenCalled()
  })

  it("caps runtime assets without evicting the offline shell icons", async () => {
    const runtime = await loadServiceWorker(network)
    const install = waitableEvent()
    await runtime.dispatch("install", install.event)
    await install.settled()

    for (let index = 0; index < 70; index += 1) {
      const event = fetchEvent(
        new Request(
          `https://surfacekit.test/_next/static/chunks/chunk-${index}.js`
        )
      )
      await runtime.dispatch("fetch", event.event)
      await event.response()
      await Promise.all(event.pending)
    }

    const precache = [...runtime.stores.entries()].find(([name]) =>
      name.startsWith("surfacekit-precache-")
    )?.[1]
    const runtimeCache = [...runtime.stores.entries()].find(([name]) =>
      name.startsWith("surfacekit-runtime-")
    )?.[1]
    expect(precache).toBeDefined()
    expect(runtimeCache).toBeDefined()
    expect(runtimeCache!.entries.size).toBeLessThanOrEqual(64)
    expect([...precache!.entries.keys()].sort()).toEqual(iconPaths.toSorted())

    network.mockResolvedValueOnce(new Response("error", { status: 500 }))
    const failed = fetchEvent(
      new Request("https://surfacekit.test/_next/static/chunks/failure.js")
    )
    await runtime.dispatch("fetch", failed.event)
    expect((await failed.response())?.status).toBe(500)
    await Promise.all(failed.pending)
    expect(runtimeCache!.entries.has("/_next/static/chunks/failure.js")).toBe(
      false
    )

    const redirectResponse = new Response("redirected", { status: 200 })
    Object.defineProperty(redirectResponse, "redirected", { value: true })
    network.mockResolvedValueOnce(redirectResponse)
    const redirected = fetchEvent(
      new Request("https://surfacekit.test/_next/static/chunks/redirect.js")
    )
    await runtime.dispatch("fetch", redirected.event)
    expect((await redirected.response())?.redirected).toBe(true)
    await Promise.all(redirected.pending)
    expect(runtimeCache!.entries.has("/_next/static/chunks/redirect.js")).toBe(
      false
    )
  })

  it("keeps two generations isolated until the old generation can retire", async () => {
    const stores = new Map<string, MemoryCache>()
    const first = await loadServiceWorker(network, {
      revision: "generation-one",
      stores,
    })
    const firstInstall = waitableEvent()
    await first.dispatch("install", firstInstall.event)
    await firstInstall.settled()
    const firstActivate = waitableEvent()
    await first.dispatch("activate", firstActivate.event)
    await firstActivate.settled()
    expect(first.claim).toHaveBeenCalledOnce()

    const second = await loadServiceWorker(network, {
      revision: "generation-two",
      stores,
    })
    const secondInstall = waitableEvent()
    await second.dispatch("install", secondInstall.event)
    await secondInstall.settled()

    expect(stores.has("surfacekit-precache-generation-one")).toBe(true)
    expect(stores.has("surfacekit-precache-generation-two")).toBe(true)
    expect(second.skipWaiting).not.toHaveBeenCalled()

    const secondActivate = waitableEvent()
    await second.dispatch("activate", secondActivate.event)
    await secondActivate.settled()
    expect(stores.has("surfacekit-precache-generation-one")).toBe(false)
    expect(stores.has("surfacekit-precache-generation-two")).toBe(true)
    expect(stores.has("unrelated-cache")).toBe(true)
    expect(second.claim).not.toHaveBeenCalled()
  })
})
