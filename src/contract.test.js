// @vitest-environment node
//
// Contracts between files that nothing else ties together: the two locale
// files, the route list in routes.mjs and the places that repeat it
// (vercel.json, public/sitemap.xml, src/App.jsx), the project list and its
// copy, and the no-dashes rule for copy. Plain file reads, no rendering; each
// failure lists every offender, not just the first.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ORIGIN, ROUTES, NOT_FOUND } from "../routes.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const read = (file) => readFileSync(join(ROOT, file), "utf8");
const readJson = (file) => JSON.parse(read(file));

const LOCALES = {
  en: readJson("src/i18n/locales/en.json"),
  ms: readJson("src/i18n/locales/ms.json"),
};

// Dotted key to value for every leaf of a locale file.
function flatten(node, prefix = "", out = new Map()) {
  if (node !== null && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      flatten(value, prefix ? `${prefix}.${key}` : key, out);
    }
  } else {
    out.set(prefix, node);
  }
  return out;
}

// The interpolation names in a value ({{count}}, {{count, number}}), sorted.
const varsOf = (value) =>
  [...String(value).matchAll(/{{\s*([\w.]+)[^}]*}}/g)].map((match) => match[1]).sort();

const lookup = (locale, key) =>
  key.split(".").reduce((node, part) => (node && typeof node === "object" ? node[part] : undefined), locale);

const isCopy = (value) => typeof value === "string" && value.trim() !== "";

function filesUnder(dir, pattern) {
  const out = [];
  for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) out.push(...filesUnder(path, pattern));
    else if (pattern.test(entry.name)) out.push(path);
  }
  return out;
}

describe("locale files", () => {
  const en = flatten(LOCALES.en);
  const ms = flatten(LOCALES.ms);

  it("have the same keys", () => {
    expect([...en.keys()].filter((key) => !ms.has(key))).toEqual([]);
    expect([...ms.keys()].filter((key) => !en.has(key))).toEqual([]);
  });

  it("use the same {{variables}} in every key", () => {
    const mismatched = [];
    for (const [key, value] of en) {
      if (!ms.has(key)) continue;
      const a = varsOf(value).join(", ");
      const b = varsOf(ms.get(key)).join(", ");
      if (a !== b) mismatched.push(`${key}: en {${a}} ms {${b}}`);
    }
    expect(mismatched).toEqual([]);
  });
});

describe("copy", () => {
  // The two dash characters, their HTML entities, and a \u escape of either
  // in source. Built from char codes so this file does not match itself.
  const dash = String.fromCharCode(0x2013) + String.fromCharCode(0x2014);
  const DASHES = new RegExp(`[${dash}]|&[mn]dash;|&#(?:8211|8212|x201[34]);|\\\\u201[34]`, "i");

  it("has no em or en dashes", () => {
    const files = [
      "src/i18n/locales/en.json",
      "src/i18n/locales/ms.json",
      "index.html",
      "tools/resume/resume.html",
      "routes.mjs",
      "tools/og/build.cjs",
      "public/manifest.json",
      ...filesUnder("src", /\.jsx?$/),
    ];
    const hits = [];
    for (const file of files) {
      read(file)
        .split("\n")
        .forEach((line, index) => {
          if (DASHES.test(line)) hits.push(`${file}:${index + 1}: ${line.trim().slice(0, 120)}`);
        });
    }
    expect(hits).toEqual([]);
  });
});

describe("routes", () => {
  const paths = ROUTES.map((route) => route.path)
    .filter((path) => path !== "/")
    .sort();

  it("include the home page once and have unique names and paths", () => {
    expect(ROUTES.filter((route) => route.path === "/")).toHaveLength(1);
    const names = ROUTES.map((route) => route.name).concat(NOT_FOUND.name);
    expect(new Set(names).size).toBe(names.length);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("match the rewrites in vercel.json", () => {
    const { rewrites = [] } = readJson("vercel.json");
    const sources = rewrites.map((rule) => rule.source).filter((source) => source !== "/");
    expect([...sources].sort()).toEqual(paths);
    const misrouted = rewrites
      .filter((rule) => rule.destination !== `${rule.source}.html`)
      .map((rule) => `${rule.source} -> ${rule.destination}`);
    expect(misrouted).toEqual([]);
  });

  it("match the pages in public/sitemap.xml", () => {
    const locs = [...read("public/sitemap.xml").matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(
      (match) => match[1]
    );
    expect(locs.filter((loc) => !loc.startsWith(`${ORIGIN}/`))).toEqual([]);
    const locPaths = locs.map((loc) => new URL(loc).pathname);
    expect(new Set(locPaths).size).toBe(locPaths.length);
    // A path with an extension is a file (the resume PDF), not a page.
    const isFile = (path) => /\.[a-z0-9]+$/i.test(path);
    expect(locPaths).toContain("/");
    expect(locPaths.filter((path) => path !== "/" && !isFile(path)).sort()).toEqual(paths);
    const missingFiles = locPaths
      .filter(isFile)
      .filter((path) => !existsSync(join(ROOT, "public", decodeURIComponent(path))));
    expect(missingFiles).toEqual([]);
  });

  it("match the <Route> paths in src/App.jsx", () => {
    const routePaths = [...read("src/App.jsx").matchAll(/<Route\s[^>]*?\bpath="([^"]+)"/g)].map(
      (match) => match[1]
    );
    expect(routePaths).toContain("/");
    expect(routePaths).toContain("*");
    expect(routePaths.filter((path) => path !== "/" && path !== "*").sort()).toEqual(paths);
  });

  it("have a title and description in both locale files", () => {
    const missing = [];
    for (const route of [...ROUTES, NOT_FOUND]) {
      for (const key of [route.titleKey, route.descKey]) {
        for (const [lang, locale] of Object.entries(LOCALES)) {
          if (!isCopy(lookup(locale, `meta.${key}`))) missing.push(`meta.${key} in ${lang}.json`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it("point their Open Graph images at files in public/", () => {
    const missing = ROUTES.filter((route) => route.image)
      .map((route) => route.image.path)
      .filter((path) => !existsSync(join(ROOT, "public", path)));
    expect(missing).toEqual([]);
  });
});

describe("projects", () => {
  const source = read("src/data/projects.js");
  const ids = [...source.matchAll(/^\s*id:\s*"([^"]+)"/gm)].map((match) => match[1]);

  it("are listed in src/data/projects.js", () => {
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("have a title and description in both locale files", () => {
    const missing = [];
    for (const id of ids) {
      for (const suffix of ["title", "desc"]) {
        for (const [lang, locale] of Object.entries(LOCALES)) {
          if (!isCopy(lookup(locale, `projects.${id}_${suffix}`))) {
            missing.push(`projects.${id}_${suffix} in ${lang}.json`);
          }
        }
      }
    }
    expect(missing).toEqual([]);
  });
});
