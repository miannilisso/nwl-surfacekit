# Using @nwl/surfacekit

The workspace consumes the package with `"@nwl/surfacekit": "workspace:*"`.
Built tarballs expose the same compiled ESM, declaration, and CSS shape. The app
must use React and React DOM 19; the package declares both as required
`^19.0.0` peers and does not bundle another React copy.

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

The exported stylesheet is precompiled and minified. Consumers do not install
Tailwind, PostCSS, the shadcn CLI, or animation build tooling for SurfaceKit,
and Next.js does not need `transpilePackages` for the package. Applications may
run their own CSS pipeline for application-local classes independently of the
SurfaceKit stylesheet.

The distributable CSS uses generic system font fallbacks. Applications own any
brand-font files and override SurfaceKit's font tokens at their root. The
reference Next app owns its supplied Outfit, Geist, and Geist Mono files; they
are not in the package tarball. The supported external package is planned as an
immutable 1.0 GitHub Release tarball; none is available yet.

For local verification, run `pnpm --filter @nwl/surfacekit build`, then
`pnpm --dir packages/ui pack`, and `pnpm test:consumers` from the repository
root. The consumer gate packs once, installs the same tarball without workspace
links in Next.js and Vite fixtures, and checks exports/types, production builds,
SSR, hydration, themes, and React identity. A future release consumer should
download the GitHub Release asset, verify its SHA-256 against `SHA256SUMS`, then
install that exact `.tgz` with its React 19 peers. See [RELEASE.md](../../RELEASE.md).

The package does not import browser globals during server render. Current
reference and clean-consumer SSR/hydration checks cover representative flows;
they do not guarantee every host integration. The app/Storybook mobile matrix
checks 320px, 375px, and 768px; components with intentional horizontal content
retain touch scrolling rather than widening the document.

## Application-shell example

```tsx
import {
  AppShell,
  AppSidebar,
  AppTopbar,
  ThemeSwitcher,
} from "@nwl/surfacekit/patterns/app-shell"
import { ResourceStatus } from "@nwl/surfacekit/patterns/resource-status"

const items = [
  { label: "Overview", href: "/workspace", active: true },
  { label: "Projects", href: "/workspace/projects", badge: 12 },
]

export function Workspace() {
  return (
    <AppShell
      topbar={
        <AppTopbar
          title="Production workspace"
          eyebrow="SurfaceKit"
          actions={<ThemeSwitcher />}
        />
      }
      sidebar={
        <AppSidebar
          label="Workspace navigation"
          items={items}
          footer={<a href="/">Home</a>}
        />
      }
      footer={
        <p className="text-sm text-muted-foreground">
          SurfaceKit production UI foundations.
        </p>
      }
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

`ThemeSwitcher` reads and updates the nearest `next-themes` provider. Use the
same component anywhere the application exposes its theme control so every
surface shares one persisted preference. `AppShell.footer` renders after the
main content in a `contentinfo` landmark. `AppSidebar.footer` stays after the
navigation list and is useful for secondary actions such as Home or account
navigation.

## Auth UI boundary

`@nwl/surfacekit/components/password-input`,
`@nwl/surfacekit/patterns/auth-shell`, `.../auth-form`,
`.../security-challenge`, and `.../step-up-dialog` provide controlled input,
request, challenge, and dialog states. The host app supplies values, callbacks,
transport, and identity-provider integration. A callback means a request was
raised, not that authentication or step-up verification succeeded. The host owns
credential protection, sessions, throttling, account enumeration policy, and
server-side authorization. `PermissionGate` is a UI display boundary only.

The other public categories are individual `components/<name>` and
`patterns/<name>` modules, the aggregate `patterns` export,
`hooks/use-mobile`, `lib/utils`, and `globals.css`. There is no JavaScript
package-root export or consumer `postcss.config` entry.

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
- `globals.css` is compiled; consumer Tailwind processing is not required.
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
pnpm --dir packages/ui pack
pnpm test:consumers
pnpm test:storybook
```

For a new public module, add the source and export, behavioral test, Storybook
story, typed catalog record, and route-local demo before considering it
complete.

See the [current enterprise-readiness audit](../../docs/audits/2026-08-24-surfacekit-enterprise-readiness.md)
before external adoption. Local consumer success and a published immutable
release are separate gates.
