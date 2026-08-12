import { Card, CardContent, CardHeader, CardTitle } from "../../components/card"
import { Progress } from "../../components/progress"
import { cn } from "../../lib/utils"

interface ResourceStatusProps extends React.ComponentProps<"div"> {
  title: string
  value: string
  progress: number
  detail?: string
}

function ResourceStatus({
  title,
  value,
  progress,
  detail,
  className,
  ...props
}: ResourceStatusProps) {
  return (
    <div
      data-slot="resource-status"
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
          <Progress value={progress} className="mt-4" />
        </CardContent>
      </Card>
    </div>
  )
}

export { ResourceStatus }
