import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@nwl/surfacekit/components/button"
import { Input } from "@nwl/surfacekit/components/input"
import { Label } from "@nwl/surfacekit/components/label"
import { AuthPanel, AuthShell } from "@nwl/surfacekit/patterns/auth-shell"
import { ErrorSummary } from "@nwl/surfacekit/patterns/error-summary"

function AuthExample({
  mode = "signin",
  split = false,
}: {
  mode?: "signin" | "verification" | "error"
  split?: boolean
}) {
  const title =
    mode === "verification"
      ? "Verify your identity"
      : mode === "error"
        ? "Sign-in needs attention"
        : "Welcome back"
  return (
    <AuthShell
      title={title}
      brand="SurfaceKit access"
      subtitle={
        mode === "verification"
          ? "Enter the six-digit code from your authenticator."
          : "Use your managed work account to continue."
      }
      aside={
        split ? (
          <AuthPanel
            title="Application guidance"
            subtitle="Configured by the consuming application"
          >
            <p className="text-sm">
              Show only the sign-in and recovery methods your provider supports.
            </p>
            <footer className="pt-4 text-xs text-muted-foreground">
              Security policy SK-12
            </footer>
          </AuthPanel>
        ) : undefined
      }
      support={
        <Button
          render={<a href="#support" />}
          nativeButton={false}
          variant="link"
          size="sm"
        >
          Get support
        </Button>
      }
      legal={
        <Button
          render={<a href="#privacy" />}
          nativeButton={false}
          variant="link"
          size="sm"
        >
          Privacy
        </Button>
      }
      footer="This screen requests authentication; the consuming application decides whether access is granted."
    >
      <AuthPanel
        title={mode === "verification" ? "Security code" : "Secure access"}
        subtitle="The consuming application validates each submitted request."
      >
        {mode === "error" && (
          <ErrorSummary
            title="Authentication failed"
            messages={[
              "Your session expired. Start a new sign-in request.",
              "If this continues, contact your identity administrator with request ID req_01J9.",
            ]}
          />
        )}
        <form aria-label="Authentication" className="space-y-3">
          {mode === "verification" ? (
            <>
              <Label htmlFor="code">Verification code</Label>
              <Input id="code" inputMode="numeric" />
            </>
          ) : (
            <>
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" />
            </>
          )}
          <Button className="w-full">
            {mode === "verification" ? "Verify code" : "Continue with SSO"}
          </Button>
        </form>
      </AuthPanel>
    </AuthShell>
  )
}
const meta = {
  title: "SurfaceKit/Patterns/Auth Shell",
  component: AuthExample,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Frames provider-neutral sign-in, verification, and recoverable request errors with optional supporting content.",
      },
    },
  },
} satisfies Meta<typeof AuthExample>
export default meta
type Story = StoryObj<typeof meta>
export const SignIn: Story = {}
export const Verification: Story = { args: { mode: "verification" } }
export const Error: Story = { args: { mode: "error" } }
export const SplitLayout: Story = { args: { split: true } }
