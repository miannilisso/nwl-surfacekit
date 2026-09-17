import { CheckCircle2 } from "lucide-react"
import { cn } from "../../lib/utils"

interface AuthShellProps extends React.ComponentProps<"section"> {
  title: string
  subtitle?: string
  aside?: React.ReactNode
  brand?: React.ReactNode
  support?: React.ReactNode
  legal?: React.ReactNode
  footer?: React.ReactNode
}

function AuthShell({
  title,
  subtitle,
  aside,
  brand = "SurfaceKit",
  support,
  legal,
  footer,
  className,
  children,
  ...props
}: AuthShellProps) {
  return (
    <section
      data-slot="auth-shell"
      className={cn(
        "grid min-h-screen bg-background text-foreground md:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)]",
        className
      )}
      {...props}
    >
      <div className="flex min-h-screen flex-col justify-center px-6 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <div className="text-sm font-medium text-primary">{brand}</div>
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            {subtitle ? (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <div>{children}</div>
          {support || legal ? (
            <nav
              aria-label="Authentication support"
              className="flex flex-wrap gap-3 text-sm text-muted-foreground"
            >
              {support}
              {legal}
            </nav>
          ) : null}
          {footer ? (
            <footer className="text-sm text-muted-foreground">{footer}</footer>
          ) : null}
        </div>
      </div>
      <div className="hidden min-h-screen border-l border-border bg-muted/50 p-10 md:flex md:flex-col md:items-end">
        {aside ?? (
          <AuthPanel
            title="Secure access"
            subtitle="Compose the sign-in methods and recovery paths your application supports."
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                SurfaceKit provides presentation and interaction only. Your
                application verifies every request.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                  <span>Works with your chosen sign-in service</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                  <span>Controlled verification states</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                  <span>Accessible recovery workflows</span>
                </li>
              </ul>
            </div>
          </AuthPanel>
        )}
      </div>
    </section>
  )
}

interface AuthPanelProps extends React.ComponentProps<"div"> {
  title: string
  subtitle?: string
}

function AuthPanel({
  title,
  subtitle,
  className,
  children,
  ...props
}: AuthPanelProps) {
  return (
    <div
      data-slot="auth-panel"
      className={cn(
        "w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      <div className="mt-6 space-y-3">{children}</div>
    </div>
  )
}

export { AuthPanel, AuthShell }
