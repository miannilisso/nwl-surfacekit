# SurfaceKit Catalog and Playground Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a typed inventory for all 60 components and 10 patterns, replace the monolithic and duplicated playground implementation with a maintainable shared shell, and render every public module as a real, directly linkable example.

**Architecture:** A server-safe metadata catalog drives navigation, search, counts, and route membership without importing UI implementations. Each category owns a route-specific dynamic demo registry, so unrelated demos do not enter its client graph. A shared AppShell-based layout, preview frame, loading state, and per-demo error boundary provide consistent behavior while preserving all current public URLs.

**Tech Stack:** Next.js 16.3.0 App Router, React 19.2.8 Server and Client Components, TypeScript 5.9.3, `next/link`, `next/navigation`, Vitest 4.1.10, React Testing Library, Playwright 1.62.1, and `@nwl/surfacekit` workspace imports.

## Global Constraints

- Phase 1 in `2026-08-13-surfacekit-package-storybook.md` must be green before this plan begins.
- Preserve `/playground`, `/form-inputs`, `/navigation`, `/dialogs-overlays`, `/data-display`, `/feedback`, `/layout-utilities`, and `/patterns`.
- Every source component and pattern ID must appear exactly once in the catalog and exactly once as a demo file.
- Catalog modules contain serializable metadata only; they do not import React components, hooks, Storybook, or browser APIs.
- Every category route imports only its own registry; no all-demos client barrel is allowed.
- Route pages stay Server Components. Add `"use client"` only to pathname-aware navigation, search, error boundaries, and interactive demos.
- Use Next.js `Link` for internal navigation and follow the installed Next.js 16.3.0 guides in `apps/web/node_modules/next/dist/docs`.
- Use real public SurfaceKit exports. Do not recreate compound components with generic `<div>` and `<button>` markup.
- All examples use deterministic labels, dates, chart values, IDs, and initial state.
- Preserve package APIs; the AppSidebar render hook added here is optional and backward compatible.

---

## File Structure

### Create

- `apps/web/lib/surfacekit/catalog.ts` — server-safe typed inventory and route helpers.
- `apps/web/lib/surfacekit/catalog.test.ts` — count, uniqueness, route, and serialization contracts.
- `apps/web/components/playground/playground-shell.tsx` — pathname-aware AppShell composition.
- `apps/web/components/playground/playground-shell.test.tsx` — active navigation and mobile behavior.
- `apps/web/components/playground/component-preview.tsx` — stable anchors and preview metadata.
- `apps/web/components/playground/component-preview.test.tsx` — accessible preview semantics.
- `apps/web/components/playground/catalog-search.tsx` — client-side query and category filtering.
- `apps/web/components/playground/catalog-search.test.tsx` — filtering and empty results.
- `apps/web/components/playground/demo-error-boundary.tsx` — isolates an individual demo failure.
- `apps/web/components/playground/demo-error-boundary.test.tsx` — fallback and retry behavior.
- `apps/web/components/playground/demo-loading.tsx` — deterministic Skeleton fallback.
- `apps/web/components/playground/demo-grid.tsx` — shared catalog-to-demo renderer.
- `apps/web/components/playground/demos/<id>-demo.tsx` — one focused demo for each of 70 IDs.
- `apps/web/components/playground/registries/<category>.tsx` — route-local dynamic demo maps.
- `apps/web/app/(playground)/layout.tsx` — shared playground layout.
- `apps/web/app/(playground)/error.tsx` — route-level recovery for non-demo failures.
- `apps/web/app/(playground)/loading.tsx` — route transition fallback.
- `tests/e2e/playground.spec.ts` — route inventory, direct anchors, navigation, and representative interactions.

### Replace

- The eight existing playground `page.tsx` implementations with focused overview/category Server Components.

### Modify

- `packages/ui/src/patterns/app-shell/app-shell.tsx` and test/story — optional internal-link renderer.
- `tests/contracts/surface-package-coverage.test.ts` — extend equality to catalog IDs and demo IDs.
- `apps/web/README.md`, `packages/ui/README.md`, `README.md` — catalog and example contribution workflow.

## Authoritative Category Map

| Category           | Route               | Component IDs                                                                                                                                                                       |
| ------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Form Inputs        | `/form-inputs`      | button, button-group, calendar, checkbox, combobox, field, input, input-group, input-otp, label, native-select, radio-group, select, slider, switch, textarea, toggle, toggle-group |
| Navigation         | `/navigation`       | breadcrumb, menubar, navigation-menu, pagination, tabs                                                                                                                              |
| Dialogs & Overlays | `/dialogs-overlays` | alert-dialog, command, context-menu, dialog, drawer, dropdown-menu, hover-card, popover, sheet, toast, tooltip                                                                      |
| Data Display       | `/data-display`     | attachment, avatar, badge, bubble, card, carousel, chart, item, marker, message, message-scroller, progress, table                                                                  |
| Feedback           | `/feedback`         | alert, empty, skeleton, spinner                                                                                                                                                     |
| Layout & Utilities | `/layout-utilities` | accordion, aspect-ratio, collapsible, direction, kbd, resizable, scroll-area, separator, sidebar                                                                                    |
| Patterns           | `/patterns`         | app-shell, auth-shell, confirm-danger-action, data-table-toolbar, error-summary, incident-banner, permission-gate, resource-status, step-up-dialog, web-shell                       |

The six component rows contain exactly 60 unique IDs. The Patterns row contains exactly 10 unique IDs.

## Task 1: Introduce the Typed Catalog and Final Inventory Contract

**Files:**

- Create: `apps/web/lib/surfacekit/catalog.ts`
- Create: `apps/web/lib/surfacekit/catalog.test.ts`
- Modify: `tests/contracts/surface-package-coverage.test.ts`

**Interfaces:**

- Produces: `SurfaceCatalogEntry`, `SurfaceCategory`, `surfaceCatalog`, `surfaceCategories`, `getSurfaceById(id)`, `getSurfacesByCategory(category)`, `getSurfaceCounts()`.
- Consumed by: the shared shell, overview search, category pages, structural test, documentation, and Phase 3 marketing pages.

- [ ] **Step 1: Write the failing catalog tests**

```ts
import { describe, expect, it } from "vitest"
import {
  getSurfaceCounts,
  getSurfacesByCategory,
  surfaceCatalog,
  surfaceCategories,
} from "./catalog"

describe("surface catalog", () => {
  it("contains 60 components and 10 patterns exactly once", () => {
    expect(getSurfaceCounts()).toEqual({
      components: 60,
      patterns: 10,
      total: 70,
    })
    expect(new Set(surfaceCatalog.map((entry) => entry.id))).toHaveSize(70)
  })

  it("assigns every entry to its declared route", () => {
    for (const category of surfaceCategories) {
      const entries = getSurfacesByCategory(category.id)
      expect(entries.length).toBeGreaterThan(0)
      expect(entries.every((entry) => entry.route === category.route)).toBe(
        true
      )
    }
  })

  it("is safe to serialize from a Server Component", () => {
    expect(() => JSON.stringify(surfaceCatalog)).not.toThrow()
    expect(JSON.parse(JSON.stringify(surfaceCatalog))).toEqual(surfaceCatalog)
  })
})
```

- [ ] **Step 2: Run it and verify red**

Run: `pnpm vitest --run apps/web/lib/surfacekit/catalog.test.ts`

Expected: FAIL because `catalog.ts` does not exist.

- [ ] **Step 3: Implement the catalog types and helpers**

```ts
export type SurfaceKind = "component" | "pattern"
export type SurfaceCategory =
  | "form-inputs"
  | "navigation"
  | "dialogs-overlays"
  | "data-display"
  | "feedback"
  | "layout-utilities"
  | "patterns"

export type SurfaceCatalogEntry = {
  readonly id: string
  readonly name: string
  readonly kind: SurfaceKind
  readonly category: SurfaceCategory
  readonly route: string
  readonly description: string
  readonly storyTitle: string
}

export const surfaceCategories = [
  { id: "form-inputs", name: "Form Inputs", route: "/form-inputs" },
  { id: "navigation", name: "Navigation", route: "/navigation" },
  {
    id: "dialogs-overlays",
    name: "Dialogs & Overlays",
    route: "/dialogs-overlays",
  },
  { id: "data-display", name: "Data Display", route: "/data-display" },
  { id: "feedback", name: "Feedback", route: "/feedback" },
  {
    id: "layout-utilities",
    name: "Layout & Utilities",
    route: "/layout-utilities",
  },
  { id: "patterns", name: "Patterns", route: "/patterns" },
] as const
```

Populate `surfaceCatalog` from the Authoritative Category Map. Each `name` is title case, each `description` is one sentence describing user value, and each `storyTitle` matches the Phase 1 story title exactly. Do not derive human copy from filenames at runtime.

- [ ] **Step 4: Extend the structural test before demos exist**

Import `surfaceCatalog`, assert the component/pattern catalog ID sets equal their source-directory sets, and scan `apps/web/components/playground/demos` for `<id>-demo.tsx` filenames.

The directory reader returns an empty list only for `ENOENT`, so the first run reports a meaningful missing-demo set instead of crashing; all other filesystem errors are rethrown.

Run: `pnpm test:contracts`

Expected: FAIL because the demo directory and 70 demo files do not exist; source, test, story, and catalog equality pass.

- [ ] **Step 5: Commit the catalog red baseline**

```bash
git add apps/web/lib/surfacekit tests/contracts/surface-package-coverage.test.ts
git commit -m "test: define the SurfaceKit catalog contract"
```

## Task 2: Add an AppSidebar Internal-Link Extension

**Files:**

- Modify: `packages/ui/src/patterns/app-shell/app-shell.tsx`
- Modify: `packages/ui/src/patterns/app-shell/app-shell.test.tsx`
- Modify: `apps/web/stories/app-shell.stories.tsx`

**Interfaces:**

- Existing: `AppSidebar({ items, label, ...navProps })` continues rendering anchors.
- New: `renderItem?: (item: AppSidebarItem, props: React.ComponentProps<"a">) => React.ReactNode`.
- New export: `AppSidebarItem` so consumers can type render callbacks.

- [ ] **Step 1: Write the failing render-hook test**

```tsx
it("allows an application router to render internal links", () => {
  render(
    <AppSidebar
      items={[{ label: "Components", href: "/playground", active: true }]}
      renderItem={(item, props) => (
        <a {...props} data-router-link="true" href={item.href} />
      )}
    />
  )
  const link = screen.getByRole("link", { name: "Components" })
  expect(link).toHaveAttribute("data-router-link", "true")
  expect(link).toHaveAttribute("aria-current", "page")
})
```

- [ ] **Step 2: Run and verify red**

Run: `pnpm vitest --run packages/ui/src/patterns/app-shell/app-shell.test.tsx`

Expected: FAIL at typecheck or runtime because `renderItem` is not supported.

- [ ] **Step 3: Implement the optional renderer**

Build the default anchor props once, including `href`, `aria-current`, class name, and composed icon/label/badge children. Return `renderItem(item, anchorProps)` when supplied; otherwise return `<a {...anchorProps} />`.

- [ ] **Step 4: Add a RouterIntegration story and verify compatibility**

Run: `pnpm vitest --run packages/ui/src/patterns/app-shell/app-shell.test.tsx && pnpm build-storybook`

Expected: existing stories/tests and the new renderer contract pass.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/patterns/app-shell apps/web/stories/app-shell.stories.tsx
git commit -m "feat: support routed AppSidebar links"
```

## Task 3: Build the Shared Playground Frame

**Files:**

- Create: `apps/web/components/playground/playground-shell.tsx`
- Create: `apps/web/components/playground/playground-shell.test.tsx`
- Create: `apps/web/components/playground/component-preview.tsx`
- Create: `apps/web/components/playground/component-preview.test.tsx`
- Create: `apps/web/components/playground/demo-loading.tsx`
- Create: `apps/web/components/playground/demo-error-boundary.tsx`
- Create: `apps/web/components/playground/demo-error-boundary.test.tsx`
- Create: `apps/web/components/playground/demo-grid.tsx`
- Create: `apps/web/app/(playground)/layout.tsx`

**Interfaces:**

- `PlaygroundShell({ children })` derives active navigation from `usePathname()` and uses AppShell/AppTopbar/AppSidebar.
- `ComponentPreview({ entry, children })` renders a `<section id={entry.id}>` with heading, description, kind badge, and preview region.
- `DemoGrid({ entries, demos })` requires a component for every entry and wraps each in `DemoErrorBoundary` and `ComponentPreview`.

- [ ] **Step 1: Write shell and preview tests**

```tsx
it("marks only the matching route as current", () => {
  vi.mocked(usePathname).mockReturnValue("/data-display")
  render(
    <PlaygroundShell>
      <p>Examples</p>
    </PlaygroundShell>
  )
  expect(screen.getByRole("link", { name: "Data Display" })).toHaveAttribute(
    "aria-current",
    "page"
  )
  expect(screen.getByRole("link", { name: "Navigation" })).not.toHaveAttribute(
    "aria-current"
  )
})

it("gives each preview a stable directly linkable section", () => {
  const entry = surfaceCatalog.find(({ id }) => id === "button")!
  render(
    <ComponentPreview entry={entry}>
      <button>Example</button>
    </ComponentPreview>
  )
  expect(screen.getByRole("region", { name: "Button" })).toHaveAttribute(
    "id",
    "button"
  )
})
```

- [ ] **Step 2: Run and verify red**

Run: `pnpm vitest --run apps/web/components/playground`

Expected: FAIL because the shared components do not exist.

- [ ] **Step 3: Implement the shared components and route layout**

Use `Link` through AppSidebar's `renderItem` callback:

```tsx
renderItem={(item, anchorProps) => (
  <Link {...anchorProps} href={item.href ?? "/playground"} />
)}
```

The route-group layout is a Server Component:

```tsx
import { PlaygroundShell } from "../../components/playground/playground-shell"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PlaygroundShell>{children}</PlaygroundShell>
}
```

- [ ] **Step 4: Implement per-demo error isolation**

`DemoErrorBoundary` catches a child error, logs it once, renders an Alert with “Example unavailable,” and provides a “Retry example” button that resets its key. Its test renders a component that throws, asserts the fallback, disables the throw, clicks retry, and asserts restored content.

- [ ] **Step 5: Verify and commit**

Run: `pnpm vitest --run apps/web/components/playground && pnpm --filter web typecheck`

```bash
git add apps/web/components/playground apps/web/app/'(playground)'/layout.tsx
git commit -m "feat: add the shared playground frame"
```

## Task 4: Replace the Overview with a Searchable Catalog

**Files:**

- Create: `apps/web/components/playground/catalog-search.tsx`
- Create: `apps/web/components/playground/catalog-search.test.tsx`
- Replace: `apps/web/app/(playground)/playground/page.tsx`

**Interfaces:**

- `CatalogSearch({ entries })` filters by case-insensitive name, ID, description, or category and links to `${entry.route}#${entry.id}`.
- `/playground` remains a Server Component and passes serialized catalog data into the client search island.

- [ ] **Step 1: Write the failing search tests**

```tsx
it("filters entries and links directly to the matching example", async () => {
  const user = userEvent.setup()
  render(<CatalogSearch entries={surfaceCatalog} />)
  await user.type(
    screen.getByRole("searchbox", { name: "Search SurfaceKit" }),
    "otp"
  )
  expect(screen.getByRole("link", { name: /Input OTP/ })).toHaveAttribute(
    "href",
    "/form-inputs#input-otp"
  )
  expect(
    screen.queryByRole("link", { name: /Accordion/ })
  ).not.toBeInTheDocument()
})
```

Also test empty-query counts, category filtering, no-results copy, and clearing the query.

- [ ] **Step 2: Run and verify red**

Run: `pnpm vitest --run apps/web/components/playground/catalog-search.test.tsx`

- [ ] **Step 3: Implement the search island and overview**

The overview renders one heading, verified 60/10 counts, seven category cards, and `CatalogSearch`. It does not import a demo or mark the page `"use client"`.

- [ ] **Step 4: Verify the route**

Run: `pnpm --filter web typecheck && pnpm --filter web build`

Expected: `/playground` is built successfully and no longer contains the 1,175-line client component.

- [ ] **Step 5: Commit**

```bash
git add apps/web/components/playground/catalog-search* apps/web/app/'(playground)'/playground/page.tsx
git commit -m "feat: add the SurfaceKit catalog overview"
```

## Task 5: Implement Form, Navigation, and Overlay Demos

**Files:**

- Create 34 demo files for the Form Inputs, Navigation, and Dialogs & Overlays rows in the category map.
- Create: `apps/web/components/playground/registries/form-inputs.tsx`
- Create: `apps/web/components/playground/registries/navigation.tsx`
- Create: `apps/web/components/playground/registries/dialogs-overlays.tsx`
- Replace the three matching route pages.

**Interfaces:**

- Each demo default-exports a zero-prop React component.
- Each registry exports a category-specific `Record<string, React.ComponentType>` and category gallery.
- Category pages call `getSurfacesByCategory(category)` and render the matching gallery.

- [ ] **Step 1: Add the route-level smoke assertions first**

Extend `tests/e2e/playground.spec.ts` with headings and direct anchors for all 34 IDs. Include interactions for Input OTP entry, Combobox selection, Tabs keyboard navigation, Dialog Escape dismissal/focus return, DropdownMenu selection, and Toast creation.

Run: `pnpm playwright test tests/e2e/playground.spec.ts --project=chromium`

Expected: FAIL because the replacement routes/demos do not exist.

- [ ] **Step 2: Create all 18 Form Inputs demos**

Each file composes the complete public module API where applicable. Required interactive outcomes are: form value entry, selection, disabled state, invalid messaging, and controlled state. The Form Inputs registry imports exactly these IDs:

```ts
;[
  "button",
  "button-group",
  "calendar",
  "checkbox",
  "combobox",
  "field",
  "input",
  "input-group",
  "input-otp",
  "label",
  "native-select",
  "radio-group",
  "select",
  "slider",
  "switch",
  "textarea",
  "toggle",
  "toggle-group",
]
```

- [ ] **Step 3: Create all 5 Navigation demos**

Breadcrumb uses real links and a current page; Menubar and NavigationMenu include nested items; Pagination uses page/previous/next exports; Tabs exposes keyboard-switchable panels.

- [ ] **Step 4: Create all 11 Dialogs & Overlays demos**

Every overlay has an accessible title/name and deterministic trigger. Command filters and selects, both menu modules include checkbox/radio/submenu content, and Toast uses `toast.add` with a zero timeout during tests.

- [ ] **Step 5: Replace category pages with Server Components**

Each page exports route metadata, one page heading/description, and its category gallery. Remove copied `navItems`, AppShell, AppTopbar, and AppSidebar declarations because the route-group layout owns them.

- [ ] **Step 6: Run structural and route checks**

Run: `pnpm test:contracts && pnpm --filter web typecheck && pnpm playwright test tests/e2e/playground.spec.ts --project=chromium`

Expected: the contract still fails only for the 36 demos remaining in Tasks 6 and 7; the three completed routes and declared interactions pass.

- [ ] **Step 7: Commit**

```bash
git add apps/web/components/playground/demos apps/web/components/playground/registries/{form-inputs,navigation,dialogs-overlays}.tsx apps/web/app/'(playground)'/{form-inputs,navigation,dialogs-overlays}/page.tsx tests/e2e/playground.spec.ts
git commit -m "feat: add interactive input and overlay playgrounds"
```

## Task 6: Implement Data, Feedback, and Utility Demos

**Files:**

- Create 26 demo files for the Data Display, Feedback, and Layout & Utilities rows.
- Create registries: `data-display.tsx`, `feedback.tsx`, `layout-utilities.tsx`.
- Replace the three matching route pages.

**Interfaces:** same demo and registry contract as Task 5.

- [ ] **Step 1: Add failing route assertions**

Add direct-anchor checks for all 26 IDs plus interactions for Carousel controls, MessageScroller jump-to-latest, DirectionProvider RTL output, Resizable keyboard adjustment, and Sidebar collapse/expand.

Run: `pnpm playwright test tests/e2e/playground.spec.ts --project=chromium`

Expected: FAIL on the new anchors/interactions.

- [ ] **Step 2: Create all 13 Data Display demos**

Chart uses a fixed seven-point dataset and fixed-height container. Message and Bubble show inbound/outbound composition. MessageScroller has enough deterministic messages to overflow. Table includes caption, header, body, and footer. Attachment and Item exercise their actions.

- [ ] **Step 3: Create all 4 Feedback demos**

Alert shows informational and destructive semantics; Empty provides an action; Skeleton labels its surrounding loading region; Spinner appears standalone and inside a disabled Button.

- [ ] **Step 4: Create all 9 Layout & Utilities demos**

Accordion and Collapsible expose working triggers; Direction includes LTR and RTL regions; Resizable and ScrollArea use bounded dimensions; Sidebar includes provider, trigger, header, content, groups, menu, submenu, badge, footer, rail, inset, input, action, and skeleton states across its examples.

- [ ] **Step 5: Replace the three category pages**

Use the same Server Component shape from Task 5 and remove all duplicated shell/navigation code.

- [ ] **Step 6: Verify and commit**

Run: `pnpm test:contracts && pnpm --filter web typecheck && pnpm playwright test tests/e2e/playground.spec.ts --project=chromium`

Expected: contract fails only for the 10 pattern demos; all six component category routes pass.

```bash
git add apps/web/components/playground/demos apps/web/components/playground/registries/{data-display,feedback,layout-utilities}.tsx apps/web/app/'(playground)'/{data-display,feedback,layout-utilities}/page.tsx tests/e2e/playground.spec.ts
git commit -m "feat: complete component playground coverage"
```

## Task 7: Implement All 10 Pattern Demos

**Files:**

- Create demos for: `app-shell`, `auth-shell`, `confirm-danger-action`, `data-table-toolbar`, `error-summary`, `incident-banner`, `permission-gate`, `resource-status`, `step-up-dialog`, `web-shell`.
- Create: `apps/web/components/playground/registries/patterns.tsx`
- Replace: `apps/web/app/(playground)/patterns/page.tsx`

**Interfaces:** consumes the final Phase 1 pattern APIs and fulfills the last 10 demo IDs.

- [ ] **Step 1: Add failing pattern workflow checks**

Test direct anchors for all 10 patterns plus permission allowed/denied switching, toolbar search/filter/export, danger cancel/confirm, incident dismiss, and step-up error/success flows.

- [ ] **Step 2: Create complete live compositions**

- AppShell: bounded shell preview with routed items, topbar actions, and content.
- AuthShell: bounded sign-in composition with labels, inputs, errors, and secondary panel.
- WebShell: bounded public-page composition with header, hero, content, and footer.
- PermissionGate, StepUpDialog, ConfirmDangerAction, and IncidentBanner: controls that expose each conditional/callback state.
- ErrorSummary: linked validation errors that focus or navigate to matching fields.
- ResourceStatus: healthy, warning, critical, and indeterminate resources.
- DataTableToolbar: controlled query plus working create, filter, and export feedback.

- [ ] **Step 3: Replace the Patterns page**

The page contains live examples only; remove prose-only cards that claim behavior without rendering it.

- [ ] **Step 4: Turn the structural gate green**

Run: `pnpm test:contracts`

Expected: PASS with exact equality across 60 component sources, 10 pattern sources, 70 tests, 70 stories, 70 catalog entries, and 70 demo files.

- [ ] **Step 5: Verify and commit**

Run: `pnpm --filter web typecheck && pnpm playwright test tests/e2e/playground.spec.ts --project=chromium`

```bash
git add apps/web/components/playground/demos apps/web/components/playground/registries/patterns.tsx apps/web/app/'(playground)'/patterns/page.tsx tests/e2e/playground.spec.ts tests/contracts/surface-package-coverage.test.ts
git commit -m "feat: add live enterprise pattern playgrounds"
```

## Task 8: Add Route Loading and Failure Recovery

**Files:**

- Create: `apps/web/app/(playground)/loading.tsx`
- Create: `apps/web/app/(playground)/error.tsx`
- Modify: `apps/web/components/playground/demo-loading.tsx`
- Modify: `tests/e2e/playground.spec.ts`

**Interfaces:**

- Route loading uses SurfaceKit Skeleton.
- Route error is a Client Component with `error`, `reset`, error reference copy, and retry action.
- Individual demo failures continue to use `DemoErrorBoundary` without invoking the route error page.

- [ ] **Step 1: Write failing component/browser recovery tests**

Assert the route error has `role="alert"`, displays a stable “Playground unavailable” heading, exposes the error digest when present, and calls `reset` from “Try again.” Assert individual demo fallback does not remove sibling previews.

- [ ] **Step 2: Implement deterministic loading and error UI**

```tsx
"use client"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Alert role="alert" variant="destructive">
      <AlertTitle>Playground unavailable</AlertTitle>
      <AlertDescription>
        This route could not render. Reference: {error.digest ?? "local"}
      </AlertDescription>
      <Button onClick={reset}>Try again</Button>
    </Alert>
  )
}
```

- [ ] **Step 3: Verify and commit**

Run: `pnpm vitest --run apps/web/components/playground && pnpm --filter web typecheck && pnpm --filter web build`

```bash
git add apps/web/app/'(playground)'/{loading,error}.tsx apps/web/components/playground tests/e2e/playground.spec.ts
git commit -m "feat: isolate playground loading and failures"
```

## Task 9: Close the Catalog and Playground Phase

**Files:**

- Modify: `apps/web/README.md`
- Modify: `packages/ui/README.md`
- Modify: `README.md`
- Modify any Phase 2 file required by verified failures.

**Interfaces:** consumes all Phase 2 deliverables and produces a shippable catalog/playground baseline.

- [ ] **Step 1: Document the addition workflow**

```md
To add a SurfaceKit module:

1. Add the package source, barrel, and behavioral test.
2. Add the matching Storybook file.
3. Add one metadata entry to the SurfaceKit catalog.
4. Add `<id>-demo.tsx` and register it in exactly one category registry.
5. Run `pnpm test:contracts` before opening a review.
```

- [ ] **Step 2: Run all Phase 1 and Phase 2 checks**

Run: `pnpm lint && pnpm typecheck && pnpm test:contracts && pnpm test:components:coverage && pnpm test:storybook && pnpm build && pnpm playwright test tests/e2e/playground.spec.ts`

Expected: every command exits 0. All eight playground routes render across Chromium, Firefox, and WebKit; direct anchors exist for all 70 modules; the declared workflows pass.

- [ ] **Step 3: Inspect client boundaries and build output**

Confirm no route page contains `"use client"`, the overview imports metadata only, and each category registry imports only IDs assigned to that route. Review the Next.js build output for unexpected dynamic rendering or bundle warnings and correct the boundary that caused them.

- [ ] **Step 4: Review graph impact**

Update the graph, detect changes, inspect affected flows, and query tests for AppShell, PlaygroundShell, CatalogSearch, DemoGrid, and every changed production module. Resolve any untested changed flow.

- [ ] **Step 5: Commit the verified Phase 2 result**

```bash
git add README.md packages/ui/README.md apps/web/README.md apps/web/lib/surfacekit apps/web/components/playground apps/web/app/'(playground)' tests
git commit -m "docs: document the SurfaceKit playground catalog"
```

## Phase 2 Acceptance Checklist

- [ ] The catalog contains exactly 60 components and 10 patterns with unique IDs.
- [ ] Source, test, story, catalog, and demo sets match exactly.
- [ ] All eight preserved routes use one shared playground shell.
- [ ] The overview is server-rendered and imports no demo implementations.
- [ ] Category routes import no unrelated demo registry.
- [ ] Every component and pattern has a live, real-API, directly linkable example.
- [ ] Chart, Input OTP, and Sidebar are visibly and interactively represented.
- [ ] All 10 patterns are rendered rather than described only in prose.
- [ ] Internal navigation uses Next.js Link through the compatible AppSidebar extension.
- [ ] Demo and route failures have accessible recovery behavior.
- [ ] Cross-browser route and representative workflow tests pass.
