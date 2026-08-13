import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, within } from "storybook/test"
import { PermissionGate } from "@nwl/surfacekit/patterns/permission-gate"

function GateExample({
  allowed = false,
  loading = false,
  request = false,
  onRequestAccess = fn(),
}: {
  allowed?: boolean
  loading?: boolean
  request?: boolean
  onRequestAccess?: () => void
}) {
  return (
    <div className="w-[38rem] max-w-[calc(100vw-2rem)]">
      <PermissionGate
        allowed={allowed}
        loading={loading}
        title="Billing access required"
        description="Ask an owner to grant billing permissions."
        onRequestAccess={request ? onRequestAccess : undefined}
      >
        <section className="rounded-3xl border bg-card p-6">
          <h3 className="font-heading text-lg font-medium">Billing controls</h3>
          <p className="mt-2 text-sm">Annual enterprise plan · Active</p>
        </section>
      </PermissionGate>
    </div>
  )
}
const meta = {
  title: "SurfaceKit/Patterns/Permission Gate",
  component: GateExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Conditionally reveals protected content or a denied, request-access, custom-fallback, or permission-loading state.",
      },
    },
  },
} satisfies Meta<typeof GateExample>
export default meta
type Story = StoryObj<typeof meta>
export const Allowed: Story = { args: { allowed: true } }
export const Denied: Story = {}
export const RequestAccess: Story = {
  args: { request: true, onRequestAccess: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Request access" })
    )
    await expect(args.onRequestAccess).toHaveBeenCalledOnce()
  },
}
export const Loading: Story = { args: { loading: true } }
