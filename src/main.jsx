import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App";

// After a redeploy, a tab that is still open holds references to chunk
// filenames that no longer exist. Vite fires this when a lazy import or one
// of its preloaded dependencies fails to load; reloading picks up the new
// index.html and its current chunk names.
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  window.location.reload();
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
