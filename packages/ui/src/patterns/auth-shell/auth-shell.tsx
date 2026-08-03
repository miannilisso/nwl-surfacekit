import { cn } from "../../lib/utils"

interface AuthShellProps extends React.ComponentProps<"section"> {
  title: string
  subtitle?: string
  aside?: React.ReactNode
}

function AuthShell({ title, subtitle, aside, className, children, ...props }: AuthShellProps) {
  return (
    <section
      data-slot="auth-shell"
      className={cn("grid min-h-screen bg-background text-foreground md:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)]", className)}
      {...props}
    >
      <div className="flex min-h-screen flex-col justify-center px-6 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">SurfaceKit</p>
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          <div>{children}</div>
        </div>
      </div>
      <div className="hidden min-h-screen border-l border-border bg-muted/50 p-10 md:flex md:items-end">
        {aside ?? (
          <AuthPanel title="Secure access" subtitle="SSO, passkeys, and passwordless flows ready for product teams.">
            <p className="text-sm text-muted-foreground">Built from accessible Base UI primitives and tokenized shadcn source.</p>
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

function AuthPanel({ title, subtitle, className, children, ...props }: AuthPanelProps) {
  return (
    <div
      data-slot="auth-panel"
      className={cn("w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-sm", className)}
      {...props}
    >
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="mt-6 space-y-3">{children}</div>
    </div>
  )
}

export { AuthPanel, AuthShell }
