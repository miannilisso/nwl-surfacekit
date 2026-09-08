"use client"

import * as React from "react"

export function PwaRegistrar() {
  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    ) {
      return
    }

    void navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      })
      .catch(() => undefined)
  }, [])

  return null
}
