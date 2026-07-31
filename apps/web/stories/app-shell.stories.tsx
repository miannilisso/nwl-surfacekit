import { AppShell, AppSidebar, AppTopbar } from "@nwl/surfacekit/patterns/app-shell"

const meta = {
  title: "SurfaceKit/Patterns/AppShell",
  component: AppShell,
}

export default meta

export const Default = {
  render: () => (
    <AppShell
      topbar={<AppTopbar title="Workspace" />}
      sidebar={<AppSidebar items={["Overview", "Projects", "Reports"]} />}
    >
      <div>Projects dashboard body</div>
    </AppShell>
  ),
}
