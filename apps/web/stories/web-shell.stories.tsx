import { WebShell, WebShellFooter, WebShellHeader } from "@nwl/surfacekit/patterns/web-shell"

const meta = {
  title: "SurfaceKit/Patterns/WebShell",
  component: WebShell,
}

export default meta

export const Default = {
  render: () => (
    <WebShell
      header={<WebShellHeader title="SurfaceKit" />}
      footer={<WebShellFooter links={["Docs", "Pricing", "About"]} />}
    >
      <div>Landing content for the marketing site</div>
    </WebShell>
  ),
}
