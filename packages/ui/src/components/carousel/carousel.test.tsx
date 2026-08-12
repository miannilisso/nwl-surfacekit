import { render, renderHook, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
  type CarouselApi,
} from "./carousel"

function Example({
  orientation = "horizontal",
  setApi,
}: {
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}) {
  return (
    <Carousel
      aria-label="Release highlights"
      orientation={orientation}
      setApi={setApi}
    >
      <CarouselContent>
        {[1, 2, 3].map((item) => (
          <CarouselItem aria-label={`Slide ${item} of 3`} key={item}>
            Release {item}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

describe("Carousel", () => {
  it("provides region and slide semantics, orientation, and its API", async () => {
    const setApi = vi.fn()
    const { container } = render(
      <Example orientation="vertical" setApi={setApi} />
    )
    expect(
      screen.getByRole("region", { name: "Release highlights" })
    ).toHaveAttribute("aria-roledescription", "carousel")
    expect(screen.getAllByRole("group")).toHaveLength(3)
    expect(
      container.querySelector('[data-slot="carousel-content"] > div')
    ).toHaveClass("flex-col")
    await waitFor(() => expect(setApi).toHaveBeenCalledOnce())
    expect(setApi.mock.calls[0]?.[0]).toHaveProperty("scrollNext")
  })

  it("guards its hook and exposes previous and next controls", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined)
    expect(() => renderHook(() => useCarousel())).toThrow(/<Carousel \/>/)
    consoleError.mockRestore()
    const user = userEvent.setup()
    render(<Example />)
    const previous = screen.getByRole("button", { name: "Previous slide" })
    const next = screen.getByRole("button", { name: "Next slide" })
    expect(previous).toBeDisabled()
    expect(next).toBeDisabled()
    await user.keyboard("{ArrowRight}{ArrowLeft}")
  })
})
