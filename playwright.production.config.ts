import { defineConfig } from "@playwright/test"

import baseConfig from "./playwright.config"

export default defineConfig({
  ...baseConfig,
  webServer: {
    command: "pnpm --filter web start --hostname 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
