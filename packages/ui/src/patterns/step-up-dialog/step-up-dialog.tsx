import { Button } from "../../components/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card"
import { cn } from "../../lib/utils"

interface StepUpDialogProps extends React.ComponentProps<"div"> {
  headline: string
  description: string
  primaryLabel?: string
  secondaryLabel?: string
}

function StepUpDialog({
  headline,
  description,
  primaryLabel = "Verify now",
  secondaryLabel = "Later",
  className,
  ...props
}: StepUpDialogProps) {
  return (
    <div
      data-slot="step-up-dialog"
      className={cn(
        "rounded-3xl border border-border bg-card p-6 shadow-sm",
        className
      )}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>{headline}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" size="sm">
              {secondaryLabel}
            </Button>
            <Button size="sm">{primaryLabel}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { StepUpDialog }
