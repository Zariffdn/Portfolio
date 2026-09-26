import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Matches a package directory under node_modules on either path separator.
const pkg = (names) => new RegExp("node_modules[\\\\/](" + names.join("|") + ")[\\\\/]");

const ORIGIN = "https://zariffdanial.vercel.app";

// Routes that get their own copy of index.html (dist/<path>.html, served at
// /<path> by the matching rewrite in vercel.json), so crawlers and link previews
// read the right title, description and canonical without running any
// JavaScript. Titles and descriptions come from meta.* in en.json.
const ROUTE_META = [
  ["about", "about", "aboutDesc"],
  ["project", "projects", "projectsDesc"],
  ["resume", "resume", "resumeDesc"],
  ["uses", "uses", "usesDesc"],
  ["mytax", "mytax", "mytaxDesc"],
  ["bestinet", "bestinet", "bestinetDesc"],
];

const attr = (s) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function routeHtml() {
  let root;
  let outDir;
  return {
    name: "route-html",
    apply: "build",
    configResolved(config) {
      root = config.root;
      outDir = resolve(root, config.build.outDir);
    },
    closeBundle() {
      const meta = JSON.parse(
        readFileSync(resolve(root, "src/i18n/locales/en.json"), "utf8")
      ).meta;
      const shell = readFileSync(resolve(outDir, "index.html"), "utf8");

      for (const [path, titleKey, descKey] of ROUTE_META) {
        const title = attr(meta[titleKey]);
        const desc = attr(meta[descKey]);
        const url = `${ORIGIN}/${path}`;
        const swaps = [
          [/<title>[^<]*<\/title>/, `<title>${title}</title>`],
          [/(<meta name="description" content=")[^"]*/, `$1${desc}`],
          [/(<link rel="canonical" href=")[^"]*/, `$1${url}`],
          [/(<meta itemprop="name" content=")[^"]*/, `$1${title}`],
          [/(<meta itemprop="description" content=")[^"]*/, `$1${desc}`],
          [/(<meta property="og:url" content=")[^"]*/, `$1${url}`],
          [/(<meta property="og:title" content=")[^"]*/, `$1${title}`],
          [/(<meta property="og:description" content=")[^"]*/, `$1${desc}`],
          [/(<meta name="twitter:title" content=")[^"]*/, `$1${title}`],
          [/(<meta name="twitter:description" content=")[^"]*/, `$1${desc}`],
        ];
        let html = shell;
        for (const [pattern, replacement] of swaps) {
          // Fail the build rather than ship a page with the home page's tags.
          if (!pattern.test(html)) {
            throw new Error(`route-html: ${pattern} not found in index.html`);
          }
          html = html.replace(pattern, replacement);
        }
        writeFileSync(resolve(outDir, `${path}.html`), html);
      }
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
