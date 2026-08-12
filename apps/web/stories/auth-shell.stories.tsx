import type { Meta, StoryObj } from "@storybook/react"

import { Button } from "@nwl/surfacekit/components/button"
import { AuthPanel, AuthShell } from "@nwl/surfacekit/patterns/auth-shell"
import { ErrorSummary } from "@nwl/surfacekit/patterns/error-summary"

const meta = {
  title: "SurfaceKit/Patterns/AuthShell",
  component: AuthShell,
} satisfies Meta<typeof AuthShell>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Welcome back",
    subtitle: "Sign in to continue",
  },
  render: () => (
    <AuthShell title="Welcome back" subtitle="Sign in to continue">
      <AuthPanel
        title="Secure access"
        subtitle="Use your work account to continue"
      >
        <ErrorSummary
          title="Access issue"
          messages={[
            "Your session expired",
            "Two-factor authentication is required",
          ]}
        />
        <Button className="w-full">Continue with SSO</Button>
        <Button className="w-full" variant="outline">
          Use passkey
        </Button>
      </AuthPanel>
    </AuthShell>
  ),
}
