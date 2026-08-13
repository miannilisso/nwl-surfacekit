import { Button } from "../../components/button"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "../../components/alert"
import { cn } from "../../lib/utils"

interface IncidentBannerProps extends React.ComponentProps<"div"> {
  title: string
  description: string
  actionLabel?: string
  severity?: "info" | "warning" | "critical"
  onAction?: () => void
  onDismiss?: () => void
}

function IncidentBanner({
  title,
  description,
  actionLabel = "View status",
  severity = "info",
  onAction,
  onDismiss,
  className,
  ...props
}: IncidentBannerProps) {
  return (
    <div
      data-slot="incident-banner"
      className={cn(
        "rounded-3xl border border-border bg-card p-5 shadow-sm",
        className
      )}
      {...props}
    >
      <Alert
        role={severity === "info" ? "status" : "alert"}
        data-severity={severity}
        variant={severity === "critical" ? "destructive" : "default"}
        className="border-none p-0"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
          </div>
          <Button size="sm" variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
        {onDismiss && (
          <AlertAction>
            <Button
              aria-label="Dismiss incident"
              size="icon-xs"
              variant="ghost"
              onClick={onDismiss}
            >
              ×
            </Button>
          </AlertAction>
        )}
      </Alert>
    </div>
  )
}

export { IncidentBanner }
