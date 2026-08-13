import { Search, Filter, Download } from "lucide-react"

import { Button } from "../../components/button"
import { Input } from "../../components/input"
import { Badge } from "../../components/badge"
import { cn } from "../../lib/utils"

interface DataTableToolbarProps extends React.ComponentProps<"div"> {
  title: string
  searchPlaceholder?: string
  actionLabel?: string
  count?: number
  onFilter?: () => void
  onExport?: () => void
  searchValue?: string
  searchLabel?: string
  onSearchValueChange?: (value: string) => void
  onCreate?: () => void
  busy?: boolean
}

function DataTableToolbar({
  title,
  searchPlaceholder = "Search records",
  actionLabel = "New item",
  count,
  onFilter,
  onExport,
  searchValue,
  searchLabel = "Search records",
  onSearchValueChange,
  onCreate,
  busy = false,
  className,
  ...props
}: DataTableToolbarProps) {
  return (
    <div
      data-slot="data-table-toolbar"
      className={cn(
        "space-y-4 rounded-3xl border border-border bg-card p-5 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              {title}
            </p>
            {count !== undefined && <Badge variant="secondary">{count}</Badge>}
          </div>
          <div className="relative max-w-xs">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              aria-label={searchLabel}
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(event) => onSearchValueChange?.(event.target.value)}
              disabled={busy}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {onFilter && (
            <Button
              variant="outline"
              size="sm"
              onClick={onFilter}
              disabled={busy}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          )}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              disabled={busy}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
          <Button size="sm" onClick={onCreate} disabled={busy}>
            {busy ? "Working…" : actionLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { DataTableToolbar }
