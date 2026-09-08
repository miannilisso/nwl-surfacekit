import { createHash } from "node:crypto"
import { copyFile, mkdir, readFile, stat } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const repositoryRoot = fileURLToPath(new URL("../../..", import.meta.url))
const checkOnly = process.argv.includes("--check")

const assetPairs = [
  ["assets/favicons/favicon.ico", "apps/web/app/favicon.ico"],
  ["assets/favicons/apple-icon.png", "apps/web/public/favicons/apple-icon.png"],
  ["assets/favicons/icon0.svg", "apps/web/public/favicons/icon0.svg"],
  ["assets/favicons/icon1.png", "apps/web/public/favicons/icon1.png"],
  [
    "assets/favicons/nwl-surfacekit.png",
    "apps/web/public/favicons/nwl-surfacekit.png",
  ],
  [
    "assets/favicons/nwl-surfacekit.svg",
    "apps/web/public/favicons/nwl-surfacekit.svg",
  ],
  [
    "assets/favicons/web-app-manifest-192x192.png",
    "apps/web/public/favicons/web-app-manifest-192x192.png",
  ],
  [
    "assets/favicons/web-app-manifest-512x512.png",
    "apps/web/public/favicons/web-app-manifest-512x512.png",
  ],
  [
    "assets/fonts/Outfit/Outfit-VariableFont_wght.ttf",
    "apps/web/public/fonts/Outfit/Outfit-VariableFont_wght.ttf",
  ],
  [
    "assets/fonts/Geist/Geist-VariableFont_wght.ttf",
    "apps/web/public/fonts/Geist/Geist-VariableFont_wght.ttf",
  ],
  [
    "assets/fonts/Geist/Geist-Italic-VariableFont_wght.ttf",
    "apps/web/public/fonts/Geist/Geist-Italic-VariableFont_wght.ttf",
  ],
  [
    "assets/fonts/Geist_Mono/GeistMono-VariableFont_wght.ttf",
    "apps/web/public/fonts/Geist_Mono/GeistMono-VariableFont_wght.ttf",
  ],
  [
    "assets/fonts/Geist_Mono/GeistMono-Italic-VariableFont_wght.ttf",
    "apps/web/public/fonts/Geist_Mono/GeistMono-Italic-VariableFont_wght.ttf",
  ],
]

function digest(bytes) {
  return createHash("sha256").update(bytes).digest("hex")
}

async function isIdentical(source, destination) {
  try {
    const [sourceStat, destinationStat] = await Promise.all([
      stat(source),
      stat(destination),
    ])
    if (sourceStat.size !== destinationStat.size) return false
    const [sourceBytes, destinationBytes] = await Promise.all([
      readFile(source),
      readFile(destination),
    ])
    return digest(sourceBytes) === digest(destinationBytes)
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") {
      return false
    }
    throw error
  }
}

const drifted = []
for (const [sourceRelative, destinationRelative] of assetPairs) {
  const source = path.join(repositoryRoot, sourceRelative)
  const destination = path.join(repositoryRoot, destinationRelative)

  if (await isIdentical(source, destination)) continue
  drifted.push(destinationRelative)
  if (!checkOnly) {
    await mkdir(path.dirname(destination), { recursive: true })
    await copyFile(source, destination)
  }
}

if (checkOnly && drifted.length > 0) {
  throw new Error(
    `Reference assets are missing or stale:\n${drifted.map((file) => `- ${file}`).join("\n")}`
  )
}

const verb = checkOnly ? "Verified" : "Synced"
console.log(
  `${verb} ${assetPairs.length} assets from the canonical assets tree.`
)
