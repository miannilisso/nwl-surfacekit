import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  DirectionProvider,
  useDirection,
} from "@nwl/surfacekit/components/direction"

function DirectionSample({ label }: { label: string }) {
  const direction = useDirection()
  return (
    <section
      dir={direction}
      className="w-80 max-w-[calc(100vw-2rem)] rounded-2xl border p-4"
    >
      <p className="font-medium">{label}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {direction === "rtl"
          ? "مرحبا بكم في مساحة العمل"
          : "Welcome to the production workspace"}
      </p>
      <output className="mt-3 block text-xs">Direction: {direction}</output>
    </section>
  )
}
function DirectionExample({
  direction = "ltr",
  nested = false,
}: {
  direction?: "ltr" | "rtl"
  nested?: boolean
}) {
  return (
    <DirectionProvider direction={direction}>
      <DirectionSample label="Workspace" />
      {nested && (
        <DirectionProvider direction={direction === "rtl" ? "ltr" : "rtl"}>
          <div className="mt-4">
            <DirectionSample label="Nested override" />
          </div>
        </DirectionProvider>
      )}
    </DirectionProvider>
  )
}
const meta = {
  title: "SurfaceKit/Components/Advanced/Direction",
  component: DirectionExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Provides left-to-right or right-to-left reading direction to Base UI primitives, with scoped nested overrides.",
      },
    },
  },
} satisfies Meta<typeof DirectionExample>
export default meta
type Story = StoryObj<typeof meta>
export const LTR: Story = {}
export const RTL: Story = { args: { direction: "rtl" } }
export const Nested: Story = { args: { direction: "rtl", nested: true } }
