import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// On every route change: scroll to the top and move focus to <main> so
// keyboard and screen-reader users land on the new page's content instead of
// staying on the link they activated. With a #hash, scroll to that element
// instead (polling briefly, since the destination route is lazy-loaded).
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      // Skip the initial load: nothing was "navigated from" yet.
      if (!first.current) {
        const main = document.getElementById("main");
        if (main) main.focus({ preventScroll: true });
      }
      first.current = false;
      return undefined;
    }
    first.current = false;

    let id;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch (_) {
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
