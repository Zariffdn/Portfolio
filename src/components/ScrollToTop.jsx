import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { scrollBehavior } from "../utils/motion";
import { readStorage, writeStorage } from "../utils/storage";

// Route changes are split in two. ScrollToTop notices the new pathname and
// records it here; the new page's usePageEntry() (in PageWrap) does the
// scroll and focus once that page has mounted. With AnimatePresence
// mode="wait" that is after the old page's exit animation, so the old page
// never jumps to the top or loses focus while it is still on screen.
//
// { pathname, initial, restoreY }: `initial` marks the first page of the
// visit, which keeps its natural focus (the skip link stays the first Tab
// stop); `restoreY` is set on Back and Forward to a page the reader had
// scrolled.
let pendingEntry = null;

// Where each history entry was scrolled to when the reader left it, keyed by
// React Router's location.key and mirrored to sessionStorage so a reload keeps
// them. main.jsx switches the browser's own restoration off.
const POSITIONS_KEY = "scroll-positions";
const MAX_POSITIONS = 50;

function loadPositions() {
  try {
    const saved = JSON.parse(readStorage("sessionStorage", POSITIONS_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

const positions = new Map(loadPositions());

function savePosition(key, y) {
  if (!key) return;
  positions.delete(key);
  positions.set(key, Math.round(y));
  while (positions.size > MAX_POSITIONS) positions.delete(positions.keys().next().value);
  writeStorage("sessionStorage", POSITIONS_KEY, JSON.stringify([...positions]));
}

const HASH_POLL_MS = 80;
const HASH_POLL_TRIES = 30;

function hashTarget(hash) {
  const raw = hash.slice(1);
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

// Programmatic focus on something that is not focusable by default needs
// tabindex="-1"; it stays out of the Tab order.
export function focusQuietly(el) {
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

// Jumps to the top (no glide, whatever scroll-behavior says) and moves focus
// to the new page's h1, so keyboard and screen-reader users start at the new
// content instead of on the link they activated.
function enterAtTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  const main = document.getElementById("main");
  if (!main) return;
  focusQuietly(main.querySelector("h1") || main);
}

// Back or Forward to a page the reader had scrolled: put it back where it
// was, with one more try a frame later in case late content grew the page.
// Focus moves to <main> without scrolling (never to an h1 that is now off
// screen), except on the first page of the visit, which keeps its natural
// focus.
function restore(y, moveFocus) {
  const go = () => window.scrollTo({ top: y, left: 0, behavior: "instant" });
  go();
  window.requestAnimationFrame(() => {
    if (Math.abs(window.scrollY - y) > 2) go();
  });
  if (!moveFocus) return;
  const main = document.getElementById("main");
  if (main) focusQuietly(main);
}

// Scrolls the #hash target into view and focuses it, polling briefly because
// a section can mount a moment after its page. Calls done(found) at the end;
// returns a cancel function.
function scrollToHash(hash, behavior, done) {
  const id = hashTarget(hash);
  if (!id) {
    done(false);
    return () => {};
  }
  let cancelled = false;
  let timer;
  let tries = 0;

  const attempt = () => {
    if (cancelled) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior, block: "start" });
      // Focus lands on the target too, without a second scroll, so the next
      // Tab continues from here rather than from the top of the document.
      focusQuietly(el);
      done(true);
      return;
    }
    tries += 1;
    if (tries < HASH_POLL_TRIES) timer = window.setTimeout(attempt, HASH_POLL_MS);
    else done(false);
  };

  attempt();
  return () => {
    cancelled = true;
    window.clearTimeout(timer);
  };
}

// Called by the page wrapper of every route. Runs once the page has mounted;
// does nothing unless ScrollToTop recorded a visit to this pathname. The
// pending entry is cleared only when the work is done, so StrictMode's
// simulated unmount (which cancels the hash polling) simply starts it again.
export function usePageEntry() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const entry = pendingEntry;
    if (!entry || entry.pathname !== pathname) return undefined;

    const finish = () => {
      if (pendingEntry === entry) pendingEntry = null;
    };

    if (!hash) {
      if (entry.restoreY != null) restore(entry.restoreY, !entry.initial);
      else if (entry.initial) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      else enterAtTop();
      finish();
      return undefined;
    }

    // A deep link into another page: start from the top so the page never
    // shows at the old page's offset while the target mounts, then jump.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    return scrollToHash(hash, "instant", (found) => {
      if (!found && !entry.initial) enterAtTop();
      finish();
    });
    // pathname never changes for a mounted page (its <Routes> is keyed on
    // it). A later hash change on the same page finds no pending entry and
    // is left to ScrollToTop.
  }, [pathname, hash]);
}

// Watches the location. A new pathname (or the first load) is handed to the
// incoming page through pendingEntry. A #hash change within the same page
// scrolls to the target here, gliding unless reduced motion is on.
function ScrollToTop() {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();
  // The location handled last, and the one before it. On StrictMode's
  // repeated mount the location has not changed, so `from` stays the same
  // and the effect repeats its own (idempotent) work.
  const last = useRef(null);
  const from = useRef(null);

  // Remember where the current page is when the tab is left or reloaded.
  useEffect(() => {
    const onHide = () => {
      if (last.current) savePosition(last.current.key, window.scrollY);
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, []);

  useEffect(() => {
    const current = { pathname, hash, key };
    if (!last.current || last.current.key !== key) {
      // Nothing has scrolled yet (restoration is manual and the old page is
      // still on screen), so this is where the reader left that entry.
      if (last.current) savePosition(last.current.key, window.scrollY);
      from.current = last.current;
      last.current = current;
    }
    const previous = from.current;
    const restoreY = navigationType === "POP" ? positions.get(key) : undefined;

    if (!previous) {
      pendingEntry = { pathname, initial: true, restoreY };
      return undefined;
    }

    if (previous.pathname !== pathname) {
      pendingEntry = { pathname, initial: false, restoreY };
      return undefined;
    }

    if (restoreY != null) {
      restore(restoreY, true);
      return undefined;
    }

    if (previous.hash === hash) return undefined;

    if (!hash) {
      enterAtTop();
      return undefined;
    }
    return scrollToHash(hash, scrollBehavior(), () => {});
  }, [pathname, hash, key, navigationType]);

  return null;
}

export default ScrollToTop;
