import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// On every route change: scroll to the top and move focus to <main> so
// keyboard and screen-reader users land on the new page's content instead of
// staying on the link they activated. With a #hash, scroll to that element
// and focus it instead (polling briefly, since the destination route is
// lazy-loaded).
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  // The previous location key. Comparing against it inside the effect keeps
  // "is this a navigation" correct under StrictMode's double effect run in
  // dev, where a flag flipped by the effect itself would misfire.
  const previous = useRef(null);

  useEffect(() => {
    const current = pathname + hash;
    const navigated = previous.current !== null && previous.current !== current;
    previous.current = current;

    if (!hash) {
      window.scrollTo(0, 0);
      if (navigated) {
        const main = document.getElementById("main");
        if (main) main.focus({ preventScroll: true });
      }
      return undefined;
    }

    let id;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      id = hash.slice(1);
    }
    if (!id) return undefined;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 30;

    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // Land focus on the target too, without a second scroll, so the next
        // Tab continues from here rather than from the top of the document.
        if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
        return;
      }
      attempts += 1;
      if (attempts < maxAttempts) window.setTimeout(tryScroll, 80);
    };

    window.setTimeout(tryScroll, 80);

    return () => {
      cancelled = true;
    };
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
