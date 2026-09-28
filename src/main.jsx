import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App";
import { RootErrorBoundary } from "./components/ErrorBoundary";

// ScrollToTop restores scroll positions itself once a page has mounted. The
// browser's own restoration would scroll the old page while it plays its
// exit animation, and land the new one at an offset meant for the old.
try {
  if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
} catch {
  // Not settable here; the browser keeps its own behaviour.
}

// A chunk that fails to load (a tab left open across a redeploy) is handled
// where it is needed: see utils/lazyPreload and utils/reload. Vite's
// vite:preloadError event is left alone, so the failed import rejects.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>
);
