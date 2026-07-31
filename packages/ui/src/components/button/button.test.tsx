import "@testing-library/jest-dom/vitest"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Button } from "./button.js"

describe("Button", () => {
  it("renders its label", () => {
    render(<Button>SurfaceKit</Button>)

    expect(screen.getByRole("button", { name: "SurfaceKit" })).toBeInTheDocument()
  })
})
