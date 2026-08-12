import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { describe, expect, it } from "vitest"

import { Slider } from "./slider"

function ControlledSlider() {
  const [value, setValue] = React.useState([25])
  return (
    <Slider
      value={value}
      onValueChange={(nextValue) => {
        if (Array.isArray(nextValue)) setValue([...nextValue])
      }}
      getThumbAriaLabel={() => "Volume"}
      step={5}
      thumbAlignment="center"
    />
  )
}

describe("Slider", () => {
  it("provides an accessible name and responds to keyboard steps", async () => {
    const user = userEvent.setup()
    render(<ControlledSlider />)

    const slider = screen.getByLabelText("Volume")
    expect(slider).toHaveAttribute("type", "range")
    expect(slider).toHaveValue("25")
    slider.focus()
    await user.keyboard("{ArrowRight}{ArrowRight}{ArrowLeft}")
    expect(slider).toHaveValue("30")
  })

  it("renders named range thumbs and preserves disabled state", () => {
    render(
      <Slider
        defaultValue={[20, 80]}
        getThumbAriaLabel={(index) =>
          index === 0 ? "Minimum price" : "Maximum price"
        }
        disabled
        thumbAlignment="center"
      />
    )

    expect(screen.getByLabelText("Minimum price")).toBeDisabled()
    expect(screen.getByLabelText("Maximum price")).toBeDisabled()
  })
})
