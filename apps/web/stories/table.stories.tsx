import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@nwl/surfacekit/components/table"

const rows = [
  ["Production API", "Healthy", "99.99%", "Nairobi"],
  ["Customer portal", "Healthy", "99.97%", "Frankfurt"],
  ["Audit exports", "Degraded", "98.82%", "Virginia"],
]
function StatusTable({
  dense = false,
  empty = false,
  long = false,
}: {
  dense?: boolean
  empty?: boolean
  long?: boolean
}) {
  return (
    <Table className={long ? "min-w-[52rem]" : undefined}>
      <TableCaption>
        Service health for the current reporting window.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Availability</TableHead>
          <TableHead>Region</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {empty ? (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              No service data available.
            </TableCell>
          </TableRow>
        ) : (
          rows.map(([service, status, availability, region]) => (
            <TableRow key={service} className={dense ? "h-8" : undefined}>
              <TableCell className="font-medium">
                {long ? `${service} — enterprise production workload` : service}
              </TableCell>
              <TableCell>{status}</TableCell>
              <TableCell>{availability}</TableCell>
              <TableCell>{region}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      {!empty && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Fleet average</TableCell>
            <TableCell>99.59%</TableCell>
            <TableCell>Global</TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  )
}

const meta = {
  title: "SurfaceKit/Components/Content & Status/Table",
  component: StatusTable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Preserves native caption, header, body, footer, row, header-cell, and cell semantics inside a responsive overflow container.",
      },
    },
  },
} satisfies Meta<typeof StatusTable>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Dense: Story = { args: { dense: true } }
export const Empty: Story = { args: { empty: true } }
export const LongContent: Story = { args: { long: true } }
