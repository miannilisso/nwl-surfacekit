"use client"

import { Button } from "@nwl/surfacekit/components/button"
import { useState } from "react"

export default function ClientProbe() {
  const [count, setCount] = useState(0)

  return (
    <section>
      <Button onClick={() => setCount((value) => value + 1)}>
        Clicks {count}
      </Button>
      <button
        type="button"
        onClick={() => document.documentElement.classList.toggle("dark")}
      >
        Toggle theme
      </button>
    </section>
  )
}
