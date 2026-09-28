// Read at the moment of the scroll, so a change to the OS setting applies
// without a reload. CSS already switches scroll-behavior off under reduced
// motion (base.css), but an explicit behavior: "smooth" in JS overrides it.
export function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

// "smooth" normally, "auto" (an instant jump) under reduced motion.
export function scrollBehavior() {
  return prefersReducedMotion() ? "auto" : "smooth";
}
