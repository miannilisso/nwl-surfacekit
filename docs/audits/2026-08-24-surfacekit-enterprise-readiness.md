# SurfaceKit enterprise-readiness audit

Original audit: 2026-08-24, baseline `ede7b4f5de4f835023f99281ee6118950102a566`.

Refresh: 2026-09-24, reviewed implementation HEAD `0d9aca9b39e3faae89f0e8d85d751ab56ddcd793`.

Target: external React 19 applications, especially Next.js 16 and Vite 8.

Assurance: engineering evidence, not a formal security, accessibility, or legal certification.

## Decision and evidence boundary

**Not yet accepted for external production distribution.** Blocker and High
code findings from the August baseline have local implementations and focused
tests. The package is compiled and clean installed-tarball Next/Vite consumers
pass. The release delivery finding SK-H02 remains **open** because the remote
repository still lacks successful jobs, required protection, immutable-release
settings, a 1.0 tag, and a published asset with a verified digest. This is a
release stop, not a code-only closure.

The root and package versions remain `0.1.0`; the remote repository is private.
The latest `pnpm verify:ci` attempt after Task 6C passed its non-Playwright
stages, then WebKit page setup timed out on this Zorin host. A direct WebKit
`browser.newPage()` also hung under Node 22 and 24, and Playwright's WebKit
dependency dry run reported 30 missing host packages. The full current local
gate is therefore **not green**. The last complete canonical gate, before Task
6C, passed; focused Task 6C contracts passed after its final fix. Neither local
result substitutes for remote CI or a release asset.

## Current architecture and artifact

`packages/ui` owns 61 component modules and 12 enterprise pattern modules.
Each has source, colocated tests, Storybook story, typed catalog entry, and
route-local demo. `apps/web` is a Next.js 16.3.6 reference consumer of compiled
package paths; Storybook 10.6.0 uses Vite 8.3.0. The root catalog at
[`apps/web/lib/surfacekit/catalog.ts`](../../apps/web/lib/surfacekit/catalog.ts)
is the inventory authority. Root `pnpm verify:ci` runs format, lint, types,
assets, attribution and license checks, contracts, Next config, clean
consumers, component coverage, builds, Storybook interactions, environment
isolation, and production Playwright.

The package exports `globals.css`, `components/*`, `patterns`, `patterns/*`,
`hooks/*`, and `lib/*` from `dist`. The older `postcss.config` subpath is gone.
React and React DOM `^19.0.0` are peers; the repository pins both to `19.3.0`.
The build emits ESM JavaScript, declarations, source/declaration maps, and
compiled CSS. The packed root contains only `LICENSE`, `NOTICE`, `README.md`,
`USAGE.md`, and `package.json` beside `dist`.

The latest clean-consumer inventory records 606 packed files and 76 public
JavaScript specifiers: 61 component, 13 pattern including the aggregate, one
hook, and one utility. Node ESM import and strict TypeScript resolution passed
for all specifiers in both isolated consumers. Both production builds, SSR,
Button hydration, light/dark tokens, React singleton checks, and browser
console/page-error checks passed from the same local tarball. The fixture
installs have no workspace link, package source alias, or consumer Tailwind
configuration. These are representative behavior checks, not a guarantee for
every React host.

| Packed measure                    | Local result |                  Gate |      Margin |
| --------------------------------- | -----------: | --------------------: | ----------: |
| Compiled `globals.css`, gzip      | 30,697 bytes | 30,720 bytes (30 KiB) |    23 bytes |
| Peer-externalized Button JS, gzip | 13,516 bytes | 15,360 bytes (15 KiB) | 1,844 bytes |

The 23-byte CSS headroom is fragile: even a small style addition could fail
the existing contract. Vite emitted a 31,025-byte gzip CSS asset after its own
transformation; the enforced limit applies to the packed CSS bytes.

## Security, legal, PWA, mobile, and auth evidence

The chart formerly interpolated caller strings into raw style HTML. Commit
`6b818ec` replaced that sink with a text style child, opaque internal chart
scope, and bounded identifier/color handling. Commit `8bd73e8` added hostile
native-id SSR/client tests. The package keeps its public chart API. This closes
the validated SK-H01 code path locally; it is not a general XSS certification.

Apache-2.0 metadata, root/package licenses and notices, `SECURITY.md`,
`SUPPORT.md`, `RELEASE.md`, CODEOWNERS, full-SHA Action pins, and Dependabot
Action updates are committed. `THIRD_PARTY_NOTICES.md` is generated from the
locked production dependency graph. The current license policy matches 88
exact locked packages and allows only reviewed expressions (`0BSD`,
`Apache-2.0`, `BSD-3-Clause`, `ISC`, `MIT`, and `MIT AND ISC`). A fresh
2026-09-24 `pnpm audit --prod` found no known vulnerabilities;
patched-range overrides remain in `pnpm-workspace.yaml` and need review when
direct dependencies change.

The reference app alone owns supplied local Outfit, Geist, and Geist Mono
fonts. The package CSS defaults to system fonts; Storybook and the app both
load the local reference stylesheet. The app provides a root-scoped standalone
manifest starting at `/playground` and registers `/sw.js` only in production.
The worker stages versioned icon/asset caches, bounds runtime entries, uses
network-first navigation with a static offline fallback, and excludes live,
auth, and API responses. Storybook does not register that worker. The
[`pwa-service-worker` contract](../../tests/contracts/pwa-service-worker.test.ts)
and [browser PWA tests](../../tests/e2e/pwa-fonts.spec.ts) cover VM and real
Chromium cache behavior.

The app and Storybook support a 320px minimum tested viewport. Task 4's full
mobile audit rendered every then-current story at 320px, 375px, and 768px
without document overflow or non-exempt small hit targets; Task 5 reran the
expanded auth story set at those widths. Mobile shells use accessible modal
navigation and explicit horizontal scroll boundaries. Auth modules now include
controlled `PasswordInput`, `AuthForm`, and `SecurityChallenge` flows, expanded
`AuthShell` slots, and a Base UI `StepUpDialog`. They raise caller requests and
render caller state. Identity verification, credentials, sessions, throttling,
and server authorization remain host/identity-provider duties; `PermissionGate`
is presentation logic.

The old audit described a 1.16 MB Storybook iframe chunk, a 436 kB chart
chunk, and React input/key warnings. The playground/Storybook correction
removed those React warnings. A fresh 2026-09-24 Storybook 10.6.0/Vite 8.3.0
production build measured the largest JavaScript chunk at 808,798 bytes
(225.90 kB gzip in Vite's rounded report) and the chart story at 414,381
bytes. The build succeeded without a chunk-size warning under its 1,000 kB
warning limit. Storybook's config retains a targeted upstream eval-warning
exception. Task 6C's 307 Storybook interaction tests had passed earlier.

## Findings at the refreshed HEAD

| ID                                        | Severity | Current disposition                                                                                                                                                       |
| ----------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SK-B01 distributable artifact             | Blocker  | Code resolved locally in `008ac06..99c2599`: compiled exports, maps, allowlist, deterministic pack and distribution contracts. Release asset still pending.               |
| SK-B02 compiled CSS                       | Blocker  | Code resolved locally in Task 2: same `globals.css` path, no consumer Tailwind, separate app-only CSS; 30 KiB contract passes with 23-byte margin.                        |
| SK-B03 legal grant                        | Blocker  | Repository/package Apache-2.0 and attribution controls committed in `6b818ec`; exact production-license policy added in `d0da894`, with focused policy pass.              |
| SK-H01 chart injection                    | High     | Code resolved locally in `6b818ec` and `8bd73e8`; hostile input and SSR/client tests pass.                                                                                |
| SK-H02 immutable, attestable release      | High     | **Open.** Workflow code and behavior contracts exist in `d0da894..0d9aca9`; remote policy, real jobs, tag, release, and downloaded immutable asset evidence do not.       |
| SK-H03 build-time CLI in runtime graph    | High     | Code resolved locally in Task 2: Tailwind/shadcn/animation build tools are development dependencies; `pnpm audit --prod` recorded zero advisories after overrides.        |
| SK-H04 installed-tarball CI compatibility | High     | Local clean Next/Vite consumers added in `43df980..9ccb862`, using one tarball and digest checks; `verify.yml` includes the gate, but remote CI has not run successfully. |

Current executable evidence for these code dispositions is the 73/73
`pnpm test:contracts` result, including
[`package-distribution.test.ts`](../../tests/contracts/package-distribution.test.ts),
[`repository-controls.test.ts`](../../tests/contracts/repository-controls.test.ts),
[`production-license-policy.test.ts`](../../tests/contracts/production-license-policy.test.ts),
and the [release behavior contracts](../../tests/contracts/release-workflow-behavior.test.ts).
The previous full local run also passed the
[`clean consumers`](../../tests/consumers/clean-consumers.test.ts) and chart
component tests. Task 6C's focused 31/31 release/repository result followed
the last workflow fix. This documentation refresh did not rerun browser or
clean-consumer fixtures.

| ID                             | Severity    | Remaining concern                                                                                                                                                                       |
| ------------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SK-M01 ESLint compatibility    | Medium      | `eslint-plugin-react@7.37.5` still needs `@eslint/compat@2.1.1` and a narrowly scoped ESLint 10 peer allowance.                                                                         |
| SK-M02 Node matrix             | Medium      | `verify.yml` now defines Node 20.19, 22.13, and 24.0 jobs, but no successful remote jobs prove that declared range.                                                                     |
| SK-M03 accessibility assurance | Medium      | Axe, keyboard, responsive, and focus tests exist; a dated manual screen-reader, zoom/reflow, forced-colors, voice-control, reduced-motion, and RTL matrix is still absent.              |
| SK-M04 performance             | Medium      | CSS and Button gzip limits are enforced; broader per-module/per-consumer budgets are not. CSS has only 23 bytes of margin.                                                              |
| SK-M05 governance              | Medium      | Policy docs, owner, workflow, and dependency updates exist locally. Remote required checks, protection, release environment, visibility decision, and release operation are unaccepted. |
| SK-L01 visual coverage         | Low         | Thirty image baselines are Chromium-only; Firefox/WebKit behavior checks do not cover every visual state or consumer environment.                                                       |
| Local WebKit host              | Operational | The latest full gate did not finish green because WebKit page setup hangs on this host; focused tests do not replace a successful complete run.                                         |

TypeScript `6.0.3` remains below the
[typescript-eslint published `<6.1.0` support bound](https://typescript-eslint.io/users/dependency-versions/).
Vitest remains on 4 under the Node 20/Storybook 10.6
compatibility policy. These are deliberate catalog holds, not completed
upgrades. Shared versions and overrides are in [`pnpm-workspace.yaml`](../../pnpm-workspace.yaml).

## Verification chronology and remote acceptance

- The last complete canonical pre-Task-6C run passed: 233 production Playwright
  tests with 154 intentional skips, alongside clean consumers, 204 component
  tests, 307 Storybook tests, builds, contracts, and other stages. The ignored
  Task 6B report retains the captured command/result details in this worktree.
- Task 6C's attempted `pnpm verify:ci` passed format, lint, typecheck, assets,
  attribution, license policy, 55 contracts, 2 Next config tests, 3 consumer
  tests, 204 components (95.94% statements), package/web/Storybook builds,
  307 Storybook interactions, and the 119-file client environment scan. Its
  Playwright process ended after repeated WebKit setup timeouts, with 181 passed,
  4 failed, 3 interrupted, 77 skipped, and 122 not run; exit 130. The ignored
  Task 6C report retains the failure diagnosis and commands in this worktree.
- After the final Task 6C fix, the complete contract suite passed 73/73;
  focused release/repository contracts passed 31/31; format, lint, typecheck,
  Node syntax, actionlint, and `git diff --check` passed. The full browser gate
  was not repeated because the host WebKit dependency problem was isolated.
- Read-only remote checks on 2026-09-24 show repository visibility `PRIVATE`,
  historical Actions runs with `startup_failure` and zero jobs (for example
  run `32794135736`), immutable releases disabled, and no GitHub release. The
  classic branch-protection API returned HTTP 403 with an upgrade-or-public
  message. The local `surfacekit-v1.0.0` tag is absent. No real remote matrix,
  protection, protected-environment approval, artifact digest, or release
  immutability is accepted.

The checked-in release workflow is designed to fail closed on tag/version/
ancestry mismatch, missing successful main jobs, missing classic branch
protection, missing active update-and-deletion tag rules without exclusions,
or disabled immutability. A build job packs once and generates digest, SBOMs,
and attestations; a separate consumer job verifies transferred bytes; a
checkout-free protected publish job rechecks policy and tag identity before
and after publication. These behaviors are locally tested, while the actual
GitHub operation remains untested. GitHub documents [immutable release asset
behavior](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases)
and [tag rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).

## Exit criteria

Keep the package at `0.1.0` and the changelog Unreleased until the final release
preparation. Re-run the full canonical local gate on a host with functional
WebKit, obtain successful required remote Node/browser jobs on the exact
reviewed commit, configure and verify the branch/tag/environment/immutable
controls, then prepare the versioned tag. Only a published, immutable GitHub
Release with a checked tag identity, asset digest, SBOMs, attestations, and
downloaded clean-consumer verification can close SK-H02 and justify external
distribution. See [`RELEASE.md`](../../RELEASE.md) for the release policy.
