import { Button } from "../../components/button"
import { Input } from "../../components/input"
import { cn } from "../../lib/utils"

interface DataTableToolbarProps extends React.ComponentProps<"div"> {
  title: string
  searchPlaceholder?: string
  actionLabel?: string
}

function DataTableToolbar({
  title,
  searchPlaceholder = "Search records",
  actionLabel = "New item",
  className,
  ...props
}: DataTableToolbarProps) {
  return (
    <div
      data-slot="data-table-toolbar"
      className={cn(
        "flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      {...props}
    >
      <div>
        <p className="text-sm tracking-[0.2em] text-muted-foreground uppercase">
          {title}
        </p>
        <Input placeholder={searchPlaceholder} className="mt-3 max-w-xs" />
      </div>
      <Button size="sm">{actionLabel}</Button>
    </div>
  )
}

export { DataTableToolbar }
