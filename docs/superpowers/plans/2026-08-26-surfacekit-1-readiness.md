# SurfaceKit 1.0 Mobile, PWA, Auth, and Readiness Implementation Plan

## Context and global constraints

- Close every existing Blocker and High readiness finding before `@nwl/surfacekit` 1.0.0.
- Preserve all existing public import paths and component props except rejection of unsafe chart values.
- Keep React and React DOM 19 as peers; distribute through an immutable GitHub Release tarball, not a registry.
- Treat 320px as the minimum viewport and provide adaptive 44px touch targets on small/coarse-pointer layouts without removing compact desktop density.
- Auth is provider-neutral presentation and orchestration only. PWA offline support is a non-sensitive shell; live content remains network-first.
- Use test-first development for behavior changes. Do not regenerate visual baselines without inspection.
- Do not change repository visibility, push, create tags, or publish releases until local review and verification are complete.

## Task 1: Security, legal, and repository controls

Fix the chart raw-style injection boundary with hostile SSR/client regression coverage while preserving legitimate theme colors and public imports:

- Remove `dangerouslySetInnerHTML`. Preserve the caller's native DOM `id` separately from an opaque React-generated chart scope.
- Constrain chart series keys to `^[A-Za-z_][A-Za-z0-9_-]*$`; invalid keys are omitted from generated variables and produce a development-only warning.
- Accept legitimate hex, named/current/transparent, and balanced color-function or `var(--token)` syntax only after rejecting structural CSS/HTML tokens such as angle brackets, braces, semicolons, at-rules, comments, escapes, and unbalanced parentheses. Invalid colors are omitted with the same development-only warning behavior.
- Render stylesheet text as an escaped React child and ensure a case-insensitive closing-style sequence cannot occur in serialized output.
- Cover direct `ChartStyle`, `ChartContainer`, React SSR, client rendering, invalid id/key/color/theme inputs, and unchanged legitimate light/dark variables through test-first RED/GREEN evidence.

Pin every GitHub Action to the current reviewed full commit SHA with a release-tag comment, set checkout `persist-credentials: false`, and declare `contents: read` for non-publication jobs. Add Dependabot updates for GitHub Actions. Pin `code-review-graph` to the current exact stable version across every committed MCP client configuration and replace `/home/mianni/...` paths with portable workspace-relative/current-directory behavior.

Add Apache-2.0 `LICENSE`, a `NOTICE` naming Naneware Labs and 2026, generated third-party attribution/license reporting, `SECURITY.md`, `CODEOWNERS`, support policy, and version/release policy. Align public workspace package license metadata and remove `PROPRIETARY`. Add behavior-oriented repository contracts for immutable actions, least permissions, portable/pinned MCP commands, legal metadata, and attribution generation.

Run a current-tree credential scan and a full reachable-history credential scan with an available standard scanner. Record command/results in the task report but do not commit raw scan output or change remote visibility.

## Task 2: Compiled package and CSS distribution

Build the repository's actual external package boundary before changing fonts,
PWA behavior, or component APIs. Start by adding behavioral contract tests that
fail while exports still point at source and the packed artifact still leaks
development files.

- Add a dedicated `packages/ui/tsconfig.build.json` that emits ESM JavaScript,
  JavaScript maps, declarations, and declaration maps into `packages/ui/dist`
  while excluding tests, fixtures, stories, and test helpers. Keep the existing
  no-emit project configuration for editor/typecheck use.
- Make the package build deterministic and bounded: remove only
  `packages/ui/dist`, emit TypeScript, rewrite every internal
  `@nwl/surfacekit/*` self-alias to the corresponding relative path, and add
  explicit `.js` extensions to relative ESM imports/exports. Use an established
  deterministic rewriter such as `tsc-alias` with full-path `.js` resolution,
  and fail the build if an emitted self-alias or extensionless relative import
  remains. Preserve leading `"use client"` directives in every affected entry.
- Compile `packages/ui/src/styles/globals.css` with Tailwind's supported v4 CLI
  into minified `packages/ui/dist/globals.css`. Its source discovery must cover
  package implementation only, not `apps/web`, stories, or consumers. The
  distributable stylesheet owns framework-neutral tokens, component utilities,
  dark mode, and generic system font fallbacks; it must contain no unresolved
  `@import`, `@source`, `@apply`, or other build-time Tailwind directives.
- Give `apps/web` a separate Tailwind entry and PostCSS configuration for app,
  route, demo, and Storybook-only utility classes. The Next application and
  Storybook must import the compiled package stylesheet plus this reference-app
  stylesheet, never the package's source CSS. The app stylesheet must not emit
  a second theme/base/preflight layer or any selector whose declarations
  conflict with the package contract. Semantically identical utility rules
  independently required by both package and app code may repeat; they must be
  generated from the same SurfaceKit token references, remain cascade-neutral,
  and fit within an 8 KB gzip app-CSS budget. Do not post-process arbitrary CSS
  selectors/declarations to deduplicate them: cascade-safe generation and
  conflict detection are the boundary.
- Replace `packages/ui`'s source export map with conditional `types` and
  `import` entries under `dist` for every existing component, pattern, hook,
  utility, the aggregate `patterns` entry, and `globals.css`. Preserve those
  public subpaths exactly. Remove the obsolete exported PostCSS configuration
  because compiled CSS no longer requires consumer Tailwind processing.
- Make `@nwl/surfacekit` packable (`private: false`) while leaving the monorepo
  root private. Add a strict `files` allowlist and CSS-only `sideEffects`; ensure
  the tarball includes the compiled output plus current package usage/readme and
  Apache-2.0 license/notice material, but excludes `src`, tests, fixtures,
  stories, TypeScript/PostCSS/components configuration, build scripts, and
  repository-only docs.
- Keep React and React DOM as required React 19 peers with repository-only dev
  copies. Remove unused `@shadcn/react`; move `shadcn`, `tw-animate-css`,
  Tailwind, its CLI/PostCSS integration, alias-rewrite tooling, and all other
  build-only packages out of runtime dependencies. Do not remove an actual
  runtime dependency merely to satisfy a manifest assertion.
- Remove the web app's TypeScript mapping to `packages/ui/src` and any no-longer
  required source transpilation setting. Make Turbo build the package before
  the web app and declare `dist/**` as package build output. Provide a
  repository development command that produces initial JS/CSS before Next and
  Storybook start, then keeps both package outputs current with watchers so
  workspace development exercises the same shape as the installed tarball.
- Add focused contracts for a clean package build, Node ESM imports, generated
  declarations/maps, complete public export coverage, no internal aliases or
  extensionless ESM edges, retained client directives, compiled CSS without a
  consumer Tailwind install, strict packed contents, React peer/singleton
  metadata, and absence of build tooling from runtime dependencies.
- Add repeatable size gates: `dist/globals.css` must be at most 30 KB gzip, and
  a production/tree-shaken consumer that imports only Button from the packed
  package must be at most 15 KB gzip. The compiled reference-app-only stylesheet
  must be at most 8 KB gzip and contain no theme/base/preflight output or
  declaration conflicts with package selectors. Build and inspect the exact
  tarball rather than copying workspace source. Task 6 will add full disposable
  Next/Vite consumers for every public subpath; this task establishes the
  artifact they consume.

Acceptance evidence must include a clean rebuild, focused package contracts,
workspace typecheck, Next production build, Storybook build/tests, packed-file
inventory, gzip measurements, and `pnpm install --frozen-lockfile` after the
manifest/lockfile changes. Do not weaken existing coverage, accessibility, or
visual thresholds to make the distribution change pass.

## Task 3: Shared fonts and installable PWA

Use the user-supplied root `assets/` directory as the canonical reference-app
brand source. Preserve the original files and their OFL license texts; do not
replace them with Fontsource packages or regenerate equivalent artwork.

- Add one shared reference-app font stylesheet backed directly by the supplied
  variable fonts in `assets/fonts`: Outfit for `--font-sans`, Geist for
  `--font-heading`, and Geist Mono for `--font-mono`. Include the supplied
  Geist/Mono italic variable faces where appropriate, use `font-display: swap`,
  and keep sensible system fallbacks. Import this exact stylesheet from both
  the Next root layout and Storybook preview; remove `next/font/google` and any
  external font dependency/request. Do not place brand font bytes in the
  distributable UI package or change its generic fallback contract.
- Add browser-level font contracts for Next and Storybook that prove the local
  font resources return successfully, the body/heading/code computed families
  resolve to Outfit/Geist/Geist Mono respectively, and neither surface silently
  falls back to Nunito/system fonts or makes Google/external font requests.
- Treat `assets/favicons/nwl-surfacekit.svg` as the canonical mark and use the
  supplied `favicon.ico`, Apple icon, 192px and 512px web-app icons, and PNG
  artwork rather than synthesizing replacements. Add a deterministic sync/copy
  boundary for the exact files Next must serve, with hash/size contracts so
  public copies cannot drift from the canonical assets. Use the mark in the
  reference-app brand/offline experience without adding it to the external UI
  package API. Preserve the supplied source manifest as input evidence, but use
  Next's typed manifest route as the operational manifest because the supplied
  file contains placeholder names.
- Add `apps/web/app/manifest.ts` with name `NWL SurfaceKit`, short name
  `SurfaceKit`, `start_url: "/playground"`, root scope, standalone display,
  responsive orientation, SurfaceKit theme/background colors, and the supplied
  192px, 512px, maskable, SVG, favicon, and Apple-touch assets with correct
  purposes/types. Wire metadata icons and theme color without duplicating an
  incompatible static manifest.
- Read the installed Next.js 16.3.2 PWA, manifest, public-assets, and headers/CSP
  guides before implementation. Add a small first-party service worker at
  `/sw.js` and register it only in production through a minimal client boundary.
  The response must use JavaScript MIME, `nosniff`, explicit no-cache/
  revalidation headers, root scope, and a CSP that permits workers only from
  self. Do not add Serwist or another PWA framework.
- The service worker must keep navigations network-first and serve a
  self-contained, non-sensitive branded offline shell only after failed
  document navigation. Cache only successful same-origin GET responses for
  immutable `/_next/static/` assets and the explicit supplied PWA icon paths.
  Never cache API/auth/challenge/mutation requests, non-GET requests, redirects,
  error responses, cross-origin requests, React Server Component requests, or
  server actions. Version and cap only `surfacekit-*` caches, delete only
  obsolete SurfaceKit caches, and avoid mixing an old document with new assets
  during staged updates.
- Add focused unit/contracts and production browser coverage for manifest
  validity, icon availability and hash identity, installability/root scope,
  production-only registration, first online load, bounded caches and request
  exclusions, offline navigation fallback, service-worker update behavior, and
  recovery after connectivity returns. Development and Storybook must not
  acquire a service worker. Tests must not rely on an existing browser cache or
  external network.

Acceptance includes frozen install, font/license contracts, Next/Storybook
builds and tests, production Chromium PWA/font flows plus the existing Firefox
and WebKit smoke matrix, and manual browser inspection at mobile and desktop
sizes. Retain Task 2's package/CSS/tarball/size gates; brand fonts and PWA assets
belong only to the reference application.

## Task 4: Mobile-first shells and scrollbar system

Make all public components, patterns, shells, pages, stories, and demos safe at 320px. Add accessible mobile navigation and safe-area behavior to app/web shells, adaptive 44px touch targets, and themed global/component scrollbar tokens with dark/hover/active/forced-colors behavior. Preserve intentional internal horizontal scrollers. Add automated 320/375 overflow coverage and targeted mobile interaction/visual evidence.

## Task 5: Provider-neutral enterprise auth UI

Enhance AuthShell and StepUpDialog additively, making StepUpDialog a real accessible dialog. Add public PasswordInput, AuthForm, and SecurityChallenge modules with colocated tests, stories, catalog entries, and playground demos. Cover password/SSO/passkey login, signup/invite, email verification, recovery/reset, OTP/recovery code, method switching, lockout, expired session, and pending/success/error states with correct form semantics and mobile behavior.

## Task 6: Hermetic consumers, release pipeline, docs, and final gates

Add clean React 19 Next 16 and Vite 8 tarball consumers and Node 20/22/24 CI coverage. Replace canary packaging with separated read-only build and protected release jobs that build once, verify the transferred tarball, produce SHA-256, SBOM, and provenance, and attach the exact bytes for `surfacekit-v1.0.0`. Reconcile all current documentation and the dated readiness audit. Run the complete local gate, independent final review, then perform authorized remote visibility/protection/push/release operations only when their prerequisites are proven.
