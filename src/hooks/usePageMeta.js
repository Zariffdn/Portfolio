import { useEffect } from "react";

const ORIGIN = "https://portfolioo-beta.vercel.app";

function ensureTag(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

// Sets the document title, meta description, per-route canonical and og:url,
// and (optionally) a robots noindex. Everything is restored on cleanup so a
// route change never leaves the previous page's metadata behind.
export default function usePageMeta({ title, description, noindex = false }) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) document.title = title;

    const descTag = document.querySelector('meta[name="description"]');
    const previousDesc = descTag ? descTag.getAttribute("content") : null;
    if (description && descTag) descTag.setAttribute("content", description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const previousOgTitle = ogTitle ? ogTitle.getAttribute("content") : null;
    if (title && ogTitle) ogTitle.setAttribute("content", title);

    const url = ORIGIN + window.location.pathname;
    const canonical = ensureTag('link[rel="canonical"]', () => {
      const l = document.createElement("link");
      l.setAttribute("rel", "canonical");
      return l;
    });
    const previousCanonical = canonical.getAttribute("href");
    canonical.setAttribute("href", url);

    const ogUrl = ensureTag('meta[property="og:url"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:url");
      return m;
    });
    const previousOgUrl = ogUrl.getAttribute("content");
    ogUrl.setAttribute("content", url);

    let robots = null;
    if (noindex) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      robots.setAttribute("content", "noindex");
      document.head.appendChild(robots);
    }

    return () => {
      document.title = previousTitle;
      if (descTag && previousDesc !== null) descTag.setAttribute("content", previousDesc);
      if (ogTitle && previousOgTitle !== null) ogTitle.setAttribute("content", previousOgTitle);
      if (previousCanonical !== null) canonical.setAttribute("href", previousCanonical);
      if (previousOgUrl !== null) ogUrl.setAttribute("content", previousOgUrl);
      if (robots) robots.remove();
    };
  }, [title, description, noindex]);
}
