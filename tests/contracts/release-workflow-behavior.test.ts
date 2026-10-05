import { execFile } from "node:child_process"
import { createHash } from "node:crypto"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { promisify } from "node:util"

import { expect, it } from "vitest"

const execFileAsync = promisify(execFile)
const workspaceRoot = process.cwd()
const releaseGate = path.join(workspaceRoot, "scripts/check-release-gates.mjs")
const repository = "nanewarelabs/nwl-surfacekit"
const tag = "surfacekit-v1.0.0"
const commit = "a".repeat(40)
const movedCommit = "b".repeat(40)
const tarball = "nwl-surfacekit-1.0.0.tgz"
const tarballContents = "the packed package bytes"
const tarballDigest = createHash("sha256").update(tarballContents).digest("hex")

type CommandResult =
  | { ok: true; stderr: string; stdout: string }
  | { ok: false; stderr: string; stdout: string }

type MockConfig = {
  ancestor?: boolean
  commit?: string
  head?: string
  immutable?: { enabled: boolean }
  jobs?: { jobs: Array<Record<string, unknown>> }
  liveTagCommits?: string[]
  protection?: Record<string, unknown>
  rulesetDetails?: Record<string, Record<string, unknown>>
  rulesets?: Array<{ id: number }>
  runs?: { workflow_runs: Array<Record<string, unknown>> }
  sameNamedBranchCommit?: string
}

const protectedTagRuleset = {
  id: 7,
  target: "tag",
  enforcement: "active",
  bypass_actors: [],
  conditions: {
    ref_name: {
      include: [`refs/tags/${tag}`],
      exclude: [],
    },
  },
  rules: [{ type: "update" }, { type: "deletion" }],
}

const protectedMain = {
  required_status_checks: {
    contexts: ["verification-required"],
    checks: [],
  },
  required_pull_request_reviews: {
    dismiss_stale_reviews: true,
    required_approving_review_count: 1,
  },
  required_conversation_resolution: { enabled: true },
  enforce_admins: { enabled: true },
  required_linear_history: { enabled: true },
  allow_force_pushes: { enabled: false },
  allow_deletions: { enabled: false },
}

function completeConfig(): MockConfig {
  return {
    ancestor: true,
    commit,
    head: commit,
    immutable: { enabled: true },
    jobs: {
      jobs: [
        {
          name: "verification-required",
          status: "completed",
          conclusion: "success",
        },
      ],
    },
    liveTagCommits: [commit],
    protection: protectedMain,
    rulesetDetails: { "7": protectedTagRuleset },
    rulesets: [{ id: 7 }],
    runs: {
      workflow_runs: [
        {
          id: 41,
          head_sha: commit,
          head_branch: "main",
          event: "push",
          created_at: "2026-09-24T10:00:00Z",
          status: "completed",
          conclusion: "success",
        },
      ],
    },
  }
}

async function workflowRun(workflowPath: string, stepName: string) {
  const lines = (await readFile(workflowPath, "utf8")).split("\n")
  const step = lines.findIndex((line) => line.trim() === `- name: ${stepName}`)
  expect(step, `Missing workflow step: ${stepName}`).toBeGreaterThan(-1)
  const run = lines.findIndex(
    (line, index) => index > step && line.trimStart().startsWith("run:")
  )
  expect(run, `Missing run script: ${stepName}`).toBeGreaterThan(step)
  const value = lines[run].trimStart().slice("run:".length).trim()
  if (value !== "|") return value

  const indentation = lines[run].length - lines[run].trimStart().length + 2
  const script: string[] = []
  for (const line of lines.slice(run + 1)) {
    if (line.trim() && line.length - line.trimStart().length < indentation)
      break
    script.push(line.slice(indentation))
  }
  return script.join("\n")
}

async function execute(
  file: string,
  args: string[],
  options: { cwd: string; env: NodeJS.ProcessEnv }
): Promise<CommandResult> {
  try {
    const result = await execFileAsync(file, args, options)
    return { ok: true, ...result }
  } catch (error) {
    const result = error as Error & { stderr?: string; stdout?: string }
    return {
      ok: false,
      stderr: result.stderr ?? result.message,
      stdout: result.stdout ?? "",
    }
  }
}

async function withMockCommands(
  overrides: MockConfig,
  run: (context: {
    env: NodeJS.ProcessEnv
    readLog: () => Promise<string>
    root: string
  }) => Promise<void>,
  packageVersion = "1.0.0"
) {
  const root = await mkdtemp(path.join(tmpdir(), "surfacekit-release-gates-"))
  const log = path.join(root, "commands.log")
  const output = path.join(root, "github-output")
  const config = { ...completeConfig(), ...overrides }
  try {
    await mkdir(path.join(root, "packages/ui"), { recursive: true })
    await mkdir(path.join(root, "release"), { recursive: true })
    await writeFile(
      path.join(root, "packages/ui/package.json"),
      JSON.stringify({ name: "@nwl/surfacekit", version: packageVersion })
    )
    await writeFile(path.join(root, "release", tarball), tarballContents)
    await Promise.all(
      [
        "sbom.spdx.json",
        "sbom.cdx.json",
        "provenance.bundle.json",
        "sbom-attestation.bundle.json",
        "CHANGELOG.md",
      ].map((name) => writeFile(path.join(root, "release", name), name))
    )
    await writeFile(
      path.join(root, "release/SHA256SUMS"),
      `${tarballDigest}  ${tarball}\n`
    )
    await writeFile(
      path.join(root, "git"),
      `#!/usr/bin/env node
const { appendFileSync } = require("node:fs")
const args = process.argv.slice(2)
const data = JSON.parse(process.env.MOCK_RELEASE_CONFIG)
appendFileSync(process.env.MOCK_COMMAND_LOG, \`git \${args.join(" ")}\\n\`)
if (args[0] === "rev-parse") {
  console.log(args[1] === "HEAD" ? data.head : data.commit)
  process.exit(0)
}
if (args[0] === "merge-base") process.exit(data.ancestor ? 0 : 1)
process.exit(2)
`,
      { mode: 0o755 }
    )
    await writeFile(
      path.join(root, "gh"),
      `#!/usr/bin/env node
const { appendFileSync, copyFileSync, mkdirSync, readFileSync } = require("node:fs")
const path = require("node:path")
const args = process.argv.slice(2)
const data = JSON.parse(process.env.MOCK_RELEASE_CONFIG)
const command = \`gh \${args.join(" ")}\`
appendFileSync(process.env.MOCK_COMMAND_LOG, command + "\\n")
const log = readFileSync(process.env.MOCK_COMMAND_LOG, "utf8")
const endpoint = args[0] === "api" ? args[1] : ""
const jqIndex = args.indexOf("--jq")
const jq = jqIndex >= 0 ? args[jqIndex + 1] : ""
if (endpoint.endsWith("branches/main/protection")) console.log(JSON.stringify(data.protection))
else if (endpoint.endsWith("immutable-releases")) console.log(jq === ".enabled" ? String(data.immutable.enabled) : JSON.stringify(data.immutable))
else if (endpoint.includes("/rulesets?")) console.log(JSON.stringify(data.rulesets))
else if (/\\/rulesets\\/\\d+$/.test(endpoint)) console.log(JSON.stringify(data.rulesetDetails[endpoint.split("/").at(-1)]))
else if (endpoint.includes("actions/workflows/verify.yml/runs")) console.log(JSON.stringify(data.runs))
else if (/actions\\/runs\\/\\d+\\/jobs/.test(endpoint)) console.log(JSON.stringify(data.jobs))
else if (endpoint.includes("/commits/")) {
  const explicitTag = endpoint.endsWith(\`/commits/tags%2F\${process.env.TAG}\`)
  const request = explicitTag ? \`/commits/tags%2F\${process.env.TAG}\` : \`/commits/\${process.env.TAG}\`
  const count = log.split("\\n").filter((line) => line.startsWith("gh api ") && line.includes(request)).length
  const commits = explicitTag || !data.sameNamedBranchCommit ? data.liveTagCommits : [data.sameNamedBranchCommit]
  const sha = commits[Math.min(count - 1, commits.length - 1)]
  console.log(jq === ".sha" ? sha : JSON.stringify({ sha }))
}
else if (endpoint.includes("/releases/tags/")) {
  const published = log.includes("gh release edit ")
  const release = {
    tag_name: process.env.TAG,
    draft: !published,
    immutable: published,
    assets: [
      { name: process.env.MOCK_TARBALL, digest: \`sha256:\${process.env.MOCK_TARBALL_DIGEST}\`, state: "uploaded" },
      ...["SHA256SUMS", "sbom.spdx.json", "sbom.cdx.json", "provenance.bundle.json", "sbom-attestation.bundle.json", "CHANGELOG.md"].map((name) => ({ name, state: "uploaded" })),
    ],
  }
  if (jq === ".immutable") console.log(String(release.immutable))
  else console.log(JSON.stringify(release))
}
else if (args[0] === "release" && args[1] === "view") process.exit(1)
else if (args[0] === "release" && (args[1] === "create" || args[1] === "edit")) process.exit(0)
else if (args[0] === "release" && args[1] === "download") {
  const pattern = args[args.indexOf("--pattern") + 1]
  const directory = args[args.indexOf("--dir") + 1]
  mkdirSync(directory, { recursive: true })
  copyFileSync(path.join("release", pattern), path.join(directory, pattern))
}
else process.exit(2)
`,
      { mode: 0o755 }
    )

    const env = {
      ...process.env,
      PATH: `${root}${path.delimiter}${process.env.PATH}`,
      GH_TOKEN: "test-token",
      GITHUB_OUTPUT: output,
      GITHUB_REF: `refs/tags/${tag}`,
      GITHUB_REF_NAME: tag,
      GITHUB_REPOSITORY: repository,
      MOCK_COMMAND_LOG: log,
      MOCK_RELEASE_CONFIG: JSON.stringify(config),
      MOCK_TARBALL: tarball,
      MOCK_TARBALL_DIGEST: tarballDigest,
      TAG: tag,
      TAG_COMMIT: commit,
    }
    await run({
      env,
      readLog: async () => readFile(log, "utf8").catch(() => ""),
      root,
    })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

it("accepts matching identity, protected policy, and successful required verification", async () => {
  await withMockCommands({}, async ({ env, root }) => {
    for (const mode of ["identity", "policy", "verification"]) {
      const result = await execute("node", [releaseGate, mode], {
        cwd: root,
        env,
      })
      expect(result, `${mode}: ${result.stderr}`).toMatchObject({ ok: true })
    }
  })
})

it("rejects a package version that does not match the release tag", async () => {
  await withMockCommands(
    {},
    async ({ env, root }) => {
      const result = await execute("node", [releaseGate, "identity"], {
        cwd: root,
        env,
      })
      expect(result).toMatchObject({ ok: false })
      expect(result.stderr).toContain("package version must be 1.0.0")
    },
    "0.1.0"
  )
})

it("rejects a tagged commit that is not an ancestor of origin/main", async () => {
  await withMockCommands({ ancestor: false }, async ({ env, root }) => {
    const result = await execute("node", [releaseGate, "identity"], {
      cwd: root,
      env,
    })
    expect(result).toMatchObject({ ok: false })
    expect(result.stderr).toContain(
      "tagged commit is not an ancestor of origin/main"
    )
  })
})

it("rejects mutable release policy", async () => {
  await withMockCommands(
    { immutable: { enabled: false } },
    async ({ env, root }) => {
      const result = await execute("node", [releaseGate, "policy"], {
        cwd: root,
        env,
      })
      expect(result).toMatchObject({ ok: false })
      expect(result.stderr).toContain("immutable releases must be enabled")
    }
  )
})

it.each([
  [
    "pull request reviews",
    { ...protectedMain, required_pull_request_reviews: undefined },
  ],
  [
    "one approval",
    {
      ...protectedMain,
      required_pull_request_reviews: {
        ...protectedMain.required_pull_request_reviews,
        required_approving_review_count: 0,
      },
    },
  ],
  [
    "an integer approval count",
    {
      ...protectedMain,
      required_pull_request_reviews: {
        ...protectedMain.required_pull_request_reviews,
        required_approving_review_count: 1.5,
      },
    },
  ],
  [
    "review bypass prohibition",
    {
      ...protectedMain,
      required_pull_request_reviews: {
        ...protectedMain.required_pull_request_reviews,
        bypass_pull_request_allowances: {
          users: [{ login: "release-admin" }],
          teams: [],
          apps: [],
        },
      },
    },
  ],
  [
    "stale approval dismissal",
    {
      ...protectedMain,
      required_pull_request_reviews: {
        ...protectedMain.required_pull_request_reviews,
        dismiss_stale_reviews: false,
      },
    },
  ],
  [
    "conversation resolution",
    { ...protectedMain, required_conversation_resolution: { enabled: false } },
  ],
  ["administrator enforcement", { ...protectedMain, enforce_admins: null }],
  [
    "linear history",
    { ...protectedMain, required_linear_history: { enabled: false } },
  ],
  [
    "force-push prohibition",
    { ...protectedMain, allow_force_pushes: { enabled: true } },
  ],
  [
    "deletion prohibition",
    { ...protectedMain, allow_deletions: { enabled: true } },
  ],
] as const)("rejects main protection without %s", async (_, protection) => {
  const recheck = await workflowRun(
    ".github/workflows/release.yml",
    "Recheck immutable release and tag protection"
  )
  await withMockCommands({ protection }, async ({ env, root }) => {
    for (const [program, args] of [
      ["node", [releaseGate, "policy"]],
      ["bash", ["-c", recheck]],
    ] as const) {
      const result = await execute(program, [...args], { cwd: root, env })
      expect(result, `${program}: ${result.stderr}`).toMatchObject({
        ok: false,
      })
      if (program === "node") {
        expect(result.stderr).toContain(
          "required main protection is incomplete"
        )
      }
    }
  })
})

it("rejects tag protection that allows update or deletion", async () => {
  await withMockCommands(
    {
      rulesetDetails: {
        "7": {
          ...protectedTagRuleset,
          rules: [{ type: "update" }],
        },
      },
    },
    async ({ env, root }) => {
      const result = await execute("node", [releaseGate, "policy"], {
        cwd: root,
        env,
      })
      expect(result).toMatchObject({ ok: false })
      expect(result.stderr).toContain(
        "active tag update and deletion protection is required"
      )
    }
  )
})

it("rejects an exact exclusion from an otherwise qualifying tag ruleset", async () => {
  await withMockCommands(
    {
      rulesetDetails: {
        "7": {
          ...protectedTagRuleset,
          conditions: {
            ref_name: {
              include: ["~ALL"],
              exclude: [`refs/tags/${tag}`],
            },
          },
        },
      },
    },
    async ({ env, root }) => {
      const result = await execute("node", [releaseGate, "policy"], {
        cwd: root,
        env,
      })
      expect(result).toMatchObject({ ok: false })
      expect(result.stderr).toContain(
        "active tag update and deletion protection is required"
      )
    }
  )
})

it("rejects wildcard exclusions without approximating GitHub fnmatch", async () => {
  await withMockCommands(
    {
      rulesetDetails: {
        "7": {
          ...protectedTagRuleset,
          conditions: {
            ref_name: {
              include: ["~ALL"],
              exclude: ["refs/tags/surfacekit-v*"],
            },
          },
        },
      },
    },
    async ({ env, root }) => {
      const result = await execute("node", [releaseGate, "policy"], {
        cwd: root,
        env,
      })
      expect(result).toMatchObject({ ok: false })
      expect(result.stderr).toContain(
        "active tag update and deletion protection is required"
      )
    }
  )
})

it.each([
  ["missing", undefined],
  ["null", null],
  ["object", { actor_type: "Team" }],
  ["string", "none"],
  ["number", 0],
  ["boolean", false],
  ["team", [{ actor_type: "Team", bypass_mode: "always" }]],
  ["app", [{ actor_type: "Integration", bypass_mode: "pull_request" }]],
  ["role", [{ actor_type: "RepositoryRole", bypass_mode: "always" }]],
  ["admin", [{ actor_type: "OrganizationAdmin", bypass_mode: "pull_request" }]],
  ["unknown mode", [{ actor_type: "Team", bypass_mode: "future" }]],
  ["unknown actor", [{ actor_type: "FutureActor", bypass_mode: "always" }]],
  [
    "unknown actor and mode",
    [{ actor_type: "FutureActor", bypass_mode: "future" }],
  ],
] as const)(
  "rejects %s immutable-tag bypass actors at both release gates",
  async (_, bypassActors) => {
    const recheck = await workflowRun(
      ".github/workflows/release.yml",
      "Recheck immutable release and tag protection"
    )
    await withMockCommands(
      {
        rulesetDetails: {
          "7": { ...protectedTagRuleset, bypass_actors: bypassActors },
        },
      },
      async ({ env, root }) => {
        for (const [program, args] of [
          ["node", [releaseGate, "policy"]],
          ["bash", ["-c", recheck]],
        ] as const) {
          const result = await execute(program, [...args], { cwd: root, env })
          expect(result, `${program}: ${result.stderr}`).toMatchObject({
            ok: false,
          })
        }
      }
    )
  }
)

it("accepts a separate creation ruleset with bypass and an immutable update/delete ruleset without bypass", async () => {
  const recheck = await workflowRun(
    ".github/workflows/release.yml",
    "Recheck immutable release and tag protection"
  )
  await withMockCommands(
    {
      rulesets: [{ id: 7 }, { id: 8 }],
      rulesetDetails: {
        "7": {
          ...protectedTagRuleset,
          bypass_actors: [{ actor_type: "Team", bypass_mode: "always" }],
          rules: [{ type: "creation" }],
        },
        "8": { ...protectedTagRuleset, id: 8 },
      },
    },
    async ({ env, root }) => {
      const policy = await execute("node", [releaseGate, "policy"], {
        cwd: root,
        env,
      })
      expect(policy, policy.stderr).toMatchObject({ ok: true })
      const publish = await execute("bash", ["-c", recheck], { cwd: root, env })
      expect(publish, publish.stderr).toMatchObject({ ok: true })
    }
  )
})

it("rejects a failed latest main-push verification run", async () => {
  await withMockCommands(
    {
      runs: {
        workflow_runs: [
          {
            id: 41,
            head_sha: commit,
            head_branch: "main",
            event: "push",
            created_at: "2026-09-24T10:00:00Z",
            status: "completed",
            conclusion: "success",
          },
          {
            id: 42,
            head_sha: commit,
            head_branch: "main",
            event: "push",
            created_at: "2026-09-24T11:00:00Z",
            status: "completed",
            conclusion: "failure",
          },
        ],
      },
    },
    async ({ env, root }) => {
      const result = await execute("node", [releaseGate, "verification"], {
        cwd: root,
        env,
      })
      expect(result).toMatchObject({ ok: false })
      expect(result.stderr).toContain(
        "latest main push verification workflow did not succeed"
      )
    }
  )
})

it("rejects a missing required verification job", async () => {
  await withMockCommands({ jobs: { jobs: [] } }, async ({ env, root }) => {
    const result = await execute("node", [releaseGate, "verification"], {
      cwd: root,
      env,
    })
    expect(result).toMatchObject({ ok: false })
    expect(result.stderr).toContain("verification-required job is missing")
  })
})

it("rejects an unsuccessful required verification job", async () => {
  await withMockCommands(
    {
      jobs: {
        jobs: [
          {
            name: "verification-required",
            status: "completed",
            conclusion: "failure",
          },
        ],
      },
    },
    async ({ env, root }) => {
      const result = await execute("node", [releaseGate, "verification"], {
        cwd: root,
        env,
      })
      expect(result).toMatchObject({ ok: false })
      expect(result.stderr).toContain(
        "verification-required job did not complete successfully"
      )
    }
  )
})

it("fails the required aggregator when any prerequisite job failed", async () => {
  const script = await workflowRun(
    ".github/workflows/verify.yml",
    "Require all supported versions"
  )
  const result = await execute("bash", ["-c", script], {
    cwd: workspaceRoot,
    env: { ...process.env, PRIMARY: "success", SUPPORTED: "failure" },
  })
  expect(result).toMatchObject({ ok: false })
})

it("rechecks immutable policy after the protected environment wait", async () => {
  const script = await workflowRun(
    ".github/workflows/release.yml",
    "Recheck immutable release and tag protection"
  )
  await withMockCommands(
    { immutable: { enabled: false } },
    async ({ env, root }) => {
      const result = await execute("bash", ["-c", script], { cwd: root, env })
      expect(result).toMatchObject({ ok: false })
    }
  )
})

it("rechecks wildcard exclusions after the environment wait", async () => {
  const script = await workflowRun(
    ".github/workflows/release.yml",
    "Recheck immutable release and tag protection"
  )
  await withMockCommands(
    {
      rulesetDetails: {
        "7": {
          ...protectedTagRuleset,
          conditions: {
            ref_name: {
              include: ["~ALL"],
              exclude: ["refs/tags/surfacekit-v*"],
            },
          },
        },
      },
    },
    async ({ env, root }) => {
      const result = await execute("bash", ["-c", script], { cwd: root, env })
      expect(result).toMatchObject({ ok: false })
    }
  )
})

it("resolves an explicit tag ref when a branch has the same name", async () => {
  const script = await workflowRun(
    ".github/workflows/release.yml",
    "Create a draft with every verified asset"
  )
  await withMockCommands(
    { liveTagCommits: [commit], sameNamedBranchCommit: movedCommit },
    async ({ env, readLog, root }) => {
      const result = await execute("bash", ["-c", script], { cwd: root, env })
      expect(result, result.stderr).toMatchObject({ ok: true })
      expect(await readLog()).toContain(
        `gh api repos/${repository}/commits/tags%2F${tag} --jq .sha`
      )
    }
  )
})

it("does not create a draft after the remote tag moves", async () => {
  const script = await workflowRun(
    ".github/workflows/release.yml",
    "Create a draft with every verified asset"
  )
  await withMockCommands(
    { liveTagCommits: [movedCommit] },
    async ({ env, readLog, root }) => {
      const result = await execute("bash", ["-c", script], { cwd: root, env })
      expect(result).toMatchObject({ ok: false })
      expect(result.stderr).toContain("remote tag moved before draft creation")
      expect(await readLog()).not.toContain("gh release create")
    }
  )
})

it("does not publish a draft after the remote tag moves", async () => {
  const script = await workflowRun(
    ".github/workflows/release.yml",
    "Publish and verify the downloaded immutable asset"
  )
  await withMockCommands(
    { liveTagCommits: [movedCommit] },
    async ({ env, readLog, root }) => {
      const result = await execute("bash", ["-c", script], { cwd: root, env })
      expect(result).toMatchObject({ ok: false })
      expect(result.stderr).toContain("remote tag moved before publication")
      expect(await readLog()).not.toContain("gh release edit")
    }
  )
})

it("rejects a released tag that moved during publication", async () => {
  const script = await workflowRun(
    ".github/workflows/release.yml",
    "Publish and verify the downloaded immutable asset"
  )
  await withMockCommands(
    { liveTagCommits: [commit, movedCommit] },
    async ({ env, readLog, root }) => {
      const result = await execute("bash", ["-c", script], { cwd: root, env })
      expect(result).toMatchObject({ ok: false })
      expect(result.stderr).toContain("released tag identity changed")
      expect(await readLog()).toContain(`gh release edit ${tag} --draft=false`)
    }
  )
})

it("checks the live tag immediately around ordered draft and publication actions", async () => {
  const createDraft = await workflowRun(
    ".github/workflows/release.yml",
    "Create a draft with every verified asset"
  )
  const publish = await workflowRun(
    ".github/workflows/release.yml",
    "Publish and verify the downloaded immutable asset"
  )
  await withMockCommands(
    { liveTagCommits: [commit, commit, commit] },
    async ({ env, readLog, root }) => {
      const draftResult = await execute("bash", ["-c", createDraft], {
        cwd: root,
        env,
      })
      expect(draftResult, draftResult.stderr).toMatchObject({ ok: true })
      const publishResult = await execute("bash", ["-c", publish], {
        cwd: root,
        env,
      })
      expect(publishResult, publishResult.stderr).toMatchObject({ ok: true })

      const commands = (await readLog()).trim().split("\n")
      const tagChecks = commands
        .map((command, index) => ({ command, index }))
        .filter(({ command }) => command.includes(`/commits/tags%2F${tag}`))
        .map(({ index }) => index)
      const create = commands.findIndex((command) =>
        command.startsWith(`gh release create ${tag}`)
      )
      const publishDraft = commands.findIndex((command) =>
        command.startsWith(`gh release edit ${tag}`)
      )
      expect(tagChecks).toHaveLength(3)
      expect(tagChecks[0]).toBeLessThan(create)
      expect(tagChecks[1]).toBeLessThan(publishDraft)
      expect(tagChecks[2]).toBeGreaterThan(publishDraft)
    }
  )
})
