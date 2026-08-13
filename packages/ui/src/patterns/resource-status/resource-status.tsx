import { Card, CardContent, CardHeader, CardTitle } from "../../components/card"
import { Progress } from "../../components/progress"
import { cn } from "../../lib/utils"

interface ResourceStatusProps extends React.ComponentProps<"div"> {
  title: string
  value: string
  progress?: number
  detail?: string
  tone?: "healthy" | "warning" | "critical"
}

function ResourceStatus({
  title,
  value,
  progress,
  detail,
  tone = "healthy",
  className,
  ...props
}: ResourceStatusProps) {
  return (
    <div
      data-slot="resource-status"
      data-tone={tone}
      className={cn(
        "rounded-3xl border border-border bg-card p-5 shadow-sm",
        className
      )}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-2xl font-semibold">{value}</p>
            <p className="text-sm text-muted-foreground">{detail}</p>
          </div>
          <Progress
            value={progress ?? null}
            aria-label={`${title} progress`}
            className={cn(
              "mt-4",
              tone === "warning" &&
                "[&_[data-slot=progress-indicator]]:bg-amber-600",
              tone === "critical" &&
                "[&_[data-slot=progress-indicator]]:bg-destructive"
            )}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export { ResourceStatus }
