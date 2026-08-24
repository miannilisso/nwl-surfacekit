import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@nwl/surfacekit/components/badge"
import { Button } from "@nwl/surfacekit/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"

const meta = {
  title: "SurfaceKit/Introduction",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-8">
        <header className="grid gap-3">
          <Badge variant="secondary">SurfaceKit reference</Badge>
          <h1 className="font-heading text-4xl font-semibold tracking-tight">
            Build and review reliable interfaces
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Explore SurfaceKit’s 70 public component and pattern stories, then
            carry the same accessible building blocks into the playground.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Explore the canvas</CardTitle>
              <CardDescription>
                Use Canvas to inspect rendered states and interaction behavior.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Open any component or pattern story from the sidebar to compare
              its focused examples.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Adjust controls</CardTitle>
              <CardDescription>
                Use Controls to vary supported component inputs without leaving
                the story.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Use the theme toolbar above to switch every story between light
              and dark color schemes.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Review accessibility</CardTitle>
              <CardDescription>
                Open the accessibility results panel to inspect automated WCAG
                checks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Treat automated findings as useful review evidence alongside
              keyboard and assistive-technology testing.
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Continue with SurfaceKit</CardTitle>
            <CardDescription>
              Visit the reference application, browse its playground, or read
              the repository documentation.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-wrap gap-3">
            <Button
              render={<a href="http://localhost:3000/" />}
              nativeButton={false}
            >
              Visit home
            </Button>
            <Button
              render={<a href="http://localhost:3000/playground" />}
              nativeButton={false}
              variant="outline"
            >
              Explore playground
            </Button>
            <Button
              render={
                <a href="https://github.com/miannilisso/nwl-surfacekit#readme" />
              }
              nativeButton={false}
              variant="link"
            >
              Repository documentation
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  ),
}
