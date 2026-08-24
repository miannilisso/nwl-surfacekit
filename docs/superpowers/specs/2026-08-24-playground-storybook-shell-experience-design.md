# Playground, Storybook, and Shell Experience Design

**Status:** Approved design, pending written-spec review
**Date:** 2026-08-24
**Scope:** Playground routing and navigation, shared shell composition, Storybook production performance and navigation, global theming, React warning remediation, tests, and current documentation

## 1. Purpose

SurfaceKit's reference application and Storybook should present a coherent, production-oriented experience. Playground category URLs must reflect their ownership by the playground, navigation must provide reliable routes back to the catalog and product home, both web and Storybook surfaces must make color-scheme review obvious, and development output must be free of actionable React and bundle warnings.

This design supersedes the route-preservation requirement in section 8.1 of `2026-08-13-surfacekit-production-readiness-design.md`. Existing top-level category routes remain compatible through permanent redirects, while their canonical URLs move beneath `/playground`.

## 2. Current Evidence

- The `(playground)` folder is a Next.js route group. It groups files without contributing a URL segment, which is why sidebar navigation resolves to `/form-inputs`, `/navigation`, and the other root-level category URLs.
- `surfaceCategories` in `apps/web/lib/surfacekit/catalog.ts` is the authoritative source for category routes, and the playground shell, category cards, catalog search, documentation, and browser tests consume those values.
- `AppTopbar` already renders a `ThemeSwitcher`, but the marketing `WebShellHeader` does not expose it.
- `AppShell` has topbar, sidebar, and main regions but no footer region. `AppSidebar` renders a single navigation list without a bottom slot.
- Storybook has no global color-scheme control or introductory entry, so alphabetical ordering makes Accordion the first story.
- Storybook enables `developmentModeForBuild`, which deliberately retains development behavior in the static build. The current Vite build emits an `iframe` runtime chunk of approximately 1,162.65 kB uncompressed and warns at the configured 1,000 kB threshold.
- The Storybook build configuration still uses Vite's deprecated `rollupOptions` alias rather than `rolldownOptions`.
- Focused Storybook execution identifies the controlled-input warning in `Input OTP / Invalid`. The installed `input-otp` implementation forwards `defaultValue` to a native input while also supplying its managed `value`.
- Focused Storybook execution identifies duplicate keys in `Pagination / First Page` and `Pagination / Last Page`. Boundary clamping produces repeated page values (`1` and `12`).

## 3. Goals

1. Make `/playground/<category>` the canonical route shape for all seven categories.
2. Preserve old top-level category links with permanent redirects.
3. Add a reusable theme switch to the marketing shell navigation without duplicating theme state logic.
4. Add a footer to the application shell and a Home action fixed to the bottom of the playground sidebar.
5. Let Storybook users switch every story between light and dark presentation from the global toolbar.
6. Give Storybook a purposeful introduction page and make it the initial local destination.
7. Remove the oversized-chunk warning through production configuration and measured code splitting, not by increasing the warning limit.
8. Eliminate the confirmed controlled-input and duplicate-key React warnings.
9. Preserve accessibility enforcement, story interactions, visual baselines, public component behavior, and package import paths.

## 4. Non-Goals

- Redesigning SurfaceKit's visual language or replacing existing components.
- Adding a new theming dependency or a second theme state store.
- Replacing Storybook, Vite, Vitest, Next.js, or the existing browser-test stack.
- Making every Storybook story a documentation page.
- Hiding bundle warnings by raising `chunkSizeWarningLimit`.
- Removing the old category URLs without a compatibility path.
- Accepting or regenerating visual snapshots without inspecting differences.

## 5. Route Architecture

### 5.1 Canonical hierarchy

The playground will use a real route segment:

```text
apps/web/app/(playground)/playground/
├── layout.tsx
├── page.tsx
├── data-display/page.tsx
├── dialogs-overlays/page.tsx
├── feedback/page.tsx
├── form-inputs/page.tsx
├── layout-utilities/page.tsx
├── navigation/page.tsx
└── patterns/page.tsx
```

The route group remains useful for source organization, while the nested `playground` folder contributes the public URL segment. The shared layout continues to preserve the interactive shell across category navigation.

`surfaceCategories` will define these canonical routes:

- `/playground/form-inputs`
- `/playground/navigation`
- `/playground/dialogs-overlays`
- `/playground/data-display`
- `/playground/feedback`
- `/playground/layout-utilities`
- `/playground/patterns`

All cards, search results, sidebar links, active-state checks, tests, and documentation will derive from or agree with those values.

### 5.2 Compatibility redirects

Next.js configuration will define permanent redirects from each former root-level category route to its nested canonical route. Redirect coverage will assert both the destination and permanent status. The redirects prevent broken bookmarks while allowing search engines and consumers to converge on the new hierarchy.

## 6. Shared Shell Composition

### 6.1 Theme control

The existing `ThemeSwitcher` becomes a named export from the app-shell pattern. It retains the current `next-themes` behavior, accessible label, hydration protection, icon treatment, and small ghost-button presentation.

`AppTopbar` continues to consume the same component. The marketing application composes that exported switcher into the existing `WebShellHeader` `cta` region beside the Playground link. No duplicate theme hook or competing storage key is introduced.

### 6.2 Application footer

`AppShell` gains an optional `footer` prop. When present, its content column becomes a minimum-height flex column containing the main region and a semantic footer after it. The footer stays in normal document flow, respects the desktop sidebar offset, and does not create a second page-level `main` landmark.

The playground supplies a concise SurfaceKit footer with product identity and useful navigation. The footer must remain readable in both themes and at mobile and desktop widths.

### 6.3 Sidebar bottom action

`AppSidebar` gains an optional `footer` prop rendered after its primary item list with `margin-top: auto`. Its navigation root becomes a full-height flex column so the slot stays at the bottom when content is short and follows content when it grows.

The playground uses this slot for a Home link to `/`, rendered through Next.js `Link`, with an icon and accessible text. It is visually separated from category navigation and does not affect active-category calculations.

These additions are backward-compatible: consumers that omit the new props retain current output and behavior.

## 7. Storybook Experience

### 7.1 Global color scheme

Storybook preview configuration defines a `theme` global with light and dark toolbar choices and a light initial value. A focused decorator applies the selected class and `color-scheme` to the preview document root and gives the preview canvas SurfaceKit background and foreground colors.

Applying the class at the document root ensures components rendered through portals inherit the selected theme. The decorator cleans up changes when preview state changes or unmounts. The global remains user-selectable rather than being overridden per story.

### 7.2 Introduction landing

A new `SurfaceKit/Introduction` CSF entry presents:

- SurfaceKit's purpose and verified inventory;
- direct paths to component, pattern, accessibility, and playground resources;
- a short explanation of Canvas, Controls, accessibility checks, and the theme toolbar;
- representative SurfaceKit cards, badges, and actions rather than custom visual primitives.

Story sorting places Introduction first. The local `storybook` command uses Storybook's `--initial-path` option to open the introduction overview for a first visit. The static build also exposes the introduction as the first navigation entry. The Accordion stories keep their existing IDs and behavior.

### 7.3 Production bundle strategy

Optimization proceeds in measured stages:

1. Record the current largest JavaScript chunks and gzip sizes.
2. Remove `developmentModeForBuild` from the published static build so production Storybook uses production React behavior. Component tests and Storybook interaction tests continue to run through their dedicated Vitest browser command and retain their current accessibility enforcement.
3. Replace deprecated `build.rollupOptions` with `build.rolldownOptions` while preserving the narrow Storybook-core `EVAL` warning filter.
4. Rebuild and inspect the output.
5. Only if a JavaScript chunk still exceeds 1,000 kB uncompressed, add a narrowly scoped `output.codeSplitting.groups` configuration for Storybook/framework runtime dependencies. The grouping must preserve execution order and must not collapse all dependencies into one generic vendor chunk.

Acceptance is based on the actual emitted files: no Vite chunk-size warning, no JavaScript chunk above the 1,000 kB project limit, successful Storybook navigation, and no regression in total initial behavior. Raising the limit is explicitly disallowed.

## 8. React Warning Remediation

### 8.1 Input OTP

The Input OTP stories will demonstrate initialized values through a controlled story wrapper. The wrapper initializes local state from an `initialValue` story argument and passes only `value` plus `onChange` to `InputOTP`. It will not pass `defaultValue` into the upstream primitive.

The public `InputOTP` component API remains unchanged because the confirmed warning is produced by the upstream implementation's uncontrolled initialization path. A focused story regression test will exercise both initialized invalid and disabled examples without emitting the controlled/uncontrolled warning.

### 8.2 Pagination

Pagination calculates a three-page window before rendering. At the start it produces `[1, 2, 3]`; in the middle it centers on the current page; at the end it produces `[10, 11, 12]`. Values are unique before they become React keys, link destinations, or accessible labels.

Focused story assertions cover first-, middle-, and last-page windows. The full Storybook suite must produce no duplicate-key warnings.

## 9. Testing and Verification

### 9.1 Regression coverage

- Catalog tests assert every canonical nested category route.
- Next.js redirect tests or configuration-contract tests assert all seven legacy mappings.
- Playground shell tests assert nested active routes, the Home link, catalog fallback link, footer, and theme action.
- App-shell package tests cover optional footer rendering, sidebar-bottom composition, custom router rendering, and theme switching.
- Storybook-focused tests cover the introduction entry, theme global/decorator behavior, initialized OTP stories, and unique pagination boundaries.
- Browser navigation tests assert `/playground` to `/playground/form-inputs` and confirm legacy URLs resolve to canonical URLs.
- Existing route, accessibility, workflow, and visual inventories are updated without reducing their coverage.

### 9.2 Required gates

The implementation is complete only when:

1. focused red/green regression tests pass;
2. formatting, strict lint, and workspace type checks pass;
3. package contract and coverage suites pass at existing thresholds;
4. the Next.js production build lists only the intended canonical playground routes while legacy redirects work;
5. the Storybook build completes without an oversized-chunk warning;
6. all Storybook files and interactions pass without the identified React warnings;
7. environment-isolation checks pass;
8. production Playwright passes in Chromium, Firefox, and WebKit with intentional visual skips unchanged;
9. desktop and mobile browser QA confirms routing, theme changes, footer layout, Home navigation, Storybook landing, and Storybook theme changes; and
10. `pnpm verify:ci` passes on the final tree.

Visual snapshots are regenerated only when a reviewed layout change makes an existing baseline intentionally obsolete.

## 10. Documentation

Current documentation will be reconciled with the new route structure and experience:

- Root `README.md` will use canonical nested playground URLs and mention the Storybook introduction and color-scheme toolbar.
- `apps/web/README.md` will document nested category routes, permanent redirects, shell navigation, Storybook initial path, and production build expectations.
- UI package documentation will describe the additive `AppShell.footer`, `AppSidebar.footer`, and exported `ThemeSwitcher` APIs.
- The current enterprise-readiness audit will receive a dated implementation note only if the change materially alters one of its recorded findings; historical plans and specifications remain unchanged.

Documentation will not claim that chunk splitting reduces total downloaded JavaScript unless measurements demonstrate it. It will distinguish a smaller maximum chunk from a smaller total payload.

## 11. Risks and Controls

- **Route breakage:** Centralize canonical routes in the catalog, add permanent redirects, and test direct and in-app navigation.
- **Theme flash or portal mismatch:** Apply the Storybook theme to the document root and validate portalled overlays in both schemes.
- **Shell layout regression:** Keep new slots optional and cover landmark structure, minimum height, desktop offsets, and mobile stacking.
- **Unsafe manual chunking:** Prefer production-mode correction first; add only narrow Rolldown groups after measurement and run the full story interaction suite.
- **Reduced accessibility assurance:** Keep the dedicated Storybook Vitest accessibility gate unchanged when removing development mode from the separately published static build.
- **Hidden console regressions:** Run focused stories with verbose output and treat relevant React warnings as failures in final verification evidence.

## 12. Acceptance Decision

The work is accepted when canonical nested navigation, compatibility redirects, both theme controls, shell footer and Home action, Storybook introduction, warning-free stories, and sub-limit Storybook chunks are all demonstrated by automated tests and rendered browser evidence. A successful build with suppressed warnings is not sufficient.
