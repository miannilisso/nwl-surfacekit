import type { StorybookConfig } from "@storybook/react-vite"
import react from "@vitejs/plugin-react"
import { mergeConfig } from "vite"

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  features: {
    developmentModeForBuild: true,
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [react()],
      build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
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
