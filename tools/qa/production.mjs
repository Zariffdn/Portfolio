// Production smoke check: what the deployed site answers without running any
// JavaScript, which is what crawlers and link previews see.
//
// For every route in routes.mjs: HTTP 200, the <title> from meta.* in en.json,
// a canonical pointing at the route's own URL, and the Content-Security-Policy
// meta tag. An unknown path answers 404 with robots noindex and the 404 title.
// A trailing slash redirects to the path without it (/about/ to /about), the
// short /resume.pdf redirects to the resume, and the resume is a PDF. The
// response headers vercel.json sets on every path are present.
//
//   node tools/qa/production.mjs                       checks https://zariffdanial.vercel.app
//   node tools/qa/production.mjs --url=https://<preview>.vercel.app
//
// Canonicals are always expected on the production origin, wherever the
// check runs. Node 22 or newer (global fetch). Run weekly by
// .github/workflows/weekly.yml.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ORIGIN, ROUTES, NOT_FOUND } from "../../routes.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));

const META = readJson("src/i18n/locales/en.json").meta;
const VERCEL = readJson("vercel.json");
const SITE_HEADERS = (VERCEL.headers || []).find((rule) => rule.source === "/(.*)");
const RESUME_REDIRECT = (VERCEL.redirects || []).find((rule) => rule.source === "/resume.pdf");

const TIMEOUT_MS = 25000;

const arg = process.argv.slice(2).find((value) => value.startsWith("--url="));
const BASE = (arg ? arg.slice("--url=".length) : ORIGIN).replace(/\/+$/, "");

const decode = (text) =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

async function get(pathname) {
  const response = await fetch(BASE + pathname, {
    redirect: "manual",
    headers: { "user-agent": "zariffdanial-portfolio-weekly-check" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const body = response.status >= 300 && response.status < 400 ? "" : await response.text();
  return { status: response.status, headers: response.headers, body };
}

function head(html) {
  const title = /<title>([^<]*)<\/title>/i.exec(html);
  const canonical = /<link rel="canonical" href="([^"]*)"/i.exec(html);
  const robots = /<meta name="robots" content="([^"]*)"/i.exec(html);
  return {
    title: title ? decode(title[1]) : null,
    canonical: canonical ? canonical[1] : null,
    robots: robots ? robots[1] : null,
    csp: /<meta http-equiv="Content-Security-Policy"/i.test(html),
  };
}

const failures = [];
let checks = 0;

function expect(ok, label, detail) {
  checks += 1;
  console.log(`${ok ? "ok  " : "FAIL"} ${label}${ok || !detail ? "" : `: ${detail}`}`);
  if (!ok) failures.push(`${label}: ${detail}`);
}

// Resolves a Location header against the base, so /about and
// https://host/about compare equal.
const locationPath = (location) => (location ? new URL(location, BASE + "/").pathname : null);

async function main() {
  console.log(`Checking ${BASE}`);

  for (const route of ROUTES) {
    const { status, body } = await get(route.path);
    const tags = head(body);
    const label = route.path;
    expect(status === 200, `${label} answers 200`, `HTTP ${status}`);
    expect(tags.title === META[route.titleKey], `${label} title`, `"${tags.title}", expected "${META[route.titleKey]}"`);
    expect(tags.canonical === ORIGIN + route.path, `${label} canonical`, `${tags.canonical}, expected ${ORIGIN + route.path}`);
    expect(tags.csp, `${label} Content-Security-Policy meta`, "missing");
  }

  {
    const { status, body } = await get(NOT_FOUND.path);
    const tags = head(body);
    expect(status === 404, `${NOT_FOUND.path} answers 404`, `HTTP ${status}`);
    expect(/\bnoindex\b/i.test(tags.robots || ""), `${NOT_FOUND.path} robots noindex`, `robots is ${tags.robots}`);
    expect(tags.title === META[NOT_FOUND.titleKey], `${NOT_FOUND.path} title`, `"${tags.title}", expected "${META[NOT_FOUND.titleKey]}"`);
  }

  {
    const { status, headers } = await get("/about/");
    const to = locationPath(headers.get("location"));
    expect(status >= 300 && status < 400 && to === "/about", "/about/ redirects to /about", `HTTP ${status} to ${to}`);
  }

  if (RESUME_REDIRECT) {
    const { status, headers } = await get(RESUME_REDIRECT.source);
    const to = locationPath(headers.get("location"));
    expect(
      status >= 300 && status < 400 && to === RESUME_REDIRECT.destination,
      `${RESUME_REDIRECT.source} redirects to ${RESUME_REDIRECT.destination}`,
      `HTTP ${status} to ${to}`
    );
    const pdf = await get(RESUME_REDIRECT.destination);
    const type = pdf.headers.get("content-type") || "";
    expect(pdf.status === 200 && type.includes("application/pdf"), `${RESUME_REDIRECT.destination} is a PDF`, `HTTP ${pdf.status}, ${type}`);
  }

  if (SITE_HEADERS) {
    const { headers } = await get("/");
    for (const { key, value } of SITE_HEADERS.headers) {
      const actual = headers.get(key);
      expect(actual === value, `header ${key}`, `${actual === null ? "missing" : `"${actual}"`}, expected "${value}"`);
    }
  }

  console.log(`\n${checks} checks, ${failures.length} failed`);
  process.exitCode = failures.length ? 1 : 0;
}

main().catch((error) => {
  console.error(`production check aborted: ${(error && error.stack) || error}`);
  process.exitCode = 1;
});
