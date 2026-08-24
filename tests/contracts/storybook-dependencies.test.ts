import { access, readFile } from "node:fs/promises"
import path from "node:path"
import { describe, expect, it } from "vitest"

const repositoryRoot = process.cwd()

describe("Storybook dependency policy", () => {
  it("uses the current stable Storybook family and browser-mode test addon", async () => {
    const packageJson = JSON.parse(
      await readFile(path.join(repositoryRoot, "package.json"), "utf8")
    ) as {
      engines: Record<string, string>
      scripts: Record<string, string>
      devDependencies: Record<string, string>
    }
    const workspace = await readFile(
      path.join(repositoryRoot, "pnpm-workspace.yaml"),
      "utf8"
    )
    const mainConfig = await readFile(
      path.join(repositoryRoot, "apps/web/.storybook/main.ts"),
      "utf8"
    )

    for (const dependency of [
      "storybook",
      "@storybook/addon-a11y",
      "@storybook/addon-vitest",
      "@storybook/react-vite",
    ]) {
      expect(packageJson.devDependencies[dependency]).toBe("catalog:")
      expect(workspace).toContain(`"${dependency}": "10.5.10"`)
    }

    for (const removedDependency of [
      "@storybook/addon-essentials",
      "@storybook/react",
      "@storybook/test",
      "@storybook/test-runner",
    ]) {
      expect(packageJson.devDependencies).not.toHaveProperty(removedDependency)
    }

    expect(mainConfig).toContain('"@storybook/addon-vitest"')
    expect(packageJson.engines.node).toBe("^20.19.0 || ^22.13.0 || >=24.0.0")
    expect(packageJson.scripts["test:storybook"]).toBe(
      "vitest --config vitest.storybook.config.ts --run"
    )
    await expect(
      access(path.join(repositoryRoot, "apps/web/.storybook/test-runner.ts"))
    ).rejects.toThrow()
  })
})
