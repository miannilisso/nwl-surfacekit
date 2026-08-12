import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Separator } from "./separator"

describe("Separator", () => {
  it.each(["horizontal", "vertical"] as const)(
    "renders a semantic %s separator",
    (orientation) => {
      render(
        <Separator
          aria-label={`${orientation} divider`}
          orientation={orientation}
        />
      )

      const separator = screen.getByRole("separator", {
        name: `${orientation} divider`,
      })
      expect(separator).toHaveAttribute("data-orientation", orientation)
      expect(separator).toHaveAttribute("aria-orientation", orientation)
    }
  )
})
