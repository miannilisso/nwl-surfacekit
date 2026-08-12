import { Alert, AlertDescription, AlertTitle } from "../../components/alert"
import { Button } from "../../components/button"
import { cn } from "../../lib/utils"

interface PermissionGateProps extends React.ComponentProps<"div"> {
  title: string
  description: string
  actionLabel?: string
}

function PermissionGate({
  title,
  description,
  actionLabel = "Request access",
  className,
  ...props
}: PermissionGateProps) {
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
          <Button size="sm" variant="outline">
            {actionLabel}
          </Button>
        </div>
      </Alert>
    </div>
  )
}

export { PermissionGate }
