import { useEffect } from "react";

const ORIGIN = "https://zariffdanial.vercel.app";

// One URL per page: lowercase, without a trailing slash, the root kept as "/".
// /About/ and /about then share a canonical (vercel.json also redirects the
// trailing slash away), matching the static tags the build writes.
function canonicalPath(pathname) {
  const path = (pathname || "/").toLowerCase().replace(/\/+$/, "");
  return path || "/";
}

// Points an attribute of an existing head tag at a new value and returns a
// function that puts the old value back. Does nothing when either is missing.
function setAttr(selector, name, value) {
  const el = document.head.querySelector(selector);
  if (!el || !value) return () => {};
  const previous = el.getAttribute(name);
  el.setAttribute(name, value);
  return () => {
    if (previous === null) el.removeAttribute(name);
    else el.setAttribute(name, previous);
  };
}

// Like setAttr, but creates the tag when the head has none (the 404 shell has
// no canonical or og:url), and removes it again on undo.
function upsertAttr(selector, create, name, value) {
  if (document.head.querySelector(selector)) return setAttr(selector, name, value);
  const el = create();
  el.setAttribute(name, value);
  document.head.appendChild(el);
  return () => el.remove();
}

function element(tag, attrs) {
  return () => {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
    return el;
  };
}

// Sets the document title, description (plain, Open Graph and Twitter), the
// per-route canonical and og:url, and (optionally) a robots noindex. A noindex
// page has no canonical URL, so its canonical and og:url tags are taken out.
// Every change is undone on cleanup, so a route change never leaves the
// previous page's metadata behind, and StrictMode's double run is harmless.
export default function usePageMeta({ title, description, noindex = false }) {
  useEffect(() => {
    const undo = [];

    const previousTitle = document.title;
    if (title) document.title = title;
    undo.push(() => {
      document.title = previousTitle;
    });

    undo.push(setAttr('meta[name="description"]', "content", description));
    undo.push(setAttr('meta[property="og:description"]', "content", description));
    undo.push(setAttr('meta[name="twitter:description"]', "content", description));
    undo.push(setAttr('meta[property="og:title"]', "content", title));
    undo.push(setAttr('meta[name="twitter:title"]', "content", title));

    // Takes the matching head tags out until cleanup puts them back.
    const removeAll = (selector) => {
      for (const el of document.head.querySelectorAll(selector)) {
        el.remove();
        undo.push(() => document.head.appendChild(el));
      }
    };

    if (noindex) {
      removeAll('link[rel="canonical"]');
      removeAll('meta[property="og:url"]');
      // The static 404 shell already carries one; never add a second.
      if (!document.head.querySelector('meta[name="robots"]')) {
        const robots = element("meta", { name: "robots", content: "noindex" })();
        document.head.appendChild(robots);
        undo.push(() => robots.remove());
      }
    } else {
      // A page reached from the 404 shell must not keep that shell's noindex.
      removeAll('meta[name="robots"]');
      const url = ORIGIN + canonicalPath(window.location.pathname);
      undo.push(
        upsertAttr('link[rel="canonical"]', element("link", { rel: "canonical" }), "href", url)
      );
      undo.push(
        upsertAttr('meta[property="og:url"]', element("meta", { property: "og:url" }), "content", url)
      );
    }

    return () => {
      for (let i = undo.length - 1; i >= 0; i -= 1) undo[i]();
    };
  }, [title, description, noindex]);
}
