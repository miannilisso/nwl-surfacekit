import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"

const meta = {
  title: "SurfaceKit/Card",
  component: Card,
  args: {
    children: "SurfaceKit Card",
  },
}

export default meta

export const Default = {
  render: (args: React.ComponentProps<typeof Card>) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>A short description for the card.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card body content.</p>
      </CardContent>
      <CardFooter>Footer content</CardFooter>
    </Card>
  ),
}
