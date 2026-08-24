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
  {
    path: "/playground/form-inputs",
    heading: "Form Inputs",
    snapshot: "form-inputs",
  },
  {
    path: "/playground/navigation",
    heading: "Navigation",
    snapshot: "navigation",
  },
  {
    path: "/playground/dialogs-overlays",
    heading: "Dialogs & Overlays",
    snapshot: "dialogs-overlays",
  },
  {
    path: "/playground/data-display",
    heading: "Data Display",
    snapshot: "data-display",
  },
  {
    path: "/playground/feedback",
    heading: "Feedback",
    snapshot: "feedback",
  },
  {
    path: "/playground/layout-utilities",
    heading: "Layout & Utilities",
    snapshot: "layout-utilities",
  },
  {
    path: "/playground/patterns",
    heading: "Patterns",
    snapshot: "patterns",
  },
] as const

export const applicationRoutes = [
  ...marketingRoutes,
  ...playgroundRoutes,
] as const

export function routeSnapshotName(route: (typeof applicationRoutes)[number]) {
  return route.snapshot
}
