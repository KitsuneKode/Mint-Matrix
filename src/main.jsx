import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "./components/ui/toaster.jsx";
import { Analytics } from "@vercel/analytics";
import { SpeedInsight } from "@vercel/speed-insights";

createRoot(document.getElementById("root")).render(
  <>
    <App />
    <Toaster />
    <Analytics />
    <SpeedInsight />
  </>
);
