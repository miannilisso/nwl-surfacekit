import { Button } from "../../components/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card"
import { cn } from "../../lib/utils"

interface ConfirmDangerActionProps extends React.ComponentProps<"div"> {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
}

function ConfirmDangerAction({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  className,
  ...props
}: ConfirmDangerActionProps) {
  return (
    <div
      data-slot="confirm-danger-action"
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
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" size="sm">
              {cancelLabel}
            </Button>
            <Button variant="destructive" size="sm">
              {confirmLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { ConfirmDangerAction }
