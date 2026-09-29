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
// stop); `restoreY` is set on Back, Forward or a reload to a page the reader
// had scrolled.
let pendingEntry = null;

// The pages currently mounted, each with a run() that takes the pending
// entry when it is theirs. A page does that from its own mount effect;
// setPending() also calls it, for the one case where no page mounts: a Back
// (or a link to the page itself) that lands inside the old page's exit
// animation. AnimatePresence then cancels the exit and keeps that page, with
// the location it was rendered with, so no effect of its own would re-run,
// and an entry left pending would stop its scroll positions being saved.
const mountedPages = new Set();

function setPending(entry) {
  pendingEntry = entry;
  for (const page of mountedPages) {
    if (page.pathname === entry.pathname) page.run();
  }
}

// True once the page for this entry has mounted and taken its scroll
// position (usePageEntry clears the pending entry when its work is done).
// Until then the window still shows the page before it, so the offset is not
// this entry's and is not saved as such: a chunk that fails after a redeploy
// reloads the page while the new entry is still pending, and a reader can
// click a second link before the first page has mounted.
function entered(entry) {
  return !(pendingEntry && pendingEntry.pathname === entry.pathname);
}

// Where each history entry was scrolled to when the reader left it, keyed by
// React Router's location.key and mirrored to sessionStorage so a reload
// keeps them. main.jsx switches the browser's own restoration off.
//
// The router keys only the entries it creates. Every other entry reports the
// key "default": the first page of each document (a typed URL, a link from
// another site, a reload) and any entry a native fragment anchor adds, which
// is why every same-page anchor in the app is a <Link to="#x">. A position is
// saved with its pathname, and the first page of a document takes a saved
// position only when the browser brought the document back, so two "default"
// entries never open at the other one's offset.
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

function savePosition(key, pathname, y) {
  if (!key) return;
  positions.delete(key);
  positions.set(key, [pathname, Math.round(y)]);
  while (positions.size > MAX_POSITIONS) positions.delete(positions.keys().next().value);
  writeStorage("sessionStorage", POSITIONS_KEY, JSON.stringify([...positions]));
}

// The position saved for this entry, if it was saved on this pathname. An
// entry saved before positions carried a pathname is a bare number; ignored.
function savedPosition(key, pathname) {
  const saved = positions.get(key);
  return Array.isArray(saved) && saved[0] === pathname ? saved[1] : undefined;
}

// True when the browser brought this document back (a reload, or Back or
// Forward from another site): the one case where its first entry is a page
// the reader had already scrolled. A typed URL, a link from elsewhere or a
// duplicated tab is a new entry, although it reports the same key.
function documentRestored() {
  try {
    const [nav] = window.performance.getEntriesByType("navigation");
    return Boolean(nav) && (nav.type === "reload" || nav.type === "back_forward");
  } catch {
    return false;
  }
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

// Takes the pending entry for this page, if there is one: the scroll and
// focus of a page that has just mounted (or was kept, see setPending).
// Returns a cancel function while the hash target is still being polled for.
// The pending entry is cleared only when the work is done, so StrictMode's
// simulated unmount (which cancels the polling) simply starts it again.
function takeEntry(pathname, hash) {
  const entry = pendingEntry;
  if (!entry || entry.pathname !== pathname) return undefined;

  const finish = () => {
    if (pendingEntry === entry) pendingEntry = null;
  };

  // Back, Forward or a reload to an entry the reader had scrolled: put it
  // back where it was, hash or not. The hash target only matters the first
  // time the entry is reached, as ScrollToTop already does for a same-page
  // hash.
  if (entry.restoreY != null) {
    restore(entry.restoreY, !entry.initial);
    finish();
    return undefined;
  }

  if (!hash) {
    if (entry.initial) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
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
}

// Called by the page wrapper of every route. Registers the page while it is
// mounted and takes its entry at once; setPending() runs it again should an
// entry for this pathname be recorded while the page is still up. pathname
// never changes for a mounted page (its <Routes> is keyed on it); a later
// hash change on the same page finds no pending entry and is left to
// ScrollToTop.
export function usePageEntry() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    let cancel = null;
    const page = {
      pathname,
      run() {
        if (cancel) cancel();
        cancel = takeEntry(pathname, hash) || null;
      },
    };
    mountedPages.add(page);
    page.run();
    return () => {
      mountedPages.delete(page);
      if (cancel) cancel();
    };
  }, [pathname, hash, key]);
}

// Watches the location. A new pathname (or the first load) is handed to the
// incoming page through pendingEntry. A #hash on the same page, new or
// repeated, scrolls to the target here, gliding unless reduced motion is on.
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
      const entry = last.current;
      if (entry && entered(entry)) savePosition(entry.key, entry.pathname, window.scrollY);
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, []);

  useEffect(() => {
    const current = { pathname, hash, key };
    if (!last.current || last.current.key !== key) {
      // Nothing has scrolled yet (restoration is manual and the old page is
      // still on screen), so this is where the reader left that entry.
      const left = last.current;
      if (left && entered(left)) savePosition(left.key, left.pathname, window.scrollY);
      from.current = last.current;
      last.current = current;
    }
    const previous = from.current;
    const restoreY = navigationType === "POP" ? savedPosition(key, pathname) : undefined;

    if (!previous) {
      setPending({
        pathname,
        initial: true,
        restoreY: documentRestored() ? restoreY : undefined,
      });
      return undefined;
    }

    if (previous.pathname !== pathname) {
      setPending({ pathname, initial: false, restoreY });
      return undefined;
    }

    if (restoreY != null) {
      restore(restoreY, true);
      return undefined;
    }

    if (!hash) {
      // A Link to the page the reader is already on, no hash: nothing to do.
      if (previous.hash === hash) return undefined;
      enterAtTop();
      return undefined;
    }
    // A new or repeated #hash on the same page (a chip clicked again after
    // scrolling away) scrolls to the target, as a native anchor would.
    return scrollToHash(hash, scrollBehavior(), () => {});
  }, [pathname, hash, key, navigationType]);

  return null;
}

export default ScrollToTop;
