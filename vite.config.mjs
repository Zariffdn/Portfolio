import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ORIGIN, ROUTES, NOT_FOUND, htmlFileFor } from "./routes.mjs";

// Matches a package directory under node_modules on either path separator.
const pkg = (names) => new RegExp("node_modules[\\\\/](" + names.join("|") + ")[\\\\/]");

// Search engines cut descriptions off at about this many characters.
const DESC_MAX = 160;

// The response headers vercel.json sets on every path. `vite preview` sends
// the same ones, so the QA sweep runs against what production serves.
const vercel = JSON.parse(readFileSync(new URL("./vercel.json", import.meta.url), "utf8"));
const siteHeaders = (vercel.headers || []).find((rule) => rule.source === "/(.*)");
const SITE_HEADERS = Object.fromEntries(
  (siteHeaders ? siteHeaders.headers : []).map(({ key, value }) => [key, value])
);

// Content-Security-Policy, delivered as a <meta> tag in every page the build
// writes (the dev server has none: Vite's client injects inline scripts and
// styles). Everything is same-origin, including Vercel's analytics scripts
// and the self-hosted fonts, except the two APIs the page calls: the GitHub
// contribution calendar on /about and the contact form. The one inline script
// (the theme script in index.html) is allowed by its hash, computed at build
// time. Inline styles stay allowed because React and framer-motion write
// style attributes. frame-ancestors has no effect in a meta tag; the
// X-Frame-Options header in vercel.json covers framing instead.
const CONTACT_FORM = "https://formspree.io";
const CALENDAR_API = "https://github-contributions-api.jogruber.de";

function contentSecurityPolicy(scriptHash) {
  return [
    "default-src 'self'",
    `script-src 'self' '${scriptHash}'`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data:",
    `connect-src 'self' ${CALENDAR_API} ${CONTACT_FORM}`,
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    `form-action 'self' ${CONTACT_FORM}`,
  ].join("; ");
}

// Script types the browser runs. Anything else (application/ld+json) is a
// data block that CSP does not govern.
const EXECUTABLE_TYPES = new Set(["", "text/javascript", "application/javascript", "module"]);

// Finds the inline theme script and returns the CSP source that allows it.
// Any other inline script would be blocked in production, so it fails the
// build here instead. The HTML parser turns CRLF into LF before the browser
// hashes the text, so the hash is taken over the same normalised text.
function themeScriptHash(html) {
  const inline = [];
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = match[1];
    if (/\bsrc\s*=/i.test(attrs)) continue;
    const type = /\btype\s*=\s*"([^"]*)"/i.exec(attrs);
    if (!EXECUTABLE_TYPES.has(type ? type[1].trim().toLowerCase() : "")) continue;
    inline.push({ text: match[2], index: match.index });
  }
  const theme = inline.find((script) => script.text.includes("dataset.theme"));
  if (!theme) throw new Error("route-html: the inline theme script is missing from index.html");
  if (inline.length > 1) {
    throw new Error(
      `route-html: index.html has ${inline.length} inline scripts; the Content-Security-Policy allows only the theme script`
    );
  }
  const text = theme.text.replace(/\r\n?/g, "\n");
  return {
    source: `sha256-${createHash("sha256").update(text, "utf8").digest("base64")}`,
    index: theme.index,
  };
}

// Puts the CSP meta tag straight after <meta charset>, ahead of everything it
// governs (the theme script above all).
function withCsp(html) {
  const script = themeScriptHash(html);
  const charset = /([ \t]*)(<meta charset="[^"]*"\s*\/?>)(\r?\n)/i;
  const match = charset.exec(html);
  if (!match || match.index > script.index) {
    throw new Error("route-html: <meta charset> must come before the theme script in index.html");
  }
  const [, indent, tag, eol] = match;
  const meta = `<meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy(script.source)}">`;
  return html.replace(charset, `${indent}${tag}${eol}${indent}${meta}${eol}`);
}

const attr = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Tag patterns. Each captures everything up to the value, so a swap keeps the
// tag and replaces only its content.
const TAG = {
  title: /(<title>)[^<]*(?=<\/title>)/,
  description: /(<meta name="description" content=")[^"]*/,
  canonical: /(<link rel="canonical" href=")[^"]*/,
  itempropName: /(<meta itemprop="name" content=")[^"]*/,
  itempropDescription: /(<meta itemprop="description" content=")[^"]*/,
  itempropImage: /(<meta itemprop="image" content=")[^"]*/,
  ogUrl: /(<meta property="og:url" content=")[^"]*/,
  ogType: /(<meta property="og:type" content=")[^"]*/,
  ogTitle: /(<meta property="og:title" content=")[^"]*/,
  ogDescription: /(<meta property="og:description" content=")[^"]*/,
  ogImage: /(<meta property="og:image" content=")[^"]*/,
  ogImageWidth: /(<meta property="og:image:width" content=")[^"]*/,
  ogImageHeight: /(<meta property="og:image:height" content=")[^"]*/,
  ogImageAlt: /(<meta property="og:image:alt" content=")[^"]*/,
  twitterTitle: /(<meta name="twitter:title" content=")[^"]*/,
  twitterDescription: /(<meta name="twitter:description" content=")[^"]*/,
  twitterImage: /(<meta name="twitter:image" content=")[^"]*/,
  twitterImageAlt: /(<meta name="twitter:image:alt" content=")[^"]*/,
};

// Fail the build rather than ship a page with the home page's tags.
function swap(html, key, value) {
  const pattern = TAG[key];
  if (!pattern.test(html)) {
    throw new Error(`route-html: ${pattern} not found in index.html`);
  }
  return html.replace(pattern, (_, head) => head + attr(value));
}

// Removes a whole tag and its line.
function drop(html, pattern) {
  const line = new RegExp(`[ \\t]*${pattern.source}[^>]*>\\r?\\n?`);
  if (!line.test(html)) {
    throw new Error(`route-html: ${pattern} not found in index.html`);
  }
  return html.replace(line, "");
}

function readMeta(root) {
  const meta = JSON.parse(
    readFileSync(resolve(root, "src/i18n/locales/en.json"), "utf8")
  ).meta;
  for (const { titleKey, descKey } of [...ROUTES, NOT_FOUND]) {
    for (const key of [titleKey, descKey]) {
      if (typeof meta[key] !== "string" || !meta[key].trim()) {
        throw new Error(`route-html: meta.${key} is missing from en.json`);
      }
    }
    if (meta[descKey].length > DESC_MAX) {
      throw new Error(
        `route-html: meta.${descKey} in en.json is ${meta[descKey].length} characters; keep it to ${DESC_MAX} or fewer`
      );
    }
  }
  return meta;
}

// Writes a static shell per route (see routes.mjs), so crawlers and link
// previews read the right title, description, canonical and image without
// running any JavaScript, plus dist/404.html, and puts the CSP meta tag in
// every one of them. Titles and descriptions come from meta.* in en.json.
// Each non-home shell is served at /<path> by its rewrite in vercel.json
// (vite preview finds it by itself).
function routeHtml() {
  let root;
  let outDir;
  let written = false;
  return {
    name: "route-html",
    apply: "build",
    configResolved(config) {
      root = config.root;
      outDir = resolve(root, config.build.outDir);
    },
    // Checked before bundling so a bad description fails the build at once.
    buildStart() {
      written = false;
      readMeta(root);
    },
    writeBundle() {
      written = true;
    },
    closeBundle() {
      // Also called after a failed build, when there is no index.html to copy.
      if (!written) return;
      const meta = readMeta(root);
      const shell = withCsp(readFileSync(resolve(outDir, "index.html"), "utf8"));

      const ld = shell.match(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
      );
      if (!ld) throw new Error("route-html: no JSON-LD block in index.html");
      try {
        JSON.parse(ld[1]);
      } catch (e) {
        throw new Error(`route-html: the JSON-LD in index.html does not parse: ${e.message}`, {
          cause: e,
        });
      }

      const withText = (html, title, desc) => {
        let out = html;
        for (const key of ["title", "itempropName", "ogTitle", "twitterTitle"]) {
          out = swap(out, key, title);
        }
        for (const key of ["description", "itempropDescription", "ogDescription", "twitterDescription"]) {
          out = swap(out, key, desc);
        }
        return out;
      };

      for (const route of ROUTES) {
        const url = ORIGIN + route.path;
        let html = withText(shell, meta[route.titleKey], meta[route.descKey]);
        html = swap(html, "canonical", url);
        html = swap(html, "ogUrl", url);
        if (route.type) html = swap(html, "ogType", route.type);
        if (route.image) {
          const image = ORIGIN + route.image.path;
          html = swap(html, "ogImage", image);
          html = swap(html, "twitterImage", image);
          html = swap(html, "itempropImage", image);
          html = swap(html, "ogImageWidth", route.image.width);
          html = swap(html, "ogImageHeight", route.image.height);
          html = swap(html, "ogImageAlt", route.image.alt);
          html = swap(html, "twitterImageAlt", route.image.alt);
        }
        writeFileSync(resolve(outDir, htmlFileFor(route)), html);
      }

      // The 404 page has no URL of its own: no canonical, no og:url, noindex.
      let notFound = withText(shell, meta[NOT_FOUND.titleKey], meta[NOT_FOUND.descKey]);
      notFound = drop(notFound, /<link rel="canonical"/);
      notFound = drop(notFound, /<meta property="og:url"/);
      notFound = notFound.replace(
        /([ \t]*)(<meta name="description"[^>]*>)/,
        '$1$2\n$1<meta name="robots" content="noindex">'
      );
      if (!notFound.includes('<meta name="robots" content="noindex">')) {
        throw new Error("route-html: could not add robots noindex to 404.html");
      }
      writeFileSync(resolve(outDir, "404.html"), notFound);
    },
  };
}

export default defineConfig({
  plugins: [react(), routeHtml()],
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 4173,
    headers: SITE_HEADERS,
  },
  build: {
    outDir: "dist",
    target: "es2020",
    rolldownOptions: {
      output: {
        // Stable vendor chunks so a copy edit does not re-fingerprint React.
        codeSplitting: {
          groups: [
            { name: "react", test: pkg(["react", "react-dom", "scheduler"]) },
            { name: "motion", test: pkg(["framer-motion", "motion-dom", "motion-utils"]) },
            { name: "i18n", test: pkg(["i18next", "react-i18next", "i18next-browser-languagedetector"]) },
          ],
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    css: false,
  },
});
