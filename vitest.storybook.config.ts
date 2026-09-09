import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import { playwright } from "@vitest/browser-playwright"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const repositoryRoot = path.dirname(fileURLToPath(import.meta.url))
const storybookProjectConfig = {
  extends: true,
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
          sequence: { groupOrder: 0 },
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
          sequence: { groupOrder: 1 },
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
