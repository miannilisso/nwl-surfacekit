import { Button } from "@nwl/surfacekit/components/button"
import { useState } from "react"

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <h1>SurfaceKit Vite consumer</h1>
      <Button onClick={() => setCount((value) => value + 1)}>
        Clicks {count}
      </Button>
      <button
        type="button"
        onClick={() => document.documentElement.classList.toggle("dark")}
      >
        Toggle theme
      </button>
    </main>
  )
}
