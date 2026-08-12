import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Calendar, CalendarDayButton } from "./calendar"

const august = new Date(2026, 7, 1)

describe("Calendar", () => {
  it("renders a named month grid and selects an enabled day", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Calendar
        aria-label="Release date"
        defaultMonth={august}
        mode="single"
        onSelect={onSelect}
        disabled={{ before: new Date(2026, 7, 10) }}
      />
    )

    expect(
      screen.getByRole("grid", { name: "August 2026" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /Monday, August 3rd/ })
    ).toBeDisabled()
    await user.click(
      screen.getByRole("button", { name: /Thursday, August 13th/ })
    )
    expect(onSelect).toHaveBeenCalledWith(
      new Date(2026, 7, 13),
      new Date(2026, 7, 13),
      expect.objectContaining({ disabled: false }),
      expect.anything()
    )
  })

  it("uses the custom day button and supports month navigation", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Calendar
        defaultMonth={august}
        mode="single"
        selected={new Date(2026, 7, 13)}
        components={{ DayButton: CalendarDayButton }}
      />
    )

    await user.click(
      screen.getByRole("button", { name: "Go to the Next Month" })
    )
    expect(
      screen.getByRole("grid", { name: "September 2026" })
    ).toBeInTheDocument()
    await user.click(
      screen.getByRole("button", { name: "Go to the Previous Month" })
    )
    expect(container.querySelector('[data-day="8/13/2026"]')).toHaveAttribute(
      "data-selected-single",
      "true"
    )
  })
})
