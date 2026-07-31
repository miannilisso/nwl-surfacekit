import { cn } from "../../lib/utils.js"

interface AppShellProps extends React.ComponentProps<"div"> {
  topbar?: React.ReactNode
  sidebar?: React.ReactNode
}

function AppShell({ topbar, sidebar, className, children, ...props }: AppShellProps) {
  return (
    <div data-slot="app-shell" className={cn("flex min-h-screen flex-col bg-background", className)} {...props}>
      {topbar ? <div className="border-b border-border bg-card/70">{topbar}</div> : null}
      <div className="flex flex-1 overflow-hidden">
        {sidebar ? <aside className="w-72 border-r border-border bg-muted/30 p-4">{sidebar}</aside> : null}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

interface AppTopbarProps extends React.ComponentProps<"header"> {
  title: string
}

function AppTopbar({ title, className, ...props }: AppTopbarProps) {
  return (
    <header data-slot="app-topbar" className={cn("flex items-center justify-between p-4", className)} {...props}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="text-sm text-muted-foreground">SurfaceKit</div>
    </header>
  )
}

interface AppSidebarProps extends React.ComponentProps<"nav"> {
  items: string[]
}

function AppSidebar({ items, className, ...props }: AppSidebarProps) {
  return (
    <nav data-slot="app-sidebar" className={cn("space-y-2", className)} {...props}>
      <p className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Navigation</p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item}>
            <div className="rounded-xl px-3 py-2 text-sm text-foreground/80 hover:bg-background">{item}</div>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export { AppShell, AppSidebar, AppTopbar }
