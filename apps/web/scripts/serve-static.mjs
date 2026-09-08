import { createReadStream } from "node:fs"
import { stat } from "node:fs/promises"
import http from "node:http"
import path from "node:path"
import process from "node:process"

const root = path.resolve(process.argv[2] ?? "storybook-static")
const port = Number(process.argv[3] ?? 6006)
const host = process.argv[4] ?? "127.0.0.1"
const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "application/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".ttf", "font/ttf"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
])

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host}`)
    const relativePath = decodeURIComponent(url.pathname).replace(/^\/+/, "")
    let file = path.resolve(root, relativePath || "index.html")
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403).end("Forbidden")
      return
    }

    const fileStat = await stat(file)
    if (fileStat.isDirectory()) file = path.join(file, "index.html")
    const extension = path.extname(file).toLowerCase()
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": contentTypes.get(extension) ?? "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    })
    createReadStream(file).pipe(response)
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
    response.end("Not found")
  }
})

server.listen(port, host, () => {
  console.log(`Serving ${root} at http://${host}:${port}`)
})

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)))
}
