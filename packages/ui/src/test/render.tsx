import {
  render,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react"
import type { PropsWithChildren, ReactElement } from "react"

import { DirectionProvider } from "../components/direction"
import { TooltipProvider } from "../components/tooltip"

export function surfaceWrapper({ children }: PropsWithChildren) {
  return (
    <DirectionProvider direction="ltr">
      <TooltipProvider>{children}</TooltipProvider>
    </DirectionProvider>
  )
}

export function renderSurface(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): RenderResult {
  return render(ui, { wrapper: surfaceWrapper, ...options })
}
