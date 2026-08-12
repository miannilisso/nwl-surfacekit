import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Bar as RechartsBar,
  BarChart,
  CartesianGrid,
  Line as RechartsLine,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@nwl/surfacekit/components/chart"

const data = [
  { month: "Jan", requests: 4200, errors: 72 },
  { month: "Feb", requests: 5100, errors: 61 },
  { month: "Mar", requests: 6800, errors: 48 },
  { month: "Apr", requests: 7400, errors: 39 },
]
const config = {
  requests: { label: "API requests", color: "#5b6ee1" },
  errors: { label: "Errors", color: "#c0262d" },
} satisfies ChartConfig
function ChartExample({
  kind = "line",
  multiple = false,
  tooltip = false,
  empty = false,
}: {
  kind?: "line" | "bar"
  multiple?: boolean
  tooltip?: boolean
  empty?: boolean
}) {
  const chartData = empty ? [] : data
  const common = (
    <>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="month" />
      <YAxis />
      <ChartTooltip
        defaultIndex={tooltip ? 2 : undefined}
        content={<ChartTooltipContent />}
      />
      {multiple && <ChartLegend content={<ChartLegendContent />} />}
    </>
  )
  return (
    <figure className="w-[42rem] max-w-[calc(100vw-2rem)] rounded-3xl border bg-card p-5">
      <figcaption className="mb-4">
        <h3 className="font-heading text-lg font-medium">Production traffic</h3>
        <p className="text-sm text-muted-foreground">
          Requests and errors by month
        </p>
      </figcaption>
      <ChartContainer
        config={config}
        className="h-72 w-full"
        initialDimension={{ width: 640, height: 288 }}
      >
        {kind === "bar" ? (
          <BarChart accessibilityLayer data={chartData}>
            {common}
            <RechartsBar
              dataKey="requests"
              fill="var(--color-requests)"
              radius={8}
            />
            {multiple && (
              <RechartsBar
                dataKey="errors"
                fill="var(--color-errors)"
                radius={8}
              />
            )}
          </BarChart>
        ) : (
          <LineChart accessibilityLayer data={chartData}>
            {common}
            <RechartsLine
              dataKey="requests"
              stroke="var(--color-requests)"
              strokeWidth={3}
            />
            {multiple && (
              <RechartsLine
                dataKey="errors"
                stroke="var(--color-errors)"
                strokeWidth={3}
              />
            )}
          </LineChart>
        )}
      </ChartContainer>
      {empty && (
        <p className="-mt-36 mb-28 text-center text-sm text-muted-foreground">
          No traffic data for this period.
        </p>
      )}
    </figure>
  )
}
const meta = {
  title: "SurfaceKit/Components/Advanced/Chart",
  component: ChartExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Connects deterministic Recharts data to scoped theme variables, formatted tooltips, legends, and accessible chart layers.",
      },
    },
  },
} satisfies Meta<typeof ChartExample>
export default meta
type Story = StoryObj<typeof meta>
export const Line: Story = {}
export const Bar: Story = { args: { kind: "bar" } }
export const MultipleSeries: Story = { args: { multiple: true } }
export const Tooltip: Story = { args: { tooltip: true } }
export const Empty: Story = { args: { empty: true } }
