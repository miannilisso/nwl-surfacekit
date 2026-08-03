import { Search, Settings } from "lucide-react"

import { Button } from "../../components/button"
import { cn } from "../../lib/utils"

interface AppShellProps extends React.ComponentProps<"div"> {
  topbar?: React.ReactNode
  sidebar?: React.ReactNode
}

function AppShell({ topbar, sidebar, className, children, ...props }: AppShellProps) {
  return (
    <div
      data-slot="app-shell"
      className={cn("flex min-h-screen flex-col bg-background text-foreground", className)}
      {...props}
    >
      {topbar ? <div className="border-b border-border bg-card/80 backdrop-blur">{topbar}</div> : null}
      <div className="flex flex-1 overflow-hidden">
        {sidebar ? (
          <aside className="hidden w-72 shrink-0 border-r border-border bg-sidebar p-4 text-sidebar-foreground md:block">
            {sidebar}
          </aside>
        ) : null}
        <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

interface AppTopbarProps extends React.ComponentProps<"header"> {
  title: string
  eyebrow?: string
  actions?: React.ReactNode
}

function AppTopbar({ title, eyebrow = "Workspace", actions, className, ...props }: AppTopbarProps) {
  return (
    <header
      data-slot="app-topbar"
      className={cn("flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6", className)}
      {...props}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase text-muted-foreground">{eyebrow}</p>
        <h1 className="truncate text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button aria-label="Search workspace" variant="ghost" size="icon-sm">
          <Search />
        </Button>
        {actions ?? (
          <Button aria-label="Open settings" variant="outline" size="icon-sm">
            <Settings />
          </Button>
        )}
      </div>
    </header>
  )
}

interface AppSidebarProps extends React.ComponentProps<"nav"> {
  items: Array<{ label: string; href?: string; active?: boolean }>
  label?: string
}

function AppSidebar({ items, label = "Navigation", className, ...props }: AppSidebarProps) {
  return (
    <nav data-slot="app-sidebar" aria-label={label} className={cn("space-y-4", className)} {...props}>
      <div className="px-2">
        <p className="text-xs font-semibold uppercase text-sidebar-foreground/60">{label}</p>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href ?? "#"}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "block rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                item.active && "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export { AppShell, AppSidebar, AppTopbar }
