import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
} from "@nwl/surfacekit/components/combobox"

const meta: Meta<typeof Combobox> = {
  title: "SurfaceKit/Combobox",
  component: Combobox,
  args: {
    children: (
      <>
        <ComboboxInput placeholder="Search..." />
        <ComboboxContent>
          <ComboboxItem value="apple">Apple</ComboboxItem>
          <ComboboxItem value="banana">Banana</ComboboxItem>
        </ComboboxContent>
      </>
    ),
  },
  render: (args: ComponentProps<typeof Combobox>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Combobox {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
