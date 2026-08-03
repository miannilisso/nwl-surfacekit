import { ArrowRight } from "lucide-react"

import { Button } from "../../components/button"
import { cn } from "../../lib/utils"

interface WebShellProps extends React.ComponentProps<"div"> {
  header?: React.ReactNode
  footer?: React.ReactNode
}

function WebShell({ header, footer, className, children, ...props }: WebShellProps) {
  return (
    <div data-slot="web-shell" className={cn("flex min-h-screen flex-col bg-background text-foreground", className)} {...props}>
      {header ? <div className="border-b border-border bg-card/80 backdrop-blur">{header}</div> : null}
      <main className="flex-1">{children}</main>
      {footer ? <footer className="border-t border-border bg-background px-6 py-5">{footer}</footer> : null}
    </div>
  )
}

interface WebShellHeaderProps extends React.ComponentProps<"header"> {
  title: string
  links?: Array<{ label: string; href: string }>
  cta?: React.ReactNode
}

function WebShellHeader({ title, links = [], cta, className, ...props }: WebShellHeaderProps) {
  return (
    <header
      data-slot="web-shell-header"
      className={cn("mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-6 px-6 py-3", className)}
      {...props}
    >
      <a href="/" className="text-base font-semibold">{title}</a>
      <nav aria-label="Primary" className="hidden items-center gap-5 text-sm text-muted-foreground sm:flex">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
            {link.label}
          </a>
        ))}
      </nav>
      {cta ?? (
        <Button render={<a href="/playground" />} nativeButton={false} size="sm" variant="outline">
          Playground
        </Button>
      )}
    </header>
  )
}

interface WebShellFooterProps extends React.ComponentProps<"div"> {
  links: Array<{ label: string; href: string }>
}

function WebShellFooter({ links, className, ...props }: WebShellFooterProps) {
  return (
    <div
      data-slot="web-shell-footer"
      className={cn("mx-auto flex w-full max-w-6xl flex-col gap-3 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between", className)}
      {...props}
    >
      <p>© 2026 Naneware Labs</p>
      <div className="flex flex-wrap gap-4">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="hover:text-foreground">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}

interface WebHeroProps extends React.ComponentProps<"section"> {
  eyebrow?: string
  title: string
  description: string
  action?: React.ReactNode
}

function WebHero({ eyebrow, title, description, action, className, children, ...props }: WebHeroProps) {
  return (
    <section data-slot="web-hero" className={cn("border-b border-border", className)} {...props}>
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_24rem]">
        <div className="max-w-3xl space-y-6">
          {eyebrow ? <p className="text-sm font-medium text-primary">{eyebrow}</p> : null}
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
          {action ?? (
            <Button render={<a href="/playground" />} nativeButton={false}>
              Open playground
              <ArrowRight data-icon="inline-end" />
            </Button>
          )}
        </div>
        {children ? <div className="min-w-0">{children}</div> : null}
      </div>
    </section>
  )
}

export { WebHero, WebShell, WebShellFooter, WebShellHeader }
