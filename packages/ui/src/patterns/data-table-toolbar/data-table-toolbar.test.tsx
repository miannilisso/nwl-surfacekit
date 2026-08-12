import "@testing-library/jest-dom/vitest"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DataTableToolbar } from "./data-table-toolbar"

describe("DataTableToolbar", () => {
  it("renders a toolbar with search and action button", () => {
    render(<DataTableToolbar title="Records" />)

    expect(screen.getByText("Records")).toBeInTheDocument()
    expect(screen.getByRole("textbox")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "New item" })).toBeInTheDocument()
  })
})
