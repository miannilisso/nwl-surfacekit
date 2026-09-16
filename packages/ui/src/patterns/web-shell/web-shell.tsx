import { ArrowRight } from "lucide-react"

import { Button } from "../../components/button"
import { cn } from "../../lib/utils"
import {
  MobileNavigation,
  type MobileNavigationOptions,
} from "../mobile-navigation"

interface WebShellProps extends React.ComponentProps<"div"> {
  header?: React.ReactNode
  footer?: React.ReactNode
  mainProps?: React.ComponentProps<"main">
}

function WebShell({
  header,
  footer,
  mainProps,
  className,
  children,
  ...props
}: WebShellProps) {
  const { className: mainClassName, ...mainRest } = mainProps ?? {}

  return (
    <div
      data-slot="web-shell"
      className={cn(
        "flex min-h-dvh flex-col bg-background text-foreground",
        className
      )}
      {...props}
    >
      {header ? (
        <div className="border-b border-border bg-card/80 backdrop-blur">
          {header}
        </div>
      ) : null}
      <main className={cn("flex-1", mainClassName)} {...mainRest}>
        {children}
      </main>
      {footer ? (
        <footer className="border-t border-border bg-background ps-[max(1.5rem,var(--safe-area-left))] pe-[max(1.5rem,var(--safe-area-right))] pt-5 pb-[max(1.25rem,var(--safe-area-bottom))]">
          {footer}
        </footer>
      ) : null}
    </div>
  )
}

interface WebShellHeaderProps extends React.ComponentProps<"header"> {
  title: string
  links?: Array<{ label: string; href: string }>
  cta?: React.ReactNode
  mobileNavigation?: MobileNavigationOptions
}

function WebShellHeader({
  title,
  links = [],
  cta,
  mobileNavigation,
  className,
  ...props
}: WebShellHeaderProps) {
  const primaryNavigation = (
    <>
      {links.map((link, index) => (
        <a
          key={`${index}-${link.href}`}
          href={link.href}
          className="surface-touch-compact-sm-y inline-flex min-h-11 items-center transition-colors hover:text-foreground"
        >
          {link.label}
        </a>
      ))}
    </>
  )

  return (
    <header
      data-slot="web-shell-header"
      className={cn(
        "mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 ps-[max(1rem,var(--safe-area-left))] pe-[max(1rem,var(--safe-area-right))] pt-[max(0.75rem,var(--safe-area-top))] pb-3 sm:gap-6 sm:ps-[max(1.5rem,var(--safe-area-left))] sm:pe-[max(1.5rem,var(--safe-area-right))]",
        className
      )}
      {...props}
    >
      <a
        href="/"
        className="surface-touch-compact-sm-y inline-flex min-h-11 items-center text-base font-semibold"
      >
        {title}
      </a>
      <nav
        aria-label="Primary"
        className="hidden items-center gap-5 text-sm text-muted-foreground sm:flex"
      >
        {primaryNavigation}
      </nav>
      <div className={cn(mobileNavigation && "hidden sm:block")}>
        {cta ?? (
          <Button
            render={<a href="/playground" />}
            nativeButton={false}
            size="sm"
            variant="outline"
          >
            Playground
          </Button>
        )}
      </div>
      {mobileNavigation ? (
        <MobileNavigation
          navigation={
            <nav
              aria-label="Primary"
              className="flex min-h-full flex-col gap-2 text-sm text-foreground [&_a]:flex [&_a]:min-h-11 [&_a]:items-center [&_a]:rounded-md [&_a]:px-3 [&_a]:hover:bg-muted"
            >
              {primaryNavigation}
              <div className="mt-auto border-t border-border pt-4">
                {cta ?? (
                  <Button
                    render={<a href="/playground" />}
                    nativeButton={false}
                    variant="outline"
                    className="w-full"
                  >
                    Playground
                  </Button>
                )}
              </div>
            </nav>
          }
          options={mobileNavigation}
          defaultTitle="Primary navigation"
          defaultTriggerLabel="Open primary navigation"
          triggerClassName="sm:hidden"
        />
      ) : null}
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
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-col gap-3 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      {...props}
    >
      <p>© 2026 Naneware Labs</p>
      <div className="flex flex-wrap gap-4">
        {links.map((link, index) => (
          <a
            key={`${index}-${link.href}`}
            href={link.href}
            className="surface-touch-compact-sm inline-flex min-h-11 min-w-11 items-center hover:text-foreground"
          >
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

function WebHero({
  eyebrow,
  title,
  description,
  action,
  className,
  children,
  ...props
}: WebHeroProps) {
  return (
    <section
      data-slot="web-hero"
      className={cn("border-b border-border", className)}
      {...props}
    >
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_24rem]">
        <div className="max-w-3xl space-y-6">
          {eyebrow ? (
            <p className="text-sm font-medium text-primary">{eyebrow}</p>
          ) : null}
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            {description}
          </p>
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

export {
  WebHero,
  WebShell,
  WebShellFooter,
  WebShellHeader,
  type MobileNavigationOptions,
}
