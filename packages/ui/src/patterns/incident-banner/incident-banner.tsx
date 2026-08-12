import { Button } from "../../components/button"
import { Alert, AlertDescription, AlertTitle } from "../../components/alert"
import { cn } from "../../lib/utils"

interface IncidentBannerProps extends React.ComponentProps<"div"> {
  title: string
  description: string
  actionLabel?: string
}

function IncidentBanner({
  title,
  description,
  actionLabel = "View status",
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
      <Alert className="border-none p-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <AlertTitle>{title}</AlertTitle>
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

export { IncidentBanner }
