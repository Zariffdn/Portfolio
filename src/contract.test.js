// @vitest-environment node
//
// Contracts between files that nothing else ties together: the two locale
// files, the route list in routes.mjs and the places that repeat it
// (vercel.json, public/sitemap.xml, src/App.jsx), the case-study chain, the
// project list and its copy, the Content-Security-Policy origins, the
// hosting rules in vercel.json, the install counts, the home page shell and
// the no-dashes rule. Plain file reads, no rendering; each failure lists
// every offender, not just the first.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ORIGIN, ROUTES, NOT_FOUND } from "../routes.mjs";
import { caseStudies, nextStudy } from "./components/CaseStudy/studies";

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

// Every text file in the repository, for the rules that hold everywhere.
// Skips what git ignores (node_modules, dist, build, docs/private, the sweep
// output, every other dot directory) and the lockfile.
const TEXT_FILE = /\.(?:jsx?|[cm]js|css|json|md|html|ya?ml|xml|txt|svg)$/i;
const SKIP = new Set([
  "node_modules",
  "dist",
  "build",
  "coverage",
  "docs/private",
  // The three paths the notes lived at before docs/private; .gitignore keeps
  // them ignored in case an old copy remains, and nothing in them may ever
  // be printed.
  "docs/MATRICULATION.md",
  "docs/DEGREE.md",
  "docs/BOOTCAMP.md",
  "tools/qa/output",
  "package-lock.json",
]);

function textFiles(dir = "") {
  const out = [];
  for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const path = dir ? `${dir}/${entry.name}` : entry.name;
    if (SKIP.has(path) || (entry.name.startsWith(".") && entry.name !== ".github")) continue;
    if (entry.isDirectory()) out.push(...textFiles(path));
    else if (TEXT_FILE.test(entry.name)) out.push(path);
  }
  return out;
}

// Width and height from a JPEG's first frame header.
function jpegSize(buffer) {
  let i = 2;
  while (i + 9 < buffer.length) {
    if (buffer[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = buffer[i + 1];
    if (marker === 0xff) {
      i += 1;
      continue;
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buffer.readUInt16BE(i + 5), width: buffer.readUInt16BE(i + 7) };
    }
    i += 2 + buffer.readUInt16BE(i + 2);
  }
  return null;
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

  it("has no em or en dashes anywhere in the repository", () => {
    const files = textFiles();
    expect(files.length).toBeGreaterThan(100);
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
    // Each <Route> runs up to the next one (or the end of <Routes>), so the
    // path is found whichever attribute comes first.
    const routePaths = read("src/App.jsx")
      .split(/(?=<Route\b)/)
      .slice(1)
      .map((tag) => /\bpath="([^"]+)"/.exec(tag.split("</Routes>")[0]))
      .map((match) => (match ? match[1] : null));
    expect(routePaths).not.toContain(null);
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

  it("point their Open Graph images at files in public/ of the declared size", () => {
    const wrong = [];
    for (const { image } of ROUTES.filter((route) => route.image)) {
      const file = join(ROOT, "public", image.path);
      if (!existsSync(file)) {
        wrong.push(`${image.path} is missing`);
        continue;
      }
      const size = jpegSize(readFileSync(file));
      if (!size || size.width !== image.width || size.height !== image.height) {
        const actual = size ? `${size.width}x${size.height}` : "not a JPEG";
        wrong.push(`${image.path} is ${actual}, declared ${image.width}x${image.height}`);
      }
    }
    expect(wrong).toEqual([]);
  });
});

describe("case studies", () => {
  const articles = ROUTES.filter((route) => route.type === "article")
    .map((route) => route.path)
    .sort();

  it("chain every article route in studies.js, wrapping from the last to the first", () => {
    expect(caseStudies.map((study) => study.path).sort()).toEqual(articles);
    caseStudies.forEach((study, i) => {
      expect(isCopy(study.title) && isCopy(study.teaser)).toBe(true);
      expect(nextStudy(study.path)).toBe(caseStudies[(i + 1) % caseStudies.length]);
    });
    expect(nextStudy("/not-a-study")).toBeNull();
  });

  it("are the only targets of caseStudy links in projects.js", () => {
    const targets = [...read("src/data/projects.js").matchAll(/^\s*caseStudy:\s*"([^"]+)"/gm)].map(
      (match) => match[1]
    );
    expect(targets.length).toBeGreaterThan(0);
    expect(targets.filter((path) => !articles.includes(path))).toEqual([]);
  });
});

describe("vercel.json", () => {
  const vercel = readJson("vercel.json");
  const rule = (list, source) => {
    const found = (list || []).find((entry) => entry.source === source);
    expect(found, `a rule for ${source}`).toBeDefined();
    return found;
  };
  const headersOf = (entry) => Object.fromEntries(entry.headers.map(({ key, value }) => [key, value]));

  it("keeps unknown paths at 404: no trailing slash, no cleanUrls, no catch-all rewrite", () => {
    expect(vercel.trailingSlash).toBe(false);
    expect(vercel.cleanUrls).toBeUndefined();
    const patterns = (vercel.rewrites || [])
      .map((entry) => entry.source)
      .filter((source) => /[:*()]/.test(source));
    expect(patterns).toEqual([]);
  });

  it("sends the security headers from the rule that vite preview and production.mjs read", () => {
    // Both look the rule up by this exact source.
    const headers = headersOf(rule(vercel.headers, "/(.*)"));
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Referrer-Policy"]).toBeTruthy();
    expect(headers["Permissions-Policy"]).toBeTruthy();
  });

  it("caches fingerprinted assets for good and the resume not at all", () => {
    expect(headersOf(rule(vercel.headers, "/assets/(.*)"))["Cache-Control"]).toMatch(/immutable/);
    expect(headersOf(rule(vercel.headers, "/Zariff-Danial-Resume.pdf"))["Cache-Control"]).toMatch(
      /max-age=0/
    );
    expect(existsSync(join(ROOT, "public/Zariff-Danial-Resume.pdf"))).toBe(true);
  });

  it("redirects the short and the old fingerprinted resume paths to the stable file", () => {
    // production.mjs looks the short one up by this exact source.
    expect(rule(vercel.redirects, "/resume.pdf").destination).toBe("/Zariff-Danial-Resume.pdf");
    const old = vercel.redirects.find((entry) => entry.source.startsWith("/assets/Zariff-Danial-Resume-"));
    expect(old).toBeDefined();
    expect(old.destination).toBe("/Zariff-Danial-Resume.pdf");
    expect(old.permanent).toBe(true);
    const missing = vercel.redirects
      .map((entry) => entry.destination)
      .filter((destination) => !existsSync(join(ROOT, "public", destination)));
    expect(missing).toEqual([]);
  });
});

describe("content security policy", () => {
  // The origins vite.config.mjs allows, read from its source: nothing exports
  // them, and the dev server carries no CSP.
  const config = read("vite.config.mjs");
  const constant = (name) => {
    const match = config.match(new RegExp(`const ${name} = "([^"]+)"`));
    expect(match, `const ${name} in vite.config.mjs`).not.toBeNull();
    return match[1];
  };
  const directive = (name) => {
    const match = config.match(new RegExp("`" + name + " 'self' ([^`]*)`"));
    expect(match, `${name} in contentSecurityPolicy()`).not.toBeNull();
    return match[1];
  };

  it("allows the origin the contact form posts to, for fetch and form-action", () => {
    const endpoint = read("src/components/About/Contact.jsx").match(/const FORMSPREE_ENDPOINT = "([^"]+)"/);
    expect(endpoint).not.toBeNull();
    expect(constant("CONTACT_FORM")).toBe(new URL(endpoint[1]).origin);
    expect(directive("connect-src")).toContain("${CONTACT_FORM}");
    expect(directive("form-action")).toContain("${CONTACT_FORM}");
  });

  it("allows the origin the installed contribution calendar fetches from", () => {
    const pkg = readJson("node_modules/react-github-calendar/package.json");
    const entry = pkg.exports && typeof pkg.exports === "object" ? pkg.exports["."] : pkg.module || pkg.main;
    const source = read(join("node_modules/react-github-calendar", entry));
    const origins = [...new Set([...source.matchAll(/https:\/\/[a-z0-9.-]+/gi)].map((match) => match[0]))];
    expect(origins).toContain(constant("CALENDAR_API"));
    expect(directive("connect-src")).toContain("${CALENDAR_API}");
    // The sweep excuses failures of that API and no other.
    const sweep = read("tools/qa/sweep.mjs").match(/const CALENDAR_API = "([^"]+)"/);
    expect(sweep).not.toBeNull();
    expect(new URL(sweep[1]).origin).toBe(constant("CALENDAR_API"));
  });
});

describe("home page shell", () => {
  const html = read("index.html");
  const meta = (attr, name) => {
    const match = html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`));
    return match ? match[1] : null;
  };
  const unescape = (value) =>
    String(value).replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&amp;/g, "&");

  it("carries meta.home and meta.homeDesc from en.json, which the build copies over it", () => {
    const { home, homeDesc } = LOCALES.en.meta;
    expect(unescape(html.match(/<title>([^<]*)<\/title>/)[1])).toBe(home);
    for (const [attr, name] of [
      ["itemprop", "name"],
      ["property", "og:title"],
      ["name", "twitter:title"],
    ]) {
      expect(unescape(meta(attr, name)), name).toBe(home);
    }
    for (const [attr, name] of [
      ["name", "description"],
      ["itemprop", "description"],
      ["property", "og:description"],
      ["name", "twitter:description"],
    ]) {
      expect(unescape(meta(attr, name)), name).toBe(homeDesc);
    }
  });

  it("declares the default Open Graph image at its real size", () => {
    const image = meta("property", "og:image");
    expect(image.startsWith(`${ORIGIN}/`)).toBe(true);
    expect(meta("name", "twitter:image")).toBe(image);
    expect(meta("itemprop", "image")).toBe(image);
    const size = jpegSize(readFileSync(join(ROOT, "public", new URL(image).pathname)));
    expect(size).not.toBeNull();
    expect(`${size.width}x${size.height}`).toBe(
      `${meta("property", "og:image:width")}x${meta("property", "og:image:height")}`
    );
  });
});

describe("install counts", () => {
  const mytax = read("src/data/mytax.js");
  const lifetime = mytax.match(/lifetimeInstalls = "([^"]+)"/)[1];
  // Each store's figure (the first word of its count) in data/mytax.js.
  const stores = [...mytax.matchAll(/kind: "([^"]+)"[\s\S]*?count: "([^"]+)"/g)].map((match) => [
    match[1],
    match[2].split(" ")[0],
  ]);

  it("agree between data/mytax.js and both locale files", () => {
    expect(stores.length).toBe(3);
    for (const [lang, locale] of Object.entries(LOCALES)) {
      expect(lookup(locale, "home.proofInstallsValue"), lang).toBe(lifetime);
      expect(lookup(locale, "meta.homeDesc"), lang).toContain(lifetime);
      for (const [kind, figure] of stores) {
        const count = String(lookup(locale, `store.${kind}.count`));
        expect(count.split(" ")[0], `${kind} in ${lang}`).toBe(figure);
      }
    }
  });

  it("agree with index.html, its noscript paragraph and the resume", () => {
    const html = read("index.html");
    expect(html.match(/<meta name="description" content="([^"]*)"/)[1]).toContain(lifetime);
    expect(html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1]).toContain(lifetime);
    expect(read("tools/resume/resume.html")).toContain(lifetime);
  });
});

describe("hard rules", () => {
  it("use no !important in any stylesheet", () => {
    const hits = filesUnder("src", /\.css$/).filter((file) =>
      /!important/.test(read(file).replace(/\/\*[\s\S]*?\*\//g, ""))
    );
    expect(hits).toEqual([]);
  });

  it("depend on no CSS framework", () => {
    const pkg = readJson("package.json");
    const names = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    expect(names.filter((name) => /bootstrap|tailwind|bulma/i.test(name))).toEqual([]);
  });

  it("keep the hiring copy to full-time roles in Malaysia", () => {
    // Words the owner has ruled out of the copy (CLAUDE.md, Content edits).
    const banned = /freelanc|overseas|relocat|abroad|luar negara|berpindah/i;
    const hits = [];
    for (const [lang, locale] of Object.entries(LOCALES)) {
      for (const [key, value] of flatten(locale)) {
        if (banned.test(String(value))) hits.push(`${lang}: ${key}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it("post the contact form to Formspree with the honeypot and the subject prefix", () => {
    const contact = read("src/components/About/Contact.jsx");
    expect(contact).toMatch(/name="_gotcha"/);
    // Formspree documents only "subject" for the email's subject line.
    expect(contact).toMatch(/data\.set\("subject",\s*SUBJECT_PREFIX \+ subject\)/);
    expect(contact).not.toMatch(/"_subject"/);
    expect(contact).toMatch(/"Portfolio: "/);
  });
});

describe("jump links", () => {
  // A native <a href="#id"> pushes a keyless history entry that ScrollToTop
  // reads as Back to the first page of the visit, so same-page jumps go
  // through <Link to="#id"> (About/AboutCard.jsx). The skip link in App.jsx
  // keeps its href but moves focus itself in onClick.
  it("go through React Router, except the skip link", () => {
    const offenders = [];
    for (const file of filesUnder("src", /\.jsx$/)) {
      for (const [tag] of read(file).matchAll(/<a\b[^>]*>/g)) {
        if (!/\bhref=(?:"#|\{`#)/.test(tag)) continue;
        if (tag.includes('className="skip-link"') && tag.includes("onClick=")) continue;
        offenders.push(`${file}: ${tag}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("projects", () => {
  const source = read("src/data/projects.js");
  const ids = [...source.matchAll(/^\s*id:\s*"([^"]+)"/gm)].map((match) => match[1]);

  it("are listed in src/data/projects.js", () => {
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("show real projects on the home page, each once", () => {
    const match = source.match(/selectedForHome = \[([^\]]*)\]/);
    expect(match).not.toBeNull();
    const selected = [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    expect(selected.length).toBeGreaterThan(0);
    expect(new Set(selected).size).toBe(selected.length);
    expect(selected.filter((id) => !ids.includes(id))).toEqual([]);
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
