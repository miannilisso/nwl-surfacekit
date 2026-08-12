import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

describe("Table", () => {
  it("preserves native table semantics across every region", () => {
    const { container } = render(
      <Table>
        <TableCaption>Quarterly revenue</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Region</TableHead>
            <TableHead>Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>EMEA</TableCell>
            <TableCell>$2.4M</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>$2.4M</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )
    expect(
      screen.getByRole("table", { name: "Quarterly revenue" })
    ).toBeVisible()
    expect(screen.getAllByRole("columnheader")).toHaveLength(2)
    expect(screen.getAllByRole("cell")).toHaveLength(4)
    expect(
      container.querySelector('[data-slot="table-footer"]')
    ).toBeInTheDocument()
  })

  it("wraps wide tables in a horizontal overflow container", () => {
    const { container } = render(
      <Table className="min-w-max">
        <TableBody />
      </Table>
    )
    const table = screen.getByRole("table")
    expect(table).toHaveClass("min-w-max")
    expect(
      container.querySelector('[data-slot="table-container"]')
    ).toHaveClass("overflow-x-auto")
  })
})
