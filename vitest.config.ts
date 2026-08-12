import { readdirSync } from "node:fs"
import path from "node:path"
import { defineConfig } from "vitest/config"

const surfaceFileThresholds = Object.fromEntries(
  readdirSync("packages/ui/src", { recursive: true })
    .filter(
      (file): file is string =>
        typeof file === "string" &&
        /^(components|patterns)\/.*\.tsx$/.test(file) &&
        !file.endsWith(".test.tsx")
    )
    .map((file) => [
      `packages/ui/src/${file}`,
      {
        statements: 75,
        lines: 75,
        functions: 75,
        branches: 70,
      },
    ])
)

export default defineConfig({
  resolve: {
    alias: {
      "@nwl/surfacekit": path.resolve(process.cwd(), "packages/ui/src"),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      include: [
        "packages/ui/src/components/**/*.tsx",
        "packages/ui/src/patterns/**/*.tsx",
      ],
      exclude: ["**/*.test.tsx", "**/index.ts", "packages/ui/src/test/**"],
      reporter: ["text", "json-summary", "html"],
      reportsDirectory: "coverage/surfacekit",
      reportOnFailure: true,
      thresholds: {
        statements: 90,
        lines: 90,
        functions: 90,
        branches: 85,
        ...surfaceFileThresholds,
      },
    },
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "tests/e2e/**",
    ],
  },
})
