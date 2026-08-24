# Playground, Storybook, and Shell Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver canonical nested playground routes, compatibility redirects, richer shared shells, light/dark controls in the web shell and Storybook, a purposeful Storybook landing, warning-free stories, and a Storybook production build whose JavaScript chunks remain below 1,000 kB.

**Architecture:** Keep route metadata centralized in the existing typed catalog and place category pages beneath a real `playground` URL segment. Extend the shared app-shell pattern through optional, backward-compatible slots and reuse its theme switcher from a narrow web-app client component. Configure Storybook through focused preview and introduction modules, then optimize the static runtime by restoring production mode before adding any narrowly scoped Rolldown splitting.

**Tech Stack:** React 19.2.8, Next.js 16.3.2 App Router, next-themes, Storybook 10.5.10, Vite 8.2.2/Rolldown, Vitest 4.1.11, Testing Library, Playwright, Tailwind CSS 4.3.3, pnpm 11.23.0

**Spec:** `docs/superpowers/specs/2026-08-24-playground-storybook-shell-experience-design.md`

## Global Constraints

- Read relevant Next.js 16 guidance from `apps/web/node_modules/next/dist/docs/` before changing routes or configuration.
- Preserve all existing `@nwl/surfacekit` import paths and component behavior; new shell APIs are optional and additive.
- Canonical category URLs must be `/playground/<category>`; all seven former root-level URLs must permanently redirect.
- The catalog at `apps/web/lib/surfacekit/catalog.ts` remains the sole application source for category routes.
- Keep exactly 70 public-module story files under `apps/web/stories`; the introduction story lives in `apps/web/.storybook`.
- Preserve Storybook accessibility enforcement and the existing component coverage thresholds.
- Do not resolve the chunk warning by increasing `chunkSizeWarningLimit` above `1000`.
- Add manual Rolldown splitting only if restoring a production Storybook build does not bring every emitted JavaScript chunk below `1,000,000` bytes.
- Do not regenerate visual snapshots until differences are inspected and confirmed intentional.
- Run `pnpm verify:ci` on the final tree.

---

## File Structure

### New files

- `apps/web/app/(playground)/playground/layout.tsx` — canonical shared layout for all playground routes, moved from the route-group root.
- `apps/web/app/(playground)/playground/<category>/page.tsx` — seven canonical category pages moved beneath the real URL segment.
- `apps/web/components/marketing/web-shell-actions.tsx` — client-only composition of the shared theme switcher and Playground link.
- `apps/web/components/marketing/web-shell-actions.test.tsx` — accessible rendering contract for the navbar actions.
- `apps/web/.storybook/theme-decorator.tsx` — document-root Storybook theme synchronization.
- `apps/web/.storybook/theme-decorator.test.tsx` — light/dark root-class and cleanup coverage.
- `apps/web/.storybook/introduction.stories.tsx` — non-inventory Storybook landing experience.
- `apps/web/next.config.test.ts` — permanent legacy redirect contract.

### Moved files

- `apps/web/app/(playground)/layout.tsx` → `apps/web/app/(playground)/playground/layout.tsx`
- `apps/web/app/(playground)/{data-display,dialogs-overlays,feedback,form-inputs,layout-utilities,navigation,patterns}/page.tsx` → matching folders under `apps/web/app/(playground)/playground/`
- `apps/web/.storybook/preview.ts` → `apps/web/.storybook/preview.tsx`

### Modified files

- `apps/web/lib/surfacekit/catalog.ts` and `.test.ts` — canonical nested routes and exact assertions.
- `apps/web/next.config.ts` — seven permanent redirects.
- `packages/ui/src/patterns/app-shell/app-shell.tsx`, `.test.tsx`, and `index.ts` — optional footer slots and exported `ThemeSwitcher`.
- `apps/web/components/playground/playground-shell.tsx` and `.test.tsx` — nested active state, shell footer, sidebar Home action.
- `apps/web/app/(marketing)/page.tsx` and `marketing/page.tsx` — shared navbar actions.
- `apps/web/.storybook/main.ts` — introduction entry and production Vite/Rolldown configuration.
- `apps/web/stories/input-otp.stories.tsx` and `pagination.stories.tsx` — React warning fixes and story assertions.
- `tests/contracts/storybook-dependencies.test.ts` — Storybook production and landing configuration contract.
- `tests/e2e/routes.ts`, `playground.spec.ts`, `workflows.spec.ts`, `marketing.spec.ts`, `a11y.spec.ts`, and `visual.spec.ts` — nested routes, redirects, shell/theme workflows, and path-sensitive branches.
- `apps/web/components/playground/catalog-search.test.tsx` and `apps/web/components/marketing/capability-explorer.test.tsx` — canonical href expectations.
- `package.json` — Storybook initial path.
- `README.md`, `apps/web/README.md`, `packages/ui/README.md`, and `packages/ui/USAGE.md` — current routes, Storybook UX, and shell APIs.
- `docs/audits/2026-08-24-surfacekit-enterprise-readiness.md` — dated note for the completed experience/performance slice without changing the readiness decision.

---

### Task 1: Canonicalize playground routing with permanent redirects

**Files:**

- Create: `apps/web/next.config.test.ts`
- Modify: `apps/web/next.config.ts`
- Modify: `apps/web/lib/surfacekit/catalog.ts`
- Modify: `apps/web/lib/surfacekit/catalog.test.ts`
- Move: `apps/web/app/(playground)/layout.tsx`
- Move: `apps/web/app/(playground)/{data-display,dialogs-overlays,feedback,form-inputs,layout-utilities,navigation,patterns}/page.tsx`
- Modify: `apps/web/app/(playground)/playground/page.tsx`
- Modify: `apps/web/components/playground/catalog-search.test.tsx`
- Modify: `apps/web/components/marketing/capability-explorer.test.tsx`
- Modify: `tests/e2e/routes.ts`
- Modify: `tests/e2e/playground.spec.ts`
- Modify: `tests/e2e/workflows.spec.ts`
- Modify: `tests/e2e/marketing.spec.ts`
- Modify: `tests/e2e/a11y.spec.ts`
- Modify: `tests/e2e/visual.spec.ts`

**Interfaces:**

- Consumes: `surfaceCategories: readonly { id; name; route }[]` and Next.js `NextConfig.redirects`.
- Produces: canonical category routes under `/playground`, plus seven `{ source, destination, permanent: true }` redirect records.

- [ ] **Step 1: Strengthen catalog and redirect tests before implementation**

Add this exact route assertion to `catalog.test.ts`:

```ts
expect(surfaceCategories.map(({ route }) => route)).toEqual([
  "/playground/form-inputs",
  "/playground/navigation",
  "/playground/dialogs-overlays",
  "/playground/data-display",
  "/playground/feedback",
  "/playground/layout-utilities",
  "/playground/patterns",
])
```

Create `next.config.test.ts`, import the default config, call `await nextConfig.redirects?.()`, and assert this complete mapping:

```ts
const expectedRedirects = [
  ["/form-inputs", "/playground/form-inputs"],
  ["/navigation", "/playground/navigation"],
  ["/dialogs-overlays", "/playground/dialogs-overlays"],
  ["/data-display", "/playground/data-display"],
  ["/feedback", "/playground/feedback"],
  ["/layout-utilities", "/playground/layout-utilities"],
  ["/patterns", "/playground/patterns"],
] as const

expect(redirects).toEqual(
  expectedRedirects.map(([source, destination]) => ({
    source,
    destination,
    permanent: true,
  }))
)
```

- [ ] **Step 2: Run the focused tests and record the expected red state**

Run:

```bash
pnpm vitest --run apps/web/lib/surfacekit/catalog.test.ts apps/web/next.config.test.ts
```

Expected: FAIL because catalog routes are still root-level and `redirects` is undefined.

- [ ] **Step 3: Implement the canonical catalog and redirects**

Change each category route in `surfaceCategories` to `/playground/${id}`. Add this configuration to `next.config.ts` while retaining `transpilePackages`:

```ts
const legacyPlaygroundRedirects = [
  ["/form-inputs", "/playground/form-inputs"],
  ["/navigation", "/playground/navigation"],
  ["/dialogs-overlays", "/playground/dialogs-overlays"],
  ["/data-display", "/playground/data-display"],
  ["/feedback", "/playground/feedback"],
  ["/layout-utilities", "/playground/layout-utilities"],
  ["/patterns", "/playground/patterns"],
] as const

const nextConfig: NextConfig = {
  transpilePackages: ["@nwl/surfacekit"],
  async redirects() {
    return legacyPlaygroundRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }))
  },
}
```

- [ ] **Step 4: Move the layout and category pages beneath the real route segment**

Use `git mv` for the eight existing files. Update moved page imports to the `@/components/...` and `@/lib/...` aliases so route depth does not leak into import paths. Keep page metadata and rendered galleries unchanged.

- [ ] **Step 5: Update all active route and direct-link expectations**

Replace root-level category hrefs in unit and browser tests with their nested equivalents. Update path-sensitive branches:

```ts
if (route.path === "/playground/layout-utilities") {
  /* existing check */
}
if (path === "/playground/data-display") {
  /* existing chart wait */
}
```

Add a browser test that navigates to `/form-inputs`, waits for the redirect, and asserts:

```ts
await expect(page).toHaveURL(/\/playground\/form-inputs$/)
await expect(
  page.getByRole("heading", { level: 1, name: "Form Inputs" })
).toBeVisible()
```

- [ ] **Step 6: Run focused routing verification**

Run:

```bash
pnpm vitest --run apps/web/lib/surfacekit/catalog.test.ts apps/web/next.config.test.ts apps/web/components/playground/catalog-search.test.tsx apps/web/components/marketing/capability-explorer.test.tsx
pnpm --filter web typecheck
pnpm --filter web build
```

Expected: PASS; Next build lists `/playground` and all seven nested child routes.

- [ ] **Step 7: Commit the routing slice**

```bash
git add apps/web tests/e2e
git commit -m "feat: nest playground category routes"
```

---

### Task 2: Add shell footer, sidebar Home action, and shared web theme control

**Files:**

- Modify: `packages/ui/src/patterns/app-shell/app-shell.tsx`
- Modify: `packages/ui/src/patterns/app-shell/app-shell.test.tsx`
- Modify: `packages/ui/src/patterns/app-shell/index.ts`
- Modify: `apps/web/components/playground/playground-shell.tsx`
- Modify: `apps/web/components/playground/playground-shell.test.tsx`
- Create: `apps/web/components/marketing/web-shell-actions.tsx`
- Create: `apps/web/components/marketing/web-shell-actions.test.tsx`
- Modify: `apps/web/app/(marketing)/page.tsx`
- Modify: `apps/web/app/(marketing)/marketing/page.tsx`
- Modify: `tests/e2e/workflows.spec.ts`
- Modify: `tests/e2e/marketing.spec.ts`

**Interfaces:**

- Consumes: `useTheme()` from next-themes and `AppSidebar.renderItem` for router-aware anchors.
- Produces: `AppShellProps.footer?: React.ReactNode`, `AppSidebarProps.footer?: React.ReactNode`, and exported `ThemeSwitcher`.

- [ ] **Step 1: Add failing package tests for the new optional shell regions**

Extend `app-shell.test.tsx` with tests that render:

```tsx
<AppShell footer={<span>SurfaceKit footer</span>}>Workspace</AppShell>
```

and assert a `contentinfo` landmark. Render:

```tsx
<AppSidebar
  items={[{ label: "Overview", href: "/playground" }]}
  footer={<a href="/">Home</a>}
/>
```

and assert Home follows the list within the navigation landmark. Mock `next-themes`, click the exported `ThemeSwitcher`, and assert `setTheme("dark")` when `resolvedTheme` is `light`.

- [ ] **Step 2: Run the package test and verify it fails**

Run:

```bash
pnpm vitest --run packages/ui/src/patterns/app-shell/app-shell.test.tsx
```

Expected: FAIL because the optional footer props and exported switcher do not exist.

- [ ] **Step 3: Implement the additive app-shell interfaces**

Add `footer?: React.ReactNode` to both prop interfaces. Structure `AppShell`'s content column as:

```tsx
<div className={cn("flex min-h-screen flex-col", sidebar && "md:ml-72")}>
  <main className={cn("min-w-0 flex-1 p-4 sm:p-6 lg:p-8", mainClassName)}>
    {children}
  </main>
  {footer ? (
    <footer className="border-t border-border px-4 py-5 sm:px-6 lg:px-8">
      {footer}
    </footer>
  ) : null}
</div>
```

Keep the topbar padding and sidebar offsets behaviorally equivalent. Change `AppSidebar` to `flex h-full flex-col`, wrap its label/list in the existing content flow, and render:

```tsx
{
  footer ? (
    <div className="mt-auto border-t border-sidebar-border pt-4">{footer}</div>
  ) : null
}
```

Export `ThemeSwitcher` from `app-shell.tsx`; the existing `index.ts` wildcard export exposes it.

- [ ] **Step 4: Add failing application-shell tests**

Update `playground-shell.test.tsx` to mock `/playground/data-display` and assert:

- Data Display is current;
- Home links to `/`;
- the `contentinfo` landmark contains SurfaceKit identity;
- Browse catalog links to `/playground`.

Create `web-shell-actions.test.tsx`, mock `next-themes`, render the actions, and assert an accessible theme button and a Playground link.

- [ ] **Step 5: Implement playground and marketing composition**

Use `Home` from lucide-react in the playground sidebar footer and render it through the existing Next.js `Link` callback. Supply a concise footer to `AppShell`.

Create `WebShellActions` as a client component:

```tsx
"use client"

export function WebShellActions() {
  return (
    <div className="flex items-center gap-2">
      <ThemeSwitcher />
      <Link
        href="/playground"
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        Playground
      </Link>
    </div>
  )
}
```

Use it as the `WebShellHeader` `cta` on both marketing pages.

- [ ] **Step 6: Add browser assertions for the visible behavior**

In `workflows.spec.ts`, open `/playground/form-inputs`, click the Home link in the sidebar, and assert `/` plus the SurfaceKit page heading. In `marketing.spec.ts`, click the theme button on `/`, assert the document root receives `dark`, reload, and assert persistence.

- [ ] **Step 7: Run focused shell verification**

```bash
pnpm vitest --run packages/ui/src/patterns/app-shell/app-shell.test.tsx apps/web/components/playground/playground-shell.test.tsx apps/web/components/marketing/web-shell-actions.test.tsx
pnpm --filter @nwl/surfacekit typecheck
pnpm --filter web typecheck
```

Expected: PASS with no hydration or landmark warnings.

- [ ] **Step 8: Commit the shell slice**

```bash
git add packages/ui/src/patterns/app-shell apps/web/components apps/web/app tests/e2e
git commit -m "feat: enrich SurfaceKit shell navigation"
```

---

### Task 3: Add Storybook theme control and introduction landing

**Files:**

- Create: `apps/web/.storybook/theme-decorator.tsx`
- Create: `apps/web/.storybook/theme-decorator.test.tsx`
- Move: `apps/web/.storybook/preview.ts` → `apps/web/.storybook/preview.tsx`
- Create: `apps/web/.storybook/introduction.stories.tsx`
- Modify: `apps/web/.storybook/main.ts`
- Modify: `tests/contracts/storybook-dependencies.test.ts`
- Modify: `package.json`

**Interfaces:**

- Consumes: Storybook `globalTypes`, `initialGlobals`, decorators, `options.storySort`, and CLI `--initial-path`.
- Produces: `StoryTheme = "light" | "dark"`, `withSurfaceKitTheme`, and story ID `surfacekit-introduction--overview`.

- [ ] **Step 1: Add failing theme-decorator and configuration contracts**

Create a jsdom test that renders a story through `withSurfaceKitTheme` with `globals.theme = "dark"`, waits for `document.documentElement` to contain `dark`, rerenders light, and asserts removal. After unmount, assert the decorator restores the prior root state.

Extend the Storybook contract test to assert:

```ts
expect(mainConfig).toContain('"./introduction.stories.tsx"')
expect(mainConfig).not.toContain("developmentModeForBuild")
expect(packageJson.scripts.storybook).toContain(
  "--initial-path /?path=/story/surfacekit-introduction--overview"
)
```

- [ ] **Step 2: Run the focused tests and verify the red state**

```bash
pnpm vitest --run apps/web/.storybook/theme-decorator.test.tsx tests/contracts/storybook-dependencies.test.ts
```

Expected: FAIL because the decorator and introduction configuration do not exist and development mode is still enabled.

- [ ] **Step 3: Implement document-root theme synchronization**

Define `StoryTheme`, normalize unknown globals to `light`, and use `React.useLayoutEffect` to update `document.documentElement.classList`, `document.documentElement.style.colorScheme`, and the body background. Cleanup restores the previous class and inline color-scheme value.

Rename `preview.ts` to `preview.tsx` and configure:

```tsx
const preview: Preview = {
  decorators: [withSurfaceKitTheme],
  globalTypes: {
    theme: {
      description: "Color scheme for every SurfaceKit story",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  parameters: {
    /* retain controls and a11y settings */
    options: {
      storySort: {
        order: ["SurfaceKit", ["Introduction", "Components", "Patterns"]],
      },
    },
  },
}
```

- [ ] **Step 4: Create the Introduction story outside the module inventory**

Add `./introduction.stories.tsx` before the public-module glob in `main.ts`. Build the `Overview` story from SurfaceKit `Badge`, `Button`, and `Card` components. Include visible instructions for Canvas, Controls, accessibility results, and the theme toolbar, plus links to `/`, `/playground`, and repository documentation. Use `parameters.layout = "fullscreen"` and a single page-level heading.

- [ ] **Step 5: Configure the local initial path**

Change the root script to:

```json
"storybook": "storybook dev -p 6006 --config-dir apps/web/.storybook --initial-path /?path=/story/surfacekit-introduction--overview"
```

- [ ] **Step 6: Run Storybook configuration and landing verification**

```bash
pnpm vitest --run apps/web/.storybook/theme-decorator.test.tsx tests/contracts/storybook-dependencies.test.ts
pnpm test:storybook -- apps/web/.storybook/introduction.stories.tsx
pnpm --filter web typecheck
```

Expected: PASS; the Storybook suite includes the Introduction file without changing the 70-file public-module contract.

- [ ] **Step 7: Commit the Storybook experience slice**

```bash
git add apps/web/.storybook package.json tests/contracts
git commit -m "feat: add Storybook theme and introduction"
```

---

### Task 4: Remove controlled-input and duplicate-key warnings

**Files:**

- Modify: `apps/web/stories/input-otp.stories.tsx`
- Modify: `apps/web/stories/pagination.stories.tsx`

**Interfaces:**

- Consumes: `InputOTP`'s controlled `value`/`onChange` API and Storybook `play` assertions.
- Produces: `InputOTPExampleProps.initialValue?: string` and unique pagination page windows.

- [ ] **Step 1: Reproduce the warnings with focused, serial Storybook execution**

```bash
pnpm vitest --config vitest.storybook.config.ts --run apps/web/stories/input-otp.stories.tsx apps/web/stories/pagination.stories.tsx --reporter=verbose --maxWorkers=1
```

Expected red evidence: controlled/uncontrolled warning under `Input OTP > Invalid`, duplicate key `1` under `Pagination > First Page`, and duplicate key `12` under `Pagination > Last Page`.

- [ ] **Step 2: Add failing pagination story assertions**

Import `expect` and `within` from `storybook/test`. Add play functions that assert First Page renders links named `Page 1`, `Page 2`, and `Page 3` exactly once, and Last Page renders `Page 10`, `Page 11`, and `Page 12` exactly once. Run the focused pagination story and confirm the boundary assertions fail before implementation.

- [ ] **Step 3: Implement a unique three-page window**

Inside `PaginationExample`, calculate:

```ts
const firstVisiblePage = Math.min(Math.max(page - 1, 1), 10)
const visiblePages = Array.from(
  { length: 3 },
  (_, index) => firstVisiblePage + index
)
```

Map `visiblePages` directly; keep `value` as the key, href suffix, label, and visible text.

- [ ] **Step 4: Convert initialized OTP examples to controlled state**

Replace `defaultValue` with `initialValue` in story props. Initialize local state once and pass only controlled props:

```tsx
const [value, setValue] = React.useState(initialValue ?? "")

<InputOTP value={value} onChange={setValue} /* existing props */>
  {/* existing groups and slots */}
</InputOTP>
```

Update Invalid and Disabled args to use `initialValue`. Keep the public component implementation and API unchanged.

- [ ] **Step 5: Rerun the same serial command and inspect stderr**

Expected: all focused stories pass and output contains none of:

```text
both value and defaultValue props
same key, `1`
same key, `12`
```

- [ ] **Step 6: Run the complete Storybook interaction suite**

```bash
pnpm test:storybook
```

Expected: all public stories plus Introduction pass with no relevant React warnings.

- [ ] **Step 7: Commit the warning-remediation slice**

```bash
git add apps/web/stories/input-otp.stories.tsx apps/web/stories/pagination.stories.tsx
git commit -m "fix: remove Storybook React warnings"
```

---

### Task 5: Reduce the Storybook production runtime chunk

**Files:**

- Modify: `apps/web/.storybook/main.ts`
- Modify: `tests/contracts/storybook-dependencies.test.ts`

**Interfaces:**

- Consumes: Vite `build.rolldownOptions` and optional Rolldown `output.codeSplitting.groups`.
- Produces: a static Storybook build with no JavaScript file above `1,000,000` bytes and no chunk-size warning.

- [ ] **Step 1: Capture the baseline build evidence**

```bash
pnpm build-storybook 2>&1 | tee /tmp/surfacekit-storybook-before.log
find storybook-static/assets -type f -name '*.js' -printf '%s %p\n' | sort -nr | head -10
```

Expected baseline: `iframe-B5IAatM5.js` or its new hash is approximately 1,162,650 bytes and Vite reports a chunk larger than 1,000 kB.

- [ ] **Step 2: Add a failing production-configuration contract**

Extend `storybook-dependencies.test.ts`:

```ts
expect(mainConfig).not.toContain("developmentModeForBuild")
expect(mainConfig).not.toContain("rollupOptions")
expect(mainConfig).toContain("rolldownOptions")
expect(mainConfig).toContain("chunkSizeWarningLimit: 1000")
```

Run `pnpm vitest --run tests/contracts/storybook-dependencies.test.ts` and confirm failure before changing `main.ts`.

- [ ] **Step 3: Restore production mode and migrate the deprecated option**

Remove the `features.developmentModeForBuild` block. Rename `rollupOptions` to `rolldownOptions`, retaining the existing narrow `onwarn` handler unchanged. Keep `chunkSizeWarningLimit: 1000`.

- [ ] **Step 4: Rebuild and enforce the byte limit**

```bash
pnpm build-storybook 2>&1 | tee /tmp/surfacekit-storybook-after-production.log
find storybook-static/assets -type f -name '*.js' -size +1000000c -print
test -z "$(find storybook-static/assets -type f -name '*.js' -size +1000000c -print -quit)"
```

Expected: the final command exits zero and the build log has no chunk-size warning.

- [ ] **Step 5: Apply narrowly scoped splitting only if Step 4 still exceeds the limit**

If and only if the byte assertion fails, add this exact `output` block under `rolldownOptions`:

```ts
output: {
  strictExecutionOrder: true,
  codeSplitting: {
    groups: [
      {
        name: "storybook-runtime",
        test: /node_modules\/(?:@storybook|storybook)\//,
        minSize: 100_000,
        maxSize: 750_000,
        priority: 20,
      },
    ],
  },
},
```

Re-run Step 4. If this grouping changes runtime execution or fails to bring all chunks under the limit, revert the grouping and stop with the measured evidence instead of suppressing the warning.

- [ ] **Step 6: Verify the optimized build remains functional**

```bash
pnpm test:storybook
pnpm vitest --run tests/contracts/storybook-dependencies.test.ts
```

Expected: PASS with all interactions and accessibility checks intact.

- [ ] **Step 7: Commit the production-build slice**

```bash
git add apps/web/.storybook/main.ts tests/contracts/storybook-dependencies.test.ts
git commit -m "perf: optimize Storybook production chunks"
```

---

### Task 6: Reconcile documentation and perform full browser/release verification

**Files:**

- Modify: `README.md`
- Modify: `apps/web/README.md`
- Modify: `packages/ui/README.md`
- Modify: `packages/ui/USAGE.md`
- Modify: `docs/audits/2026-08-24-surfacekit-enterprise-readiness.md`
- Modify only after review: `tests/e2e/visual.spec.ts-snapshots/*.png`

**Interfaces:**

- Consumes: completed canonical routes, shell APIs, Storybook theme/landing behavior, and measured chunk evidence.
- Produces: current operational documentation and final verification evidence.

- [ ] **Step 1: Update current documentation**

Replace root-level category paths with nested paths in both READMEs. Document permanent redirects, the sidebar Home action, app footer, web-navbar theme switch, Storybook Introduction landing, and Storybook light/dark toolbar. Add `ThemeSwitcher`, `AppShell.footer`, and `AppSidebar.footer` examples to UI usage documentation.

Append a dated audit note that states exactly what this slice completed and that it does not resolve the external packaging blockers or change the readiness decision.

- [ ] **Step 2: Scan for stale route and unsupported performance claims**

```bash
rg -n '/(form-inputs|navigation|dialogs-overlays|data-display|feedback|layout-utilities|patterns)' README.md apps/web/README.md packages/ui docs/audits apps/web tests --glob '!**/node_modules/**'
rg -n '100% accessible|bundle size reduced' README.md apps/web/README.md packages/ui/README.md packages/ui/USAGE.md docs/audits/2026-08-24-surfacekit-enterprise-readiness.md
```

Expected: former URLs appear only as documented redirect sources or redirect tests; no placeholder or unsupported claim is introduced.

- [ ] **Step 3: Run focused browser workflows before snapshot changes**

```bash
pnpm --filter web build
pnpm playwright test tests/e2e/marketing.spec.ts tests/e2e/playground.spec.ts tests/e2e/workflows.spec.ts --config playwright.production.config.ts --project=chromium
```

Expected: canonical navigation, legacy redirect, both theme controls, app footer, and Home navigation pass.

- [ ] **Step 4: Inspect visual differences before accepting them**

Run Chromium visual tests without updating snapshots:

```bash
pnpm playwright test tests/e2e/visual.spec.ts --config playwright.production.config.ts --project=chromium
```

Inspect each failure image. Only footer/sidebar changes attributable to this design may be accepted. Then run:

```bash
pnpm playwright test tests/e2e/visual.spec.ts --config playwright.production.config.ts --project=chromium --update-snapshots
pnpm playwright test tests/e2e/visual.spec.ts --config playwright.production.config.ts --project=chromium
```

Expected: reviewed baselines pass on the second run.

- [ ] **Step 5: Perform real-browser QA for the app and Storybook**

Confirm `npx` exists, then use the Playwright CLI wrapper. With the app and Storybook running in separate terminal sessions, validate these flows at desktop and 390×844 mobile size:

```text
http://localhost:3000/ -> toggle theme -> open Playground
/playground -> open Form Inputs -> verify /playground/form-inputs
/playground/form-inputs -> sidebar Home -> /
http://localhost:6006/ -> Introduction -> switch dark/light -> open a portal story
```

For each surface, capture page identity, nonblank DOM, absence of framework overlays, relevant console errors/warnings, one target interaction, and screenshots outside the repository.

- [ ] **Step 6: Apply the React/Next.js best-practices review**

Review edited TSX files for unnecessary client boundaries, duplicated theme state, unstable keys, barrel imports that inflate client bundles, avoidable effects, and hydration mismatches. Correct any issue and rerun its focused test.

- [ ] **Step 7: Run the authoritative release gate on the final tree**

```bash
pnpm verify:ci
```

Expected: formatting, strict lint, type checks, contracts, component coverage, Next build, Storybook build, all Storybook files, environment isolation, and the Chromium/Firefox/WebKit production matrix pass.

- [ ] **Step 8: Review the final graph impact and diff integrity**

Use `build_or_update_graph_tool`, `detect_changes_tool`, `get_affected_flows_tool`, and `query_graph_tool` with `tests_for` for the app-shell and playground-shell files. Then run:

```bash
git diff --check
git status --short
```

Expected: no unreviewed file, whitespace error, missing affected test, or unexplained flow.

- [ ] **Step 9: Commit the documentation and verification slice**

```bash
git add README.md apps/web/README.md packages/ui/README.md packages/ui/USAGE.md docs/audits tests/e2e/visual.spec.ts-snapshots
git commit -m "docs: reconcile playground and Storybook experience"
```

- [ ] **Step 10: Report completion without publishing implicitly**

Report commit SHAs, exact test counts, coverage, largest Storybook chunk before/after, browser QA viewports, visual snapshot decisions, remaining warnings, and worktree cleanliness. Do not push unless the user separately requests it.
