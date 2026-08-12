# SurfaceKit Web App

A modern Next.js 16 application showcasing the complete SurfaceKit component library and enterprise design patterns. Built with React 19, TypeScript, Tailwind CSS v4, and shadcn/ui conventions.

## Overview

The web app provides two main sections:

- **Marketing** - Public landing and documentation pages using the WebShell pattern
- **Playground** - Interactive component and pattern showcase using the AppShell pattern with a sidebar navigation and theme switcher

## Features

### 🎨 Component Showcase

Explore **60+ carefully crafted components** organized by category:

- **Form Inputs** - Input, Textarea, Checkbox, RadioGroup, Select, NativeSelect, Slider, Toggle, ToggleGroup, Switch
- **Navigation** - Breadcrumb, Menubar, Pagination, Tabs, NavigationMenu
- **Dialogs & Overlays** - Dialog, Drawer, Sheet, Tooltip, Popover, HoverCard, ContextMenu, DropdownMenu, AlertDialog, Command
- **Data Display** - Table, Carousel, Calendar, Message, MessageScroller, Collapsible
- **Feedback** - Alert, Progress, Skeleton, Spinner, Empty, Badge
- **Layout & Utilities** - AspectRatio, Avatar, Separator, Attachment, Bubble, Kbd, ScrollArea, Resizable, Marker, Item, Field

### 🏗️ Enterprise Patterns

Learn from **10 production-ready patterns**:

- **AppShell** - Complete application layout with topbar, sidebar, and main content area
- **AppTopbar** - Fixed header with title, navigation, search, notifications, theme switcher, and settings
- **AppSidebar** - Responsive navigation menu with active states and badges
- **AuthShell** - Authentication layout pattern with login/signup flows
- **WebShell** - Public-facing website layout with header and footer
- **DataTableToolbar** - Reusable toolbar for data tables with filters and actions
- **ConfirmDangerAction** - Safe confirmation dialog for destructive operations
- **ErrorSummary** - Accessible error aggregation and display
- **IncidentBanner** - System incident and maintenance notifications
- **PermissionGate** - Role-based access control pattern

### 🌓 Dark/Light Theme Switching

Toggle between dark and light modes with the theme switcher in the top bar. Theme preference is persisted to local storage using `next-themes`.

### ♿ Accessibility First

All components and patterns are built using accessible primitives from Base UI and include:

- Full keyboard navigation support
- ARIA labels and roles
- Screen reader testing with axe-core
- 100% test coverage across all components

### 📱 Responsive Design

Built with Tailwind CSS v4 and responsive utility classes. Components adapt gracefully to mobile, tablet, and desktop viewports.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

From the workspace root:

```bash
pnpm install
```

### Development Server

From the workspace root or `apps/web` directory:

```bash
pnpm dev
```

The app will be available at:

- **<http://localhost:3000>** - Local development
- **<http://192.168.1.103:3000>** - Network access (IP may vary)

### Production Build

```bash
pnpm build
pnpm start
```

## Project Structure

```txt
apps/web/
├── app/
│   ├── (marketing)/              # Public routes using WebShell pattern
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── (playground)/             # Component showcase using AppShell pattern
│       ├── layout.tsx
│       ├── playground/           # Overview page with component samples
│       │   └── page.tsx
│       ├── form-inputs/          # Form input components section
│       │   └── page.tsx
│       ├── navigation/           # Navigation components section
│       │   └── page.tsx
│       ├── dialogs-overlays/     # Dialog & overlay components section
│       │   └── page.tsx
│       ├── data-display/         # Data display components section
│       │   └── page.tsx
│       ├── feedback/             # Feedback components section
│       │   └── page.tsx
│       ├── layout-utilities/     # Layout utility components section
│       │   └── page.tsx
│       └── patterns/             # Pattern showcase section
│           └── page.tsx
├── components/                   # App-specific components (if any)
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions and helpers
├── stories/                      # Storybook stories for all components/patterns
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## Navigation

The playground features an interactive sidebar with links to all sections:

1. **Overview** (`/playground`) - Quick component samples and pattern examples
2. **Form Inputs** (`/form-inputs`) - All form-related components
3. **Navigation** (`/navigation`) - Navigation and menu components
4. **Dialogs & Overlays** (`/dialogs-overlays`) - Modal, dialog, and overlay components
5. **Data Display** (`/data-display`) - Tables, carousels, calendars, and messaging
6. **Feedback** (`/feedback`) - Alerts, progress, status, and empty states
7. **Layout & Utilities** (`/layout-utilities`) - Layout helpers and utility components
8. **Patterns** (`/patterns`) - Enterprise design patterns and their usage

## Using Components

All components are imported from the `@nwl/surfacekit` package:

```typescript
import { Button } from "@nwl/surfacekit/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@nwl/surfacekit/components/card"
import { Input } from "@nwl/surfacekit/components/input"

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text..." />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  )
}
```

## Using Patterns

Import patterns from `@nwl/surfacekit/patterns`:

```typescript
import { AppShell, AppTopbar, AppSidebar } from "@nwl/surfacekit/patterns/app-shell"

const navItems = [
  { label: "Dashboard", href: "/", active: true },
  { label: "Settings", href: "/settings", active: false },
]

export function Dashboard() {
  return (
    <AppShell
      topbar={<AppTopbar title="Dashboard" eyebrow="Welcome" />}
      sidebar={<AppSidebar items={navItems} />}
    >
      {/* Your page content */}
    </AppShell>
  )
}
```

## Theming

### Using the Theme Hook

Access theme state with the `useTheme` hook from `next-themes`:

```typescript
"use client"

import { useTheme } from "next-themes"

export function MyThemedComponent() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Current theme: {theme}
    </button>
  )
}
```

### Customizing Colors

Colors are defined in `tailwind.config.ts` using CSS variables:

```css
@layer theme {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.6%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    /* ... more colors ... */
  }

  .dark {
    --background: 0 0% 3.6%;
    --foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    /* ... more colors ... */
  }
}
```

## Testing

### Unit Tests

Components include Vitest tests with 100% coverage. Run tests with:

```bash
pnpm test
```

### Component Stories

All components and patterns have Storybook stories in `stories/`:

```bash
pnpm storybook
```

View interactive component examples and their prop variations.

### E2E Tests

Playwright smoke and visual tests verify critical user flows:

```bash
pnpm test:e2e
```

## Performance

- **Turbopack** - Fast incremental builds during development
- **Server Components** - Automatic code splitting and reduced JavaScript
- **Static Pre-rendering** - All playground routes pre-rendered at build time
- **Image Optimization** - Next.js automatic image optimization
- **CSS Optimization** - Tailwind CSS v4 tree-shaking and minification

## Accessibility

All components follow WAI-ARIA best practices:

- Semantic HTML structure
- Keyboard navigation support
- Screen reader announcements
- Sufficient color contrast
- Focus management

Run axe accessibility checks during testing:

```bash
pnpm test:a11y
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

Key dependencies:

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Static typing
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui conventions** - Component patterns and styling
- **@base-ui/react** - Accessible component primitives
- **next-themes** - Dark mode management
- **lucide-react** - Icon library
- **@portabletext/react** - Rich text rendering

See `package.json` for complete dependency list.

## Configuration Files

- **next.config.ts** - Next.js build and runtime configuration
- **tailwind.config.ts** - Tailwind CSS token and plugin configuration
- **tsconfig.json** - TypeScript compiler options
- **components.json** - shadcn/ui component generation config
- **postcss.config.mjs** - PostCSS plugins and settings

## Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Production build
pnpm start            # Start production server
pnpm test             # Run unit tests
pnpm test:e2e         # Run end-to-end tests
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript type checking
pnpm storybook        # Start Storybook dev server
```

## Contributing

When adding new components:

1. Create component folder in `packages/ui/src/components/<name>/`
2. Add component implementation in `<name>.tsx`
3. Add tests in `<name>.test.tsx`
4. Add Storybook story in `apps/web/stories/<name>.stories.tsx`
5. Update the playground pages to showcase the component
6. Update this README with the new component

## License

See LICENSE file in the workspace root.

## Resources

- [SurfaceKit Documentation](../../../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Base UI](https://base-ui.io)
