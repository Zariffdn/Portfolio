import { readStorage, writeStorage } from "./storage";

// After a redeploy, a tab that is still open holds references to chunk
// filenames that no longer exist, and a route the reader opens next fails to
// load. Reloading picks up the new index.html and its current chunk names.
//
// Called only by a render that needs the missing chunk (see lazyPreload); a
// background warm-up that fails never reloads the page someone is reading.
// Returns true when it started a reload. It does not reload:
// - offline, where a reload would swap a working page for the browser's
//   offline page;
// - twice within 10 s, so a chunk that is still missing after a reload (a
//   broken deploy) cannot loop;
// - when sessionStorage cannot be written, since then there is no way to tell
//   a loop from a first failure.
// In each of those cases the route's error boundary shows a Reload button.
const RELOAD_KEY = "chunk-reload-at";
const RELOAD_WINDOW_MS = 10000;

export default function reloadOnce() {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return false;
  const last = Number(readStorage("sessionStorage", RELOAD_KEY)) || 0;
  if (Date.now() - last < RELOAD_WINDOW_MS) return false;
  if (!writeStorage("sessionStorage", RELOAD_KEY, String(Date.now()))) return false;
  window.location.reload();
  return true;
}
