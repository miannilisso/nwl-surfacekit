# Using @nwl/surfacekit

The package is currently a private source dependency supported only inside this
workspace. Add it to a workspace app with
`"@nwl/surfacekit": "workspace:*"`. The app must use React and React DOM 19;
the package declares both as required `^19.0.0` peers.

Load the global tokens once near the application root:

```css
@import "@nwl/surfacekit/globals.css";
```

Import only public module entry points:

```tsx
import { Button } from "@nwl/surfacekit/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"
import { ResourceStatus } from "@nwl/surfacekit/patterns/resource-status"
```

Do not import from src or depend on another app's files.

## Styling setup

The exported stylesheet is Tailwind CSS v4 source. Workspace consumers must use
the catalog-pinned `tailwindcss` and `@tailwindcss/postcss` packages and load the
package's PostCSS configuration:

```js
// postcss.config.mjs
export { default } from "@nwl/surfacekit/postcss.config"
```

The CSS currently imports `shadcn/tailwind.css`; this is why `shadcn` remains a
runtime dependency. External tarball consumers are not supported yet. In audit
fixtures, clean Next.js and Vite apps failed without the Tailwind/PostCSS setup
and required source transpilation (for example, Next.js
`transpilePackages: ["@nwl/surfacekit"]`). These requirements will be replaced
by compiled JavaScript, declarations, and CSS before external release.

## Application-shell example

```tsx
import {
  AppShell,
  AppSidebar,
  AppTopbar,
} from "@nwl/surfacekit/patterns/app-shell"
import { ResourceStatus } from "@nwl/surfacekit/patterns/resource-status"

const items = [
  { label: "Overview", href: "/workspace", active: true },
  { label: "Projects", href: "/workspace/projects", badge: 12 },
]

export function Workspace() {
  return (
    <AppShell
      topbar={<AppTopbar title="Production workspace" eyebrow="SurfaceKit" />}
      sidebar={<AppSidebar label="Workspace navigation" items={items} />}
    >
      <ResourceStatus
        title="Compute quota"
        value="62%"
        detail="22 of 35 nodes active"
        progress={62}
      />
    </AppShell>
  )
}
```

## Router-aware links

AppSidebar renders ordinary anchors by default. Framework consumers can provide
router links through renderItem while preserving the package's accessible
props:

```tsx
import Link from "next/link"
import { AppSidebar } from "@nwl/surfacekit/patterns/app-shell"

;<AppSidebar
  items={items}
  renderItem={(item, anchorProps) => (
    <Link {...anchorProps} href={item.href ?? "#"} />
  )}
/>
```

## Public web-shell example

```tsx
import {
  WebHero,
  WebShell,
  WebShellFooter,
  WebShellHeader,
} from "@nwl/surfacekit/patterns/web-shell"

;<WebShell
  header={<WebShellHeader title="SurfaceKit" links={[]} />}
  footer={<WebShellFooter links={[]} />}
>
  <WebHero
    eyebrow="Naneware Labs"
    title="Production UI without the guesswork"
    description="A governed component and enterprise-pattern system."
  />
</WebShell>
```

## Styling and composition

- Tailwind CSS v4 variables in globals.css define light and dark tokens.
- Components accept their documented className and native element props.
- Compound components should be composed through their exported children.
- Prefer public composition hooks such as render and renderItem over wrapping
  internals or copying package source.

## Compatibility and validation

Preserve public import paths and existing prop behavior when updating the
package. Additive optional props are preferred for compatible changes;
removals, renames, and incompatible behavior changes require an explicit
breaking release decision.

Run package-focused checks from the monorepo root:

```bash
pnpm test:contracts
pnpm test:components:coverage
pnpm --filter @nwl/surfacekit typecheck
pnpm --filter @nwl/surfacekit build
pnpm test:storybook
```

For a new public module, add the source and export, behavioral test, Storybook
story, typed catalog record, and route-local demo before considering it
complete.

See the
[2026-08-24 enterprise-readiness audit](../../docs/audits/2026-08-24-surfacekit-enterprise-readiness.md)
before evaluating the package for an external application. A green workspace
suite is not evidence of a stable release tarball or general framework
compatibility.
