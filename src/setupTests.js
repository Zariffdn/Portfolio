// jest-dom adds custom matchers for asserting on DOM nodes; this entry
// registers them with vitest's expect.
import "@testing-library/jest-dom/vitest";

// jsdom has neither matchMedia nor IntersectionObserver; the app reads both
// on mount (theme detection, cursor, scroll reveals).
if (typeof window !== "undefined") {
  if (!window.matchMedia) {
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }
  if (!window.IntersectionObserver) {
    window.IntersectionObserver = class {
      constructor(cb) {
        this.cb = cb;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    };
  }
  // jsdom ships a "not implemented" stub that logs an error; replace it outright.
  window.scrollTo = () => {};
}
