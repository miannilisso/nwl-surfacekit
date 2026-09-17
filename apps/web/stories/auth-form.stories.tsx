import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, fn, userEvent, within } from "storybook/test"

import { Button } from "@nwl/surfacekit/components/button"
import { Input } from "@nwl/surfacekit/components/input"
import { Label } from "@nwl/surfacekit/components/label"
import { PasswordInput } from "@nwl/surfacekit/components/password-input"
import {
  AuthForm,
  type AuthFormState,
} from "@nwl/surfacekit/patterns/auth-form"

type AuthFlow =
  | "password-login"
  | "sso-login"
  | "passkey-login"
  | "signup"
  | "invitation"
  | "email-verification"
  | "password-recovery"
  | "password-reset"

const flowContent: Record<
  AuthFlow,
  { title: string; description: string; submitLabel: string }
> = {
  "password-login": {
    title: "Sign in",
    description: "Send these credentials to your configured provider.",
    submitLabel: "Request sign in",
  },
  "sso-login": {
    title: "Continue with your organization",
    description: "Your application chooses and invokes the provider.",
    submitLabel: "Request organization sign in",
  },
  "passkey-login": {
    title: "Continue with a passkey",
    description: "Your application performs the passkey ceremony.",
    submitLabel: "Request passkey sign in",
  },
  signup: {
    title: "Create an account",
    description: "Open signup is controlled by your application.",
    submitLabel: "Request account",
  },
  invitation: {
    title: "Accept invitation",
    description: "Review the invitation before sending your request.",
    submitLabel: "Request invitation acceptance",
  },
  "email-verification": {
    title: "Verify your email",
    description: "Ask your application to send another verification message.",
    submitLabel: "Send verification email",
  },
  "password-recovery": {
    title: "Recover access",
    description: "Responses should not reveal whether an account exists.",
    submitLabel: "Request recovery instructions",
  },
  "password-reset": {
    title: "Choose a new password",
    description: "Your provider validates and stores the submitted credential.",
    submitLabel: "Request password reset",
  },
}

function AuthFormExample({
  flow = "password-login",
  state = "idle",
  statusMessage,
  onRequest = fn(),
}: {
  flow?: AuthFlow
  state?: AuthFormState
  statusMessage?: string
  onRequest?: (data: Record<string, FormDataEntryValue>) => void
}) {
  const [password, setPassword] = React.useState("")
  const [visible, setVisible] = React.useState(false)
  const content = flowContent[flow]
  const passwordAutocomplete =
    flow === "signup" || flow === "invitation" || flow === "password-reset"
      ? "new-password"
      : "current-password"
  const needsPassword = [
    "password-login",
    "signup",
    "invitation",
    "password-reset",
  ].includes(flow)

  return (
    <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-sm">
      <AuthForm
        title={content.title}
        description={content.description}
        state={state}
        statusMessage={statusMessage}
        submitLabel={content.submitLabel}
        onSubmit={(event) => {
          event.preventDefault()
          onRequest(Object.fromEntries(new FormData(event.currentTarget)))
        }}
        alternativeActions={
          flow === "password-login" ? (
            <>
              <Button type="button" variant="outline">
                Request SSO sign in
              </Button>
              <Button type="button" variant="outline">
                Request passkey sign in
              </Button>
            </>
          ) : undefined
        }
        secondaryActions={
          <Button
            render={<a href="#support" />}
            nativeButton={false}
            variant="link"
          >
            Need help?
          </Button>
        }
        footer="Submitting requests an authentication action; it does not prove identity or create a session."
      >
        <div className="space-y-2">
          <Label htmlFor="auth-story-username">Email or username</Label>
          <Input
            id="auth-story-username"
            name="username"
            type="text"
            autoComplete={
              flow === "passkey-login" ? "username webauthn" : "username"
            }
            defaultValue="person@example.com"
          />
        </div>
        {needsPassword ? (
          <div className="space-y-2">
            <Label htmlFor="auth-story-password">
              {passwordAutocomplete === "new-password"
                ? "New password"
                : "Password"}
            </Label>
            <PasswordInput
              id="auth-story-password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              visible={visible}
              onVisibleChange={setVisible}
              autoComplete={passwordAutocomplete}
            />
          </div>
        ) : null}
      </AuthForm>
    </div>
  )
}

const meta = {
  title: "SurfaceKit/Patterns/Auth Form",
  component: AuthFormExample,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Provider-neutral controlled forms for requesting sign-in, signup, invitation, verification, and recovery actions. Consumers enforce authentication and authorization server-side.",
      },
    },
  },
} satisfies Meta<typeof AuthFormExample>

export default meta
type Story = StoryObj<typeof meta>

export const PasswordLogin: Story = {
  args: { flow: "password-login", onRequest: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText("Password"), "example only")
    await userEvent.click(
      canvas.getByRole("button", { name: "Request sign in" })
    )
    await expect(args.onRequest).toHaveBeenCalledOnce()
  },
}
export const SSOLogin: Story = { args: { flow: "sso-login" } }
export const PasskeyLogin: Story = { args: { flow: "passkey-login" } }
export const OpenSignup: Story = { args: { flow: "signup" } }
export const InvitationAcceptance: Story = { args: { flow: "invitation" } }
export const EmailVerification: Story = { args: { flow: "email-verification" } }
export const PasswordRecovery: Story = { args: { flow: "password-recovery" } }
export const PasswordReset: Story = { args: { flow: "password-reset" } }
export const Pending: Story = { args: { state: "pending" } }
export const Success: Story = {
  args: {
    state: "success",
    statusMessage: "The request was accepted for processing.",
  },
}
export const Error: Story = {
  args: {
    state: "error",
    statusMessage: "We could not complete that request. Try again.",
  },
}
export const Locked: Story = {
  args: {
    state: "locked",
    statusMessage: "This request is temporarily unavailable. Try again later.",
  },
}
export const Expired: Story = {
  args: {
    state: "expired",
    statusMessage: "This request expired. Start again.",
  },
}
