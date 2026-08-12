import { Alert, AlertDescription, AlertTitle } from "../../components/alert"
import { Card, CardContent } from "../../components/card"
import { cn } from "../../lib/utils"

interface ErrorSummaryProps extends React.ComponentProps<"div"> {
  title: string
  messages: string[]
}

function ErrorSummary({
  title,
  messages,
  className,
  ...props
}: ErrorSummaryProps) {
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
                {messages.map((message) => (
                  <li key={message}>{message}</li>
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
