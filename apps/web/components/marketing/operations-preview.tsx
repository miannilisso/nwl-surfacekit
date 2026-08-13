"use client"

import * as React from "react"
import { Badge } from "@nwl/surfacekit/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"
import { DataTableToolbar } from "@nwl/surfacekit/patterns/data-table-toolbar"
import { IncidentBanner } from "@nwl/surfacekit/patterns/incident-banner"
import { ResourceStatus } from "@nwl/surfacekit/patterns/resource-status"

const projects = [
  { name: "Atlas", region: "Nairobi", state: "Healthy" },
  { name: "Beacon", region: "Frankfurt", state: "Healthy" },
  { name: "Cinder", region: "Virginia", state: "Review" },
]

export function OperationsPreview() {
  const [query, setQuery] = React.useState("")
  const [feedback, setFeedback] = React.useState("Operations preview ready")
  const visibleProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-5 rounded-[2rem] border bg-muted/30 p-4 shadow-sm sm:p-6">
      <IncidentBanner
        severity="warning"
        title="Maintenance scheduled"
        description="A rolling database upgrade begins at 22:00 UTC."
        onAction={() => setFeedback("Maintenance details opened")}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <ResourceStatus
          title="Compute quota"
          value="62%"
          progress={62}
          detail="22 of 35 nodes active"
          tone="healthy"
        />
        <ResourceStatus
          title="Storage quota"
          value="84%"
          progress={84}
          detail="6 TB remaining"
          tone="warning"
        />
      </div>
      <DataTableToolbar
        title="Projects"
        count={visibleProjects.length}
        searchLabel="Search projects"
        searchPlaceholder="Search projects"
        searchValue={query}
        onSearchValueChange={setQuery}
        actionLabel="New project"
        onCreate={() => setFeedback("Project creation opened")}
        onFilter={() => setFeedback("Project filters opened")}
        onExport={() => setFeedback("Export prepared")}
      />
      {query ? (
        <p className="text-sm text-muted-foreground">
          {`Showing results for ${query}`}
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-3">
        {visibleProjects.map((project) => (
          <Card size="sm" key={project.name}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">{project.region}</span>
              <Badge
                variant={project.state === "Healthy" ? "secondary" : "outline"}
              >
                {project.state}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <p role="status" aria-live="polite" className="text-sm font-medium">
        {feedback}
      </p>
    </div>
  )
}
