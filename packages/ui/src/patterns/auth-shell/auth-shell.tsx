import { cn } from "../../lib/utils.js"

interface AuthShellProps extends React.ComponentProps<"section"> {
  title: string
  subtitle?: string
}

function AuthShell({ title, subtitle, className, children, ...props }: AuthShellProps) {
  return (
    <section
      data-slot="auth-shell"
      className={cn("grid min-h-screen gap-6 bg-background p-6 md:grid-cols-[1.2fr_0.8fr]", className)}
      {...props}
    >
      <div className="flex flex-col justify-center gap-4 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        <div className="rounded-2xl border border-dashed border-border bg-background/60 p-6">
          {children}
        </div>
      </div>
      <div className="flex items-center justify-center rounded-3xl bg-muted/70 p-6">
        <AuthPanel title="Secure access" subtitle="Use your work account to continue">
          <p className="text-sm text-muted-foreground">Single Sign-On and passwordless sign-in ready.</p>
        </AuthPanel>
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
      className={cn("w-full max-w-sm rounded-3xl border border-border bg-background p-6 shadow-sm", className)}
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
