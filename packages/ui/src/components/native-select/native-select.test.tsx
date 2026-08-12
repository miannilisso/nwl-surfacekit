import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "./native-select"

describe("NativeSelect", () => {
  it("associates a label and selects an option", async () => {
    const user = userEvent.setup()
    render(
      <>
        <label htmlFor="region">Region</label>
        <NativeSelect id="region" defaultValue="ke">
          <NativeSelectOption value="ke">Kenya</NativeSelectOption>
          <NativeSelectOption value="ug">Uganda</NativeSelectOption>
        </NativeSelect>
      </>
    )

    const select = screen.getByRole("combobox", { name: "Region" })
    await user.selectOptions(select, "ug")
    expect(select).toHaveValue("ug")
  })

  it("composes option groups and disabled state", () => {
    render(
      <NativeSelect aria-label="Environment" disabled>
        <NativeSelectOptGroup label="Live">
          <NativeSelectOption value="production">Production</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    )

    const select = screen.getByRole("combobox", { name: "Environment" })
    expect(select).toBeDisabled()
    expect(screen.getByRole("group", { name: "Live" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Production" })).toHaveValue(
      "production"
    )
  })
})
