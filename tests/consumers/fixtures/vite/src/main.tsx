import "@nwl/surfacekit/globals.css"
import { hydrateRoot } from "react-dom/client"

import App from "./app"

hydrateRoot(document.getElementById("root")!, <App />)
