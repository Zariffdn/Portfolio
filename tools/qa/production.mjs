// Production smoke check: what the deployed site answers without running any
// JavaScript, which is what crawlers and link previews see.
//
// For every route in routes.mjs: HTTP 200, the <title> from meta.* in en.json,
// a canonical pointing at the route's own URL, and the Content-Security-Policy
// meta tag. An unknown path answers 404 with robots noindex and the 404 title.
// A trailing slash redirects to the path without it (/about/ to /about), every
// redirect in vercel.json answers where it says (the short /resume.pdf among
// them, with 308 for a permanent one and 307 otherwise), and the resume is a
// PDF. The response headers vercel.json sets on every path are present.
// Vercel's analytics and speed-insights scripts, which the app loads from the
// site's own origin at run time (the QA sweep stubs them, since the preview
// server has none), are served as JavaScript, and the CSP allows 'self' in
// script-src and connect-src, which is what they and their beacons need.
//
//   node tools/qa/production.mjs                       checks https://zariffdanial.vercel.app
//   node tools/qa/production.mjs --url=https://<preview>.vercel.app
//
// A request that times out or fails on the network is tried once more; a
// second failure fails that path's checks and the run carries on to the
// rest. Canonicals are always expected on the production origin, wherever the
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
const REDIRECTS = VERCEL.redirects || [];
const RESUME_REDIRECT = REDIRECTS.find((rule) => rule.source === "/resume.pdf");

// The resume's stable address (see CLAUDE.md), which /resume.pdf must lead to.
const RESUME_PDF = "/Zariff-Danial-Resume.pdf";

// Loaded by the app from its own origin; see the note at the top.
const VERCEL_SCRIPTS = ["/_vercel/insights/script.js", "/_vercel/speed-insights/script.js"];

const TIMEOUT_MS = 25000;
const RETRY_DELAY_MS = 5000;

const arg = process.argv.slice(2).find((value) => value.startsWith("--url="));
const BASE = (arg ? arg.slice("--url=".length) : ORIGIN).replace(/\/+$/, "");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const decode = (text) =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

// One request, tried once more after a timeout or a network failure. When
// both attempts fail the answer has status 0 and the error, so each check on
// it fails on its own line and the run goes on.
async function request(pathname, method = "GET") {
  let error = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (attempt) await sleep(RETRY_DELAY_MS);
    try {
      const response = await fetch(BASE + pathname, {
        method,
        redirect: "manual",
        headers: { "user-agent": "zariffdanial-portfolio-weekly-check" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      // A redirect says what it needs in its headers and HEAD has no body;
      // release those instead of reading them.
      const skipBody = method === "HEAD" || (response.status >= 300 && response.status < 400);
      const body = skipBody ? "" : await response.text();
      if (skipBody && response.body) await response.body.cancel().catch(() => {});
      return { status: response.status, headers: response.headers, body, error: null };
    } catch (caught) {
      const cause = caught && caught.cause;
      error = String((cause && (cause.code || cause.name)) || (caught && caught.name) || caught);
      console.log(`     ${method} ${pathname} ${attempt ? "failed again" : "failed, trying once more"}: ${error}`);
    }
  }
  return { status: 0, headers: new Headers(), body: "", error };
}

const get = (pathname) => request(pathname, "GET");
const answered = (answer) => (answer.error ? `no answer (${answer.error})` : `HTTP ${answer.status}`);

function head(html) {
  const title = /<title>([^<]*)<\/title>/i.exec(html);
  const canonical = /<link rel="canonical" href="([^"]*)"/i.exec(html);
  const robots = /<meta name="robots" content="([^"]*)"/i.exec(html);
  const csp = /<meta http-equiv="Content-Security-Policy" content="([^"]*)"/i.exec(html);
  return {
    title: title ? decode(title[1]) : null,
    canonical: canonical ? canonical[1] : null,
    robots: robots ? robots[1] : null,
    csp: csp ? decode(csp[1]) : null,
  };
}

// The sources of one CSP directive, or null when the policy has no such
// directive.
function directive(policy, name) {
  const match = new RegExp(`(?:^|;)\\s*${name}\\s+([^;]*)`, "i").exec(policy || "");
  return match ? match[1].trim().split(/\s+/) : null;
}

// A redirect source with a sample value in place of each path parameter
// (:hash matches one segment), so the rule can be requested.
const sample = (source) => source.replace(/:[A-Za-z0-9_]+/g, "sample");

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

  let home = null;
  for (const route of ROUTES) {
    const answer = await get(route.path);
    if (route.path === "/") home = answer;
    const tags = head(answer.body);
    const label = route.path;
    expect(answer.status === 200, `${label} answers 200`, answered(answer));
    expect(tags.title === META[route.titleKey], `${label} title`, `"${tags.title}", expected "${META[route.titleKey]}"`);
    expect(tags.canonical === ORIGIN + route.path, `${label} canonical`, `${tags.canonical}, expected ${ORIGIN + route.path}`);
    expect(Boolean(tags.csp), `${label} Content-Security-Policy meta`, "missing");
  }

  {
    const answer = await get(NOT_FOUND.path);
    const tags = head(answer.body);
    expect(answer.status === 404, `${NOT_FOUND.path} answers 404`, answered(answer));
    expect(/\bnoindex\b/i.test(tags.robots || ""), `${NOT_FOUND.path} robots noindex`, `robots is ${tags.robots}`);
    expect(tags.title === META[NOT_FOUND.titleKey], `${NOT_FOUND.path} title`, `"${tags.title}", expected "${META[NOT_FOUND.titleKey]}"`);
  }

  {
    const answer = await get("/about/");
    const to = locationPath(answer.headers.get("location"));
    expect(answer.status === 308 && to === "/about", "/about/ redirects to /about (308)", `${answered(answer)} to ${to}`);
  }

  // The checks below are only as good as the rules they read from
  // vercel.json, so a rule that went missing is a failure, not fewer checks.
  expect(
    Boolean(RESUME_REDIRECT) && RESUME_REDIRECT.destination === RESUME_PDF,
    `vercel.json redirects /resume.pdf to ${RESUME_PDF}`,
    RESUME_REDIRECT ? `it goes to ${RESUME_REDIRECT.destination}` : "no such redirect"
  );
  expect(Boolean(SITE_HEADERS), "vercel.json sets headers on every path", "no /(.*) rule");

  for (const rule of REDIRECTS) {
    const from = sample(rule.source);
    const wanted = rule.permanent ? 308 : 307;
    const answer = await get(from);
    const to = locationPath(answer.headers.get("location"));
    expect(
      answer.status === wanted && to === rule.destination,
      `${from} redirects to ${rule.destination} (${wanted})`,
      `${answered(answer)} to ${to}`
    );
  }

  {
    const pdf = await request(RESUME_PDF, "HEAD");
    const type = pdf.headers.get("content-type") || "";
    expect(pdf.status === 200 && type.includes("application/pdf"), `${RESUME_PDF} is a PDF`, `${answered(pdf)}, ${type || "no content-type"}`);
  }

  if (SITE_HEADERS) {
    const answer = home || (await get("/"));
    for (const { key, value } of SITE_HEADERS.headers) {
      const actual = answer.headers.get(key);
      expect(actual === value, `header ${key}`, `${actual === null ? "missing" : `"${actual}"`}, expected "${value}"`);
    }
  }

  for (const script of VERCEL_SCRIPTS) {
    const answer = await request(script, "HEAD");
    const type = answer.headers.get("content-type") || "";
    expect(answer.status === 200 && /javascript/i.test(type), `${script} is served as JavaScript`, `${answered(answer)}, ${type || "no content-type"}`);
  }
  {
    const policy = home ? head(home.body).csp : null;
    for (const name of ["script-src", "connect-src"]) {
      const sources = directive(policy, name);
      expect(
        Boolean(sources) && sources.includes("'self'"),
        `Content-Security-Policy ${name} allows 'self' (Vercel's scripts and their beacons)`,
        sources ? sources.join(" ") : "directive missing"
      );
    }
  }

  console.log(`\n${checks} checks, ${failures.length} failed`);
  process.exitCode = failures.length ? 1 : 0;
}

main().catch((error) => {
  console.error(`production check aborted: ${(error && error.stack) || error}`);
  process.exitCode = 1;
});
