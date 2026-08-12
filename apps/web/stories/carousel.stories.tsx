import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@nwl/surfacekit/components/carousel"

const releases = [
  "Identity controls",
  "Audit exports",
  "Regional failover",
  "Policy automation",
]
function CarouselExample({
  multiple = false,
  vertical = false,
  loop = false,
}: {
  multiple?: boolean
  vertical?: boolean
  loop?: boolean
}) {
  return (
    <Carousel
      aria-label="Release highlights"
      className={vertical ? "h-72 w-80" : "w-[34rem] max-w-[calc(100vw-7rem)]"}
      orientation={vertical ? "vertical" : "horizontal"}
      opts={{ align: "start", loop }}
    >
      <CarouselContent className={vertical ? "h-72" : undefined}>
        {releases.map((release, index) => (
          <CarouselItem
            className={multiple ? "basis-1/2" : undefined}
            aria-label={`${index + 1} of ${releases.length}`}
            key={release}
          >
            <article className="flex h-48 items-center justify-center rounded-3xl border bg-card p-6 text-center">
              <div>
                <p className="text-xs text-muted-foreground">
                  Release {index + 1}
                </p>
                <h3 className="mt-2 font-heading text-xl font-medium">
                  {release}
                </h3>
              </div>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
const meta = {
  title: "SurfaceKit/Components/Advanced/Carousel",
  component: CarouselExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Presents labeled slide groups with keyboard and button navigation, API access, orientation, looping, and multi-card layouts.",
      },
    },
  },
} satisfies Meta<typeof CarouselExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const next = canvas.getByRole("button", { name: "Next slide" })
    await waitFor(() => expect(next).toBeEnabled())
    await userEvent.click(next)
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: "Previous slide" })
      ).toBeEnabled()
    )
  },
}
export const Multiple: Story = { args: { multiple: true } }
export const Vertical: Story = { args: { vertical: true } }
export const Looping: Story = { args: { loop: true } }
