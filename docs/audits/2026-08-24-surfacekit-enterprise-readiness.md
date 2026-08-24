# SurfaceKit enterprise-readiness audit

Date: 2026-08-24

Baseline commit: `ede7b4f5de4f835023f99281ee6118950102a566`

Target: `@nwl/surfacekit` for use by external React 19 applications, especially
Next.js 16 and Vite consumers

Assurance level: engineering readiness; this is not a formal compliance,
penetration-testing, or legal opinion

## Decision

**Not ready for external production distribution.**

The repository is strong as an internally governed source workspace: 60
components and 10 patterns have exact source/test/story/catalog/demo contracts,
coverage exceeds the enforced floors, Next.js and Storybook production builds
work on the modernized toolchain, and cross-browser production tests exist.

External release is blocked by the absence of a compiled and restricted package
artifact, compiled CSS, an immutable release process, and an explicit software
license. A validated high-severity chart injection path must also be fixed before
an external application can safely accept user-influenced chart configuration.

This implementation completed dependency modernization, verification
isolation, React peer declarations, security overrides, migration configuration,
and current documentation. It intentionally did **not** implement the broader
package/CSS/release redesign or silently fix other audit findings.

## Scope and method

The audit covered current repository source and configuration, excluding
generated output, `node_modules`, `.git`, and linked `.worktrees` as source
targets. Historical plans under `docs/superpowers/plans/` and the dated
production-readiness specification were treated as historical records and were
not edited.

Evidence included:

- a full current-HEAD code-review graph: 436 parsed files, 1,425 nodes, 10,992
  edges, 131 detected flows, and 15 architecture communities;
- manifest, export-map, configuration, CI, source, story, and test inspection;
- current registry metadata and official migration guidance, summarized in
  [dependency compatibility evidence](2026-08-24-dependency-compatibility-evidence.md);
- real package creation and disposable React 19 consumers using Next.js 16.3.2
  and Vite 8.2.2;
- the canonical production dependency audit and a production license inventory;
- an independent standard static security baseline plus focused validation of
  chart rendering and GitHub Actions boundaries;
- repository format, lint, type, contract, component, build, Storybook,
  environment-isolation, and production-browser gates.

The static security review fully read 29 baseline files and 8 focused-validation
files and searched the authorized repository surface. It did not claim every
story, image, historical document, or lockfile entry was manually read. Browser
and axe automation does not replace manual assistive-technology review.

## Architecture and public surface

The primary architecture is a package/reference-app split:

1. `packages/ui` owns framework-neutral React source and public subpath exports.
2. `apps/web` consumes only public package paths and supplies Next-specific
   routing integration through composition.
3. Storybook stories, route demos, and `apps/web/lib/surfacekit/catalog.ts`
   exercise the same 70-module inventory.
4. Contract tests enforce equality across source, exports, tests, stories,
   catalog records, and demos.
5. Vitest, Storybook, and Playwright supply unit, interaction, accessibility,
   workflow, cross-browser, and visual evidence.

The graph's highest coupling is from stories and category demos into the shared
component surface. That is expected for an evidence application, but it means
the reference app is not independent proof of the installed tarball: Vitest and
Storybook alias `@nwl/surfacekit` directly to repository source.

Current public imports are preserved:

```text
@nwl/surfacekit/globals.css
@nwl/surfacekit/postcss.config
@nwl/surfacekit/components/*
@nwl/surfacekit/patterns
@nwl/surfacekit/patterns/*
@nwl/surfacekit/hooks/*
@nwl/surfacekit/lib/*
```

React and React DOM are now required `^19.0.0` peers with repository development
copies fixed at `19.2.8`. The package remains private and source-only.

## Dependency modernization

| Cohort                   | Before            | After               |
| ------------------------ | ----------------- | ------------------- |
| pnpm                     | `11.18.0`         | `11.23.0`           |
| Next.js / Next ESLint    | `16.3.0`          | `16.3.2`            |
| Storybook family         | `10.5.7`          | `10.5.10`           |
| Vitest family            | `4.1.10`          | `4.1.11`            |
| Turbo family             | `2.10.8`          | `2.10.11`           |
| ESLint / `@eslint/js`    | `9.39.4`          | `10.9.0` / `10.0.1` |
| Vite / React plugin      | `6.4.3` / `4.7.0` | `8.2.2` / `6.1.0`   |
| Base UI                  | `1.6.0`           | `1.7.0`             |
| axe Playwright           | `4.12.1`          | `4.13.0`            |
| typescript-eslint family | `8.66.0`          | `8.67.0`            |
| Node types               | `26.1.2`          | `26.2.0`            |
| globals                  | `17.9.0`          | `17.11.0`           |
| input-otp                | `1.4.2`           | `1.5.0`             |
| lucide-react             | `1.28.0`          | `1.34.0`            |
| react-resizable-panels   | `4.12.2`          | `4.12.3`            |
| shadcn                   | `4.16.1`          | `4.19.0`            |
| `@shadcn/react`          | `0.2.1`           | `0.3.0`             |

`date-fns` and `zod` were removed as unused direct dependencies. The planned
removal of `@shadcn/react` was rejected by implementation evidence:
`message-scroller.tsx` directly imports `@shadcn/react/message-scroller`.

TypeScript stays at `5.9.3` because typescript-eslint `8.67.0` supports
TypeScript below `6.1.0`. `pnpm outdated -r` now reports only TypeScript `7.0.2`,
which is non-actionable under that compatibility contract.

ESLint 10 required two narrow migrations:

- the obsolete root `.eslintrc.js` was removed and the root package is ESM;
- `eslint-plugin-react@7.37.5` is wrapped with `@eslint/compat@2.1.0`, with a
  pnpm peer allowance restricted to that exact plugin/version and ESLint 10.

The latter is validated locally but remains outside the plugin's published peer
range. It is therefore a compatibility exception, not upstream support.

The initial production audit reported four high, three moderate, and one low
advisory. Patched-range overrides for `fast-uri`, `brace-expansion`, `js-yaml`,
`hono`, and `nanoid` reduce the current `pnpm audit --prod` result to zero known
advisories. These overrides must be removed when direct dependency updates make
them unnecessary.

## Tarball and clean-consumer evidence

The package was packed into a temporary directory and installed without
workspace links into clean consumers.

| Probe                                              | Result                                                                     | Interpretation                                                                                           |
| -------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Tarball contents                                   | 93,182 bytes; 228 files; all 70 `*.test.tsx` files                         | No release allowlist; internal source/support files leak into the artifact.                              |
| Package output                                     | exports point to raw `.ts`, `.tsx`, and CSS; `build` is `tsc --noEmit`     | Consumers must transpile package source; no immutable compiled contract exists.                          |
| Declaration probe                                  | 428 declaration/map files emitted manually, including 70 test declarations | TypeScript can emit, but there is no distribution config and tests pollute output. No declarations ship. |
| Vite without styling tools                         | failed resolving `@import "tailwindcss"`                                   | `globals.css` is not self-contained.                                                                     |
| Next without styling tools                         | failed resolving `@tailwindcss/postcss` from package config                | Styling requirements are undeclared for clean consumers.                                                 |
| Vite with Tailwind/PostCSS                         | strict typecheck and production build passed                               | Raw-source integration is possible with consumer-specific setup.                                         |
| Next with Tailwind/PostCSS and `transpilePackages` | production build and static SSR passed                                     | Raw-source integration is possible but is not zero-config or a stable package contract.                  |
| Next hydration                                     | Chromium rendered the public Button with no hydration error                | One representative path passed; the only console error was a consumer-fixture favicon 404.               |
| Vite Button bundle                                 | JS 228.49 kB / 72.36 kB gzip; CSS 204.78 kB / 29.99 kB gzip                | Source CSS is large for a single Button consumer.                                                        |
| Vite React-only baseline                           | JS 190.86 kB / 60.19 kB gzip; no CSS                                       | Narrow Button import added about 37.63 kB / 12.17 kB gzip JS plus the full CSS payload.                  |

These measurements are diagnostic, not a committed performance budget. They
show that narrow JavaScript imports tree-shake at the module boundary, while the
global source stylesheet remains monolithic.

## Security and license results

### Validated security findings

The standard scan found no server endpoint, database, upload, command-execution,
credential, authentication, authorization, SSRF, or path-traversal surface in
product code. `PermissionGate` is correctly treated as display logic, not an
authorization boundary. Two control families require action:

1. Chart CSS/HTML construction permits injection through public `id`, config
   keys, `color`, and theme color strings. The values flow into an unquoted CSS
   selector/declaration and then `dangerouslySetInnerHTML` in
   `packages/ui/src/components/chart/chart.tsx:94-112`. In a server-rendered
   consumer, a closing-style payload can terminate the raw-text element and
   inject executable markup. This was independently validated at high severity.
2. All nine GitHub Action references use mutable `@v4` tags. The canary workflow
   also lacks an explicit permissions block. A compromised or moved tag can
   alter verification or the named tarball artifact without a repository diff.

### Production dependency and license inventory

- `pnpm audit --prod`: zero known advisories after patched-range overrides.
- Production license identifiers: `0BSD`, `Apache-2.0`, `BSD-2-Clause`,
  `BSD-3-Clause`, `BlueOak-1.0.0`, `CC-BY-4.0`, `ISC`, `LGPL-3.0-or-later`,
  `MIT`, `MIT AND ISC`, and `Python-2.0`.
- The LGPL entry is `@img/sharp-libvips-linux-x64@1.3.2`, an optional native
  runtime selected through the toolchain. No repository license policy or
  approval record explains how copyleft or attribution obligations are handled.
- No root `LICENSE`, package license declaration, `SECURITY.md`, or vulnerability
  disclosure channel was found.

## Ranked findings

### SK-B01 — No distributable package contract

- **Severity:** Blocker
- **Evidence:** `private: true`; no `files` allowlist; no emitted JavaScript or
  declarations; raw-source exports; Turbo reports no package build output; pack
  includes 228 files and all tests.
- **Impact:** A GitHub tarball is mutable in behavior across consumer bundlers,
  exposes internals, and cannot provide stable runtime/type artifacts.
- **Remediation:** Define ESM output and declaration builds, exclude tests and
  internal configuration, map every preserved subpath export to `dist`, add
  `sideEffects`/CSS semantics, and make `pnpm pack` consume only built output.
- **Acceptance:** A clean checkout produces a deterministic tarball whose file
  allowlist, exports, declarations, source maps, and integrity digest are
  contract-tested; Node resolution and both consumer builds use only tarball
  files.
- **Effort:** Large (5-10 engineering days).

### SK-B02 — CSS is source tooling, not a release artifact

- **Severity:** Blocker
- **Evidence:** both clean consumers failed until they installed Tailwind and
  `@tailwindcss/postcss`; CSS imports `tailwindcss`, `tw-animate-css`, and
  `shadcn/tailwind.css`, and contains repository-relative `@source` directives.
- **Impact:** External builds are configuration-dependent, the CLI package stays
  in the runtime graph, and every consumer receives a roughly 205 kB stylesheet.
- **Remediation:** compile and minify a framework-neutral CSS artifact, preserve
  tokens/dark mode, remove repository-relative sources, and move build-only CSS
  tools/CLI packages out of runtime dependencies.
- **Acceptance:** Next and Vite tarball fixtures import `globals.css` without
  Tailwind/PostCSS/shadcn; visual baselines and all component states remain
  equivalent; a CSS size budget is enforced.
- **Effort:** Large (5-10 engineering days).

### SK-B03 — No legal grant for external reuse

- **Severity:** Blocker
- **Evidence:** no root `LICENSE`; `@nwl/surfacekit` has no `license`; the private
  TypeScript config says `PROPRIETARY`; no third-party notice or license policy.
- **Impact:** External applications cannot determine permission, redistribution
  terms, attribution obligations, or approved dependency licenses.
- **Remediation:** obtain owner/legal selection of the intended license, align
  package metadata, add notices and an allowed/denied license policy.
- **Acceptance:** repository and packed manifest carry approved consistent terms;
  CI fails on unapproved licenses and emits a reviewable notice inventory.
- **Effort:** Small engineering change after legal decision (1-2 days); decision
  lead time is external.

### SK-H01 — Chart raw-style construction enables SSR XSS and CSS injection

- **Severity:** High
- **Evidence:** unrestricted public chart identifiers, record keys, and color
  strings are interpolated into CSS and assigned through
  `dangerouslySetInnerHTML`; no validation, CSS escaping, or raw-text encoding.
- **Impact:** user-influenced chart data can execute markup in a Next.js SSR
  consumer or inject page-wide CSS in other rendering modes.
- **Remediation:** avoid raw style HTML; use internal identifiers and React style
  objects/custom properties, validate color grammar, and CSS-escape any retained
  selector construction.
- **Acceptance:** hostile SSR tests for `id`, keys, `color`, and theme values
  cannot create sibling markup or arbitrary rules; safe cases and current public
  props remain covered; security review approves the new dataflow.
- **Effort:** Medium (2-4 days).

### SK-H02 — Release artifact is neither immutable nor attestable

- **Severity:** High
- **Evidence:** only a manually dispatched canary artifact workflow exists; it
  uses mutable action tags, has no explicit permissions, digest, attestation,
  signed release, changelog, or GitHub release attachment process.
- **Impact:** a consumer cannot tie an artifact to a reviewed commit, and upstream
  Action compromise can tamper with the named tarball.
- **Remediation:** pin all actions by commit SHA, declare least permissions,
  build once from a protected tag, generate SBOM/provenance/digests, attach the
  immutable tarball to a GitHub release, and verify it before consumption.
- **Acceptance:** a release tag maps to one reviewed commit and one reproducible,
  attested digest; verification downloads and tests that exact artifact.
- **Effort:** Medium-Large (4-7 days).

### SK-H03 — Runtime dependency boundary includes build-time CLI infrastructure

- **Severity:** High
- **Evidence:** `shadcn` remains in `dependencies` solely because source CSS
  imports its stylesheet; `pnpm audit --prod` evaluates 451 dependencies and
  required five transitive overrides to reach zero advisories.
- **Impact:** consumer install size and supply-chain exposure are far larger than
  the rendered component runtime requires; future CLI advisories become product
  runtime findings.
- **Remediation:** complete SK-B02, move CLI/build tools to development scope,
  minimize runtime dependencies, and add a dependency-boundary contract.
- **Acceptance:** the packed runtime graph contains only code executed by
  components; production audit remains zero without avoidable CLI subtrees.
- **Effort:** Medium after compiled CSS (2-4 days).

### SK-H04 — Installed-tarball compatibility is not a CI contract

- **Severity:** High
- **Evidence:** reference tests alias directly to workspace source; disposable
  Next/Vite probes were manual; no release fixture validates SSR, hydration,
  declarations, CSS, or React singleton behavior from the tarball.
- **Impact:** workspace verification can remain green while the external artifact
  is broken or silently depends on hoisting and repository configuration.
- **Remediation:** add hermetic consumer fixtures that install the just-built
  tarball, with no workspace links, in supported framework/runtime matrices.
- **Acceptance:** CI tests Next and Vite builds, strict types, SSR/hydration,
  public exports, CSS, React deduplication, and bundle budgets from one immutable
  tarball.
- **Effort:** Medium (3-5 days) after SK-B01/SK-B02.

### SK-M01 — ESLint 10 relies on a temporary upstream compatibility exception

- **Severity:** Medium
- **Evidence:** latest `eslint-plugin-react@7.37.5` publishes a peer range ending
  at ESLint `^9.7`; SurfaceKit uses `@eslint/compat` and an exact pnpm allowance.
- **Impact:** a future ESLint/plugin rule can fail outside the declared upstream
  contract even though the current full lint passes.
- **Remediation:** track an upstream ESLint 10-compatible release, remove the
  adapter/allowance when available, or evaluate a governed alternative plugin.
- **Acceptance:** `pnpm peers check` and lint pass without an exception and the
  selected plugin declares ESLint 10 support.
- **Effort:** Small once upstream support exists (under 1 day).

### SK-M02 — Supported runtime range is not matrix-tested

- **Severity:** Medium
- **Evidence:** the engine contract is `^20.19 || ^22.13 || >=24`, while CI tests
  only Node `20.19.0`.
- **Impact:** Node 22/24-specific resolution, loader, or native dependency changes
  can break a declared supported environment unnoticed.
- **Remediation:** test the minimum Node 20 line and current Node 22/24 LTS lines;
  reduce the engine range if the team will support fewer lines.
- **Acceptance:** frozen install and core verification run on every declared
  line, with the full browser job on one primary line.
- **Effort:** Small (1-2 days plus CI time).

### SK-M03 — Accessibility assurance is automation-heavy

- **Severity:** Medium
- **Evidence:** all routes/stories run axe and representative workflows cover
  keyboard focus, but there is no recorded manual screen-reader, zoom/reflow,
  forced-colors, voice-control, reduced-motion, or RTL acceptance matrix.
- **Impact:** semantic, announcement, focus-order, and assistive-technology
  defects outside axe's rules can reach external apps.
- **Remediation:** define a release checklist and representative manual matrix,
  prioritize overlays/forms/navigation, and record exceptions with owners.
- **Acceptance:** each release has dated manual evidence for supported browsers
  and assistive technologies; automated a11y remains blocking.
- **Effort:** Medium setup (2-4 days), recurring review thereafter.

### SK-M04 — Performance budgets are not enforced

- **Severity:** Medium
- **Evidence:** a one-Button Vite consumer added about 12.17 kB gzip JavaScript
  over React baseline plus 29.99 kB gzip CSS; Storybook emitted a 1.16 MB iframe
  chunk and a 436 kB chart story chunk.
- **Impact:** dependency or CSS growth can regress consuming applications without
  failing CI.
- **Remediation:** define per-entry and shared-CSS budgets from clean tarball
  consumers, track dependency contributions, and split optional heavy modules.
- **Acceptance:** CI reports and gates gzip/brotli deltas for representative
  light and heavy imports.
- **Effort:** Medium (2-4 days) after compiled artifacts.

### SK-M05 — Governance and ownership controls are absent from source

- **Severity:** Medium
- **Evidence:** no `SECURITY.md`, `CODEOWNERS`, changelog, changeset/release
  policy, compatibility policy, or dependency-update configuration was found.
  Repository branch-protection settings were not available to this local audit.
- **Impact:** vulnerability intake, review ownership, breaking-change decisions,
  and release notes depend on undocumented team knowledge.
- **Remediation:** add policy documents and owned paths, automate dependency and
  action-SHA updates, and document required branch protections/reviews.
- **Acceptance:** external consumers can find support, security, versioning, and
  deprecation policies; protected releases require owned review.
- **Effort:** Medium (2-4 days).

### SK-L01 — Visual and browser evidence has known limits

- **Severity:** Low
- **Evidence:** functional workflows cover Chromium, Firefox, and WebKit, while
  pixel baselines are Chromium-only and automated snapshots cover the reference
  routes rather than every consumer environment.
- **Impact:** engine-specific visual drift may not be detected automatically.
- **Remediation:** retain Chromium as the deterministic baseline and add focused
  cross-engine visual/manual review for high-risk overlays and forms.
- **Acceptance:** the support policy states the visual matrix and high-risk
  releases record cross-engine review.
- **Effort:** Small-Medium (1-3 days plus snapshot maintenance).

## Final verification evidence

- `pnpm install --frozen-lockfile` completed with pnpm `11.23.0`; `pnpm peers
check` reported no issues.
- `pnpm outdated -r --format json` reported only the documented TypeScript
  `5.9.3` to `7.0.2` compatibility hold. The command uses a non-zero exit code
  when it reports that hold.
- `pnpm audit --prod` reported no known vulnerabilities after the documented
  patched-range overrides.
- Formatting, ESLint 10, workspace type checks, and all 4 contract files / 6
  contract tests passed.
- All 70 component files / 152 tests passed with 95.60% statements, 86.83%
  branches, 97.81% functions, and 95.67% lines.
- Next.js 16.3.2 built all 11 application routes, Storybook 10.5.10 built on
  Vite 8.2.2, and all 70 story files / 282 tests passed. Storybook still logs
  one controlled/uncontrolled input warning and two duplicate-key warnings;
  these are lower-priority maintainability findings, not hidden failures.
- The environment-isolation check inspected 114 client bundle files without
  finding server-only environment markers.
- The final production Playwright run explicitly disabled retries: 141 runnable
  tests passed across Chromium, Firefox, and WebKit, with 60 intentional skips
  because the 30 pixel baselines are Chromium-only. Synchronization fixes were
  stress-tested separately: the affected visual cases passed 18/18 and the
  WebKit tab workflow passed 5/5. No visual snapshot was regenerated.

## Existing strengths

- Exact 70-module synchronization across public source, tests, stories, catalog,
  and demos prevents undocumented surface drift.
- Coverage floors remain 90% statements/lines/functions, 85% branches, with
  per-file minimums. The migration result is 95.60% statements, 86.83% branches,
  97.81% functions, and 95.67% lines across 70 suites / 152 tests.
- Storybook treats accessibility violations as test errors across all 70 story
  files, and the reference app has route-level axe checks.
- Production Playwright covers Chromium, Firefox, WebKit, workflows, marketing,
  playground behavior, accessibility, and 30 reviewed Chromium baselines.
- `test:env` checks built client assets for common server-only environment
  references.
- The package does not import Next.js; router integration remains caller-owned.
- React peers now prevent a private framework copy in external dependency
  resolution.
- Frozen lockfile installation, pnpm build-script allowlisting, and current
  zero-advisory production audit are solid supply-chain foundations.

## Dependency-ordered roadmap

### Phase 0 — Release stop controls

1. Fix and security-test SK-H01.
2. Decide and record the repository/package license (SK-B03).
3. Pin GitHub Actions by SHA and add least permissions immediately (part of
   SK-H02), even before a full release workflow exists.

### Phase 1 — Artifact and CSS contract

1. Design the preserved subpath-to-`dist` export map.
2. Add production ESM and declaration builds excluding tests.
3. Compile CSS and remove consumer Tailwind/shadcn requirements.
4. Add a strict `files` allowlist, side-effect metadata, manifest validation,
   and deterministic pack/digest tests.

### Phase 2 — Immutable release delivery

1. Build once from a protected version tag.
2. Generate SBOM, provenance, notices, checksums, and changelog.
3. Attach the exact tarball to a GitHub release and test the downloaded digest.
4. Define semantic-versioning, support, deprecation, vulnerability, and rollback
   policies.

### Phase 3 — Compatibility contract

1. Run clean tarball fixtures for Next.js 16 and Vite 8.
2. Add the declared Node 20/22/24 matrix.
3. Verify SSR, hydration, strict declarations, every export family, CSS,
   tree-shaking, React singleton behavior, and unsupported-version failures.
4. Remove the TypeScript and ESLint compatibility holds when upstream support is
   official and the matrix is green.

### Phase 4 — Assurance and performance

1. Establish JavaScript/CSS budgets from immutable consumer fixtures.
2. Complete a manual accessibility/assistive-technology matrix.
3. Add focused cross-engine visual review for overlays, forms, and navigation.
4. Track remaining lower-coverage branches and noisy React console warnings as
   maintainability work without weakening current thresholds.

## Readiness exit criteria

SurfaceKit may claim external production readiness only when:

- all Blockers and High findings above are closed and independently verified;
- the exact immutable GitHub release tarball passes clean Next and Vite consumer
  matrices without workspace aliases or source styling tools;
- production dependency audit is zero high/critical and license policy passes;
- public imports and behavior remain compatible or are released under an
  explicit breaking version;
- CI, release provenance, security intake, compatibility, accessibility, and
  performance evidence are current and owned;
- the repository's complete aggregate verification passes from a frozen install
  with a populated linked-worktree directory.

Until then, documentation should describe SurfaceKit as a private workspace
source package with strong internal verification—not as a compiled external
library or enterprise-ready release artifact.
