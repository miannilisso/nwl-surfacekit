export const marketingRoutes = [
  { path: "/", heading: "SurfaceKit", snapshot: "home" },
  {
    path: "/marketing",
    heading: "Built for modern product development",
    snapshot: "marketing",
  },
] as const

export const playgroundRoutes = [
  {
    path: "/playground",
    heading: "Component playground",
    snapshot: "playground",
  },
  { path: "/form-inputs", heading: "Form Inputs", snapshot: "form-inputs" },
  { path: "/navigation", heading: "Navigation", snapshot: "navigation" },
  {
    path: "/dialogs-overlays",
    heading: "Dialogs & Overlays",
    snapshot: "dialogs-overlays",
  },
  { path: "/data-display", heading: "Data Display", snapshot: "data-display" },
  { path: "/feedback", heading: "Feedback", snapshot: "feedback" },
  {
    path: "/layout-utilities",
    heading: "Layout & Utilities",
    snapshot: "layout-utilities",
  },
  { path: "/patterns", heading: "Patterns", snapshot: "patterns" },
] as const

export const applicationRoutes = [
  ...marketingRoutes,
  ...playgroundRoutes,
] as const

export function routeSnapshotName(route: (typeof applicationRoutes)[number]) {
  return route.snapshot
}
