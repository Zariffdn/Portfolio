// usePageMeta rewrites the head tags for a page and undoes every change when
// the page unmounts, so a route change never leaves the previous page's
// metadata behind. The static shells the build writes carry the same tags
// (index.html); the 404 shell has no canonical or og:url and a robots
// noindex of its own.

import { render } from "@testing-library/react";
import usePageMeta from "./usePageMeta";
import { ORIGIN } from "../../routes.mjs";

function Page(props) {
  usePageMeta(props);
  return null;
}

const head = document.head;
const tag = (selector) => head.querySelector(selector);
const attr = (selector, name) => (tag(selector) ? tag(selector).getAttribute(name) : null);
const content = (selector) => attr(selector, "content");
const canonical = () => attr('link[rel="canonical"]', "href");

// The head of a route shell, as the build writes it.
function shell({ notFound = false } = {}) {
  head.innerHTML = [
    '<meta name="description" content="old description">',
    notFound ? "" : `<link rel="canonical" href="${ORIGIN}/old">`,
    '<meta property="og:title" content="old title">',
    '<meta property="og:description" content="old description">',
    notFound ? "" : `<meta property="og:url" content="${ORIGIN}/old">`,
    '<meta name="twitter:title" content="old title">',
    '<meta name="twitter:description" content="old description">',
    notFound ? '<meta name="robots" content="noindex">' : "",
  ].join("");
  document.title = "old title";
}

afterEach(() => {
  head.innerHTML = "";
  window.history.replaceState(null, "", "/");
});

it("sets the title, the descriptions, the canonical and og:url, and restores them on unmount", () => {
  shell();
  window.history.replaceState(null, "", "/About/");
  const { unmount } = render(<Page title="New title" description="New description" />);

  expect(document.title).toBe("New title");
  expect(content('meta[name="description"]')).toBe("New description");
  expect(content('meta[property="og:description"]')).toBe("New description");
  expect(content('meta[name="twitter:description"]')).toBe("New description");
  expect(content('meta[property="og:title"]')).toBe("New title");
  expect(content('meta[name="twitter:title"]')).toBe("New title");
  // Lowercased, without the trailing slash.
  expect(canonical()).toBe(`${ORIGIN}/about`);
  expect(content('meta[property="og:url"]')).toBe(`${ORIGIN}/about`);

  unmount();
  expect(document.title).toBe("old title");
  expect(content('meta[name="description"]')).toBe("old description");
  expect(content('meta[property="og:title"]')).toBe("old title");
  expect(canonical()).toBe(`${ORIGIN}/old`);
  expect(content('meta[property="og:url"]')).toBe(`${ORIGIN}/old`);
});

it("keeps the root canonical as /", () => {
  shell();
  window.history.replaceState(null, "", "/");
  render(<Page title="Home" description="Home" />);
  expect(canonical()).toBe(`${ORIGIN}/`);
});

it("takes the canonical and og:url out under noindex and puts them back on unmount", () => {
  shell();
  const { unmount } = render(<Page title="Missing" description="Missing" noindex />);

  expect(canonical()).toBeNull();
  expect(tag('meta[property="og:url"]')).toBeNull();
  expect(content('meta[name="robots"]')).toBe("noindex");

  unmount();
  expect(canonical()).toBe(`${ORIGIN}/old`);
  expect(content('meta[property="og:url"]')).toBe(`${ORIGIN}/old`);
  expect(tag('meta[name="robots"]')).toBeNull();
});

it("adds no second robots tag inside the 404 shell", () => {
  shell({ notFound: true });
  const { unmount } = render(<Page title="Missing" description="Missing" noindex />);
  expect(head.querySelectorAll('meta[name="robots"]')).toHaveLength(1);
  unmount();
  expect(head.querySelectorAll('meta[name="robots"]')).toHaveLength(1);
});

it("drops the 404 shell's noindex for a page reached inside it and creates the missing canonical", () => {
  // A client-side navigation from the 404 page to a real one.
  shell({ notFound: true });
  window.history.replaceState(null, "", "/about");
  const { unmount } = render(<Page title="About" description="About" />);

  expect(tag('meta[name="robots"]')).toBeNull();
  expect(canonical()).toBe(`${ORIGIN}/about`);
  expect(content('meta[property="og:url"]')).toBe(`${ORIGIN}/about`);

  unmount();
  expect(content('meta[name="robots"]')).toBe("noindex");
  expect(canonical()).toBeNull();
  expect(tag('meta[property="og:url"]')).toBeNull();
});
