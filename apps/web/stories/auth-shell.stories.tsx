import { AuthPanel, AuthShell } from "@nwl/surfacekit/patterns/auth-shell"

const meta = {
  title: "SurfaceKit/Patterns/AuthShell",
  component: AuthShell,
}

export default meta

export const Default = {
  render: () => (
    <AuthShell title="Welcome back" subtitle="Sign in to continue">
      <AuthPanel title="Secure access" subtitle="Use your work account to continue">
        <div>Continue with SSO</div>
      </AuthPanel>
    </AuthShell>
  ),
}
