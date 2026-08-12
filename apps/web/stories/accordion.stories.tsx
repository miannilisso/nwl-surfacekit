import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@nwl/surfacekit/components/accordion"

const meta: Meta<typeof Accordion> = {
  title: "SurfaceKit/Accordion",
  component: Accordion,
  args: {
    children: (
      <>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content for section 1.</AccordionContent>
        </AccordionItem>
      </>
    ),
  },
  render: (args: ComponentProps<typeof Accordion>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Accordion {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
