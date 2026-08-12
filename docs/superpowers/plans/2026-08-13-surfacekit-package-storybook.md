# SurfaceKit Package and Storybook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace shallow package checks with behavior-driven coverage for all 60 components and 10 patterns, document every public module through production-quality Storybook stories, and enforce both surfaces in CI.

**Architecture:** Tests remain colocated with package implementations and assert public DOM, interaction, focus, and callback contracts. Storybook remains in `apps/web`, with every story independently executable through the Storybook test runner. A repository contract test enforces exact source/test/story equality and rejects the old export-count scaffold.

**Tech Stack:** React 19.2.8, TypeScript 5.9.3, Vitest 4.1.10, React Testing Library 16.3.2, `@testing-library/user-event` 14.6.4, Storybook 8.6.18, Storybook test runner 0.23.0, axe-playwright 2.2.2, http-server 14.1.1, Base UI 1.6.0, Tailwind CSS 4.3.3, pnpm 11.18.0.

## Global Constraints

- Preserve every existing `@nwl/surfacekit/components/<name>` and `@nwl/surfacekit/patterns/<name>` import path.
- Preserve public runtime APIs unless a new behavioral test demonstrates a concrete defect; every implementation fix starts with a failing test.
- Exercise every public runtime export in its module test; explicitly exclude type-only exports and variant-builder constants from DOM assertions.
- Use role, label, visible content, state, focus, and callback results instead of implementation snapshots.
- Keep `packages/ui` independent of Next.js, Storybook, and `apps/web`.
- Require global coverage of 90% statements, 90% lines, 90% functions, and 85% branches, plus per-file floors of 75% statements/lines/functions and 70% branches.
- Storybook accessibility checks fail on detected WCAG A/AA violations; documentation must not convert automated checks into absolute conformance claims.
- Generated `coverage`, `storybook-static`, `test-results`, and `playwright-report` outputs remain ignored and untracked.
- Follow the repository's installed Next.js 16.3.0 documentation for later application work; this phase does not introduce Next.js runtime dependencies into the package.

---

## File Structure

### Create

- `tests/contracts/surface-package-coverage.test.ts` — exact source/test/story set comparison and scaffold rejection.
- `tests/contracts/test-environment.test.tsx` — proves required browser polyfills and provider helpers.
- `packages/ui/src/test/render.tsx` — minimal shared render helper for direction and tooltip providers.
- `apps/web/.storybook/test-runner.ts` — runs every story, its play function, console-error checks, and axe.

### Modify

- `pnpm-workspace.yaml`, `package.json`, `pnpm-lock.yaml` — pinned test dependencies and stable scripts.
- `vitest.config.ts`, `vitest.setup.ts` — coverage, deterministic browser polyfills, and cleanup.
- `apps/web/.storybook/main.ts`, `apps/web/.storybook/preview.ts` — consistent story docs, themes, viewport, and a11y settings.
- All 60 `packages/ui/src/components/*/*.test.tsx` files — behavioral module contracts.
- All 10 `packages/ui/src/patterns/*/*.test.tsx` files — expanded pattern workflows.
- All 70 `apps/web/stories/*.stories.tsx` files — state coverage, docs, and applicable play functions.
- `packages/ui/README.md`, `packages/ui/USAGE.md`, `apps/web/README.md`, `README.md` — evidence-backed test and Storybook guidance.

## Task 1: Install and Prove the Quality Infrastructure

**Files:**

- Create: `tests/contracts/surface-package-coverage.test.ts`
- Create: `apps/web/.storybook/test-runner.ts`
- Modify: `pnpm-workspace.yaml`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `vitest.config.ts`
- Modify: `apps/web/.storybook/main.ts`
- Modify: `apps/web/.storybook/preview.ts`

**Interfaces:**

- Consumes: source directories named `packages/ui/src/components/<id>` and `packages/ui/src/patterns/<id>`.
- Produces: `pnpm test:contracts`, `pnpm test:components:coverage`, `pnpm test:storybook`, and an exact package-surface contract used by every later task.

- [ ] **Step 1: Add the failing package-surface contract**

```ts
import { readdir, readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { describe, expect, it } from "vitest"

const repositoryRoot = fileURLToPath(new URL("../..", import.meta.url))
const componentsRoot = path.join(repositoryRoot, "packages/ui/src/components")
const patternsRoot = path.join(repositoryRoot, "packages/ui/src/patterns")
const storiesRoot = path.join(repositoryRoot, "apps/web/stories")

async function directories(root: string) {
  return (await readdir(root, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

async function storyIds() {
  return (await readdir(storiesRoot))
    .filter((name) => name.endsWith(".stories.tsx"))
    .map((name) => name.replace(".stories.tsx", ""))
    .sort()
}

describe("SurfaceKit package coverage", () => {
  it("keeps source, colocated tests, and stories in exact sync", async () => {
    const components = await directories(componentsRoot)
    const patterns = await directories(patternsRoot)
    const surface = [...components, ...patterns].sort()

    expect(components).toHaveLength(60)
    expect(patterns).toHaveLength(10)
    expect(await storyIds()).toEqual(surface)

    for (const [kind, ids] of [
      ["components", components],
      ["patterns", patterns],
    ] as const) {
      for (const id of ids) {
        const testPath = path.join(
          repositoryRoot,
          `packages/ui/src/${kind}/${id}/${id}.test.tsx`
        )
        const source = await readFile(testPath, "utf8")
        expect(source, testPath).not.toContain("Object.keys(ComponentModule)")
        expect(source, testPath).toContain("@testing-library")
      }
    }
  })
})
```

- [ ] **Step 2: Run the contract and verify the intended red state**

Run: `pnpm vitest --run tests/contracts/surface-package-coverage.test.ts`

Expected: FAIL on the first scaffolded component test containing `Object.keys(ComponentModule)`; the 60/10 counts and story set equality already pass.

- [ ] **Step 3: Pin direct quality dependencies**

Add these exact catalog entries and root dev dependencies:

```yaml
"@storybook/test": "8.6.18"
"@storybook/test-runner": "0.23.0"
"@testing-library/user-event": "14.6.4"
"@vitest/coverage-v8": "4.1.10"
"axe-playwright": "2.2.2"
"http-server": "14.1.1"
"start-server-and-test": "3.0.12"
```

Run: `pnpm install`

- [ ] **Step 4: Configure package coverage**

Extend `vitest.config.ts` with:

```ts
coverage: {
  provider: "v8",
  include: [
    "packages/ui/src/components/**/*.tsx",
    "packages/ui/src/patterns/**/*.tsx",
  ],
  exclude: [
    "**/*.test.tsx",
    "**/index.ts",
    "packages/ui/src/test/**",
  ],
  reporter: ["text", "json-summary", "html"],
  reportsDirectory: "coverage/surfacekit",
  reportOnFailure: true,
  thresholds: {
    statements: 90,
    lines: 90,
    functions: 90,
    branches: 85,
    "packages/ui/src/{components,patterns}/**/*.tsx": {
      statements: 75,
      lines: 75,
      functions: 75,
      branches: 70,
      perFile: true,
    },
  },
},
```

Typecheck the installed Vitest configuration before proceeding. If Vitest 4.1.10 rejects `perFile` inside the glob threshold, replace that entry with the equivalent supported per-file threshold object; do not weaken either floor.

- [ ] **Step 5: Configure executable Storybook checks**

Create `apps/web/.storybook/test-runner.ts`:

```ts
import type { TestRunnerConfig } from "@storybook/test-runner"
import { checkA11y, injectAxe } from "axe-playwright"

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page)
  },
  async postVisit(page) {
    await checkA11y(page, "#storybook-root", {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
        },
      },
    })
  },
}

export default config
```

Set `parameters.a11y.context` to `#storybook-root`, retain the same WCAG tags in `apps/web/.storybook/preview.ts`, and enable `features.developmentModeForBuild` in `main.ts` so asynchronous story updates are settled during built-story checks.

- [ ] **Step 6: Add stable root scripts**

```json
{
  "test:components": "vitest --run packages/ui/src",
  "test:components:coverage": "vitest --run packages/ui/src --coverage",
  "test:contracts": "vitest --run tests/contracts",
  "storybook:serve": "http-server storybook-static -a 127.0.0.1 -p 6006 -c-1",
  "test:storybook:run": "test-storybook --config-dir apps/web/.storybook --url http://127.0.0.1:6006 --ci --failOnConsole",
  "test:storybook": "pnpm build-storybook && start-test storybook:serve http://127.0.0.1:6006 test:storybook:run"
}
```

- [ ] **Step 7: Verify infrastructure failure modes**

Run: `pnpm typecheck && pnpm test:contracts && pnpm test:components:coverage`

Expected: typecheck passes; contract and coverage fail because the scaffold tests have not yet been replaced. Record the failing module names and coverage summary as the Phase 1 red baseline.

- [ ] **Step 8: Commit the infrastructure**

```bash
git add pnpm-workspace.yaml package.json pnpm-lock.yaml vitest.config.ts tests/contracts apps/web/.storybook
git commit -m "test: enforce SurfaceKit quality contracts"
```

## Task 2: Make Browser-Dependent Tests Deterministic

**Files:**

- Create: `tests/contracts/test-environment.test.tsx`
- Create: `packages/ui/src/test/render.tsx`
- Modify: `vitest.setup.ts`

**Interfaces:**

- Consumes: React Testing Library's `render`, `DirectionProvider`, and `TooltipProvider`.
- Produces: `renderSurface(ui, options?)`, deterministic `matchMedia`, `ResizeObserver`, `scrollIntoView`, and pointer behavior for later suites.

- [ ] **Step 1: Write the failing environment contract**

```tsx
import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { useDirection } from "@nwl/surfacekit/components/direction"
import { surfaceWrapper } from "../../packages/ui/src/test/render"

describe("SurfaceKit test environment", () => {
  it("provides deterministic browser APIs", () => {
    expect(window.matchMedia("(min-width: 768px)").matches).toBe(false)
    expect(globalThis.ResizeObserver).toBeTypeOf("function")
    expect(Element.prototype.scrollIntoView).toBeTypeOf("function")
  })

  it("wraps components in the default direction provider", () => {
    const { result } = renderHook(() => useDirection(), {
      wrapper: surfaceWrapper,
    })
    expect(result.current).toBe("ltr")
  })
})
```

- [ ] **Step 2: Run it and verify red**

Run: `pnpm vitest --run tests/contracts/test-environment.test.tsx`

Expected: FAIL because `packages/ui/src/test/render.tsx` and at least one browser polyfill do not exist.

- [ ] **Step 3: Add explicit polyfills and the provider helper**

```tsx
import type { PropsWithChildren, ReactElement } from "react"
import { render, type RenderOptions } from "@testing-library/react"
import { DirectionProvider } from "../components/direction"
import { TooltipProvider } from "../components/tooltip"

export function surfaceWrapper({ children }: PropsWithChildren) {
  return (
    <DirectionProvider direction="ltr">
      <TooltipProvider>{children}</TooltipProvider>
    </DirectionProvider>
  )
}

export function renderSurface(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: surfaceWrapper, ...options })
}
```

In `vitest.setup.ts`, install deterministic `matchMedia`, `ResizeObserver`, `IntersectionObserver`, `scrollIntoView`, `setPointerCapture`, `releasePointerCapture`, and `hasPointerCapture` shims only when jsdom does not provide them. Keep Testing Library cleanup enabled after every test.

- [ ] **Step 4: Run focused and baseline suites**

Run: `pnpm vitest --run tests/contracts/test-environment.test.tsx packages/ui/src/components/button/button.test.tsx`

Expected: PASS with no unhandled errors or React act warnings.

- [ ] **Step 5: Commit the deterministic environment**

```bash
git add vitest.setup.ts tests/contracts/test-environment.test.tsx packages/ui/src/test/render.tsx
git commit -m "test: stabilize SurfaceKit browser primitives"
```

## Task 3: Cover Foundation and Display Primitives

**Files:**

- Modify tests and stories for: `aspect-ratio`, `avatar`, `badge`, `button`, `button-group`, `card`, `kbd`, `label`, `separator`, `skeleton`, `spinner`.
- Modify implementation only when a focused new test demonstrates a defect in one of those modules.

**Interfaces:**

- Consumes: `renderSurface`, Testing Library role queries, Storybook CSF3, `@storybook/test`.
- Produces: behavioral and story coverage for 11 modules and all of their public runtime subcomponents.

- [ ] **Step 1: Replace the 11 shallow suites with the exact contracts below**

| Module      | Required unit evidence                                     | Required stories                               |
| ----------- | ---------------------------------------------------------- | ---------------------------------------------- |
| AspectRatio | renders child; forwards ratio style and class              | Default, Square, Portrait                      |
| Avatar      | image/fallback semantics; group/count/badge composition    | Image, Fallback, Group, Status                 |
| Badge       | renders text; variant and `render` composition             | Default, Variants, AsLink                      |
| Button      | accessible button/link; variants; sizes; disabled; click   | Variants, Sizes, Disabled, AsLink, Destructive |
| ButtonGroup | group composition; separator/text; orientation             | Horizontal, Vertical, WithText                 |
| Card        | header/title/description/action/content/footer composition | Default, WithAction, Dense, LongContent        |
| Kbd         | key text; grouped shortcut semantics                       | Single, ShortcutGroup                          |
| Label       | labels a control; disabled styling propagation             | Default, DisabledControl                       |
| Separator   | horizontal/vertical orientation and decorative behavior    | Horizontal, Vertical                           |
| Skeleton    | forwards size/class and remains non-interactive            | Text, Avatar, CardLoading                      |
| Spinner     | status name and custom class/size                          | Default, InButton, Labeled                     |

Use this concrete interaction shape for Button and equivalent role-first assertions for the other modules:

```tsx
it("supports activation and disabled state", async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Save changes</Button>)

  await user.click(screen.getByRole("button", { name: "Save changes" }))
  expect(onClick).toHaveBeenCalledOnce()

  render(<Button disabled>Delete account</Button>)
  expect(screen.getByRole("button", { name: "Delete account" })).toBeDisabled()
})
```

- [ ] **Step 2: Run the new tests before implementation edits**

Run: `pnpm vitest --run packages/ui/src/components/{aspect-ratio,avatar,badge,button,button-group,card,kbd,label,separator,skeleton,spinner}`

Expected: assertions either characterize the current API successfully or expose a specific semantic/interaction defect. Any defect must remain red until fixed in its module source.

- [ ] **Step 3: Fix only demonstrated defects and rerun green**

Run the same command after each source edit. Expected: all 11 files pass without console warnings.

- [ ] **Step 4: Expand the 11 Storybook entries**

Every meta uses `tags: ["autodocs"]`, the title family `SurfaceKit/Components/<Category>/<Name>`, and a component description. Interactive stories use:

```tsx
play: async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const button = canvas.getByRole("button", { name: "Save changes" })
  await userEvent.click(button)
  await expect(button).toHaveFocus()
}
```

- [ ] **Step 5: Verify this slice**

Run: `pnpm vitest --run packages/ui/src/components/{aspect-ratio,avatar,badge,button,button-group,card,kbd,label,separator,skeleton,spinner} && pnpm build-storybook`

Expected: targeted tests and Storybook build pass.

- [ ] **Step 6: Commit foundation coverage**

```bash
git add packages/ui/src/components/{aspect-ratio,avatar,badge,button,button-group,card,kbd,label,separator,skeleton,spinner} apps/web/stories/{aspect-ratio,avatar,badge,button,button-group,card,kbd,label,separator,skeleton,spinner}.stories.tsx
git commit -m "test: cover SurfaceKit foundation primitives"
```

## Task 4: Cover Atomic Form Controls

**Files:**

- Modify tests and stories for: `checkbox`, `input`, `input-otp`, `native-select`, `radio-group`, `slider`, `switch`, `textarea`, `toggle`, `toggle-group`.

**Interfaces:**

- Consumes: accessible form roles, `userEvent`, controlled and uncontrolled Base UI props.
- Produces: behavioral and story coverage for 10 atomic controls.

- [ ] **Step 1: Implement these module contracts**

| Module       | Required unit evidence                                                    | Required stories                            |
| ------------ | ------------------------------------------------------------------------- | ------------------------------------------- |
| Checkbox     | label/name; unchecked-to-checked; controlled state; disabled              | Unchecked, Checked, Indeterminate, Disabled |
| Input        | label association; typing; invalid/disabled/read-only; type forwarding    | Default, Types, Invalid, Disabled           |
| Input OTP    | digit entry; slots; separator; max length; disabled                       | Default, Grouped, Invalid, Disabled         |
| NativeSelect | label; option selection; optgroup; disabled                               | Default, Groups, Disabled, Invalid          |
| RadioGroup   | labeled group; arrow-key selection; controlled value; disabled item       | Default, Horizontal, DisabledItem, Invalid  |
| Slider       | accessible name; keyboard increment/decrement; controlled value; disabled | Default, Range, Steps, Disabled             |
| Switch       | label/name; toggling; controlled checked; disabled                        | Off, On, Disabled                           |
| Textarea     | label association; multiline entry; invalid/disabled/read-only            | Default, Invalid, Disabled, LongContent     |
| Toggle       | pressed state; click/keyboard; variants; disabled                         | Default, Pressed, Variants, Disabled        |
| ToggleGroup  | single/multiple selection; orientation; disabled item                     | Single, Multiple, Vertical, DisabledItem    |

Concrete controlled-control pattern:

```tsx
function ControlledSwitch() {
  const [checked, setChecked] = React.useState(false)
  return (
    <Switch
      aria-label="Enable alerts"
      checked={checked}
      onCheckedChange={setChecked}
    />
  )
}

it("supports controlled state", async () => {
  const user = userEvent.setup()
  render(<ControlledSwitch />)
  const control = screen.getByRole("switch", { name: "Enable alerts" })
  expect(control).not.toBeChecked()
  await user.click(control)
  expect(control).toBeChecked()
})
```

- [ ] **Step 2: Run red/characterization tests**

Run: `pnpm vitest --run packages/ui/src/components/{checkbox,input,input-otp,native-select,radio-group,slider,switch,textarea,toggle,toggle-group}`

Expected: every assertion executes real controls; record and fix only concrete failures.

- [ ] **Step 3: Add the declared Storybook states and play functions**

Use play functions for Checkbox, Input OTP, RadioGroup, Slider, Switch, Toggle, and ToggleGroup. Each play function asserts the final accessible state, not just callback invocation.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest --run packages/ui/src/components/{checkbox,input,input-otp,native-select,radio-group,slider,switch,textarea,toggle,toggle-group} && pnpm build-storybook`

```bash
git add packages/ui/src/components/{checkbox,input,input-otp,native-select,radio-group,slider,switch,textarea,toggle,toggle-group} apps/web/stories/{checkbox,input,input-otp,native-select,radio-group,slider,switch,textarea,toggle,toggle-group}.stories.tsx
git commit -m "test: cover SurfaceKit form controls"
```

## Task 5: Cover Compound Form Systems

**Files:**

- Modify tests and stories for: `calendar`, `combobox`, `field`, `input-group`, `select`.

**Interfaces:**

- Consumes: the atomic controls from Task 4.
- Produces: tested compound form composition, selection, errors, descriptions, and keyboard workflows.

- [ ] **Step 1: Implement these exact contracts**

| Module     | Required unit evidence                                                                 | Required stories                                 |
| ---------- | -------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Calendar   | grid/name; selected day; keyboard day movement; disabled dates; custom day button      | Single, Range, DisabledDates, MultipleMonths     |
| Combobox   | labeled input; open/filter/select/clear; empty/group/label/separator; chips; disabled  | Default, Grouped, Empty, MultipleChips, Disabled |
| Field      | label/control association; description; fieldset/legend; error list; horizontal layout | Default, Required, Invalid, FieldSet, Horizontal |
| InputGroup | addon/text/button/input/textarea composition; focus; disabled child                    | Prefix, Suffix, Button, Textarea, Disabled       |
| Select     | labeled trigger; open/select; group/label/separator; scroll controls; disabled item    | Default, Groups, DisabledItem, LongList, Invalid |

Concrete Select interaction:

```tsx
it("selects an option with the keyboard", async () => {
  const user = userEvent.setup()
  render(
    <Select defaultValue="starter">
      <SelectTrigger aria-label="Plan">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="starter">Starter</SelectItem>
        <SelectItem value="enterprise">Enterprise</SelectItem>
      </SelectContent>
    </Select>
  )
  const trigger = screen.getByRole("combobox", { name: "Plan" })
  await user.click(trigger)
  await user.keyboard("{ArrowDown}{Enter}")
  expect(trigger).toHaveTextContent("Enterprise")
})
```

- [ ] **Step 2: Run focused tests and preserve every observed red failure**

Run: `pnpm vitest --run packages/ui/src/components/{calendar,combobox,field,input-group,select}`

- [ ] **Step 3: Fix demonstrated package defects and add all declared stories**

Overlay-based stories set deterministic widths and use play functions to prove keyboard selection and focus return.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest --run packages/ui/src/components/{calendar,combobox,field,input-group,select} && pnpm build-storybook`

```bash
git add packages/ui/src/components/{calendar,combobox,field,input-group,select} apps/web/stories/{calendar,combobox,field,input-group,select}.stories.tsx
git commit -m "test: cover SurfaceKit compound forms"
```

## Task 6: Cover Disclosure and Navigation Modules

**Files:**

- Modify tests and stories for: `accordion`, `breadcrumb`, `collapsible`, `menubar`, `navigation-menu`, `pagination`, `tabs`.

**Interfaces:**

- Consumes: keyboard events, real anchor rendering, and compound navigation APIs.
- Produces: protected disclosure, current-page, selection, and roving-focus behavior.

- [ ] **Step 1: Implement these exact contracts**

| Module         | Required unit evidence                                                               | Required stories                           |
| -------------- | ------------------------------------------------------------------------------------ | ------------------------------------------ |
| Accordion      | trigger expanded state; content visibility; single/multiple; disabled item; keyboard | Single, Multiple, Disabled, LongContent    |
| Breadcrumb     | navigation label; list/item/link/page/separator/ellipsis semantics                   | Default, Collapsed, LongPath               |
| Collapsible    | expanded state; content visibility; controlled open; disabled trigger                | Closed, Open, Controlled, Disabled         |
| Menubar        | menu open; arrow movement; item selection; checkbox/radio/submenu; disabled item     | Default, CheckedItems, RadioItems, Submenu |
| NavigationMenu | navigation landmark; trigger/content; link; indicator/positioner; keyboard           | Default, WithContent, ActiveLink, Compact  |
| Pagination     | navigation label; page links; current page; previous/next; ellipsis                  | Default, MiddlePage, FirstPage, LastPage   |
| Tabs           | tablist; selected tab/panel; keyboard movement; disabled tab; list variants          | Default, Underline, DisabledTab, Overflow  |

Concrete accordion interaction:

```tsx
it("opens an item and exposes its region", async () => {
  const user = userEvent.setup()
  render(
    <Accordion>
      <AccordionItem value="billing">
        <AccordionTrigger>Billing</AccordionTrigger>
        <AccordionContent>Invoice settings</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
  const trigger = screen.getByRole("button", { name: "Billing" })
  expect(trigger).toHaveAttribute("aria-expanded", "false")
  await user.click(trigger)
  expect(trigger).toHaveAttribute("aria-expanded", "true")
  expect(screen.getByText("Invoice settings")).toBeVisible()
})
```

- [ ] **Step 2: Run focused tests, repair only proven defects, and add stories**

Run: `pnpm vitest --run packages/ui/src/components/{accordion,breadcrumb,collapsible,menubar,navigation-menu,pagination,tabs}`

- [ ] **Step 3: Verify and commit**

Run: `pnpm vitest --run packages/ui/src/components/{accordion,breadcrumb,collapsible,menubar,navigation-menu,pagination,tabs} && pnpm build-storybook`

```bash
git add packages/ui/src/components/{accordion,breadcrumb,collapsible,menubar,navigation-menu,pagination,tabs} apps/web/stories/{accordion,breadcrumb,collapsible,menubar,navigation-menu,pagination,tabs}.stories.tsx
git commit -m "test: cover SurfaceKit navigation"
```

## Task 7: Cover Dialog and Floating Overlay Modules

**Files:**

- Modify tests and stories for: `alert-dialog`, `dialog`, `drawer`, `hover-card`, `popover`, `sheet`, `tooltip`.

**Interfaces:**

- Consumes: portal-capable jsdom environment and `renderSurface`.
- Produces: verified accessible naming, focus transfer/restoration, dismissal, and portal composition.

- [ ] **Step 1: Implement these exact contracts**

| Module      | Required unit evidence                                                                  | Required stories                                |
| ----------- | --------------------------------------------------------------------------------------- | ----------------------------------------------- |
| AlertDialog | trigger; alertdialog name/description; cancel/action; focus return; media/header/footer | Default, Destructive, WithMedia, LongContent    |
| Dialog      | trigger; dialog name/description; close/Escape; overlay/portal; focus return            | Default, FormDialog, LongContent, InitiallyOpen |
| Drawer      | trigger; title/description; close; swipe handle; header/footer; focus return            | Bottom, Left, FormDrawer, InitiallyOpen         |
| HoverCard   | pointer/focus trigger; content visibility; dismissal                                    | Default, RichContent, Delayed                   |
| Popover     | trigger; title/description/header/content; Escape/outside dismissal; focus return       | Default, FormPopover, Controlled                |
| Sheet       | trigger; side variants; title/description; close/Escape; focus return                   | Right, Left, Top, Bottom                        |
| Tooltip     | accessible description; hover/focus open; Escape dismissal; provider composition        | Default, Sides, KeyboardFocus, LongContent      |

Concrete focus-restoration contract:

```tsx
it("restores focus after Escape dismissal", async () => {
  const user = userEvent.setup()
  render(
    <Dialog>
      <DialogTrigger>Open profile</DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>Update account details.</DialogDescription>
      </DialogContent>
    </Dialog>
  )
  const trigger = screen.getByRole("button", { name: "Open profile" })
  await user.click(trigger)
  expect(
    await screen.findByRole("dialog", { name: "Edit profile" })
  ).toBeVisible()
  await user.keyboard("{Escape}")
  expect(trigger).toHaveFocus()
})
```

- [ ] **Step 2: Run tests before source changes**

Run: `pnpm vitest --run packages/ui/src/components/{alert-dialog,dialog,drawer,hover-card,popover,sheet,tooltip}`

- [ ] **Step 3: Fix only reproduced defects and add interaction stories**

Every open/close story asserts the overlay role and trigger focus after dismissal.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest --run packages/ui/src/components/{alert-dialog,dialog,drawer,hover-card,popover,sheet,tooltip} && pnpm build-storybook`

```bash
git add packages/ui/src/components/{alert-dialog,dialog,drawer,hover-card,popover,sheet,tooltip} apps/web/stories/{alert-dialog,dialog,drawer,hover-card,popover,sheet,tooltip}.stories.tsx
git commit -m "test: cover SurfaceKit overlays"
```

## Task 8: Cover Command, Menu, and Toast Workflows

**Files:**

- Modify tests and stories for: `command`, `context-menu`, `dropdown-menu`, `toast`.

**Interfaces:**

- Consumes: keyboard navigation, portals, controlled state, `createToastManager`, and public toast hooks.
- Produces: verified command filtering, menu selection variants, nested menus, and notification lifecycle.

- [ ] **Step 1: Implement these exact contracts**

| Module       | Required unit evidence                                                                                      | Required stories                     |
| ------------ | ----------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Command      | search filtering; empty state; group/item/shortcut/separator; dialog open/close; keyboard select            | Palette, Empty, Groups, Dialog       |
| ContextMenu  | context-menu trigger; item; checkbox; radio; submenu; disabled item; Escape/focus                           | Default, Checkbox, Radio, Submenu    |
| DropdownMenu | trigger; item; checkbox; radio; submenu; disabled item; Escape/focus return                                 | Default, Checkbox, Radio, Submenu    |
| Toast        | manager `add`/`update`/`close`; provider/viewport; title/description/action/close/content; dismissal; limit | Success, Error, WithAction, Multiple |

Concrete toast manager contract:

```tsx
it("adds, updates, and dismisses a toast through the public manager", async () => {
  const user = userEvent.setup()
  const manager = createToastManager()
  render(<Toaster toastManager={manager} />)
  const id = manager.add({
    title: "Saved",
    description: "Changes published",
    timeout: 0,
  })
  expect(await screen.findByText("Saved")).toBeVisible()
  manager.update(id, { description: "Changes are live" })
  expect(await screen.findByText("Changes are live")).toBeVisible()
  await user.click(screen.getByRole("button", { name: "Close toast" }))
  expect(screen.queryByText("Saved")).not.toBeInTheDocument()
})
```

Replace the incorrect hand-written `ToastManagerWithPush.push` extension with the Base UI manager's real `add`, `update`, `close`, and `promise` contract. Export an accurate `ToastManager` type and retain `ToastManagerWithPush` as a deprecated type alias for source compatibility. Update consumers to call `toast.add(...)`; no unsafe cast remains.

- [ ] **Step 2: Run focused tests and preserve red failures**

Run: `pnpm vitest --run packages/ui/src/components/{command,context-menu,dropdown-menu,toast}`

- [ ] **Step 3: Implement any test-proven fixes and the declared stories**

All four default stories include play functions and assert selected output or visible feedback.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest --run packages/ui/src/components/{command,context-menu,dropdown-menu,toast} && pnpm build-storybook`

```bash
git add packages/ui/src/components/{command,context-menu,dropdown-menu,toast} apps/web/stories/{command,context-menu,dropdown-menu,toast}.stories.tsx
git commit -m "test: cover SurfaceKit command workflows"
```

## Task 9: Cover Content, Status, and Data Presentation

**Files:**

- Modify tests and stories for: `alert`, `attachment`, `bubble`, `empty`, `item`, `marker`, `message`, `progress`, `table`.

**Interfaces:**

- Consumes: semantic HTML, status roles, public composition children, and variant APIs.
- Produces: verified semantics and composition for nine content modules.

- [ ] **Step 1: Implement these exact contracts**

| Module     | Required unit evidence                                                            | Required stories                                |
| ---------- | --------------------------------------------------------------------------------- | ----------------------------------------------- |
| Alert      | alert role; title/description/action; variants                                    | Info, Success, Warning, Destructive, WithAction |
| Attachment | group/media/content/title/description/actions/trigger; removal callback           | File, Image, Group, Uploading, Error            |
| Bubble     | group/content/reactions; sent/received variants; reaction action                  | Incoming, Outgoing, Group, Reactions            |
| Empty      | heading/description/media/content composition; action                             | Default, Search, Permission, Compact            |
| Item       | group/header/footer/media/content/actions/separator; link composition             | Default, WithMedia, WithActions, Group          |
| Marker     | icon/content; variants; rendered element                                          | Default, Variants, WithContent                  |
| Message    | group/header/avatar/content/footer composition; ordering                          | Incoming, Outgoing, Thread, LongContent         |
| Progress   | accessible name/value; track/indicator/label/value; indeterminate                 | Default, Complete, Indeterminate, Labeled       |
| Table      | table/caption/header/body/footer/row/header-cell/cell semantics; overflow wrapper | Default, Dense, Empty, LongContent              |

Concrete progress contract:

```tsx
it("exposes progress value and composed labels", () => {
  render(
    <Progress value={64}>
      <ProgressLabel>Migration</ProgressLabel>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
      <ProgressValue />
    </Progress>
  )
  expect(
    screen.getByRole("progressbar", { name: "Migration" })
  ).toHaveAttribute("aria-valuenow", "64")
})
```

- [ ] **Step 2: Run tests, fix only demonstrated defects, and expand stories**

Run: `pnpm vitest --run packages/ui/src/components/{alert,attachment,bubble,empty,item,marker,message,progress,table}`

- [ ] **Step 3: Verify and commit**

Run: `pnpm vitest --run packages/ui/src/components/{alert,attachment,bubble,empty,item,marker,message,progress,table} && pnpm build-storybook`

```bash
git add packages/ui/src/components/{alert,attachment,bubble,empty,item,marker,message,progress,table} apps/web/stories/{alert,attachment,bubble,empty,item,marker,message,progress,table}.stories.tsx
git commit -m "test: cover SurfaceKit data presentation"
```

## Task 10: Cover Advanced Layout, Data, and Provider Modules

**Files:**

- Modify tests and stories for: `carousel`, `chart`, `direction`, `message-scroller`, `resizable`, `scroll-area`, `sidebar`.

**Interfaces:**

- Consumes: deterministic observers, chart fixtures, resize events, sidebar cookies disabled in tests, and provider hooks.
- Produces: verified advanced module APIs and all public runtime hooks/subcomponents.

- [ ] **Step 1: Implement these exact contracts**

| Module          | Required unit evidence                                                                                                              | Required stories                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Carousel        | region/item semantics; previous/next state; API callback; orientation; `useCarousel` guard                                          | Default, Multiple, Vertical, Looping              |
| Chart           | container/config CSS; tooltip content; legend content; style output; empty series                                                   | Line, Bar, MultipleSeries, Tooltip, Empty         |
| Direction       | default hook; provider override; nested override                                                                                    | LTR, RTL, Nested                                  |
| MessageScroller | provider/hooks; viewport/content/item; scroll button visibility; scroll-to-latest                                                   | ShortThread, Overflow, NewMessage, LoadingHistory |
| Resizable       | group/panels/handle semantics; horizontal/vertical; handle icon; keyboard resize                                                    | Horizontal, Vertical, WithHandle                  |
| ScrollArea      | viewport content; vertical/horizontal bars; long content                                                                            | Vertical, Horizontal, BothAxes                    |
| Sidebar         | provider/hook; desktop/mobile open state; trigger/rail; inset/header/footer/content/groups/menu/submenu/badge/action/skeleton/input | Desktop, Collapsed, Mobile, NestedMenu, Loading   |

Concrete provider guard pattern:

```tsx
it("throws a useful error outside its provider", () => {
  const consoleError = vi
    .spyOn(console, "error")
    .mockImplementation(() => undefined)
  expect(() => renderHook(() => useSidebar())).toThrow(/SidebarProvider/)
  consoleError.mockRestore()
})
```

Test every Sidebar public runtime export through one of the desktop, collapsed, mobile, nested-menu, or loading compositions. Do not assert cookie persistence in jsdom; assert the state/callback contract and cover persistence later in browser tests.

- [ ] **Step 2: Run focused tests before implementation changes**

Run: `pnpm vitest --run packages/ui/src/components/{carousel,chart,direction,message-scroller,resizable,scroll-area,sidebar}`

- [ ] **Step 3: Fix only proven defects and add complete stories**

Use fixed chart data and fixed container dimensions. Disable carousel autoplay and transitions in all automated stories.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest --run packages/ui/src/components/{carousel,chart,direction,message-scroller,resizable,scroll-area,sidebar} && pnpm build-storybook`

```bash
git add packages/ui/src/components/{carousel,chart,direction,message-scroller,resizable,scroll-area,sidebar} apps/web/stories/{carousel,chart,direction,message-scroller,resizable,scroll-area,sidebar}.stories.tsx
git commit -m "test: cover advanced SurfaceKit modules"
```

## Task 11: Expand All Enterprise Pattern Contracts

**Files:**

- Modify all tests and stories under `packages/ui/src/patterns` and `apps/web/stories` for: `app-shell`, `auth-shell`, `confirm-danger-action`, `data-table-toolbar`, `error-summary`, `incident-banner`, `permission-gate`, `resource-status`, `step-up-dialog`, `web-shell`.

**Interfaces:**

- Consumes: the now-tested component modules.
- Produces: complete layout, conditional, callback, and workflow proof for all 10 patterns.

- [ ] **Step 1: Add these pattern contracts**

| Pattern             | Required unit evidence                                                                    | Required stories                                      |
| ------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| AppShell            | topbar/sidebar/main landmarks; nav links; active state; action content                    | Desktop, CollapsedNavigation, MobileContent           |
| AuthShell           | shell heading/description; panel content/footer; long error content                       | SignIn, Verification, Error, SplitLayout              |
| ConfirmDangerAction | title/description; cancel/confirm callbacks; pending and disabled confirmation            | DeleteProject, DisabledConfirm, Processing            |
| DataTableToolbar    | controlled search value/callback; item count; create/filter/export actions; disabled/busy | Default, Filtered, Empty, Busy                        |
| ErrorSummary        | alert semantics; title; linked error items; empty behavior                                | SingleError, MultipleErrors, LinkedErrors, LongLabels |
| IncidentBanner      | status/alert semantics by severity; action callback; dismiss callback                     | Info, Warning, Critical, Dismissible                  |
| PermissionGate      | allowed content; denied fallback; request action; loading state                           | Allowed, Denied, RequestAccess, Loading               |
| ResourceStatus      | label/value/detail; progress semantics; status variants and indeterminate state           | Healthy, Warning, Critical, Indeterminate             |
| StepUpDialog        | headline/reason; verify/cancel callbacks; pending/error state                             | Verification, Error, Processing                       |
| WebShell            | header/nav/main/footer landmarks; hero content/actions; responsive-safe composition       | Landing, Documentation, MinimalFooter                 |

Concrete conditional pattern test:

```tsx
it("renders protected content only when permission is granted", () => {
  const { rerender } = render(
    <PermissionGate
      allowed={false}
      title="Billing access required"
      description="Ask an owner to grant billing permissions."
      fallback={<p>Request access</p>}
    >
      <p>Billing controls</p>
    </PermissionGate>
  )
  expect(screen.getByText("Request access")).toBeVisible()
  expect(screen.queryByText("Billing controls")).not.toBeInTheDocument()

  rerender(
    <PermissionGate
      allowed
      title="Billing access required"
      description="Ask an owner to grant billing permissions."
      fallback={<p>Request access</p>}
    >
      <p>Billing controls</p>
    </PermissionGate>
  )
  expect(screen.getByText("Billing controls")).toBeVisible()
})
```

Add these backward-compatible optional interfaces after their tests fail:

```ts
type AsyncActionState = "idle" | "pending" | "error"
type IncidentSeverity = "info" | "warning" | "critical"
type ResourceTone = "healthy" | "warning" | "critical"

type PermissionGateAdditions = {
  allowed?: boolean
  loading?: boolean
  fallback?: React.ReactNode
  onRequestAccess?: () => void
}

type ConfirmDangerActionAdditions = {
  state?: AsyncActionState
  disabled?: boolean
  onCancel?: () => void
  onConfirm?: () => void
}

type StepUpDialogAdditions = {
  state?: AsyncActionState
  errorMessage?: string
  onCancel?: () => void
  onVerify?: () => void
}

type DataTableToolbarAdditions = {
  searchValue?: string
  searchLabel?: string
  onSearchValueChange?: (value: string) => void
  onCreate?: () => void
  busy?: boolean
}

type IncidentBannerAdditions = {
  severity?: IncidentSeverity
  onAction?: () => void
  onDismiss?: () => void
}

type ResourceStatusAdditions = {
  tone?: ResourceTone
  progress?: number
}

type ErrorSummaryItem = {
  id: string
  message: string
  href?: string
}
```

Existing required props and default output remain valid. `PermissionGate` defaults `allowed` to `false`, matching its current denied-state rendering; when `allowed` is true it renders `children`. `ResourceStatus.progress` becomes optional only to represent an indeterminate state. `ErrorSummary` continues accepting `messages: string[]` and additionally accepts `errors?: ErrorSummaryItem[]` for linkable validation summaries.

- [ ] **Step 2: Run all pattern tests before implementation edits**

Run: `pnpm vitest --run packages/ui/src/patterns`

- [ ] **Step 3: Fix demonstrated defects and expand all 10 stories**

ConfirmDangerAction and StepUpDialog stories include play functions for cancel, confirm/verify, and focus restoration. PermissionGate and ResourceStatus stories cover every conditional branch.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest --run packages/ui/src/patterns && pnpm build-storybook`

```bash
git add packages/ui/src/patterns apps/web/stories/{app-shell,auth-shell,confirm-danger-action,data-table-toolbar,error-summary,incident-banner,permission-gate,resource-status,step-up-dialog,web-shell}.stories.tsx
git commit -m "test: cover SurfaceKit enterprise patterns"
```

## Task 12: Close the Package and Storybook Gates

**Files:**

- Modify: `packages/ui/README.md`
- Modify: `packages/ui/USAGE.md`
- Modify: `apps/web/README.md`
- Modify: `README.md`
- Modify any Phase 1 test, story, or implementation file needed to resolve evidence-backed failures.

**Interfaces:**

- Consumes: all Phase 1 tests, stories, coverage, and scripts.
- Produces: a shippable Phase 1 baseline and accurate contributor documentation.

- [ ] **Step 1: Run the structural contract**

Run: `pnpm test:contracts`

Expected: PASS with exactly 60 component directories, 10 pattern directories, 70 matching stories, 70 colocated tests, and zero scaffold assertions.

- [ ] **Step 2: Run package coverage**

Run: `pnpm test:components:coverage`

Expected: PASS at 90/90/90/85 global and 75/75/75/70 per-file floors. If a threshold fails, add tests for the reported public branch; do not lower the configured gate.

- [ ] **Step 3: Run executable Storybook checks**

Run: `pnpm test:storybook`

Expected: every story renders, every play function passes, browser console output is clean, and axe reports no detected WCAG A/AA violations. Fix story fixtures first; change production code only behind a failing package regression test.

- [ ] **Step 4: Update evidence-backed documentation**

Document:

```md
## Quality gates

- `pnpm test:components` — behavioral package tests
- `pnpm test:components:coverage` — global and per-file coverage policy
- `pnpm test:contracts` — source, test, and story inventory equality
- `pnpm build-storybook` — production Storybook compilation
- `pnpm test:storybook` — story smoke, interaction, console, and automated accessibility checks

Automated accessibility checks detect a subset of WCAG issues and do not replace manual assistive-technology review.
```

- [ ] **Step 5: Run the complete Phase 1 gate**

Run: `pnpm lint && pnpm typecheck && pnpm test:contracts && pnpm test:components:coverage && pnpm test:storybook`

Expected: exit 0 for every command, zero failed tests, zero coverage-threshold misses, zero story console errors, and zero detected axe violations.

- [ ] **Step 6: Review impact through the knowledge graph**

Run the repository graph update, change detection, affected-flow analysis, and `tests_for` queries for every modified production module. Resolve untested changed exports before committing.

- [ ] **Step 7: Commit the verified Phase 1 result**

```bash
git add README.md packages/ui/README.md packages/ui/USAGE.md apps/web/README.md packages/ui/src apps/web/stories apps/web/.storybook package.json pnpm-workspace.yaml pnpm-lock.yaml vitest.config.ts vitest.setup.ts tests/contracts
git commit -m "docs: document SurfaceKit quality gates"
```

## Phase 1 Acceptance Checklist

- [ ] All 60 component module tests exercise observable behavior.
- [ ] All 10 pattern module tests exercise observable workflows.
- [ ] All public runtime exports are covered or explicitly identified as non-runtime helpers.
- [ ] All 70 Storybook entries have useful states and applicable play functions.
- [ ] Source, test, and story sets match exactly.
- [ ] Coverage thresholds pass without exemptions added during this phase.
- [ ] Story smoke, interaction, console, and automated accessibility checks pass.
- [ ] Package import paths and public APIs remain compatible.
- [ ] Documentation states the exact evidence and automated-a11y limitation.
