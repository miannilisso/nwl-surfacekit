import { cn } from "../../lib/utils.js"

interface WebShellProps extends React.ComponentProps<"div"> {
  header?: React.ReactNode
  footer?: React.ReactNode
}

function WebShell({ header, footer, className, children, ...props }: WebShellProps) {
  return (
    <div data-slot="web-shell" className={cn("flex min-h-screen flex-col bg-background", className)} {...props}>
      {header ? <div className="border-b border-border bg-card/80">{header}</div> : null}
      <main className="flex-1 p-8">{children}</main>
      {footer ? <footer className="border-t border-border bg-muted/40 p-6">{footer}</footer> : null}
    </div>
  )
}

interface WebShellHeaderProps extends React.ComponentProps<"header"> {
  title: string
}

function WebShellHeader({ title, className, ...props }: WebShellHeaderProps) {
  return (
    <header data-slot="web-shell-header" className={cn("flex items-center justify-between p-6", className)} {...props}>
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="text-sm text-muted-foreground">Built with SurfaceKit</div>
    </header>
  )
}

interface WebShellFooterProps extends React.ComponentProps<"div"> {
  links: string[]
}

function WebShellFooter({ links, className, ...props }: WebShellFooterProps) {
  return (
    <div data-slot="web-shell-footer" className={cn("flex items-center justify-between text-sm text-muted-foreground", className)} {...props}>
      <p>© 2026 SurfaceKit</p>
      <div className="flex gap-4">
        {links.map((link) => (
          <span key={link}>{link}</span>
        ))}
      </div>
    </div>
  )
}

export { WebShell, WebShellFooter, WebShellHeader }
