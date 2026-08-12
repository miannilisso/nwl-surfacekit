import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { Table } from "@nwl/surfacekit/components/table"

const meta: Meta<typeof Table> = {
  title: "SurfaceKit/Table",
  component: Table,
  args: {
    children: (
      <>
        <thead>
          <tr>
            <th>Item</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SurfaceKit</td>
            <td>Preview</td>
          </tr>
        </tbody>
      </>
    ),
  },
  render: (args: ComponentProps<typeof Table>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Table {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
