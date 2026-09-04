import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  unlink,
  writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import tailwindcss from "../../apps/web/node_modules/@tailwindcss/postcss"
import { referenceAppSources } from "../../apps/web/postcss/reference-app-sources.mjs"
import postcss from "postcss"
import { expect, it } from "vitest"

const repositoryRoot = process.cwd()
const referenceCssPath = path.join(
  repositoryRoot,
  "apps/web/app/reference-app.css"
)

type DependencyMessage = {
  type: "dependency"
  plugin: string
  file: string
  parent?: string
}

type DirectoryDependencyMessage = {
  type: "dir-dependency"
  plugin: string
  dir: string
  glob: string
  parent?: string
}

async function sourceFixture() {
  const root = await mkdtemp(path.join(tmpdir(), "surfacekit-sources-"))
  const appRoot = path.join(root, "app")
  const packageSourceRoot = path.join(root, "package")
  const appSource = path.join(appRoot, "app/page.tsx")
  const packageSource = path.join(
    packageSourceRoot,
    "components/button/button.tsx"
  )

  await Promise.all(
    [
      path.dirname(appSource),
      path.join(appRoot, "components"),
      path.join(appRoot, "stories"),
      path.join(appRoot, ".storybook"),
      path.dirname(packageSource),
      path.join(packageSourceRoot, "patterns"),
      path.join(packageSourceRoot, "hooks"),
      path.join(packageSourceRoot, "lib"),
    ].map((directory) => mkdir(directory, { recursive: true }))
  )
  await writeFile(appSource, 'export const className = "bg-[#123456]"\n')
  await writeFile(packageSource, 'export const className = "rounded-md"\n')

  return { appRoot, appSource, packageSource, packageSourceRoot, root }
}

it("registers every scanned file and stable source glob as a PostCSS dependency", async () => {
  const fixture = await sourceFixture()
  try {
    const source = await readFile(referenceCssPath, "utf8")
    const result = await postcss([
      referenceAppSources({
        appRoot: fixture.appRoot,
        packageSourceRoot: fixture.packageSourceRoot,
        referenceCssPath,
      }),
    ]).process(source, { from: referenceCssPath })
    const messages = result.messages.filter(
      (message) => message.plugin === "surfacekit-reference-app-sources"
    ) as Array<DependencyMessage | DirectoryDependencyMessage>
    const files = messages
      .filter(
        (message): message is DependencyMessage => message.type === "dependency"
      )
      .map(({ file }) => file)
    const directories = messages.filter(
      (message): message is DirectoryDependencyMessage =>
        message.type === "dir-dependency"
    )

    expect(files).toEqual(
      expect.arrayContaining([
        path.resolve(fixture.appSource),
        path.resolve(fixture.packageSource),
      ])
    )
    expect(directories).toHaveLength(8)
    expect(directories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dir: path.resolve(fixture.appRoot, "app"),
          glob: "{**/*.ts,**/*.tsx}",
        }),
        expect.objectContaining({
          dir: path.resolve(fixture.packageSourceRoot, "components"),
          glob: "{**/*.ts,**/*.tsx}",
        }),
      ])
    )
    for (const message of messages) {
      expect(message.parent).toBe(referenceCssPath)
      expect(
        path.isAbsolute(
          message.type === "dependency" ? message.file : message.dir
        )
      ).toBe(true)
      if (message.type === "dir-dependency") {
        expect(message.glob).not.toContain("\\")
      }
    }
  } finally {
    await rm(fixture.root, { recursive: true, force: true })
  }
})

it("recompiles added and removed utility candidates without restarting the processor", async () => {
  const fixture = await sourceFixture()
  try {
    const source = await readFile(referenceCssPath, "utf8")
    const addedSource = path.join(
      fixture.appRoot,
      "stories/nested/added.stories.tsx"
    )
    const processor = postcss([
      referenceAppSources({
        appRoot: fixture.appRoot,
        packageSourceRoot: fixture.packageSourceRoot,
        referenceCssPath,
      }),
      tailwindcss(),
    ])
    const compile = async () =>
      (await processor.process(source, { from: referenceCssPath })).css

    expect(await compile()).not.toContain("#abcdef")
    await mkdir(path.dirname(addedSource), { recursive: true })
    await writeFile(addedSource, 'export const className = "text-[#abcdef]"\n')
    expect(await compile()).toContain("#abcdef")
    await unlink(addedSource)
    expect(await compile()).not.toContain("#abcdef")
  } finally {
    await rm(fixture.root, { recursive: true, force: true })
  }
})
