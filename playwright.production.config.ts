import { defineConfig } from "@playwright/test"

import baseConfig from "./playwright.config"

export default defineConfig({
  ...baseConfig,
  webServer: [
    {
      command: "pnpm --filter web start --hostname 127.0.0.1 --port 3000",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command:
        "node apps/web/scripts/serve-static.mjs storybook-static 6006 127.0.0.1",
      url: "http://127.0.0.1:6006",
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
})
