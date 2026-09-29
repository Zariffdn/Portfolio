// External link check.
//
// Collects every http(s) URL written in src/, index.html and
// tools/resume/resume.html (the copy, the data modules, the structured data,
// the resume) and requests each one the way a browser would: HEAD first, then
// GET when HEAD is refused or fails, with a desktop Chrome user agent and a
// 25 s timeout, following redirects.
//
// Fails on a 404 or 410, on a 5xx seen on two attempts, and on a host that
// does not resolve twice. Everything else that is not a 2xx is reported
// without failing: 401, 403 and 429 are usually bot protection on news and
// certificate sites, and a timeout says more about the network than the
// link. LinkedIn answers 999 to anything it thinks is a bot, which counts as
// fine.
//
// Skipped: XML namespaces and schema identifiers (not links), preconnect and
// dns-prefetch origins, and anything built from a template. The Formspree
// form behind the contact form is not requested at all: its GET answer says
// nothing, and a POST to the live form is not something a scheduled job
// should send. Send a real test message by hand instead.
//
//   node tools/qa/links.mjs            check everything
//   node tools/qa/links.mjs --list     print the URLs and where each is used, without requesting
//
// Node 22 or newer (global fetch). Run weekly by .github/workflows/weekly.yml.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

const SOURCES = ["src", "index.html", "tools/resume/resume.html"];
const TEXT_FILES = /\.(jsx?|mjs|json|css|html)$/i;

const TIMEOUT_MS = 25000;
const RETRY_DELAY_MS = 5000;
const CONCURRENCY = 6;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
const HEADERS = {
  "user-agent": USER_AGENT,
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "accept-language": "en-GB,en;q=0.9,ms;q=0.8",
};

// Identifiers that look like URLs but are never fetched.
const NOT_LINKS = [
  /^https?:\/\/www\.w3\.org\//i,
  /^https?:\/\/www\.sitemaps\.org\/schemas\//i,
  /^https?:\/\/schema\.org\/?$/i,
];

const args = new Set(process.argv.slice(2));

// A SOURCES entry that has gone missing is a mistake in this script, not a
// site with fewer links, so it stops the run rather than shrinking it.
function walk(entry) {
  const full = path.join(ROOT, entry);
  if (!fs.existsSync(full)) throw new Error(`${entry} does not exist; update SOURCES in tools/qa/links.mjs`);
  if (fs.statSync(full).isFile()) return [entry];
  return fs
    .readdirSync(full, { withFileTypes: true })
    .flatMap((child) => {
      const rel = `${entry}/${child.name}`;
      if (child.isDirectory()) return walk(rel);
      return TEXT_FILES.test(child.name) ? [rel] : [];
    });
}

// Drops trailing characters that end a sentence or a code token rather than
// the URL: punctuation, and a ")" with no "(" of its own in the URL.
function trim(url) {
  const count = (text, char) => text.split(char).length - 1;
  let out = url;
  for (;;) {
    if (/[.,;:!?'"`\]]$/.test(out)) out = out.slice(0, -1);
    else if (out.endsWith(")") && count(out, ")") > count(out, "(")) out = out.slice(0, -1);
    else return out;
  }
}

// url -> ["file:line", ...]
function collect() {
  const found = new Map();
  for (const file of SOURCES.flatMap(walk)) {
    let text = fs.readFileSync(path.join(ROOT, file), "utf8");
    // A preconnect names an origin to warm up, not a page.
    text = text.replace(/<link\b[^>]*\brel="(?:preconnect|dns-prefetch)"[^>]*>/gi, (tag) =>
      tag.replace(/https?:\/\//g, "")
    );
    text.split("\n").forEach((line, index) => {
      for (const match of line.matchAll(/https?:\/\/[^\s"'`<>\\{}|^]+/g)) {
        const raw = trim(match[0].replace(/&amp;/g, "&"));
        if (raw.includes("${") || NOT_LINKS.some((pattern) => pattern.test(raw))) continue;
        // One request per document: the fragment (a JSON-LD @id, an anchor)
        // never reaches the server, and the bare origin gains its "/".
        let url;
        try {
          const parsed = new URL(raw);
          parsed.hash = "";
          url = parsed.href;
        } catch {
          continue;
        }
        if (!found.has(url)) found.set(url, []);
        found.get(url).push(`${file}:${index + 1}`);
      }
    });
  }
  return found;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// One request. Returns { status } or { error }.
async function request(url, method, extra = {}) {
  try {
    const response = await fetch(url, {
      method,
      headers: { ...HEADERS, ...extra.headers },
      body: extra.body,
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    // Nothing needs the body; release the connection.
    if (response.body) await response.body.cancel().catch(() => {});
    return { status: response.status, finalUrl: response.url };
  } catch (error) {
    const cause = error && error.cause;
    const code = (cause && (cause.code || cause.name)) || (error && error.name) || "error";
    return { error: String(code) };
  }
}

// The contact form posts to a Formspree form; see the note at the top.
function isFormspreeForm(url) {
  const { hostname, pathname } = new URL(url);
  return hostname === "formspree.io" && pathname.startsWith("/f/");
}


// HEAD, then GET when HEAD is not a clean answer: plenty of servers refuse
// or mishandle HEAD.
async function probe(url) {
  if (isFormspreeForm(url)) return { status: 200, note: "contact form, not requested" };
  const head = await request(url, "HEAD");
  if (head.status && head.status < 400) return head;
  if (head.status === 999) return head;
  return request(url, "GET");
}

const isOk = (result) => (result.status >= 200 && result.status < 400) || result.status === 999;
const isServerError = (result) => result.status >= 500 && result.status !== 999;
const isDns = (result) => /ENOTFOUND|EAI_AGAIN/i.test(result.error || "");

// ok | fail | warn, with what was seen.
async function check(url) {
  const first = await probe(url);
  if (isOk(first)) return { verdict: "ok", seen: [first] };
  if (first.status === 404 || first.status === 410) return { verdict: "fail", seen: [first] };
  if (isServerError(first) || first.error) {
    await sleep(RETRY_DELAY_MS);
    const second = await probe(url);
    const seen = [first, second];
    if (isOk(second)) return { verdict: "ok", seen };
    if (second.status === 404 || second.status === 410) return { verdict: "fail", seen };
    if (isServerError(first) && isServerError(second)) return { verdict: "fail", seen };
    if (isDns(first) && isDns(second)) return { verdict: "fail", seen };
    return { verdict: "warn", seen };
  }
  return { verdict: "warn", seen: [first] };
}

const describe = (result) => result.error || result.note || String(result.status);

async function main() {
  const found = collect();
  const urls = [...found.keys()].sort();

  if (args.has("--list")) {
    for (const url of urls) console.log(`${url}\n    ${found.get(url).join(", ")}`);
    console.log(`\n${urls.length} external URLs`);
    return;
  }

  // The site links out to dozens of places; collecting none means the
  // pattern or the sources broke, and a run that checked nothing must not
  // pass.
  if (!urls.length) throw new Error(`no external URLs found in ${SOURCES.join(", ")}`);

  console.log(`Checking ${urls.length} external URLs from ${SOURCES.join(", ")}`);
  const results = new Map();
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < urls.length) {
        const url = urls[next++];
        const result = await check(url);
        results.set(url, result);
        const label = result.verdict === "ok" ? "ok  " : result.verdict.toUpperCase();
        console.log(`${label} ${result.seen.map(describe).join(" then ").padEnd(14)} ${url}`);
      }
    })
  );

  const failed = urls.filter((url) => results.get(url).verdict === "fail");
  const warned = urls.filter((url) => results.get(url).verdict === "warn");
  const report = (list, heading) => {
    if (!list.length) return;
    console.log(`\n${heading}:`);
    for (const url of list) {
      console.log(`  ${results.get(url).seen.map(describe).join(" then ")}  ${url}`);
      console.log(`      used in ${found.get(url).join(", ")}`);
    }
  };
  report(failed, "Broken (failing the run)");
  report(warned, "Could not confirm (reported, not failing)");
  console.log(`\n${urls.length} URLs: ${urls.length - failed.length - warned.length} ok, ${warned.length} unconfirmed, ${failed.length} broken`);
  process.exitCode = failed.length ? 1 : 0;
}

main().catch((error) => {
  console.error(`link check aborted: ${(error && error.stack) || error}`);
  process.exitCode = 1;
});
