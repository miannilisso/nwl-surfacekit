const CACHE_PREFIX = "surfacekit-"
const CACHE_REVISION = "__SURFACEKIT_CACHE_REVISION__"
const PRECACHE_NAME = `${CACHE_PREFIX}precache-${CACHE_REVISION}`
const RUNTIME_NAME = `${CACHE_PREFIX}runtime-${CACHE_REVISION}`
const RUNTIME_ENTRY_LIMIT = 64
const ICON_PATHS = [
  "/favicon.ico",
  "/favicons/apple-icon.png",
  "/favicons/icon0.svg",
  "/favicons/icon1.png",
  "/favicons/nwl-surfacekit.png",
  "/favicons/nwl-surfacekit.svg",
  "/favicons/web-app-manifest-192x192.png",
  "/favicons/web-app-manifest-512x512.png",
]
const ICON_PATH_SET = new Set(ICON_PATHS)
const SENSITIVE_PATH =
  /^\/(?:api(?:\/|$)|auth(?:\/|$)|login(?:\/|$)|logout(?:\/|$)|signup(?:\/|$)|security-challenge(?:\/|$)|challenge(?:\/|$)|mutation(?:\/|$))/i
const OFFLINE_SHELL = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#3aa346">
    <title>SurfaceKit is offline</title>
    <style>
      :root { color-scheme: light dark; font-family: ui-sans-serif, system-ui, sans-serif; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100svh; display: grid; place-items: center; padding: 1.5rem; background: Canvas; color: CanvasText; }
      main { width: min(100%, 32rem); border: 1px solid color-mix(in srgb, CanvasText 18%, transparent); border-radius: 1.25rem; padding: clamp(1.5rem, 8vw, 3rem); text-align: center; box-shadow: 0 1rem 3rem color-mix(in srgb, CanvasText 8%, transparent); }
      img { width: 5rem; height: 5rem; margin-inline: auto; border-radius: 1rem; }
      h1 { margin: 1.5rem 0 .75rem; font-size: clamp(1.75rem, 8vw, 2.5rem); line-height: 1.1; }
      p { margin: 0; color: color-mix(in srgb, CanvasText 72%, transparent); line-height: 1.6; }
      a { display: inline-flex; min-height: 2.75rem; align-items: center; margin-top: 1.5rem; padding: .625rem 1rem; border-radius: .75rem; background: #3aa346; color: #fff; font-weight: 650; text-decoration: none; }
    </style>
  </head>
  <body>
    <main>
      <img src="/favicons/nwl-surfacekit.svg" alt="NWL SurfaceKit" width="80" height="80">
      <h1>You are offline</h1>
      <p>The SurfaceKit catalogue needs a network connection. Reconnect, then try the playground again.</p>
      <a href="/playground">Try again</a>
    </main>
  </body>
</html>`

function isFrameworkDataRequest(request) {
  return (
    request.headers.get("RSC") === "1" ||
    request.headers.has("Next-Action") ||
    request.headers.has("Next-Router-State-Tree") ||
    request.headers.has("Next-Router-Prefetch")
  )
}

function isCanonicalIconUrl(url) {
  return (
    ICON_PATH_SET.has(url.pathname) && url.search === "" && url.hash === ""
  )
}

function isCacheableUrl(url) {
  return url.pathname.startsWith("/_next/static/") || isCanonicalIconUrl(url)
}

function isSafeRequest(request, url) {
  return (
    request.method === "GET" &&
    url.origin === self.location.origin &&
    !SENSITIVE_PATH.test(url.pathname) &&
    !isFrameworkDataRequest(request)
  )
}

function isCacheableResponse(response, expectedUrl) {
  if (
    !response.ok ||
    response.status !== 200 ||
    response.redirected ||
    response.type === "opaqueredirect" ||
    !response.url
  ) {
    return false
  }

  const finalUrl = new URL(response.url)
  return (
    finalUrl.origin === expectedUrl.origin &&
    finalUrl.pathname === expectedUrl.pathname &&
    finalUrl.search === expectedUrl.search
  )
}

async function precacheIcons() {
  const cache = await caches.open(PRECACHE_NAME)
  try {
    for (const path of ICON_PATHS) {
      const expectedUrl = new URL(path, self.location.origin)
      const request = new Request(expectedUrl, {
        cache: "reload",
        credentials: "same-origin",
        redirect: "error",
      })
      const response = await fetch(request)
      if (!isCacheableResponse(response, expectedUrl)) {
        throw new Error(`Invalid response for ${path}`)
      }
      await cache.put(path, response.clone())
    }
  } catch (error) {
    await caches.delete(PRECACHE_NAME)
    throw new Error("Unable to pre-cache supplied icon assets", {
      cause: error,
    })
  }
}

async function trimRuntimeCache(cache) {
  const keys = await cache.keys()
  const excess = keys.length - RUNTIME_ENTRY_LIMIT
  if (excess <= 0) return
  await Promise.all(
    keys.slice(0, excess).map((request) => cache.delete(request))
  )
}

async function immutableResponse(request, event, url) {
  const cacheName = isCanonicalIconUrl(url)
    ? PRECACHE_NAME
    : RUNTIME_NAME
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached

  const response = await fetch(request)
  if (isCacheableResponse(response, url)) {
    event.waitUntil(
      cache
        .put(request, response.clone())
        .then(() =>
          cacheName === RUNTIME_NAME ? trimRuntimeCache(cache) : undefined
        )
        .catch(() => undefined)
    )
  }
  return response
}

async function navigationResponse(request) {
  try {
    return await fetch(request)
  } catch {
    return new Response(OFFLINE_SHELL, {
      status: 503,
      statusText: "Offline",
      headers: {
        "Cache-Control": "no-store",
        "Content-Security-Policy":
          "default-src 'self'; img-src 'self'; style-src 'unsafe-inline'; object-src 'none'; base-uri 'none'",
        "Content-Type": "text/html; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    })
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheIcons())
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(async (names) => {
      const currentNames = new Set([PRECACHE_NAME, RUNTIME_NAME])
      const staleNames = names.filter(
        (name) => name.startsWith(CACHE_PREFIX) && !currentNames.has(name)
      )
      await Promise.all(staleNames.map((name) => caches.delete(name)))

      // The first worker can safely control the page that registered it. An
      // update activates only after prior clients exit; avoiding skipWaiting
      // and claim here prevents a new generation from mixing with old pages.
      if (staleNames.length === 0) await self.clients.claim()
    })
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)
  if (!isSafeRequest(request, url)) return

  if (request.mode === "navigate") {
    event.respondWith(navigationResponse(request))
    return
  }

  if (isCacheableUrl(url)) {
    event.respondWith(immutableResponse(request, event, url))
  }
})
