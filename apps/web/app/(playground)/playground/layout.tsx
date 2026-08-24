import * as React from "react"

import { PlaygroundShell } from "@/components/playground/playground-shell"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PlaygroundShell>{children}</PlaygroundShell>
}
