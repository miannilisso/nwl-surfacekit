import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@nwl/surfacekit/components/tabs"

const meta: Meta<typeof Tabs> = {
  title: "SurfaceKit/Tabs",
  component: Tabs,
  args: {
    children: (
      <>
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">Content one</TabsContent>
        <TabsContent value="two">Content two</TabsContent>
      </>
    ),
  },
  render: (args: ComponentProps<typeof Tabs>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Tabs {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
