import type { StorybookConfig } from "@storybook/react-vite"
import tailwindcss from "@tailwindcss/postcss"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"
import { mergeConfig } from "vite"

import { dedupeSurfaceKitCss } from "../postcss/dedupe-surfacekit-css.mjs"

const packageCssPath = fileURLToPath(
  new URL("../../../packages/ui/dist/globals.css", import.meta.url)
)
const referenceCssPath = fileURLToPath(
  new URL("../app/reference-app.css", import.meta.url)
)

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
      css: {
        postcss: {
          plugins: [
            tailwindcss(),
            dedupeSurfaceKitCss({ packageCssPath, referenceCssPath }),
          ],
        },
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
