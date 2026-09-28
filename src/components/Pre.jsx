import { useEffect } from "react";

// First-visit splash (App.jsx decides when). The hold and fade are one CSS
// animation (chrome.css: 0.15 s, then a 0.15 s fade), which the compositor
// runs, so a busy main thread during the first render cannot stretch it. It
// is unmounted when that animation ends, or after SAFETY_MS in case the
// animation never runs (a background tab, animations turned off).
const SAFETY_MS = 1200;

function Pre({ onDone }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, SAFETY_MS);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="preloader"
      aria-hidden="true"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) onDone();
      }}
    >
      <span className="wordmark preloader__mark">
        ZD<span className="wordmark__dot">.</span>
      </span>
    </div>
  );
}

export default Pre;
