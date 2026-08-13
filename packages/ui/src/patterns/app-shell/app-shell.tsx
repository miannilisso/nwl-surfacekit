"use client"

import * as React from "react"
import {
  Search,
  Settings,
  BarChart3,
  FileText,
  Users,
  CreditCard,
  Bell,
  Sun,
  Moon,
} from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "../../components/button"
import { Badge } from "../../components/badge"
import { cn } from "../../lib/utils"

interface AppShellProps extends React.ComponentProps<"div"> {
  topbar?: React.ReactNode
  sidebar?: React.ReactNode
}

function AppShell({
  topbar,
  sidebar,
  className,
  children,
  ...props
}: AppShellProps) {
  return (
    <div
      data-slot="app-shell"
      className={cn(
        "relative min-h-screen bg-background text-foreground",
        className
      )}
      {...props}
    >
      {topbar ? (
        <div className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-card/80 backdrop-blur">
          {topbar}
        </div>
      ) : null}
      <div className={cn("flex", topbar && "pt-16")}>
        {sidebar ? (
          <aside
            className="fixed top-0 left-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-border bg-sidebar p-4 text-sidebar-foreground md:block"
            style={{
              top: topbar ? "4rem" : "0",
              height: topbar ? "calc(100vh - 4rem)" : "100vh",
            }}
          >
            {sidebar}
          </aside>
        ) : null}
        <main
          className={cn(
            "min-w-0 flex-1 p-4 sm:p-6 lg:p-8",
            sidebar && "md:ml-72"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

interface AppTopbarProps extends React.ComponentProps<"header"> {
  title: string
  eyebrow?: string
  actions?: React.ReactNode
}

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Button
      aria-label="Toggle theme"
      variant="ghost"
      size="icon-sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      suppressHydrationWarning
    >
      {mounted && theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : mounted ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}

function AppTopbar({
  title,
  eyebrow = "Workspace",
  actions,
  className,
  ...props
}: AppTopbarProps) {
  return (
    <header
      data-slot="app-topbar"
      className={cn(
        "flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6",
        className
      )}
      {...props}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <h1 className="truncate text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          aria-label="Notifications"
          variant="ghost"
          size="icon-sm"
          className="relative"
        >
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs">
            2
          </Badge>
        </Button>
        <Button aria-label="Search workspace" variant="ghost" size="icon-sm">
          <Search className="h-4 w-4" />
        </Button>
        <ThemeSwitcher />
        {actions ?? (
          <Button aria-label="Open settings" variant="outline" size="icon-sm">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>
    </header>
  )
}

interface AppSidebarItem {
  label: string
  href?: string
  active?: boolean
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
}

interface AppSidebarProps extends React.ComponentProps<"nav"> {
  items: AppSidebarItem[]
  label?: string
  renderItem?: (
    item: AppSidebarItem,
    props: React.ComponentProps<"a">
  ) => React.ReactNode
}

function AppSidebar({
  items,
  label = "Navigation",
  renderItem,
  className,
  ...props
}: AppSidebarProps) {
  const defaultIcons: Record<
    string,
    React.ComponentType<{ className?: string }>
  > = {
    overview: BarChart3,
    reports: FileText,
    team: Users,
    billing: CreditCard,
  }

  return (
    <nav
      data-slot="app-sidebar"
      aria-label={label}
      className={cn("space-y-6", className)}
      {...props}
    >
      <div className="px-2">
        <p className="text-xs font-semibold text-sidebar-foreground/60 uppercase">
          {label}
        </p>
      </div>
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon || defaultIcons[item.label.toLowerCase()]
          const anchorProps: React.ComponentProps<"a"> = {
            href: item.href ?? "#",
            "aria-current": item.active ? "page" : undefined,
            className: cn(
              "flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              item.active &&
                "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
            ),
            children: (
              <>
                <div className="flex min-w-0 items-center gap-2">
                  {Icon && <Icon className="h-4 w-4 shrink-0" />}
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className="ml-auto shrink-0 text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </>
            ),
          }
          return (
            <li key={item.label}>
              {renderItem ? (
                renderItem(item, anchorProps)
              ) : (
                <a {...anchorProps} />
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export { AppShell, AppSidebar, AppTopbar, type AppSidebarItem }
