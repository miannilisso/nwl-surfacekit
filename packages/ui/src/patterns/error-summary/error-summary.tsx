import { Alert, AlertDescription, AlertTitle } from "../../components/alert"
import { Card, CardContent } from "../../components/card"
import { cn } from "../../lib/utils"

export interface ErrorSummaryItem {
  id: string
  message: string
  href?: string
}

interface ErrorSummaryProps extends React.ComponentProps<"div"> {
  title: string
  messages: string[]
  errors?: ErrorSummaryItem[]
}

function ErrorSummary({
  title,
  messages,
  errors = [],
  className,
  ...props
}: ErrorSummaryProps) {
  const items: ErrorSummaryItem[] = [
    ...messages.map((message) => ({ id: message, message })),
    ...errors,
  ]

  if (items.length === 0) return null

  return (
    <div
      data-slot="error-summary"
      className={cn(
        "rounded-3xl border border-border bg-card p-5 shadow-sm",
        className
      )}
      {...props}
    >
      <Card>
        <CardContent>
          <Alert className="border-none p-0">
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {items.map((error) => (
                  <li key={error.id}>
                    {error.href ? (
                      <a href={error.href}>{error.message}</a>
                    ) : (
                      error.message
                    )}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

export { ErrorSummary }
