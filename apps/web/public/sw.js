const CACHE_PREFIX = "surfacekit-"
const CACHE_NAME = `${CACHE_PREFIX}runtime-v1`
const CACHE_ENTRY_LIMIT = 64
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

function isCacheablePath(pathname) {
  return pathname.startsWith("/_next/static/") || ICON_PATH_SET.has(pathname)
}

function isSafeRequest(request, url) {
  return (
    request.method === "GET" &&
    url.origin === self.location.origin &&
    !SENSITIVE_PATH.test(url.pathname) &&
    !isFrameworkDataRequest(request)
  )
}

function isCacheableResponse(response) {
  return (
    response.ok &&
    response.status === 200 &&
    !response.redirected &&
    response.type !== "opaqueredirect"
  )
}

async function trimCache(cache) {
  const keys = await cache.keys()
  const excess = keys.length - CACHE_ENTRY_LIMIT
  if (excess <= 0) return
  await Promise.all(
    keys.slice(0, excess).map((request) => cache.delete(request))
  )
}

async function immutableResponse(request, event) {
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(request)
  if (cached) return cached

  const response = await fetch(request)
  if (isCacheableResponse(response)) {
    event.waitUntil(
      cache
        .put(request, response.clone())
        .then(() => trimCache(cache))
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
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ICON_PATHS))
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter(
              (name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME
            )
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener("message", (event) => {
  if (event.data?.type === "SURFACEKIT_ACTIVATE_UPDATE") {
    event.waitUntil(self.skipWaiting())
  }
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)
  if (!isSafeRequest(request, url)) return

  if (request.mode === "navigate") {
    event.respondWith(navigationResponse(request))
    return
  }

  if (isCacheablePath(url.pathname)) {
    event.respondWith(immutableResponse(request, event))
  }
})
