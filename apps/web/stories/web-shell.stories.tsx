import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"
import {
  WebHero,
  WebShell,
  WebShellFooter,
  WebShellHeader,
} from "@nwl/surfacekit/patterns/web-shell"

const header = (
  <WebShellHeader
    title="SurfaceKit"
    links={[
      { label: "Components", href: "#components" },
      { label: "Patterns", href: "#patterns" },
      { label: "Documentation", href: "#docs" },
    ]}
  />
)
const footer = (
  <WebShellFooter
    links={[
      { label: "Docs", href: "#docs" },
      { label: "Security", href: "#security" },
      { label: "Status", href: "#status" },
    ]}
  />
)
function WebExample({
  documentation = false,
  minimal = false,
  embedded = false,
}: {
  documentation?: boolean
  minimal?: boolean
  embedded?: boolean
}) {
  return (
    <WebShell
      mainProps={embedded ? { role: "presentation" } : undefined}
      header={header}
      footer={minimal ? <WebShellFooter links={[]} /> : footer}
    >
      <WebHero
        eyebrow={documentation ? "Documentation" : "Naneware Labs"}
        title={
          documentation
            ? "Build with governed primitives"
            : "Production UI without the guesswork"
        }
        description={
          documentation
            ? "Implementation guidance, API contracts, accessibility evidence, and migration notes for every SurfaceKit release."
            : "A production-oriented component and pattern system for enterprise Next.js product surfaces."
        }
      >
        <Card>
          <CardHeader>
            <CardTitle>
              {documentation ? "API reference" : "Release evidence"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documentation
              ? "Typed imports and compositional examples."
              : "60 components · 10 patterns · browser verified"}
          </CardContent>
        </Card>
      </WebHero>
    </WebShell>
  )
}
const meta = {
  title: "SurfaceKit/Patterns/Web Shell",
  component: WebExample,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Composes responsive public-site header navigation, primary content, hero messaging and actions, and flexible footer links.",
      },
    },
  },
} satisfies Meta<typeof WebExample>
export default meta
type Story = StoryObj<typeof meta>
export const Landing: Story = {}
export const Documentation: Story = { args: { documentation: true } }
export const MinimalFooter: Story = { args: { minimal: true } }
export const Embedded: Story = { args: { embedded: true } }
