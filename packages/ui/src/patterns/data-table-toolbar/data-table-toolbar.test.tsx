import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { DataTableToolbar } from "./data-table-toolbar"

describe("DataTableToolbar", () => {
  it("controls search and invokes create, filter, and export actions", async () => {
    const user = userEvent.setup()
    const onSearchValueChange = vi.fn()
    const onCreate = vi.fn()
    const onFilter = vi.fn()
    const onExport = vi.fn()
    render(
      <DataTableToolbar
        title="Records"
        count={12}
        searchLabel="Search records"
        searchValue="api"
        onSearchValueChange={onSearchValueChange}
        onCreate={onCreate}
        onFilter={onFilter}
        onExport={onExport}
      />
    )
    const search = screen.getByRole("textbox", { name: "Search records" })
    expect(search).toHaveValue("api")
    await user.type(search, "s")
    expect(onSearchValueChange).toHaveBeenCalledWith("apis")
    for (const name of ["Filter", "Export", "New item"])
      await user.click(screen.getByRole("button", { name }))
    expect(onFilter).toHaveBeenCalledOnce()
    expect(onExport).toHaveBeenCalledOnce()
    expect(onCreate).toHaveBeenCalledOnce()
    expect(screen.getByText("12")).toBeVisible()
  })

  it("disables all work while busy", () => {
    render(
      <DataTableToolbar
        title="Records"
        busy
        onCreate={vi.fn()}
        onFilter={vi.fn()}
        onExport={vi.fn()}
      />
    )
    expect(screen.getByRole("textbox")).toBeDisabled()
    expect(screen.getAllByRole("button")).toSatisfy((buttons: HTMLElement[]) =>
      buttons.every((button) => button.hasAttribute("disabled"))
    )
    expect(screen.getByRole("button", { name: "Working…" })).toBeDisabled()
  })
})
