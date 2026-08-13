import { Button } from "../../components/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card"
import { cn } from "../../lib/utils"

interface ConfirmDangerActionProps extends React.ComponentProps<"div"> {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  state?: "idle" | "pending" | "error"
  disabled?: boolean
  onCancel?: () => void
  onConfirm?: () => void
}

function ConfirmDangerAction({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  state = "idle",
  disabled = false,
  onCancel,
  onConfirm,
  className,
  ...props
}: ConfirmDangerActionProps) {
  return (
    <div
      data-slot="confirm-danger-action"
      data-state={state}
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
            <Button
              variant="outline"
              size="sm"
              disabled={state === "pending"}
              onClick={onCancel}
            >
              {cancelLabel}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={disabled || state === "pending"}
              onClick={onConfirm}
            >
              {state === "pending" ? "Processing…" : confirmLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { ConfirmDangerAction }
