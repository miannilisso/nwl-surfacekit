import "@testing-library/jest-dom/vitest"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"

describe("Card", () => {
  it("renders the card structure and content", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>SurfaceKit</CardTitle>
          <CardDescription>Design system scaffold</CardDescription>
        </CardHeader>
        <CardContent>Ready for components</CardContent>
      </Card>
    )

    expect(screen.getByText("SurfaceKit")).toBeInTheDocument()
    expect(screen.getByText("Design system scaffold")).toBeInTheDocument()
    expect(screen.getByText("Ready for components")).toBeInTheDocument()
  })
})
