import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import { playwright } from "@vitest/browser-playwright"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const repositoryRoot = path.dirname(fileURLToPath(import.meta.url))
const storybookProjectConfig = {
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
  test: {
    root: path.join(repositoryRoot, "apps/web"),
    browser: {
      enabled: true,
      provider: playwright({}),
      headless: true,
    },
  },
}

export default defineConfig({
  test: {
    fileParallelism: false,
    projects: [
      {
        ...storybookProjectConfig,
        plugins: [
          storybookTest({
            configDir: path.join(repositoryRoot, "apps/web/.storybook"),
          }),
        ],
        test: {
          ...storybookProjectConfig.test,
          name: "storybook",
          browser: {
            ...storybookProjectConfig.test.browser,
            instances: [
              { browser: "chromium" as const, name: "storybook-chromium" },
            ],
          },
        },
      },
      {
        ...storybookProjectConfig,
        plugins: [
          storybookTest({
            configDir: path.join(repositoryRoot, "apps/web/.storybook"),
            initialGlobals: { theme: "dark" },
            tags: { include: ["dark-a11y"] },
          }),
        ],
        test: {
          ...storybookProjectConfig.test,
          name: "storybook-dark-introduction",
          browser: {
            ...storybookProjectConfig.test.browser,
            instances: [
              {
                browser: "chromium" as const,
                name: "storybook-dark-introduction-chromium",
              },
            ],
          },
        },
      },
    ],
  },
})
