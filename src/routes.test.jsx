// Every route in routes.mjs, and the 404, rendered the way main.jsx mounts
// the app: under StrictMode (every effect runs twice, so each must be
// idempotent) and inside RootErrorBoundary. Each page must render exactly
// one h1, take its document title from meta.* in the active language, point
// its canonical at its own URL (the 404 has none and carries robots noindex),
// keep an English-only case study in English, and log nothing to
// console.error. Reduced motion is on for these renders, so the reveals and
// count-ups settle at once and nothing animates outside a test.

import { StrictMode } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import i18n from "./i18n";
import App from "./App";
import { RootErrorBoundary } from "./components/ErrorBoundary";
import { ORIGIN, ROUTES, NOT_FOUND } from "../routes.mjs";
import en from "./i18n/locales/en.json";
import ms from "./i18n/locales/ms.json";

// Neither analytics script should run in a test.
vi.mock("@vercel/analytics/react", () => ({ Analytics: () => null }));
vi.mock("@vercel/speed-insights/react", () => ({ SpeedInsights: () => null }));
// pdf.js needs a worker and a canvas, neither of which jsdom has. The resume
// page's own chrome (its heading and buttons) is what this file checks.
vi.mock("react-pdf", () => ({
  Document: ({ children }) => <div>{children}</div>,
  Page: () => null,
  pdfjs: { GlobalWorkerOptions: {} },
}));

// A lazy route's chunk is transformed by Vite the first time a test imports
// it, which can take a while on a busy machine.
const PAGE_TIMEOUT = 20000;
const TEST_TIMEOUT = 40000;

let consoleError;

beforeEach(() => {
  window.setMedia("(prefers-reduced-motion: reduce)", true);
  window.history.replaceState(null, "", "/");
  consoleError = vi.spyOn(console, "error");
});

afterEach(async () => {
  consoleError.mockRestore();
  await i18n.changeLanguage("en");
});

const h1 = (name) => screen.findByRole("heading", { level: 1, name }, { timeout: PAGE_TIMEOUT });

async function open(path) {
  window.history.replaceState(null, "", path);
  render(
    <StrictMode>
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    </StrictMode>
  );
  await h1();
  // Let the page's effects (page meta, the calendar's request, focus) settle
  // inside act, so none of them lands after the test has moved on.
  await act(async () => {});
}

it.each(ROUTES)(
  "$path renders one h1, its title and its canonical, with no console errors",
  async (route) => {
    await open(route.path);
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    await waitFor(() => expect(document.title).toBe(en.meta[route.titleKey]));
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      ORIGIN + route.path
    );
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
    expect(document.documentElement.lang).toBe("en");
    if (route.englishOnly) {
      expect(document.querySelector(".cs-page")).toHaveAttribute("lang", "en");
    }
    expect(consoleError).not.toHaveBeenCalled();
  },
  TEST_TIMEOUT
);

it(
  "renders the 404 page with robots noindex and no canonical",
  async () => {
    await open(NOT_FOUND.path);
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    await waitFor(() => expect(document.title).toBe(en.meta[NOT_FOUND.titleKey]));
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.head.querySelector('meta[property="og:url"]')).toBeNull();
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex");
    expect(consoleError).not.toHaveBeenCalled();
  },
  TEST_TIMEOUT
);

it(
  "keeps an English-only case study in English under Bahasa Malaysia",
  async () => {
    await i18n.changeLanguage("ms");
    const study = ROUTES.find((route) => route.englishOnly);
    await open(study.path);
    await waitFor(() => expect(document.documentElement.lang).toBe("ms"));
    await waitFor(() => expect(document.title).toBe(ms.meta[study.titleKey]));
    expect(document.querySelector(".cs-page")).toHaveAttribute("lang", "en");
    expect(consoleError).not.toHaveBeenCalled();
  },
  TEST_TIMEOUT
);

// ScrollToTop keeps where the reader left each history entry and puts the
// page back there on Back, with focus on <main> rather than on an h1 that is
// now off screen. jsdom never scrolls, so the offset is set by hand and the
// restore is read from the scrollTo call.
it(
  "restores the scroll position on Back",
  async () => {
    await open("/");
    const scrollY = Object.getOwnPropertyDescriptor(window, "scrollY");
    const scrollTo = vi.spyOn(window, "scrollTo");
    const nav = screen.getByRole("navigation");
    try {
      fireEvent.click(nav.querySelector('a[href="/about"]'));
      await h1(i18n.t("home.aboutTitle"));
      await waitFor(() => expect(document.activeElement.tagName).toBe("H1"));

      Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 800 });
      fireEvent.click(nav.querySelector('a[href="/project"]'));
      await h1(i18n.t("home.workTitle"));
      await waitFor(() => expect(document.activeElement.tagName).toBe("H1"));

      window.scrollY = 0;
      scrollTo.mockClear();
      await act(async () => {
        window.history.back();
      });
      await h1(i18n.t("home.aboutTitle"));
      await waitFor(() =>
        expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 800 }))
      );
      expect(document.activeElement).toBe(document.getElementById("main"));
      expect(consoleError).not.toHaveBeenCalled();
    } finally {
      scrollTo.mockRestore();
      if (scrollY) Object.defineProperty(window, "scrollY", scrollY);
      else delete window.scrollY;
    }
  },
  TEST_TIMEOUT
);
