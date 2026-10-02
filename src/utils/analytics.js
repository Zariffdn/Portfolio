import { readStorage, writeStorage, removeStorage } from "./storage";

// Keeps a browser out of Vercel Web Analytics and Speed Insights, so the
// owner's own visits do not count. Opening any page with ?analytics=off
// stores the va-disable flag from Vercel's opt-out docs, and ?analytics=on
// removes it. Both components take dropIfOptedOut as their beforeSend,
// which drops every page view and vital while the flag is there. Nothing is
// stored by default, so every other visitor is counted as before.
const OPT_OUT_KEY = "va-disable";
const PARAM = "analytics";

// beforeSend for <Analytics> and <SpeedInsights>: null drops the event. The
// flag is read on every event, so a change applies from the next one.
export function dropIfOptedOut(event) {
  return readStorage("localStorage", OPT_OUT_KEY) ? null : event;
}

// Applies ?analytics=off or ?analytics=on, then takes the parameter out of
// the address, so a link copied from the address bar afterwards never
// carries it. main.jsx calls this once, before the router reads the URL; the
// history entry keeps its state. Returns "off" or "on" once the choice is
// stored, and null when there is no such parameter or storage refused it.
export function applyAnalyticsParam() {
  const url = new URL(window.location.href);
  const choice = (url.searchParams.get(PARAM) || "").toLowerCase();
  if (choice !== "off" && choice !== "on") return null;

  url.searchParams.delete(PARAM);
  try {
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  } catch {
    // The address keeps the parameter; the choice below still applies.
  }

  const stored =
    choice === "off"
      ? writeStorage("localStorage", OPT_OUT_KEY, "1")
      : removeStorage("localStorage", OPT_OUT_KEY);
  return stored ? choice : null;
}
