// Quality sweep for the built site.
//
// Opens every route in headless Chromium, in both themes and both viewports
// in English, plus Bahasa Malaysia at desktop dark and mobile dark, and checks
// what the site was reviewed against: no console or page errors, no horizontal
// overflow, exactly one h1, the html lang the pass asked for, the three web
// fonts loaded, and no serious or critical axe violation (WCAG 2.0 A and AA,
// WCAG 2.1 AA). A full-page screenshot and the complete axe result for every
// page land in tools/qa/output/ next to report.json, so a red run can be
// inspected without re-running it.
//
// Google Fonts (fonts.googleapis.com and fonts.gstatic.com) can fail for
// reasons outside the site. Those failures are printed but do not fail the
// page, so a CDN hiccup cannot turn the gate red. A failed load of anything
// else, whether the site's own files or another third party, and any script
// error still does. A page whose web fonts never arrive is retried once and
// then reported inconclusive rather than ok, because its layout was measured
// in fallback fonts.
//
// The script builds nothing. It expects `dist/` to exist and a server to be
// serving it:
//
//   node tools/qa/sweep.mjs                sweep http://localhost:4173 (already running)
//   node tools/qa/sweep.mjs --serve        start `vite preview` on 4173 first, stop it after
//   node tools/qa/sweep.mjs --url=http://localhost:3000
//   node tools/qa/sweep.mjs --routes=home,about
//
// With --serve the port has to be free: if something already answers there
// the sweep aborts instead of measuring whatever that server holds. Passing
// --url alongside --serve skips that probe; the preview still refuses a taken
// port and its output is printed.
//
// PW_CHANNEL=chrome (or msedge) launches the installed browser instead of
// Playwright's bundled Chromium, so nothing needs downloading locally. CI
// leaves it unset and runs `npx playwright install --with-deps chromium`.
//
// Node 22 or newer (global fetch, ESM).

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stripVTControlCharacters } from "node:util";
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const OUT = path.join(HERE, "output");

const ROUTES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "projects", path: "/project" },
  { name: "resume", path: "/resume" },
  { name: "uses", path: "/uses" },
  { name: "mytax", path: "/mytax" },
  { name: "bestinet", path: "/bestinet" },
  { name: "404", path: "/this-route-does-not-exist" },
];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

const THEMES = ["dark", "light"];

// Every theme and viewport in English, plus Bahasa Malaysia on the dark theme
// at both viewports: its strings run longer (see docs/DESIGN.md), so the
// 390px overflow rule has to hold in that language too.
const PASSES = [];
for (const viewport of Object.keys(VIEWPORTS)) {
  for (const theme of THEMES) PASSES.push({ viewport, theme, lang: "en" });
}
for (const viewport of Object.keys(VIEWPORTS)) PASSES.push({ viewport, theme: "dark", lang: "ms" });

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21aa"];
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

// The families index.html pulls from Google Fonts. Each must have a loaded
// face before the page is measured, or the numbers describe fallback fonts.
const FONT_FAMILIES = ["Bricolage Grotesque", "Inter", "JetBrains Mono"];

// The only foreign origins whose failed loads are reported without failing
// the page. A failing script or fetch from any other origin still counts.
const FONT_HOSTS = new Set(["fonts.googleapis.com", "fonts.gstatic.com"]);

// The contribution calendar on /about fetches from a third-party API that is
// rate limited and sometimes down. The component renders its own error state,
// so a failed request there says nothing about the site.
const IGNORED_SOURCES = [/github-contributions-api/i];

// Vercel injects its analytics and speed-insights scripts at the edge. The
// preview server has none and its SPA fallback answers those paths with
// index.html, which Chrome refuses to run as a script and logs as a console
// error, so the sweep serves an empty script for them instead.
const STUBBED_REQUESTS = "**/_vercel/**";

const PRELOADER_TIMEOUT = 15000;
const NAVIGATION_TIMEOUT = 60000;
const FONTS_TIMEOUT = 10000;
const PDF_TIMEOUT = 30000;
const CALENDAR_TIMEOUT = 8000;
const SERVER_TIMEOUT = 60000;

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const match = arg.match(/^--([^=]+)(?:=(.*))?$/);
    return match ? [match[1], match[2] === undefined ? true : match[2]] : [arg, true];
  })
);

const BASE = String(args.url || process.env.QA_URL || "http://localhost:4173").replace(/\/+$/, "");
const SERVE = Boolean(args.serve);

// An expected stop (a mistake on the command line, a port in use, no dist),
// reported without a stack trace.
class AbortError extends Error {}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const firstLine = (error) => String((error && error.message) || error).split("\n")[0];

function selectRoutes(spec) {
  if (spec === undefined) return ROUTES;
  const known = ROUTES.map((route) => route.name);
  const names =
    spec === true
      ? []
      : String(spec)
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean);
  const unknown = names.filter((name) => !known.includes(name));
  if (unknown.length) {
    throw new AbortError(
      `unknown route${unknown.length === 1 ? "" : "s"} in --routes: ${unknown.join(", ")}. ` +
        `Known routes: ${known.join(", ")}`
    );
  }
  const selected = ROUTES.filter((route) => names.includes(route.name));
  if (!selected.length) {
    throw new AbortError(`--routes selected no pages. Known routes: ${known.join(", ")}`);
  }
  return selected;
}

function originOf(url) {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

function hostOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function isIgnoredSource(text) {
  return IGNORED_SOURCES.some((pattern) => pattern.test(text));
}

// Chrome quotes the failing url in its CORS messages ("Access to font at
// 'https://...' from origin ... has been blocked by CORS policy"), where the
// message location is the document rather than the resource.
function quotedUrl(text) {
  const match = /https?:\/\/[^\s'"`<>()[\]]+/i.exec(text);
  return match ? match[0] : null;
}

// A failed load of a Google Fonts stylesheet or font file, whether Chrome
// reports it as "Failed to load resource" (the url is then the message
// location) or as a CORS failure (the url is quoted in the text), is outside
// the site's control and must not fail the gate. The exemption is limited to
// the two font hosts on a foreign origin; anything else still fails.
function isExternalResourceFailure(text, source) {
  if (!/failed to load|blocked by CORS|net::ERR_/i.test(text)) return false;
  const base = originOf(BASE);
  return [source, quotedUrl(text)].some((url) => {
    if (!url) return false;
    const host = hostOf(url);
    return host !== null && FONT_HOSTS.has(host) && originOf(url) !== base;
  });
}

// ---------------------------------------------------------------------------
// Preview server (only with --serve)
// ---------------------------------------------------------------------------

// HTTP status of a GET on the url, or 0 when nothing answers.
async function probe(url) {
  try {
    const res = await fetch(url, { redirect: "manual" });
    return res.status;
  } catch {
    return 0;
  }
}

// Resolves once the child has printed vite's "Local:" line and the url
// answers; rejects as soon as the child exits or the timeout passes.
async function waitForServer(url, child) {
  const started = Date.now();
  while (Date.now() - started < SERVER_TIMEOUT) {
    if (child.exit() !== null) throw new AbortError(`preview server exited before answering (${child.exit()})`);
    if (child.printedLocal() && (await probe(url)) > 0) return;
    await sleep(250);
  }
  throw new AbortError(`preview server did not answer on ${url} within ${SERVER_TIMEOUT / 1000}s`);
}

async function startPreview(url) {
  if (!fs.existsSync(path.join(ROOT, "dist", "index.html"))) {
    throw new AbortError("dist/index.html is missing; run `npm run build` before the sweep");
  }

  // A server already on the port would be swept in place of the fresh dist
  // while the preview child died on --strictPort. An explicit --url is the
  // caller's own address and skips this probe; the child still refuses a
  // taken port and its output is printed below.
  if (!args.url) {
    const status = await probe(url);
    if (status > 0) {
      throw new AbortError(
        `port already in use: ${url} answered HTTP ${status} before the preview server was started. ` +
          "Stop that server, or run without --serve to sweep it as it is."
      );
    }
  }

  const port = new URL(url).port || "4173";
  const previewArgs = ["preview", "--port", port, "--strictPort"];

  // Spawning vite's own bin with the current node keeps this free of a shell
  // on every platform (npx on Windows needs cmd.exe, and killing cmd.exe does
  // not kill the server it started). npx is only the fallback.
  const localBin = path.join(ROOT, "node_modules", "vite", "bin", "vite.js");
  const child = fs.existsSync(localBin)
    ? spawn(process.execPath, [localBin, ...previewArgs], { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] })
    : spawn("npx", ["vite", ...previewArgs], {
        cwd: ROOT,
        stdio: ["ignore", "pipe", "pipe"],
        shell: process.platform === "win32",
      });

  let exit = null;
  let log = "";
  child.on("exit", (code, signal) => {
    exit = signal ? `signal ${signal}` : `code ${code}`;
  });
  child.stdout.on("data", (chunk) => {
    log += chunk;
  });
  child.stderr.on("data", (chunk) => {
    log += chunk;
  });

  // vite colours its banner even into a pipe, so strip the escapes first.
  const output = () => stripVTControlCharacters(log).trim();
  const printedLocal = () => /Local:\s+\S+/.test(output());

  const stop = () => {
    if (exit === null) child.kill();
  };
  process.on("exit", stop);

  try {
    await waitForServer(url, { exit: () => exit, printedLocal });
    if (exit !== null) throw new AbortError(`preview server exited right after answering (${exit})`);
  } catch (error) {
    stop();
    const text = output();
    throw new AbortError(`${error.message}${text ? `\npreview server output:\n${text}` : ""}`);
  }
  console.log(`preview server on ${url}`);
  return stop;
}

// ---------------------------------------------------------------------------
// Per-page work
// ---------------------------------------------------------------------------

// Rethrow anything but a timeout so a broken selector cannot pass as a slow
// page.
function timedOut(error) {
  if (error && error.name === "TimeoutError") return false;
  throw error;
}

// Waits for the web fonts, but never longer than FONTS_TIMEOUT: a stalled
// download keeps document.fonts.ready pending forever. Each family is also
// requested explicitly, so a face the page has not needed yet is fetched
// rather than skipped. Returns which families still have no loaded face.
async function waitForFonts(page) {
  return page.evaluate(
    async ({ families, timeout }) => {
      const normalise = (family) => String(family).replace(/^["']|["']$/g, "").trim().toLowerCase();
      if (!document.fonts) return { timedOut: false, missing: families.slice() };
      const settled = (async () => {
        await document.fonts.ready;
        await Promise.all(families.map((family) => document.fonts.load(`1em "${family}"`).catch(() => [])));
      })();
      const lost = await Promise.race([
        settled.then(() => false),
        new Promise((resolve) => setTimeout(() => resolve(true), timeout)),
      ]);
      const loaded = new Set();
      for (const face of Array.from(document.fonts)) {
        if (face.status === "loaded") loaded.add(normalise(face.family));
      }
      return { timedOut: lost, missing: families.filter((family) => !loaded.has(normalise(family))) };
    },
    { families: FONT_FAMILIES, timeout: FONTS_TIMEOUT }
  );
}

// Navigate, wait for the app to mount and for the fonts. "domcontentloaded"
// rather than "load" so a stalled font stylesheet cannot turn into a 60s
// navigation timeout; the preloader wait below is what proves the app is up.
async function openPage(page, url, notes) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAVIGATION_TIMEOUT });
  await page.waitForSelector(".preloader--done", { state: "attached", timeout: PRELOADER_TIMEOUT });
  const fonts = await waitForFonts(page);
  if (fonts.timedOut) notes.push(`web fonts did not settle within ${FONTS_TIMEOUT / 1000}s`);
  return fonts;
}

// Scroll the whole page in steps so every whileInView reveal and every
// IntersectionObserver fires, then return to the top so the fixed chrome
// sits where a visitor sees it. base.css sets scroll-behavior: smooth, which
// would make each step a tween that has not landed when the next begins.
async function primeReveals(page) {
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    const step = Math.max(400, Math.floor(window.innerHeight * 0.7));
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y <= total + step; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, 0);
  });
  await sleep(700);
}

function fileStem(route, pass) {
  return `${route.name}-${pass.theme}-${pass.viewport}${pass.lang === "ms" ? "-ms" : ""}`;
}

function emptyResult(route, pass) {
  return {
    route: route ? route.path : null,
    name: route ? route.name : "(pass)",
    theme: pass.theme,
    viewport: pass.viewport,
    lang: pass.lang,
    screenshot: null,
    axeReport: null,
    h1: null,
    overflowX: null,
    htmlLang: null,
    fontsMissing: [],
    errors: [],
    external: [],
    axeBlocking: [],
    notes: [],
    failures: [],
    ms: 0,
  };
}

async function sweepPage(context, route, pass) {
  const result = emptyResult(route, pass);
  const { errors, external, notes } = result;
  const started = Date.now();
  let page = null;

  try {
    page = await context.newPage();
    page.on("console", (message) => {
      if (message.type() !== "error") return;
      const text = message.text();
      const source = (message.location() && message.location().url) || "";
      if (isIgnoredSource(source) || isIgnoredSource(text)) return;
      const entry = `console: ${text.slice(0, 300)}${source ? ` [${source.slice(0, 200)}]` : ""}`;
      (isExternalResourceFailure(text, source) ? external : errors).push(entry);
    });
    page.on("pageerror", (error) => {
      errors.push(`pageerror: ${String((error && error.message) || error).slice(0, 400)}`);
    });
    await page.route(STUBBED_REQUESTS, (handler) =>
      handler.fulfill({ status: 200, contentType: "application/javascript", body: "" })
    );

    let fonts = await openPage(page, BASE + route.path, notes);
    if (fonts.missing.length) {
      notes.push(`web fonts missing on the first load (${fonts.missing.join(", ")}); the page was retried`);
      fonts = await openPage(page, BASE + route.path, notes);
    }
    result.fontsMissing = fonts.missing;

    if (route.name === "resume") {
      const rendered = await page
        .waitForSelector(".react-pdf__Page canvas", { timeout: PDF_TIMEOUT })
        .then(() => true, timedOut);
      if (!rendered) notes.push(`pdf page did not render within ${PDF_TIMEOUT / 1000}s`);
    }

    await primeReveals(page);

    if (route.name === "about") {
      // The calendar mounts once its surface scrolls near and renders either
      // its svg or, when the contributions API fails, a plain div holding the
      // error text. Wait for either so the screenshot shows the settled page.
      const appeared = await page
        .waitForSelector(".gh__surface :is(svg, div:not(:empty))", { timeout: CALENDAR_TIMEOUT })
        .then(() => true, timedOut);
      if (!appeared) notes.push(`contribution calendar rendered nothing within ${CALENDAR_TIMEOUT / 1000}s`);
      await sleep(300);
    }

    const metrics = await page.evaluate(() => ({
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      h1: document.querySelectorAll("h1").length,
      lang: document.documentElement.lang,
    }));
    result.h1 = metrics.h1;
    result.overflowX = metrics.overflowX;
    result.htmlLang = metrics.lang;

    const stem = fileStem(route, pass);
    result.screenshot = `${stem}.png`;
    await page.screenshot({ path: path.join(OUT, result.screenshot), fullPage: true });

    const axe = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    result.axeReport = `${stem}.axe.json`;
    fs.writeFileSync(path.join(OUT, result.axeReport), JSON.stringify(axe, null, 2));
    result.axeBlocking = axe.violations
      .filter((violation) => BLOCKING_IMPACTS.has(violation.impact))
      .map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        nodes: violation.nodes.slice(0, 5).map((node) => node.target.join(" ")),
        count: violation.nodes.length,
      }));

    if (fonts.missing.length) {
      result.failures.push(
        `inconclusive: no loaded face for ${fonts.missing.join(", ")} after a retry, measured in fallback fonts`
      );
    }
    if (metrics.lang !== pass.lang) result.failures.push(`html lang is "${metrics.lang}", expected "${pass.lang}"`);
    if (metrics.overflowX) result.failures.push("horizontal overflow");
    if (metrics.h1 !== 1) result.failures.push(`${metrics.h1} h1 elements`);
    if (errors.length) result.failures.push(`${errors.length} console/page error(s)`);
    if (result.axeBlocking.length) {
      result.failures.push(`${result.axeBlocking.length} serious/critical axe violation(s)`);
    }
  } catch (error) {
    result.failures.push(`crashed: ${firstLine(error)}`);
  } finally {
    result.ms = Date.now() - started;
    if (page) await page.close().catch(() => {});
  }
  return result;
}

function progress(result) {
  process.stdout.write(
    `${result.failures.length ? "FAIL" : "ok  "} ${result.viewport.padEnd(7)} ${result.theme.padEnd(5)} ` +
      `${result.lang} ${(result.route || result.name).padEnd(26)} ${result.ms}ms\n`
  );
}

// One browser context per pass. A crash outside the per-page work (creating
// the context, its init script) is recorded as a failure of the pass rather
// than aborting the run, so the pages already swept still get reported.
async function sweepPass(browser, pass, routes, results) {
  const started = Date.now();
  let context = null;
  try {
    context = await browser.newContext({
      viewport: VIEWPORTS[pass.viewport],
      deviceScaleFactor: 1,
      colorScheme: pass.theme,
      isMobile: pass.viewport === "mobile",
      hasTouch: pass.viewport === "mobile",
    });
    await context.addInitScript(
      ([theme, lang]) => {
        try {
          window.localStorage.setItem("theme", theme);
          window.localStorage.setItem("language", lang);
        } catch {
          // storage blocked; the app falls back to its defaults
        }
      },
      [pass.theme, pass.lang]
    );

    for (const route of routes) {
      const result = await sweepPage(context, route, pass);
      results.push(result);
      progress(result);
    }
  } catch (error) {
    const result = emptyResult(null, pass);
    result.failures.push(`pass crashed: ${firstLine(error)}`);
    result.ms = Date.now() - started;
    results.push(result);
    progress(result);
  } finally {
    if (context) await context.close().catch(() => {});
  }
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

function pad(value, width) {
  return String(value).padEnd(width);
}

function label(result) {
  return `${result.name} ${result.theme} ${result.viewport} ${result.lang}`;
}

function printTable(results) {
  const header = [
    pad("route", 10),
    pad("theme", 6),
    pad("viewport", 9),
    pad("lang", 5),
    pad("h1", 3),
    pad("overflow", 9),
    pad("errors", 7),
    pad("ext", 4),
    pad("axe", 4),
    pad("notes", 6),
    pad("ms", 6),
    "result",
  ].join(" ");
  console.log("");
  console.log(header);
  console.log("-".repeat(header.length));
  for (const r of results) {
    console.log(
      [
        pad(r.name, 10),
        pad(r.theme, 6),
        pad(r.viewport, 9),
        pad(r.lang, 5),
        pad(r.h1 === null ? "-" : r.h1, 3),
        pad(r.overflowX === null ? "-" : r.overflowX ? "YES" : "no", 9),
        pad(r.errors.length, 7),
        pad(r.external.length, 4),
        pad(r.axeBlocking.length, 4),
        pad(r.notes.length, 6),
        pad(r.ms, 6),
        r.failures.length ? `FAIL ${r.failures.join("; ")}` : "ok",
      ].join(" ")
    );
  }
}

function printDetails(results) {
  const failed = results.filter((r) => r.failures.length);
  if (failed.length) console.log("");
  for (const r of failed) {
    console.log(`${label(r)}  (${r.screenshot || "no screenshot"})`);
    for (const failure of r.failures) console.log(`  ${failure}`);
    for (const error of r.errors) console.log(`  ${error}`);
    for (const v of r.axeBlocking) {
      console.log(`  axe ${v.impact} ${v.id}: ${v.help} (${v.count} node${v.count === 1 ? "" : "s"})`);
      for (const target of v.nodes) console.log(`    ${target}`);
    }
  }

  const noted = results.filter((r) => r.notes.length);
  if (noted.length) {
    console.log("");
    console.log("Notes (reported, not failing):");
    for (const r of noted) {
      for (const note of r.notes) console.log(`  ${label(r)}: ${note}`);
    }
  }

  const flaky = results.filter((r) => r.external.length);
  if (flaky.length) {
    console.log("");
    console.log("External resource failures (reported, not failing):");
    for (const r of flaky) {
      for (const entry of r.external) console.log(`  ${label(r)}: ${entry}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const routes = selectRoutes(args.routes);
  if (!originOf(BASE)) throw new AbortError(`not a valid url: ${BASE}`);

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const report = {
    base: BASE,
    browser: null,
    channel: process.env.PW_CHANNEL || null,
    commit: process.env.GITHUB_SHA || null,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    pages: [],
    failed: 0,
    aborted: null,
  };
  const results = report.pages;

  let stopServer = () => {};
  let browser = null;
  try {
    if (SERVE) stopServer = await startPreview(BASE);

    const launchOptions = { headless: true };
    if (report.channel) launchOptions.channel = report.channel;
    browser = await chromium.launch(launchOptions);
    report.browser = `${browser.browserType().name()} ${browser.version()}`;
    console.log(
      `${report.browser}${report.channel ? ` (channel ${report.channel})` : ""} against ${BASE}: ` +
        `${PASSES.length} passes x ${routes.length} routes`
    );

    for (const pass of PASSES) await sweepPass(browser, pass, routes, results);
  } catch (error) {
    report.aborted = firstLine(error);
    throw error;
  } finally {
    if (browser) await browser.close().catch(() => {});
    stopServer();

    // Written whatever happened, so a crash after some pages still leaves
    // their results next to the screenshots.
    report.finishedAt = new Date().toISOString();
    report.failed = results.filter((r) => r.failures.length).length;
    fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));

    if (results.length) {
      printTable(results);
      printDetails(results);
      console.log("");
      console.log(
        `${results.length} pages, ${report.failed} failed. ` +
          `Screenshots, axe reports and report.json in ${path.relative(ROOT, OUT)}/`
      );
    }
  }
  process.exitCode = report.failed ? 1 : 0;
}

main().catch((error) => {
  console.error(`sweep aborted: ${error instanceof AbortError ? error.message : (error && error.stack) || error}`);
  process.exitCode = 1;
});
