import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import { playwright } from "@vitest/browser-playwright"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const repositoryRoot = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    fileParallelism: false,
    projects: [
      {
        extends: true,
        resolve: {
          alias: [
            {
              find: "@nwl/surfacekit/globals.css",
              replacement: path.join(
                repositoryRoot,
                "packages/ui/src/styles/globals.css"
              ),
            },
            {
              find: "@nwl/surfacekit",
              replacement: path.join(repositoryRoot, "packages/ui/src"),
            },
          ],
        },
        optimizeDeps: {
          include: ["@testing-library/dom", "storybook/test"],
        },
        plugins: [
          storybookTest({
            configDir: path.join(repositoryRoot, "apps/web/.storybook"),
          }),
        ],
        test: {
          name: "storybook",
          root: path.join(repositoryRoot, "apps/web"),
          browser: {
            enabled: true,
            provider: playwright({}),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
})
