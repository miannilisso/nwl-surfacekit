# SurfaceKit Marketing and Release Gates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the two public pages as credible SurfaceKit compositions, derive all inventory claims from verified catalog data, and establish production-build, accessibility, visual, responsive, cross-browser, and CI release gates for all 10 application routes.

**Architecture:** Marketing pages are Server Components that consume catalog metadata and delegate only interactive previews to narrow Client Components. A shared route fixture drives Playwright smoke, accessibility, and visual suites. CI builds once, serves the production Next.js output, executes Storybook and browser evidence, and rejects unsupported claims or generated artifacts.

**Tech Stack:** Next.js 16.3.0, React 19.2.8, SurfaceKit WebShell and enterprise patterns, Playwright 1.62.1 on Chromium/Firefox/WebKit, axe-core 4.12.1, Vitest 4.1.10, Storybook 8.6.18, GitHub Actions, pnpm 11.18.0, Node.js 20+.

## Global Constraints

- Phases 1 and 2 must be green before this plan begins.
- Preserve `/` and `/marketing`; both must have unique title/description metadata and one visible page-level heading.
- Use catalog-derived `60` component and `10` pattern counts; do not duplicate those literals in page data.
- Do not use “100% accessible,” “battle-tested,” “full coverage,” or equivalent absolutes unless the final evidence literally proves them.
- Describe axe results as “no automatically detectable violations” and retain the limitation that automated checks do not establish complete WCAG conformance.
- Keep static marketing content server-rendered. Only components with state, handlers, or browser APIs become Client Components.
- Internal links use Next.js `Link`; actions have descriptive accessible names and visible keyboard focus.
- CI browser tests run against `next build` plus `next start`, never only `next dev`.
- Visual fixtures are deterministic; disable animations and fix dates/data instead of masking large regions.
- Generated reports and snapshots outside the committed Playwright snapshot directory remain ignored.

---

## File Structure

### Create

- `apps/web/components/marketing/operations-preview.tsx` — interactive enterprise-pattern composition for `/`.
- `apps/web/components/marketing/operations-preview.test.tsx` — search/action/status behavior.
- `apps/web/components/marketing/capability-explorer.tsx` — category and pattern explorer for `/marketing`.
- `apps/web/components/marketing/capability-explorer.test.tsx` — category switching and direct playground links.
- `tests/e2e/routes.ts` — authoritative public/playground route fixtures and screenshot names.
- `tests/e2e/marketing.spec.ts` — content, claims, navigation, and responsive assertions.
- `tests/e2e/workflows.spec.ts` — representative keyboard/pointer flows across the app.
- `playwright.production.config.ts` — production-server browser configuration.
- `.github/workflows/verify.yml` — reproducible full verification workflow.
- `.prettierignore` when absent — generated and dependency directories excluded from formatting checks.

### Modify

- `apps/web/app/layout.tsx` — metadata template and site-level defaults.
- `apps/web/app/(marketing)/page.tsx` — concise landing page.
- `apps/web/app/(marketing)/marketing/page.tsx` — detailed capabilities page.
- `tests/e2e/a11y.spec.ts`, `tests/e2e/smoke.spec.ts`, `tests/e2e/visual.spec.ts` — all-route fixture coverage.
- `playwright.config.ts`, `package.json` — local/production commands and complete verification order.
- `README.md`, `apps/web/README.md`, `packages/ui/README.md`, `packages/ui/USAGE.md` — final evidence and contribution guidance.

## Task 1: Define Shared Route Evidence and Marketing Contracts

**Files:**

- Create: `tests/e2e/routes.ts`
- Create: `tests/e2e/marketing.spec.ts`
- Modify: `tests/e2e/smoke.spec.ts`

**Interfaces:**

- Produces: `marketingRoutes`, `playgroundRoutes`, `applicationRoutes`, `routeSnapshotName(route)`.
- Consumed by: smoke, marketing, accessibility, visual, and workflow suites.

- [ ] **Step 1: Create the exact route fixture**

```ts
export const marketingRoutes = [
  { path: "/", heading: "SurfaceKit", snapshot: "home" },
  {
    path: "/marketing",
    heading: "Built for modern product development",
    snapshot: "marketing",
  },
] as const

export const playgroundRoutes = [
  {
    path: "/playground",
    heading: "Component playground",
    snapshot: "playground",
  },
  { path: "/form-inputs", heading: "Form Inputs", snapshot: "form-inputs" },
  { path: "/navigation", heading: "Navigation", snapshot: "navigation" },
  {
    path: "/dialogs-overlays",
    heading: "Dialogs & Overlays",
    snapshot: "dialogs-overlays",
  },
  { path: "/data-display", heading: "Data Display", snapshot: "data-display" },
  { path: "/feedback", heading: "Feedback", snapshot: "feedback" },
  {
    path: "/layout-utilities",
    heading: "Layout & Utilities",
    snapshot: "layout-utilities",
  },
  { path: "/patterns", heading: "Patterns", snapshot: "patterns" },
] as const

export const applicationRoutes = [
  ...marketingRoutes,
  ...playgroundRoutes,
] as const
```

- [ ] **Step 2: Write failing marketing requirements**

```ts
test("landing page presents verified inventory and primary journeys", async ({
  page,
}) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/SurfaceKit/)
  await expect(
    page.getByRole("heading", { level: 1, name: "SurfaceKit" })
  ).toBeVisible()
  await expect(page.getByText("60", { exact: true })).toBeVisible()
  await expect(page.getByText("10", { exact: true })).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Explore the playground" })
  ).toHaveAttribute("href", "/playground")
})
```

Add assertions that `/marketing` exposes category links, enterprise pattern examples, accessibility limitations, and no banned absolute claim.

- [ ] **Step 3: Run and verify red**

Run: `pnpm playwright test tests/e2e/marketing.spec.ts --project=chromium`

Expected: FAIL on the new headings, link names, derived counts, and evidence wording.

- [ ] **Step 4: Refactor smoke tests onto the shared fixture**

Every route must return a successful response, render its declared heading, expose one `main`, and have no browser console error or page error.

- [ ] **Step 5: Commit the red contracts**

```bash
git add tests/e2e/routes.ts tests/e2e/marketing.spec.ts tests/e2e/smoke.spec.ts
git commit -m "test: define SurfaceKit route contracts"
```

## Task 2: Rebuild the Landing Page

**Files:**

- Create: `apps/web/components/marketing/operations-preview.tsx`
- Create: `apps/web/components/marketing/operations-preview.test.tsx`
- Replace: `apps/web/app/(marketing)/page.tsx`
- Modify: `apps/web/app/layout.tsx`

**Interfaces:**

- `OperationsPreview()` composes IncidentBanner, ResourceStatus, DataTableToolbar, Card, Badge, and feedback from Button/Toast or Alert.
- The page consumes `getSurfaceCounts()` and category data from the server-safe catalog.

- [ ] **Step 1: Write the failing preview behavior test**

```tsx
it("connects search and toolbar actions to visible feedback", async () => {
  const user = userEvent.setup()
  render(<OperationsPreview />)
  await user.type(
    screen.getByRole("searchbox", { name: "Search projects" }),
    "atlas"
  )
  expect(screen.getByText(/Showing results for atlas/)).toBeVisible()
  await user.click(screen.getByRole("button", { name: "Export" }))
  expect(screen.getByRole("status")).toHaveTextContent("Export prepared")
})
```

- [ ] **Step 2: Run and verify red**

Run: `pnpm vitest --run apps/web/components/marketing/operations-preview.test.tsx`

- [ ] **Step 3: Implement a narrow client preview**

The preview owns only query and feedback state. It renders fixed resource data and uses the final Phase 1 callback props; it does not fetch or claim live backend behavior.

- [ ] **Step 4: Replace `/` as a Server Component**

Compose:

1. WebShellHeader with Home, Capabilities, and Playground links;
2. WebHero with exact “SurfaceKit” H1 and “Explore the playground” CTA;
3. catalog-derived component/pattern metrics;
4. three supported value propositions;
5. `OperationsPreview` as a concrete workflow example;
6. evidence language distinguishing tests from guarantees; and
7. WebShellFooter.

Export metadata:

```ts
export const metadata: Metadata = {
  title: "SurfaceKit — Production UI foundations",
  description:
    "Explore 60 components and 10 enterprise patterns for accessible product interfaces.",
}
```

Set the root layout title template to `%s | Naneware Labs` while preserving the site default.

- [ ] **Step 5: Verify green and commit**

Run: `pnpm vitest --run apps/web/components/marketing/operations-preview.test.tsx && pnpm --filter web typecheck && pnpm playwright test tests/e2e/marketing.spec.ts --project=chromium`

```bash
git add apps/web/components/marketing/operations-preview* apps/web/app/'(marketing)'/page.tsx apps/web/app/layout.tsx
git commit -m "feat: rebuild the SurfaceKit landing page"
```

## Task 3: Rebuild the Detailed Marketing Page

**Files:**

- Create: `apps/web/components/marketing/capability-explorer.tsx`
- Create: `apps/web/components/marketing/capability-explorer.test.tsx`
- Replace: `apps/web/app/(marketing)/marketing/page.tsx`

**Interfaces:**

- `CapabilityExplorer({ categories, patterns })` filters/switches catalog groups and links to real route anchors.
- The page remains a Server Component and passes serialized catalog subsets into the client explorer.

- [ ] **Step 1: Write failing explorer tests**

```tsx
it("switches categories and links to the selected component", async () => {
  const user = userEvent.setup()
  render(
    <CapabilityExplorer
      categories={surfaceCategories}
      entries={surfaceCatalog}
    />
  )
  await user.click(screen.getByRole("tab", { name: "Feedback" }))
  expect(screen.getByRole("link", { name: "Alert" })).toHaveAttribute(
    "href",
    "/feedback#alert"
  )
  expect(
    screen.queryByRole("link", { name: "Combobox" })
  ).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run red, then implement the explorer**

Use SurfaceKit Tabs for category selection, Cards for entries, Badges for kind/count, and direct links to playground anchors. Support keyboard tab movement and a compact mobile layout.

- [ ] **Step 3: Replace `/marketing`**

Render the exact H1 “Built for modern product development,” catalog-driven category totals, the explorer, all 10 enterprise-pattern use cases, theming/accessibility guidance, package import examples, and final CTAs. Remove hard-coded category counts and unsupported accessibility/performance claims.

Export unique metadata:

```ts
export const metadata: Metadata = {
  title: "SurfaceKit capabilities",
  description:
    "Review SurfaceKit components, enterprise patterns, testing evidence, and implementation guidance.",
}
```

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest --run apps/web/components/marketing/capability-explorer.test.tsx && pnpm --filter web typecheck && pnpm playwright test tests/e2e/marketing.spec.ts --project=chromium`

```bash
git add apps/web/components/marketing/capability-explorer* apps/web/app/'(marketing)'/marketing/page.tsx
git commit -m "feat: rebuild SurfaceKit capabilities marketing"
```

## Task 4: Run Browser Tests Against Production Next.js

**Files:**

- Create: `playwright.production.config.ts`
- Modify: `playwright.config.ts`
- Modify: `package.json`

**Interfaces:**

- Local focused tests retain the dev-server default.
- `pnpm test:e2e:production` builds once and runs all suites against `next start`.

- [ ] **Step 1: Add a failing production-harness command**

Add `test:e2e:production` referencing the not-yet-created config and run it to verify the missing-config failure.

- [ ] **Step 2: Create the production config**

```ts
import { defineConfig } from "@playwright/test"
import baseConfig from "./playwright.config"

export default defineConfig({
  ...baseConfig,
  webServer: {
    command: "pnpm --filter web start --hostname 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
```

Add scripts:

```json
{
  "test:e2e": "playwright test",
  "test:e2e:production": "pnpm --filter web build && playwright test --config playwright.production.config.ts"
}
```

- [ ] **Step 3: Verify production smoke coverage**

Run: `pnpm --filter web build && pnpm playwright test --config playwright.production.config.ts tests/e2e/smoke.spec.ts`

Expected: all 10 routes pass on Chromium, Firefox, and WebKit against `next start`.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts playwright.production.config.ts package.json
git commit -m "test: run browser checks against production Next.js"
```

## Task 5: Expand Automated Accessibility to Every Route

**Files:**

- Modify: `tests/e2e/a11y.spec.ts`

**Interfaces:** consumes `applicationRoutes` and `@axe-core/playwright`.

- [ ] **Step 1: Replace the three-route loop with all 10 routes**

```ts
for (const route of applicationRoutes) {
  test(`${route.path} has no automatically detectable A/AA violations`, async ({
    page,
  }) => {
    await page.goto(route.path)
    await expect(
      page.getByRole("heading", { level: 1, name: route.heading })
    ).toBeVisible()
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze()
    expect(results.violations).toEqual([])
  })
}
```

- [ ] **Step 2: Run Chromium and preserve every violation as red evidence**

Run: `pnpm playwright test tests/e2e/a11y.spec.ts --project=chromium`

- [ ] **Step 3: Fix violations at their owning component or page**

Every package fix receives a focused regression test before source edits. Page-only composition fixes receive an e2e assertion where practical. Do not disable axe rules globally to make the suite green.

- [ ] **Step 4: Verify and commit**

Run: `pnpm playwright test --config playwright.production.config.ts tests/e2e/a11y.spec.ts --project=chromium`

```bash
git add tests/e2e/a11y.spec.ts apps/web packages/ui/src
git commit -m "test: audit every SurfaceKit route for accessibility"
```

## Task 6: Expand Visual and Responsive Regression Coverage

**Files:**

- Modify: `tests/e2e/visual.spec.ts`
- Create/Update: `tests/e2e/visual.spec.ts-snapshots/*.png`

**Interfaces:** uses `applicationRoutes`, light/dark theme initialization, Desktop Chrome, and a 390×844 mobile viewport.

- [ ] **Step 1: Define deterministic desktop and mobile matrices**

```ts
for (const route of applicationRoutes) {
  for (const theme of ["light", "dark"] as const) {
    test(`${route.snapshot} desktop ${theme}`, async ({ page }) => {
      await setTheme(page, theme)
      await page.goto(route.path)
      await expect(page).toHaveScreenshot(
        `${route.snapshot}-desktop-${theme}.png`,
        {
          fullPage: true,
          animations: "disabled",
        }
      )
    })
  }

  test(`${route.snapshot} mobile light`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await setTheme(page, "light")
    await page.goto(route.path)
    await expect(page).toHaveScreenshot(`${route.snapshot}-mobile-light.png`, {
      fullPage: true,
      animations: "disabled",
    })
  })
}
```

- [ ] **Step 2: Generate and inspect 30 baselines**

Run: `pnpm playwright test tests/e2e/visual.spec.ts --project=chromium --update-snapshots`

Inspect every image for clipped content, horizontal overflow, focus artifacts, loading placeholders, hydration differences, and incorrect dark tokens. Fix UI defects and regenerate only affected images.

- [ ] **Step 3: Prove baseline stability**

Run the same command without `--update-snapshots` twice. Expected: both runs pass with zero pixel diffs.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/visual.spec.ts tests/e2e/visual.spec.ts-snapshots apps/web packages/ui/src
git commit -m "test: cover SurfaceKit responsive visuals"
```

## Task 7: Add Cross-Browser Keyboard Workflows

**Files:**

- Create: `tests/e2e/workflows.spec.ts`

**Interfaces:** exercises the live marketing preview and representative playground primitives on all configured browsers.

- [ ] **Step 1: Add the workflow suite**

Cover these exact outcomes:

1. keyboard navigation from `/` to `/playground`;
2. catalog search for Input OTP and direct-anchor navigation;
3. text entry, checkbox toggle, radio selection, and select/combobox selection;
4. Tabs arrow-key movement;
5. DropdownMenu keyboard selection;
6. Dialog open, Escape dismissal, and trigger focus restoration;
7. Toast creation, accessible text, and dismissal;
8. Sidebar collapse/expand;
9. PermissionGate allowed/denied state; and
10. danger confirmation callback feedback.

Example focus contract:

```ts
test("dialog restores keyboard focus", async ({ page }) => {
  await page.goto("/dialogs-overlays#dialog")
  const trigger = page.getByRole("button", { name: "Open dialog example" })
  await trigger.focus()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("dialog", { name: "Edit profile" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
})
```

- [ ] **Step 2: Run Chromium red/green, then all browsers**

Run: `pnpm playwright test tests/e2e/workflows.spec.ts --project=chromium`

Fix selectors or product behavior based on accessible outcomes, then run:

`pnpm playwright test --config playwright.production.config.ts tests/e2e/workflows.spec.ts`

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/workflows.spec.ts apps/web packages/ui/src
git commit -m "test: cover SurfaceKit keyboard workflows"
```

## Task 8: Wire Reproducible CI and the Final Verification Contract

**Files:**

- Create: `.github/workflows/verify.yml`
- Create: `.prettierignore` if absent
- Modify: `package.json`
- Modify: `.gitignore`

**Interfaces:** produces `pnpm format:check` and a self-contained `pnpm verify:ci` used locally and in GitHub Actions.

- [ ] **Step 1: Add formatting and ordered verification scripts**

```json
{
  "format:check": "prettier --check .",
  "verify:ci": "CI=1 TERM=dumb sh -lc 'pnpm format:check && pnpm lint && pnpm typecheck && pnpm test:contracts && pnpm test:components:coverage && pnpm build && pnpm test:storybook && pnpm test:env && pnpm playwright test --config playwright.production.config.ts'"
}
```

Keep `verify` equivalent to `verify:ci`; do not maintain divergent local and CI definitions.

- [ ] **Step 2: Create the CI workflow**

Use `actions/checkout@v4`, `pnpm/action-setup@v4` with version `11.18.0`, `actions/setup-node@v4` with Node 20 and pnpm cache, `pnpm install --frozen-lockfile`, `pnpm exec playwright install --with-deps chromium firefox webkit`, and `pnpm verify:ci`. Upload Playwright and coverage reports only on failure.

- [ ] **Step 3: Verify generated-output hygiene**

Ensure `.gitignore` and `.prettierignore` cover `.next`, `coverage`, `storybook-static`, `playwright-report`, `test-results`, `.code-review-graph`, `node_modules`, and Turbo output. Confirm `git ls-files` reports no generated Storybook or Playwright report artifacts.

- [ ] **Step 4: Run the complete command locally**

Run: `pnpm verify:ci`

Expected: exit 0 after formatting, lint, types, exact 70-surface contracts, package coverage, Next.js build, Storybook build/tests, environment checks, all-route accessibility, 30 visual baselines, and cross-browser smoke/workflows.

- [ ] **Step 5: Commit CI**

```bash
git add .github/workflows/verify.yml .gitignore .prettierignore package.json
git commit -m "ci: enforce SurfaceKit production readiness"
```

## Task 9: Align Documentation and Perform the Completion Audit

**Files:**

- Modify: `README.md`
- Modify: `apps/web/README.md`
- Modify: `packages/ui/README.md`
- Modify: `packages/ui/USAGE.md`

**Interfaces:** consumes fresh verification evidence and produces the final user/contributor contract.

- [ ] **Step 1: Remove unsupported and stale claims**

Search all tracked Markdown and marketing source for `60+`, `100% accessible`, `100% test coverage`, `battle-tested`, `full coverage`, stale pnpm requirements, stale route categories, and network-specific development URLs. Replace each with catalog-derived facts or precise evidence wording.

- [ ] **Step 2: Document exact guarantees and limitations**

```md
SurfaceKit includes 60 component modules and 10 enterprise patterns. Repository contracts require each module to have a behavioral test, Storybook entry, catalog record, and playground demo. Automated axe checks cover every application route and every tested Storybook story; these checks detect common violations but do not replace manual assistive-technology review.
```

Document Node `>=20`, pnpm `11.18.0`, focused commands, full CI command, route map, snapshot review, API compatibility, and the five-set module contribution workflow.

- [ ] **Step 3: Run a requirement-by-requirement audit**

Create a temporary checklist from Sections 3, 10.2, and 10.4 of the approved design. For each requirement, link it to current file evidence and fresh command output. Any missing, indirect, or skipped evidence remains incomplete and must be fixed before completion.

- [ ] **Step 4: Run final verification after documentation changes**

Run: `pnpm verify:ci`

Expected: exit 0 with no changed snapshots, no lint/type errors, no failed tests, no coverage misses, no console/page errors, and no detected axe violations.

- [ ] **Step 5: Review the final graph and worktree**

Update the knowledge graph, run change detection and affected-flow analysis, query tests for changed production nodes, inspect `git diff --check`, and confirm `git status --short` contains only intended tracked work. Resolve every high-risk untested node in scope.

- [ ] **Step 6: Commit final documentation**

```bash
git add README.md apps/web/README.md packages/ui/README.md packages/ui/USAGE.md
git commit -m "docs: publish verified SurfaceKit guarantees"
```

## Final Acceptance Checklist

- [ ] All 60 components and 10 patterns have behavioral tests, complete stories, catalog records, and live demos.
- [ ] Both marketing routes use SurfaceKit compositions and catalog-derived counts.
- [ ] Unsupported absolute claims are absent from pages and documentation.
- [ ] All 10 routes pass smoke and automated accessibility checks.
- [ ] Thirty declared visual baselines pass reproducibly.
- [ ] Representative keyboard workflows pass on Chromium, Firefox, and WebKit.
- [ ] Package coverage passes 90/90/90/85 globally and 75/75/75/70 per file.
- [ ] Next.js and Storybook production builds pass.
- [ ] CI runs the same complete verification contract as local development.
- [ ] Generated artifacts are ignored and untracked.
- [ ] The final graph review finds no in-scope high-risk changed node without test evidence.
- [ ] Documentation claims match fresh verification output exactly.
