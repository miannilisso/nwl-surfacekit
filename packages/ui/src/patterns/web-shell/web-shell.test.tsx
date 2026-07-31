import "@testing-library/jest-dom/vitest"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { WebShell, WebShellFooter, WebShellHeader } from "./web-shell.js"

describe("WebShell", () => {
  it("renders the header, main content, and footer", () => {
    render(
      <WebShell
        header={<WebShellHeader title="SurfaceKit" />} 
        footer={<WebShellFooter links={["Docs", "Careers"]} />}
      >
        <div>Landing content</div>
      </WebShell>
    )

    expect(screen.getByText("SurfaceKit")).toBeInTheDocument()
    expect(screen.getByText("Landing content")).toBeInTheDocument()
    expect(screen.getByText("Docs")).toBeInTheDocument()
    expect(screen.getByText("Careers")).toBeInTheDocument()
  })
})
