# Task 1 Report: Security, Legal, and Repository Controls

## Implementation

- Replaced the chart raw-style `dangerouslySetInnerHTML` sink with a React
  `<style>` text child. `ChartContainer` now keeps the caller-provided native
  `id` on its div while styling uses an opaque `useId`-derived `data-chart`
  scope.
- `ChartStyle` accepts only safe scope and series-key identifiers, rejects CSS
  structural/HTML tokens and unbalanced color functions, emits only valid
  light/dark declarations, and warns only outside production. Public chart
  exports remain unchanged.
- Pinned all checked-in GitHub Actions to current release-tagged full SHAs,
  disabled checkout credential persistence, set read-only contents permission
  for the canary packaging workflow, and added Dependabot GitHub Action
  updates.
- Pinned all five checked-in code-review-graph MCP clients to
  `code-review-graph==2.3.8` via portable `cwd: "."` commands.
- Added Apache-2.0 license/policy artifacts, package license metadata, a
  reproducible production dependency attribution generator and output, plus
  contracts for the repository controls.

## Files

- Chart security: `packages/ui/src/components/chart/chart.tsx` and
  `packages/ui/src/components/chart/chart.test.tsx`.
- Workflow/MCP: `.github/workflows/verify.yml`,
  `.github/workflows/release-canary.yml`, `.github/dependabot.yml`, `.mcp.json`,
  `.cursor/mcp.json`, `.kiro/settings/mcp.json`, `.qoder/mcp.json`, and
  `.vscode/mcp.json`.
- Legal/reporting: `LICENSE`, `NOTICE`, `SECURITY.md`, `.github/CODEOWNERS`,
  `SUPPORT.md`, `RELEASE.md`, `THIRD_PARTY_NOTICES.md`, and
  `scripts/generate-third-party-attributions.mjs`.
- Metadata/contracts: root/package manifests and
  `tests/contracts/repository-controls.test.ts`.

## Resolved versions

Resolved from the GitHub Releases API followed by `git ls-remote` on 2026-09-02:

- `actions/checkout` v7.0.1:
  `3d3c42e5aac5ba805825da76410c181273ba90b1`
- `pnpm/action-setup` v6.0.10:
  `ff378ebe6b225b0680b81c1ad4498ae0d1d3a5e3`
- `actions/setup-node` v7.0.0:
  `820762786026740c76f36085b0efc47a31fe5020`
- `actions/upload-artifact` v7.0.1:
  `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a`

Resolved from the PyPI JSON API: `code-review-graph` stable version 2.3.8.

## TDD evidence

### RED

1. `pnpm vitest --run packages/ui/src/components/chart/chart.test.tsx`
   after adding the hostile-input and opaque-scope cases: 2 expected failures.
   Baseline did not render the caller native id and SSR serialized three style
   openings due to hostile style breakout.
2. `pnpm vitest --run tests/contracts/repository-controls.test.ts` after
   adding contracts: 3 expected failures for absent Dependabot/legal artifacts
   and absolute/unpinned MCP configuration.
3. The production warning regression initially failed after adding the test:
   `does not warn about omitted unsafe values in production` observed 9
   warnings. The warning guard was corrected to honor `NODE_ENV=production`.

### GREEN

- `pnpm vitest --run packages/ui/src/components/chart/chart.test.tsx`: the
  original 8/8 suite passed. Review round 1 then extended it to 10/10, adding
  separate hostile native-id `ChartContainer` tests for client rendering and
  React SSR. Both assert that the caller id remains the native DOM id, the
  `data-chart` scope is opaque/safe and excludes attacker input, no injected
  marker/node exists, and SSR serializes exactly one style element. Direct
  `ChartStyle` hostile-input coverage remains intact.
- `pnpm vitest --run tests/contracts/repository-controls.test.ts`: 3/3 passed.
- `pnpm check:attributions`: passed; generated report matches the locked
  production dependency graph.

## Verification commands and results

- `pnpm format:check`: passed.
- `pnpm lint`: passed; it reports one non-fatal Turbo warning that `NODE_ENV`
  is not declared in `turbo.json` for cache tracking.
- `pnpm typecheck`: passed (2/2 tasks).
- `pnpm test:contracts`: passed (5 files, 9 tests).
- `pnpm test:components:coverage`: passed (70 files, 160 tests; 95.68%
  statements, 87.30% branches, 98.07% functions, 95.75% lines).
- `pnpm build`: passed.
- `pnpm build-storybook`: passed.
- `pnpm test:storybook`: passed (284 tests; 70 intentional skips).
- `pnpm test:env`: passed; checked 114 client bundle files.
- `pnpm verify:ci`: passed on the final rerun. Its production Playwright stage
  passed 159 tests with 60 intentional visual-test skips in 3.8 minutes.
- `git diff --check`: passed.

## Credential scans

Used Gitleaks 8.30.0 without committing scan output:

```sh
gitleaks dir <isolated-current-tree-copy> --redact --exit-code 0 --report-format json
gitleaks git . --log-opts="--all" --redact --exit-code 0 --report-format json
```

- Current tree: 0 findings.
- Reachable history: 1 finding after 57 commits / 9.22 MB. It is the generic
  API-key rule at line 44 of an older committed generated Storybook asset,
  `storybook-static/assets/entry-preview-docs-BEV6M-O4.js`. No history rewrite,
  visibility change, or raw report was made in this task.

## Self-review

- Ran code-review-graph `detect_changes_tool` and `get_affected_flows_tool`
  against baseline `688f8b8`; it reported 0 affected flows and a 0.35 review
  risk score centered on the chart boundary. The listed chart test gaps are
  type declarations, while the changed behavior is covered by focused tests.
- Reviewed the diff and all new control artifacts. No additional defect found.
- The pre-existing untracked
  `docs/superpowers/plans/2026-08-26-surfacekit-1-readiness.md` was not staged
  or modified as part of Task 1.

## Concerns

1. The reachable-history Gitleaks finding needs a separate triage decision;
   this task intentionally did not rewrite history.
2. Turbo lint warns that `NODE_ENV` is undeclared for cache-key tracking,
   though lint and the full gate pass. A follow-up may add it to `turbo.json`
   if the repository wants that warning eliminated.

## Review round 1 follow-up

### TDD evidence

- Added the client and SSR hostile native-id tests before changing production
  code. The first SSR run exposed an assertion incompatibility with a separate
  parsed document; it was corrected to assert the native attribute value
  directly.
- Mutation RED: temporarily restored the old id-derived chart scope and ran
  `pnpm vitest --run packages/ui/src/components/chart/chart.test.tsx`. It
  failed 3 tests: the existing opaque-scope test plus both new hostile native-id
  client/SSR tests. The hostile scope contained the attacker id and failed the
  safe scope pattern.
- GREEN: restored the opaque React-generated scope and reran
  `pnpm vitest --run packages/ui/src/components/chart/chart.test.tsx`: 10/10
  passed.

### Historical Gitleaks triage

Verdict: **NOT_ACTIONABLE** (high confidence).

The Gitleaks generic-api-key rule matched an unquoted 13-character minified
JavaScript assignment/property-access expression with match shape
`A.AAA,A=A.AAAAAAAAA;`, secret character classes `APAPAAAAAAAAA`, and SHA-256
`3af4a68391f556bd82af6ce0783702c4a3e668247b00eec22c41cbfa8b8f74de` after
`.key,`. It contains no quote, string, or token literal. The file was the
generated historical artifact
`storybook-static/assets/entry-preview-docs-BEV6M-O4.js`, introduced at
`5fc7d8c`, deleted at `5ea086e`, absent from the current tree, and covered by
the `storybook-static/` ignore rule.

The current-tree Gitleaks scan had 0 findings. Product surface: generated
historical artifact. Source trust/boundary: no supported security boundary was
crossed. Policy basis: root `SECURITY.md`. This counterevidence fully defeats
the credential-exposure claim, with no proof gaps material to the verdict.
No history rewrite or remediation is needed. The release visibility gate may
advance only after this committed report records the disposition.
