// The two error boundaries. RootErrorBoundary is the last line of defence
// and must render with nothing else working, i18n included; RouteErrorBoundary
// takes a failed page's place and clears itself on the next navigation.

import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import i18n from "../i18n";
import { RootErrorBoundary, RouteErrorBoundary } from "./ErrorBoundary";

// react-i18next as usual, except that useTranslation can be made to throw,
// which is how the root boundary's independence from i18n is checked.
const i18nState = vi.hoisted(() => ({ broken: false }));
vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useTranslation: (...args) => {
      if (i18nState.broken) throw new Error("i18n is unavailable");
      return actual.useTranslation(...args);
    },
  };
});

function Thrower() {
  throw new Error("page exploded");
}

beforeEach(() => {
  // React reports an error a boundary caught through console.error.
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  i18nState.broken = false;
  vi.restoreAllMocks();
});

describe("RootErrorBoundary", () => {
  it("renders its fallback without i18n, with a reload button and the plain contact links", () => {
    i18nState.broken = true;
    render(
      <RootErrorBoundary>
        <Thrower />
      </RootErrorBoundary>
    );
    expect(screen.getByRole("main")).toHaveClass("fatal");
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("/Zariff-Danial-Resume.pdf");
    expect(hrefs.some((href) => href.startsWith("mailto:"))).toBe(true);
  });

  it("renders its children while nothing has thrown", () => {
    render(
      <RootErrorBoundary>
        <p>fine</p>
      </RootErrorBoundary>
    );
    expect(screen.getByText("fine")).toBeInTheDocument();
  });
});

describe("RouteErrorBoundary", () => {
  const at = (resetKey, children) => (
    <MemoryRouter initialEntries={[resetKey]}>
      <RouteErrorBoundary resetKey={resetKey}>{children}</RouteErrorBoundary>
    </MemoryRouter>
  );

  it("takes the page's place with its own h1 and noindex, then resets on a new resetKey", () => {
    const { rerender } = render(at("/broken", <Thrower />));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(i18n.t("errorBoundary.title"));
    expect(document.title).toBe(i18n.t("errorBoundary.title"));
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex");
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(at("/about", <p>next page</p>));
    expect(screen.getByText("next page")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });

  it("stays in the error state while the resetKey does not change", () => {
    const { rerender } = render(at("/broken", <Thrower />));
    rerender(at("/broken", <p>same entry</p>));
    expect(screen.queryByText("same entry")).toBeNull();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
