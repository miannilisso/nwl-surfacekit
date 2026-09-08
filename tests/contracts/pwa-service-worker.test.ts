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

async function loadServiceWorker(network: typeof fetch) {
  const listeners = new Map<string, Listener>()
  const stores = new Map<string, MemoryCache>()
  stores.set("unrelated-cache", new MemoryCache(network))
  stores.set("surfacekit-obsolete", new MemoryCache(network))

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
    location: { origin: "https://surfacekit.test" },
    registration: { scope: "https://surfacekit.test/" },
    clients: { claim },
    skipWaiting,
    addEventListener(type: string, listener: Listener) {
      listeners.set(type, listener)
    },
  }
  const source = await readFile("apps/web/public/sw.js", "utf8")
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

  beforeEach(() => {
    network = vi.fn(async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input)
      return new Response(`online:${new URL(request.url).pathname}`, {
        headers: { "Content-Type": "text/plain" },
        status: 200,
      })
    })
  })

  it("pre-caches only explicit supplied icons and deletes only obsolete SurfaceKit caches", async () => {
    const runtime = await loadServiceWorker(network)
    const install = waitableEvent()
    await runtime.dispatch("install", install.event)
    await install.settled()

    const cacheNames = [...runtime.stores.keys()]
    const currentName = cacheNames.find(
      (name) => /^surfacekit-/.test(name) && name !== "surfacekit-obsolete"
    )
    expect(currentName).toBeDefined()
    expect(
      [...runtime.stores.get(currentName!)!.entries.keys()].sort()
    ).toEqual(
      [
        "/favicon.ico",
        "/favicons/apple-icon.png",
        "/favicons/icon0.svg",
        "/favicons/icon1.png",
        "/favicons/nwl-surfacekit.png",
        "/favicons/nwl-surfacekit.svg",
        "/favicons/web-app-manifest-192x192.png",
        "/favicons/web-app-manifest-512x512.png",
      ].sort()
    )

    const activate = waitableEvent()
    await runtime.dispatch("activate", activate.event)
    await activate.settled()
    expect(runtime.stores.has("surfacekit-obsolete")).toBe(false)
    expect(runtime.stores.has("unrelated-cache")).toBe(true)
    expect(runtime.claim).toHaveBeenCalledOnce()
  })

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

  it("caches only successful non-redirected immutable assets and caps the cache", async () => {
    const runtime = await loadServiceWorker(network)

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

    const surfaceCache = [...runtime.stores.entries()].find(([name]) =>
      /^surfacekit-/.test(name)
    )?.[1]
    expect(surfaceCache).toBeDefined()
    expect(surfaceCache!.entries.size).toBeLessThanOrEqual(64)

    network.mockResolvedValueOnce(new Response("error", { status: 500 }))
    const failed = fetchEvent(
      new Request("https://surfacekit.test/_next/static/chunks/failure.js")
    )
    await runtime.dispatch("fetch", failed.event)
    expect((await failed.response())?.status).toBe(500)
    await Promise.all(failed.pending)
    expect(surfaceCache!.entries.has("/_next/static/chunks/failure.js")).toBe(
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
    expect(surfaceCache!.entries.has("/_next/static/chunks/redirect.js")).toBe(
      false
    )
  })

  it("activates an explicitly accepted staged update", async () => {
    const runtime = await loadServiceWorker(network)
    const update = waitableEvent()
    await runtime.dispatch("message", {
      ...update.event,
      data: { type: "SURFACEKIT_ACTIVATE_UPDATE" },
    })
    await update.settled()
    expect(runtime.skipWaiting).toHaveBeenCalledOnce()
  })
})
