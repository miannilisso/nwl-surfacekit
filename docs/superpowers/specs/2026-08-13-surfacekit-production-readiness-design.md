# SurfaceKit Production Readiness Design

**Status:** Approved design, pending written-spec review  
**Date:** 2026-08-13  
**Scope:** `packages/ui`, Storybook in `apps/web`, the Next.js playground routes, the public marketing routes, and their release gates

## 1. Purpose

SurfaceKit will become a verifiable, production-ready design-system package and reference application. Every public component and pattern must have meaningful automated tests, useful Storybook documentation, and a live example in the playground. The marketing pages must consume the design system consistently and make only claims supported by automated evidence.

This work improves the existing system rather than replacing its public contract. Existing package entry points and component APIs remain compatible unless a test exposes a concrete defect that cannot be fixed compatibly. A breaking change requires separate approval.

## 2. Current Baseline

The repository currently contains:

- 60 component modules under `packages/ui/src/components`.
- 10 pattern modules under `packages/ui/src/patterns`.
- One colocated test file and one Storybook story file for every module.
- 58 component tests that assert only that a module has exports; Button and Card are the only component modules with render-level assertions.
- Storybook stories for all 70 modules, but most stories demonstrate only one basic state and none contain automated interaction flows.
- A large `/playground` client page plus seven category pages with duplicated navigation data.
- No playground import for Chart, Input OTP, or Sidebar.
- A `/patterns` page that describes several patterns instead of rendering them as working compositions.
- Accessibility smoke coverage for `/`, `/marketing`, and `/playground`, but not the category routes.
- Visual regression coverage only for `/playground` in desktop light and dark themes.
- Marketing copy that claims full coverage and complete accessibility without tests broad enough to establish those claims.

The current 70 package test files pass, but that result proves module availability rather than production behavior for most components.

## 3. Goals and Non-Goals

### Goals

1. Give every exported UI module a behavioral test suite that protects its public contract.
2. Give every UI module a Storybook entry that documents its meaningful states and interactions.
3. Ensure every component and pattern is rendered through its real public API on a playground route.
4. Replace duplicated and oversized playground implementation with a catalog-driven, maintainable architecture.
5. Rebuild the public pages as credible examples of SurfaceKit composition.
6. Add structural, accessibility, visual, browser, type, lint, and build gates that prevent coverage from silently regressing.
7. Keep documentation and marketing claims derived from or checked against authoritative repository data.

### Non-Goals

- Redesigning the underlying visual language or changing the brand identity.
- Replacing Base UI, Tailwind CSS, Storybook, Vitest, Playwright, or Next.js.
- Adding backend services, authentication, analytics, billing, or persistence.
- Guaranteeing manual WCAG conformance solely from automated axe results.
- Creating breaking package APIs merely to simplify examples or tests.

## 4. Design Principles

- **Behavior over presence:** a test must fail when user-visible behavior or a public contract regresses. Export-count assertions do not qualify.
- **One inventory, multiple proofs:** a typed catalog describes the public modules and their playground placement; structural tests compare it with source, test, story, and demo files.
- **Independent evidence layers:** unit tests, stories, playground examples, accessibility scans, browser tests, and visual snapshots each prove a different property. One layer cannot substitute for another.
- **Real composition:** stories and playgrounds use documented public imports and realistic content rather than recreating component internals with arbitrary markup.
- **Small client boundaries:** Next.js pages remain Server Components when possible. State and browser APIs live in focused demo or shell client components.
- **Stable consumption:** `@nwl/surfacekit/components/<name>` and `@nwl/surfacekit/patterns/<name>` remain the supported import shape.
- **Evidence-backed language:** documentation distinguishes automated checks from guarantees requiring manual review.

## 5. Target Architecture

### 5.1 Package boundary

`packages/ui` remains framework-consumable React source. It must not import the web application, Storybook, or Next.js. Tests stay colocated with the implementation they protect. Barrel files continue to expose stable module entry points.

Shared test helpers may live in `packages/ui/src/test` when they remove repeated provider or event setup, but helpers may not hide the behavior being asserted.

### 5.2 Surface catalog

Create a typed catalog in the web application with one entry for each of the 70 modules. Each entry contains:

```ts
type SurfaceKind = "component" | "pattern"

type SurfaceCategory =
  | "form-inputs"
  | "navigation"
  | "dialogs-overlays"
  | "data-display"
  | "feedback"
  | "layout-utilities"
  | "patterns"

type SurfaceCatalogEntry = {
  readonly id: string
  readonly name: string
  readonly kind: SurfaceKind
  readonly category: SurfaceCategory
  readonly route: string
  readonly description: string
  readonly storyTitle: string
}
```

The catalog contains metadata only and does not import component implementations. This keeps server code and marketing counts from pulling all interactive components into a single client bundle.

A separate demo registry maps each catalog ID to a focused demo module. Demo modules are loaded only on the category route that needs them. The catalog is the source for navigation, route counts, search, documentation counts, and marketing totals.

### 5.3 Structural coverage contract

A Node-based contract test compares:

1. component and pattern source directories;
2. colocated `*.test.tsx` files;
3. `apps/web/stories/*.stories.tsx` files;
4. catalog entries; and
5. playground demo registrations.

The sets must match exactly. Duplicate IDs, stale registrations, missing stories, missing tests, missing demos, and undocumented modules fail CI. The contract also rejects the old placeholder assertion text so it cannot be reintroduced.

## 6. Component and Pattern Testing

### 6.1 Test taxonomy

Each module receives the applicable tests from the following contract. Tests assert observable DOM and user outcomes rather than internal implementation details.

| Module class               | Required evidence                                                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Display and layout         | semantic element or role, content composition, meaningful variants, class-name forwarding                                              |
| Form controls              | accessible name, value/state changes, controlled or uncontrolled contract, disabled state, keyboard use, callback payload              |
| Collections and navigation | item semantics, active/selected state, keyboard movement, boundary behavior, link or action behavior                                   |
| Overlays and menus         | trigger behavior, accessible naming, focus transfer/restoration, Escape dismissal, outside interaction where supported, disabled items |
| Feedback and status        | correct live-region or status semantics where applicable, variants, progress/value representation, empty/loading states                |
| Providers and hooks        | default value, provider override, nested behavior, invalid usage if the API defines it                                                 |
| Composite patterns         | landmark structure, child composition, primary workflow, conditional branch, callback contract, responsive-safe markup                 |

Every public named export must either be rendered or invoked by its module suite, or be explicitly identified as a type-only export. Testing only a root wrapper is insufficient when public subcomponents have their own semantics or behavior.

### 6.2 Test quality rules

- Use React Testing Library queries based on role, label, or visible content.
- Use `@testing-library/user-event` for realistic pointer and keyboard sequences.
- Prefer real primitives and DOM behavior; mock browser APIs only when jsdom lacks the capability.
- Keep one behavioral reason per test name.
- Verify state transitions and callback values, not merely callback invocation counts.
- Assert focus when focus management is part of the public interaction.
- Avoid snapshots for behavioral unit tests.
- Remove all `Object.keys(ComponentModule).length` placeholder tests.

### 6.3 TDD rule

For production fixes discovered during the audit, add a focused test and observe the expected failure before editing implementation. Existing behavior being characterized can be tested directly, but any behavior change follows red, green, and refactor.

### 6.4 Coverage policy

Coverage excludes barrel-only `index.ts` files, type-only declarations, generated files, Storybook output, and CSS. The package gate requires:

- at least 90% statements;
- at least 90% lines;
- at least 90% functions; and
- at least 85% branches.

No implementation module may fall below 75% statements or 70% branches without an inline, time-bounded exception documented in the coverage configuration. The structural coverage contract remains mandatory even when numeric thresholds pass.

## 7. Storybook Design

### 7.1 Information architecture

Stories use these title families:

- `SurfaceKit/Components/<Category>/<Name>`
- `SurfaceKit/Patterns/<Name>`

Every meta definition includes the component, an explanatory docs description, sensible controls, and `autodocs` where Storybook supports it. Decorators provide only global theme and layout concerns; individual stories own scenario-specific wrappers.

### 7.2 Story contract

Every module has a `Default` story plus each applicable public state:

- variants and sizes;
- disabled, read-only, and invalid;
- empty, loading, populated, and overflow;
- controlled interaction;
- destructive or high-risk confirmation;
- open overlay state;
- responsive composition;
- long content and localization stress;
- dark theme when a state has theme-specific risk.

Stories for compound modules exercise their public children together. Stories for patterns show complete workflows rather than isolated boxes of explanatory text.

### 7.3 Story interaction and accessibility evidence

High-interaction stories include play functions for the primary keyboard and pointer path. At minimum this applies to accordions, form controls, selection widgets, menus, dialogs, drawers, sheets, tabs, carousel controls, toast, and confirmation or step-up patterns.

Automated Storybook accessibility checks target WCAG A and AA axe rules. Known automated-tool limitations are documented; a clean axe result is described as “no automatically detectable violations,” not complete conformance.

The Storybook production build is a release gate. Generated `storybook-static` content remains ignored and untracked.

## 8. Playground Application

### 8.1 Routes and navigation

Preserve the existing public URLs:

- `/playground`
- `/form-inputs`
- `/navigation`
- `/dialogs-overlays`
- `/data-display`
- `/feedback`
- `/layout-utilities`
- `/patterns`

A shared playground layout owns AppShell, the top bar, the sidebar, route navigation, theme controls, and mobile navigation. Active state derives from the current pathname rather than copied `active` flags. Navigation uses Next.js `Link` semantics.

The `/playground` route becomes an overview and searchable catalog rather than a monolithic rendering of the entire library. Category routes render the complete inventory for their category. Every catalog entry has a stable in-page anchor so examples can be linked directly.

### 8.2 Demo composition

Each demo is a focused component with realistic content, visible state controls where useful, and a concise explanation of what the example proves. A shared `ComponentPreview` shell provides title, description, status tags, and consistent spacing without obscuring the actual SurfaceKit component.

Chart, Input OTP, and Sidebar are added to the appropriate category pages. Every other catalog entry is audited to ensure its demo uses the intended public child components instead of treating a compound primitive as a generic wrapper.

The Patterns route renders all 10 patterns as working examples. AppShell is represented by the surrounding playground and a bounded preview; AuthShell and WebShell use constrained previews; permission, step-up, danger, incident, resource, error, and table-toolbar patterns expose their meaningful interactions.

### 8.3 Client and server boundaries

Route pages and static catalog content remain Server Components. Interactive examples and pathname-aware navigation are narrow Client Components. A category route must not import demos from unrelated categories into its initial client chunk.

All browser-only state uses deterministic defaults so server output, hydration, screenshots, and tests remain stable.

### 8.4 Error and loading behavior

Demo failures are isolated by category-level error boundaries so one example cannot make the entire playground unusable. Dynamic demo loading uses a consistent Skeleton-based fallback. Missing catalog-to-demo mappings fail the structural test and render a clear development error rather than silently disappearing.

## 9. Marketing Surfaces

### 9.1 Responsibilities

`/` is the concise product landing page. `/marketing` is the detailed capabilities page. Both use WebShell and SurfaceKit components exclusively for shared interface elements.

Counts displayed in marketing content come from the typed catalog rather than duplicated literals. Copy reflects verified capabilities:

- “60 components” and “10 patterns” are allowed when the catalog contract passes.
- “Behaviorally tested” is allowed only after the full package suite and coverage gates pass.
- “No automatically detectable WCAG A/AA violations on tested routes” is allowed only when the current accessibility suite passes.
- “100% accessible,” “battle-tested,” and equivalent absolute claims are not used without broader evidence.

### 9.2 Content and composition

The landing page includes a clear value proposition, supported inventory metrics, key capabilities, representative workflow composition, and primary links to the playground and package usage documentation.

The detailed marketing page includes component categories derived from the catalog, enterprise pattern use cases, accessibility and theming language, implementation guidance, and a final call to action. Static sections remain server-rendered; interactive examples use narrow client islands.

Both routes receive unique metadata, one clear page-level heading, descriptive link text, responsive layouts, visible focus states, reduced-motion-safe transitions, and accurate navigation landmarks.

## 10. Verification Strategy

### 10.1 Fast developer loop

Developers can run targeted package tests, a single Storybook story, a single playground route, or one Playwright project while working. Root scripts provide stable names for each gate.

### 10.2 Required release gates

The production verification pipeline runs, in order:

1. formatting check and lint;
2. TypeScript checks for all workspaces;
3. package behavioral tests with coverage thresholds;
4. structural surface coverage contract;
5. Next.js production build;
6. Storybook production build;
7. Storybook interaction and accessibility checks;
8. route accessibility checks;
9. visual regression checks; and
10. cross-browser smoke and keyboard workflows.

The Next.js browser suite exercises a production build and production server in CI rather than relying only on `next dev`.

### 10.3 Route coverage

Accessibility scans run on `/`, `/marketing`, and all eight playground routes. Tests use WCAG A and AA axe tags supported by the installed axe version and require zero detected violations.

Desktop visual baselines cover every marketing and playground route in light and dark themes. Mobile baselines cover the two marketing routes, the playground overview, and every category route in light theme. Animations, dates, and other nondeterministic values are disabled or fixed rather than masked broadly.

Chromium, Firefox, and WebKit smoke tests verify route rendering and navigation. Representative workflow tests cover form entry, selection, menus, overlay open/close and focus restoration, tabs, toast feedback, and destructive confirmation.

### 10.4 Completion evidence

The work is complete only when:

- the structural test proves exact 60-component and 10-pattern coverage across source, tests, stories, catalog, and demos;
- no placeholder test remains;
- all package tests and coverage thresholds pass;
- all stories build and their automated checks pass;
- all 10 application routes render and pass accessibility checks;
- required visual baselines pass in their declared themes and viewports;
- cross-browser workflows pass;
- lint, typecheck, and production builds pass; and
- README and marketing claims match that evidence.

Partial or skipped verification is reported explicitly and cannot support a production-ready completion claim.

## 11. Documentation

Update the root README, `packages/ui/README.md`, `packages/ui/USAGE.md`, and `apps/web/README.md` to document:

- the authoritative component and pattern counts;
- supported package import paths;
- catalog and demo conventions;
- behavioral test and story expectations;
- accessibility wording and limitations;
- local focused commands;
- full release verification;
- how to add a new module without failing the structural contract; and
- snapshot review and update policy.

Documentation must not claim more than the current automated and manual evidence establishes.

## 12. Delivery Phases

### Phase 1: Package contracts and Storybook

Add test infrastructure, the structural contract, behavioral suites, complete stories, interaction checks, coverage configuration, and accurate package documentation. This phase is independently shippable when package and Storybook gates pass.

### Phase 2: Catalog and playground

Add the typed catalog, shared shell, focused demo modules, complete category coverage, direct-link anchors, route error/loading behavior, and expanded route tests. This phase is independently shippable when all playground inventory and route gates pass.

### Phase 3: Marketing and release gates

Rebuild both public pages around the verified catalog, remove unsupported claims, complete metadata and responsive behavior, expand visual and accessibility coverage, and wire the final root verification command. This phase completes the production-readiness objective.

## 13. Risks and Mitigations

| Risk                                             | Mitigation                                                                    |
| ------------------------------------------------ | ----------------------------------------------------------------------------- |
| Tests encode primitive internals                 | Assert public roles, labels, state, focus, and callbacks only                 |
| A central registry creates a large client bundle | Keep metadata implementation-free and load only route-specific demos          |
| Stories and playground examples drift            | Enforce exact set equality with the structural contract                       |
| Visual tests become noisy                        | Use deterministic data, disable animation, and keep snapshots route-focused   |
| Accessibility language overpromises              | Use precise automated-check wording and document manual limitations           |
| Refactoring breaks consumers                     | Preserve import paths and APIs; require regression tests for behavior changes |
| The project becomes one oversized change         | Deliver and verify the three phases independently                             |

## 14. Acceptance Decision

The implementation is accepted only as the complete three-phase result. A phase may be merged independently, but the overarching goal remains active until every completion criterion in Section 10.4 is supported by fresh verification evidence.
