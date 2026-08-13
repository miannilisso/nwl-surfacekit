import { Alert, AlertDescription, AlertTitle } from "../../components/alert"
import { Button } from "../../components/button"
import { Skeleton } from "../../components/skeleton"
import { cn } from "../../lib/utils"

interface PermissionGateProps extends React.ComponentProps<"div"> {
  title: string
  description: string
  actionLabel?: string
  allowed?: boolean
  loading?: boolean
  fallback?: React.ReactNode
  onRequestAccess?: () => void
}

function PermissionGate({
  title,
  description,
  actionLabel = "Request access",
  allowed = false,
  loading = false,
  fallback,
  onRequestAccess,
  className,
  children,
  ...props
}: PermissionGateProps) {
  if (loading) {
    return (
      <div
        data-slot="permission-gate"
        data-state="loading"
        role="status"
        aria-label="Checking permissions"
        className={cn(
          "space-y-3 rounded-3xl border border-border bg-card p-5 shadow-sm",
          className
        )}
        {...props}
      >
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-full" />
      </div>
    )
  }

  if (allowed) return <>{children}</>

  if (fallback) return <>{fallback}</>

  return (
    <div
      data-slot="permission-gate"
      className={cn(
        "rounded-3xl border border-border bg-card p-5 shadow-sm",
        className
      )}
      {...props}
    >
      <Alert className="border-none p-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <AlertTitle className="text-base">{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
          </div>
          <Button size="sm" variant="outline" onClick={onRequestAccess}>
            {actionLabel}
          </Button>
        </div>
      </Alert>
    </div>
  )
}

export { PermissionGate }
