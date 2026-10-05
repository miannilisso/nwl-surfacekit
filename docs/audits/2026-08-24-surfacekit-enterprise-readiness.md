# SurfaceKit enterprise-readiness audit

Original audit: 2026-08-24, baseline `ede7b4f5de4f835023f99281ee6118950102a566`.

Refresh: 2026-10-05, reviewed release candidate based on `1c712707f0060a4ba89f2095628e1c14d4a4c838` plus the dependency and security corrections described below.

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
On 2026-10-05 every non-browser stage in the canonical gate passed on the
refreshed dependency graph. A production Chromium/Firefox run then passed 184
tests with 77 intentional project-scoped skips. One Chromium visual assertion
needed its configured retry after a screenshot-stabilization timeout; the
unchanged baseline passed on retry and in three concurrent retry-disabled
repetitions. WebKit page setup still hangs on this unsupported Zorin host,
whose Playwright dependency dry run reports 30 missing host packages. Remote
Ubuntu CI must therefore supply the complete three-engine acceptance evidence.
Neither local result substitutes for remote CI or a release asset.

## Current architecture and artifact

`packages/ui` owns 61 component modules and 12 enterprise pattern modules.
Each has source, colocated tests, Storybook story, typed catalog entry, and
route-local demo. `apps/web` is a Next.js 16.3.8 reference consumer of compiled
package paths; Storybook 10.6.1 uses Vite 8.3.2. The root catalog at
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
| Compiled `globals.css`, gzip      | 30,626 bytes | 30,720 bytes (30 KiB) |    94 bytes |
| Peer-externalized Button JS, gzip | 13,516 bytes | 15,360 bytes (15 KiB) | 1,844 bytes |

The 94-byte CSS headroom is fragile: even a small style addition could fail
the existing contract. The enforced limit applies to the packed CSS bytes;
consumer-build output is also exercised by the clean Vite fixture.

## Security, legal, PWA, mobile, and auth evidence

The chart formerly interpolated caller strings into raw style HTML. Commit
`6b818ec` replaced that sink with a text style child, opaque internal chart
scope, and bounded identifier/color handling. Commit `8bd73e8` added hostile
native-id SSR/client tests. The final security scan additionally proved that a
nested `url()` inside an otherwise supported color function could still drive
an SVG `fill`/`stroke` request. The shared validator now rejects `url()` at any
nesting depth, with SSR and browser-shaped regression coverage for direct and
themed values. The package keeps its public chart API. This closes the
validated SK-H01 paths locally; it is not a general XSS certification.

Apache-2.0 metadata, root/package licenses and notices, `SECURITY.md`,
`SUPPORT.md`, `RELEASE.md`, CODEOWNERS, full-SHA Action pins, and Dependabot
Action updates are committed. `THIRD_PARTY_NOTICES.md` is generated from the
locked production dependency graph. The current license policy matches 88
exact locked packages and allows only reviewed expressions (`0BSD`,
`Apache-2.0`, `BSD-3-Clause`, `ISC`, `MIT`, and `MIT AND ISC`). A fresh
2026-10-05 `pnpm audit --prod` found no known vulnerabilities. Gitleaks 8.30.0
reported zero findings in the current archived tree. Its complete-history scan
reported one `generic-api-key` match in a deleted minified Storybook asset;
direct inspection showed JavaScript property access rather than a credential,
so no history rewrite is required. A sealed standard Codex Security scan of
`1c712707` found two medium/high-confidence issues: the nested chart URL above
and an incomplete branch-protection preflight. Both have test-first local
corrections; the latter now requires pull requests, one approval, no review
bypass allowances, stale-review dismissal, resolved conversations,
administrator enforcement, linear history, and disabled force pushes and
deletions both before and after the release environment. The
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
removed those React warnings. A fresh 2026-10-05 Storybook 10.6.1/Vite 8.3.2
production build measured the largest JavaScript chunk at 808,798 bytes
(225.90 kB gzip in Vite's rounded report) and the chart story at 414,381
bytes. The build succeeded without a chunk-size warning under its 1,000 kB
warning limit. Storybook's config retains a targeted upstream eval-warning
exception. The current 307 Storybook interaction tests pass.

## Findings at the refreshed HEAD

| ID                                        | Severity | Current disposition                                                                                                                                                                          |
| ----------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SK-B01 distributable artifact             | Blocker  | Code resolved locally in `008ac06..99c2599`: compiled exports, maps, allowlist, deterministic pack and distribution contracts. Release asset still pending.                                  |
| SK-B02 compiled CSS                       | Blocker  | Code resolved locally in Task 2: same `globals.css` path, no consumer Tailwind, separate app-only CSS; 30 KiB contract passes with 94-byte margin.                                           |
| SK-B03 legal grant                        | Blocker  | Repository/package Apache-2.0 and attribution controls committed in `6b818ec`; exact production-license policy added in `d0da894`, with focused policy pass.                                 |
| SK-H01 chart injection                    | High     | Code resolved locally in `6b818ec`, `8bd73e8`, and the 2026-10-05 nested-URL correction; hostile input and SSR/client tests pass.                                                            |
| SK-H02 immutable, attestable release      | High     | **Open.** Workflow and behavior contracts exist, including complete main-protection pre/post checks; remote policy, real jobs, tag, release, and downloaded immutable asset evidence do not. |
| SK-H03 build-time CLI in runtime graph    | High     | Code resolved locally in Task 2: Tailwind/shadcn/animation build tools are development dependencies; `pnpm audit --prod` recorded zero advisories after overrides.                           |
| SK-H04 installed-tarball CI compatibility | High     | Local clean Next/Vite consumers added in `43df980..9ccb862`, using one tarball and digest checks; `verify.yml` includes the gate, but remote CI has not run successfully.                    |

Current executable evidence for these code dispositions is the 100/100
`pnpm test:contracts` result, including
[`package-distribution.test.ts`](../../tests/contracts/package-distribution.test.ts),
[`repository-controls.test.ts`](../../tests/contracts/repository-controls.test.ts),
[`production-license-policy.test.ts`](../../tests/contracts/production-license-policy.test.ts),
and the [release behavior contracts](../../tests/contracts/release-workflow-behavior.test.ts).
The same candidate passed all 12 clean-consumer cases, 212 component tests,
the chart and release-policy regressions, and the supported production browser
matrix described above.

| ID                             | Severity    | Remaining concern                                                                                                                                                                       |
| ------------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SK-M01 ESLint compatibility    | Medium      | `eslint-plugin-react@7.37.5` still needs `@eslint/compat@2.1.1` and a narrowly scoped ESLint 10 peer allowance.                                                                         |
| SK-M02 Node matrix             | Medium      | `verify.yml` now defines Node 20.19, 22.13, and 24.0 jobs, but no successful remote jobs prove that declared range.                                                                     |
| SK-M03 accessibility assurance | Medium      | Axe, keyboard, responsive, and focus tests exist; a dated manual screen-reader, zoom/reflow, forced-colors, voice-control, reduced-motion, and RTL matrix is still absent.              |
| SK-M04 performance             | Medium      | CSS and Button gzip limits are enforced; broader per-module/per-consumer budgets are not. CSS has only 94 bytes of margin.                                                              |
| SK-M05 governance              | Medium      | Policy docs, owner, workflow, and dependency updates exist locally. Remote required checks, protection, release environment, visibility decision, and release operation are unaccepted. |
| SK-L01 visual coverage         | Low         | Thirty image baselines are Chromium-only; Firefox/WebKit behavior checks do not cover every visual state or consumer environment.                                                       |
| Local WebKit host              | Operational | Chromium/Firefox pass locally, but WebKit page setup hangs on this unsupported host; remote Ubuntu CI must prove the complete browser matrix.                                           |

TypeScript `6.0.3` remains below the
[typescript-eslint published `<6.1.0` support bound](https://typescript-eslint.io/users/dependency-versions/).
Vitest remains on 4 under the Node 20/Storybook 10.6 compatibility policy;
`@testing-library/jest-dom` 7, `concurrently` 10, and jsdom 30 are held for the
same Node 20 reason. `@types/node` remains on 20 so declarations model the
minimum supported runtime. These are deliberate catalog holds, not completed
upgrades. Shared versions and overrides are in
[`pnpm-workspace.yaml`](../../pnpm-workspace.yaml).

## Verification chronology and remote acceptance

- On 2026-10-05 the refreshed candidate passed frozen installation, formatting,
  strict lint, workspace types, 13 reference assets, attributions and the
  88-package production-license policy, 100 contracts, 2 Next-config tests, 12
  clean-consumer tests, and 212 component tests. Coverage was 96.01% statements,
  89.42% branches, 98.00% functions, and 96.11% lines.
- Package, Next.js 16.3.8, and Storybook 10.6.1/Vite 8.3.2 production builds
  passed; 307 Storybook interactions and the 119-file client-environment scan
  passed. Distribution evidence was 606 packed files, 30,626-byte gzip CSS,
  2,391-byte gzip reference-app CSS, and a 13,516-byte gzip Button bundle.
- The supported local production browser run passed 184 tests with 77
  intentional skips. Its single visual retry was followed by three concurrent,
  retry-disabled passes of that exact unchanged snapshot. Local WebKit remains
  an environment limitation rather than accepted three-engine evidence.
- Read-only remote checks on 2026-09-24 showed repository visibility `PRIVATE`,
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
