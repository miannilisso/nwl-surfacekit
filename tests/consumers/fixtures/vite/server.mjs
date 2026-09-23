import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { renderToString } from "react-dom/server"
import { createElement } from "react"
import App from "./dist-server/app.js"

const root = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(root, "dist")
const html = await readFile(path.join(dist, "index.html"), "utf8")
const contentTypes = {
  ".css": "text/css",
  ".js": "text/javascript",
  ".html": "text/html",
}

createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname
  if (pathname === "/") {
    const body = html.replace(
      '<div id="root"></div>',
      `<div id="root">${renderToString(createElement(App))}</div>`
    )
    response.writeHead(200, { "content-type": "text/html" })
    response.end(body)
    return
  }

  const filename = path.resolve(dist, `.${pathname}`)
  if (!filename.startsWith(`${dist}${path.sep}`)) {
    response.writeHead(404)
    response.end()
    return
  }
  try {
    const body = await readFile(filename)
    response.writeHead(200, {
      "content-type":
        contentTypes[path.extname(filename)] ?? "application/octet-stream",
    })
    response.end(body)
  } catch {
    response.writeHead(404)
    response.end()
  }
}).listen(Number(process.env.PORT), "127.0.0.1")
