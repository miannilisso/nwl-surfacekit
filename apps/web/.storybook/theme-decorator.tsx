import * as React from "react"
import type { Decorator } from "@storybook/react-vite"

export type StoryTheme = "light" | "dark"

type DocumentThemeState = {
  activeThemes: Map<number, StoryTheme>
  nextId: number
  previousBackground: string
  previousClassName: string
  previousColor: string
  previousColorScheme: string
}

const themeStates = new Map<Document, DocumentThemeState>()

function normalizeTheme(theme: unknown): StoryTheme {
  return theme === "dark" ? "dark" : "light"
}

function applyTheme(document: Document, theme: StoryTheme) {
  const root = document.documentElement
  const body = document.body

  root.classList.toggle("dark", theme === "dark")
  root.style.colorScheme = theme
  body.style.background = "var(--background)"
  body.style.color = "var(--foreground)"
}

function restoreTheme(document: Document, state: DocumentThemeState) {
  const root = document.documentElement
  const body = document.body

  root.className = state.previousClassName
  root.style.colorScheme = state.previousColorScheme
  body.style.background = state.previousBackground
  body.style.color = state.previousColor
}

function SurfaceKitTheme({ theme }: { theme: StoryTheme }) {
  React.useLayoutEffect(() => {
    const storyDocument = document
    const root = storyDocument.documentElement
    const body = storyDocument.body
    const state = themeStates.get(storyDocument) ?? {
      activeThemes: new Map(),
      nextId: 0,
      previousClassName: root.className,
      previousColorScheme: root.style.colorScheme,
      previousBackground: body.style.background,
      previousColor: body.style.color,
    }
    themeStates.set(storyDocument, state)

    const id = state.nextId++
    state.activeThemes.set(id, theme)
    applyTheme(storyDocument, theme)

    return () => {
      state.activeThemes.delete(id)
      const activeTheme = Array.from(state.activeThemes.values()).at(-1)

      if (activeTheme) {
        applyTheme(storyDocument, activeTheme)
        return
      }

      restoreTheme(storyDocument, state)
      themeStates.delete(storyDocument)
    }
  }, [theme])

  return null
}

export const withSurfaceKitTheme: Decorator = (Story, context) => (
  <>
    <SurfaceKitTheme theme={normalizeTheme(context.globals.theme)} />
    <Story />
  </>
)
