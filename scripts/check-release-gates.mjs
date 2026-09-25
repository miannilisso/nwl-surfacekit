import { appendFileSync, readFileSync } from "node:fs"
import { execFileSync, spawnSync } from "node:child_process"

const RELEASE_TAG = "surfacekit-v1.0.0"
const RELEASE_VERSION = "1.0.0"
const REQUIRED_CHECK = "verification-required"

function fail(message) {
  throw new Error(message)
}

function requiredEnvironment(name) {
  const value = process.env[name]
  if (!value) fail(`${name} is required`)
  return value
}

function command(name, args) {
  return execFileSync(name, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim()
}

function githubJson(endpoint, args = []) {
  const response = command("gh", ["api", endpoint, ...args])
  try {
    return JSON.parse(response)
  } catch {
    fail(`GitHub returned invalid JSON for ${endpoint}`)
  }
}

function checkIdentity() {
  const ref = requiredEnvironment("GITHUB_REF")
  const tag = requiredEnvironment("GITHUB_REF_NAME")
  if (ref !== `refs/tags/${RELEASE_TAG}` || tag !== RELEASE_TAG) {
    fail(`release ref must be refs/tags/${RELEASE_TAG}`)
  }

  const version = tag.slice("surfacekit-v".length)
  if (version !== RELEASE_VERSION)
    fail(`tag version must be ${RELEASE_VERSION}`)
  const manifest = JSON.parse(readFileSync("packages/ui/package.json", "utf8"))
  if (manifest.version !== version) {
    fail(`package version must be ${RELEASE_VERSION}`)
  }

  const commit = command("git", ["rev-parse", `${ref}^{commit}`])
  const head = command("git", ["rev-parse", "HEAD"])
  if (head !== commit) fail("checked-out commit does not match the release tag")
  const ancestry = spawnSync(
    "git",
    ["merge-base", "--is-ancestor", commit, "origin/main"],
    { stdio: "ignore" }
  )
  if (ancestry.status !== 0) {
    fail("tagged commit is not an ancestor of origin/main")
  }

  appendFileSync(
    requiredEnvironment("GITHUB_OUTPUT"),
    `commit=${commit}\nversion=${version}\n`
  )
}

function rulesetProtectsTag(ruleset, tagRef) {
  const includes = ruleset.conditions?.ref_name?.include ?? []
  const excludes = ruleset.conditions?.ref_name?.exclude ?? []
  const targetsTag = includes.some(
    (pattern) => pattern === "~ALL" || pattern === tagRef
  )
  const ruleTypes = new Set((ruleset.rules ?? []).map((rule) => rule.type))
  return (
    ruleset.target === "tag" &&
    ruleset.enforcement === "active" &&
    targetsTag &&
    excludes.length === 0 &&
    Array.isArray(ruleset.bypass_actors) &&
    ruleset.bypass_actors.length === 0 &&
    ruleTypes.has("update") &&
    ruleTypes.has("deletion")
  )
}

function checkPolicy() {
  requiredEnvironment("GH_TOKEN")
  const repository = requiredEnvironment("GITHUB_REPOSITORY")
  const protection = githubJson(`repos/${repository}/branches/main/protection`)
  const statusChecks = [
    ...(protection.required_status_checks?.contexts ?? []),
    ...(protection.required_status_checks?.checks ?? []).map(
      (check) => check.context
    ),
  ]
  if (!statusChecks.includes(REQUIRED_CHECK)) {
    fail(`${REQUIRED_CHECK} must be required on main`)
  }

  const immutable = githubJson(`repos/${repository}/immutable-releases`)
  if (immutable.enabled !== true) fail("immutable releases must be enabled")

  const rulesets = githubJson(
    `repos/${repository}/rulesets?targets=tag&includes_parents=true&per_page=100`
  )
  const tagRef = `refs/tags/${RELEASE_TAG}`
  const protectedTag = rulesets.some(({ id }) => {
    const ruleset = githubJson(`repos/${repository}/rulesets/${id}`)
    return rulesetProtectsTag(ruleset, tagRef)
  })
  if (!protectedTag) {
    fail("active tag update and deletion protection is required")
  }
}

function checkVerification() {
  requiredEnvironment("GH_TOKEN")
  const repository = requiredEnvironment("GITHUB_REPOSITORY")
  const tagCommit = requiredEnvironment("TAG_COMMIT")
  const runs = githubJson(
    `repos/${repository}/actions/workflows/verify.yml/runs`,
    [
      "--method",
      "GET",
      "-f",
      `head_sha=${tagCommit}`,
      "-f",
      "branch=main",
      "-f",
      "event=push",
      "-f",
      "per_page=100",
    ]
  )
  const candidates = (runs.workflow_runs ?? [])
    .filter(
      (run) =>
        run.head_sha === tagCommit &&
        run.head_branch === "main" &&
        run.event === "push"
    )
    .sort((left, right) => left.created_at.localeCompare(right.created_at))
  const run = candidates.at(-1)
  if (!run) fail("main push verification workflow run is missing")
  if (run.status !== "completed" || run.conclusion !== "success") {
    fail("latest main push verification workflow did not succeed")
  }

  const jobs = githubJson(`repos/${repository}/actions/runs/${run.id}/jobs`, [
    "--method",
    "GET",
    "-f",
    "per_page=100",
  ])
  const requiredJob = (jobs.jobs ?? []).find(
    (job) => job.name === REQUIRED_CHECK
  )
  if (!requiredJob) fail(`${REQUIRED_CHECK} job is missing`)
  if (
    requiredJob.status !== "completed" ||
    requiredJob.conclusion !== "success"
  ) {
    fail(`${REQUIRED_CHECK} job did not complete successfully`)
  }
}

try {
  const mode = process.argv[2]
  if (mode === "identity") checkIdentity()
  else if (mode === "policy") checkPolicy()
  else if (mode === "verification") checkVerification()
  else fail("usage: check-release-gates.mjs <identity|policy|verification>")
} catch (error) {
  console.error(`Release gate failed: ${error.message}`)
  process.exitCode = 1
}
