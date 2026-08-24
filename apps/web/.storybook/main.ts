import type { StorybookConfig } from "@storybook/react-vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import { mergeConfig } from "vite"

const config: StorybookConfig = {
  stories: ["./introduction.stories.tsx", "../stories/**/*.stories.{ts,tsx}"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [react()],
      resolve: {
        alias: [
          {
            find: "@nwl/surfacekit/globals.css",
            replacement: path.resolve(
              process.cwd(),
              "packages/ui/src/styles/globals.css"
            ),
          },
          {
            find: "@nwl/surfacekit",
            replacement: path.resolve(process.cwd(), "packages/ui/src"),
          },
        ],
      },
      build: {
        chunkSizeWarningLimit: 1000,
        rolldownOptions: {
          output: {
            strictExecutionOrder: true,
            codeSplitting: {
              groups: [
                {
                  name: "storybook-runtime",
                  test: /node_modules\/(?:@storybook|storybook)\//,
                  minSize: 100_000,
                  maxSize: 750_000,
                  priority: 20,
                },
              ],
            },
          },
          onwarn(warning, warn) {
            if (
              warning.code === "EVAL" &&
              typeof warning.id === "string" &&
              warning.id.includes("@storybook/core")
            ) {
              return
            }

            warn(warning)
          },
        },
      },
    }),
}

export default config
