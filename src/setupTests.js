// jest-dom adds custom matchers for asserting on DOM nodes; this entry
// registers them with vitest's expect.
import "@testing-library/jest-dom/vitest";

// jsdom has neither matchMedia nor IntersectionObserver; the app reads both
// on mount (theme detection, cursor, scroll reveals). Both shims can be
// driven from a test, so the branches they gate (reduced motion, the light
// theme, in-view reveals and count-ups, the calendar mount) run in jsdom.
if (typeof window !== "undefined") {
  // matchMedia answers every query with false until a test calls
  // window.setMedia(query, matches). A query in boolean context, such as
  // framer-motion's "(prefers-reduced-motion)", matches when a value of that
  // feature has been set, as in CSS. Listeners registered through
  // addEventListener("change") or the older addListener hear each change,
  // and afterEach puts every query back to false, so nothing leaks from one
  // test into the next.
  const media = new Map();
  const listeners = new Map();
  const normalise = (query) => String(query).replace(/\s+/g, "").toLowerCase();
  const bareFeature = (key) => key.replace(/:[^)]*\)$/, ")");
  const matches = (key) => {
    if (media.has(key)) return media.get(key) === true;
    if (key.includes(":")) return false;
    for (const [set, value] of media) {
      if (value === true && set.includes(":") && bareFeature(set) === key) {
        if (!/:(?:no-preference|none)\)$/.test(set)) return true;
      }
    }
    return false;
  };
  const notify = (key) => {
    for (const fn of listeners.get(key) || []) fn({ matches: matches(key), media: key });
  };
  window.matchMedia = (query) => {
    const key = normalise(query);
    const on = (fn) => {
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key).add(fn);
    };
    const off = (fn) => {
      if (listeners.has(key)) listeners.get(key).delete(fn);
    };
    return {
      get matches() {
        return matches(key);
      },
      media: query,
      onchange: null,
      addListener: on,
      removeListener: off,
      addEventListener: (type, fn) => {
        if (type === "change") on(fn);
      },
      removeEventListener: (type, fn) => {
        if (type === "change") off(fn);
      },
      dispatchEvent: () => false,
    };
  };
  window.setMedia = (query, value) => {
    const key = normalise(query);
    media.set(key, value);
    notify(key);
    if (bareFeature(key) !== key) notify(bareFeature(key));
  };
  window.resetMedia = () => {
    const keys = [...media.keys()];
    media.clear();
    for (const key of keys) {
      notify(key);
      if (bareFeature(key) !== key) notify(bareFeature(key));
    }
  };
  afterEach(() => window.resetMedia());

  // Every observed node reports itself in view on a microtask (a real
  // observer also reports asynchronously), so scroll reveals, count-ups and
  // the contribution calendar mount in a test. A node unobserved before the
  // microtask runs is skipped, as it would be by the browser.
  window.IntersectionObserver = class {
    constructor(callback, options = {}) {
      this.callback = callback;
      this.root = options.root || null;
      this.rootMargin = options.rootMargin || "0px";
      this.thresholds = [].concat(options.threshold === undefined ? 0 : options.threshold);
      this.nodes = new Set();
    }
    observe(node) {
      this.nodes.add(node);
      queueMicrotask(() => {
        if (!this.nodes.has(node)) return;
        const rect = node.getBoundingClientRect();
        this.callback(
          [
            {
              target: node,
              isIntersecting: true,
              intersectionRatio: 1,
              boundingClientRect: rect,
              intersectionRect: rect,
              rootBounds: null,
              time: performance.now(),
            },
          ],
          this
        );
      });
    }
    unobserve(node) {
      this.nodes.delete(node);
    }
    disconnect() {
      this.nodes.clear();
    }
    takeRecords() {
      return [];
    }
  };

  // No unit test reaches the network. The contribution calendar fetches as
  // soon as it is in view (at once, with the observer above), and a failed
  // request makes it show its error text, a fixed state. A test that needs a
  // response stubs fetch itself.
  globalThis.fetch = () => Promise.reject(new TypeError("fetch is stubbed in tests"));

  // jsdom ships a "not implemented" stub that logs an error; replace it outright.
  window.scrollTo = () => {};
  // jsdom has no scrollIntoView; ScrollToTop calls it on every #hash target.
  if (!window.Element.prototype.scrollIntoView) {
    window.Element.prototype.scrollIntoView = () => {};
  }
}
