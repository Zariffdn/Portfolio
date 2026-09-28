/*
 * Reads public/Zariff-Danial-Resume.pdf the way an applicant tracking system
 * does (text layer only, top to bottom) and flags the usual parsing problems,
 * missing metadata and a missing structure tree. Run after build.js:
 *   node tools/resume/check.js
 *
 * Uses pdfjs-dist, which is already installed as a dependency of react-pdf.
 * Its legacy build is ESM only, so it is loaded with a dynamic import below.
 */
const fs = require("fs");
const path = require("path");

const pdfPath = path.resolve(__dirname, "../../public/Zariff-Danial-Resume.pdf");

// The section headings, in the order a parser expects to meet them.
const HEADINGS = ["Summary", "Experience", "Selected projects", "Skills", "Education", "Certifications"];

// Join text items into lines using glyph positions, adding a space only when
// the horizontal gap between two items is wide enough to be one.
function linesFromItems(items) {
  const lines = [];
  let line = null;
  for (const it of items) {
    if (!it.str) continue;
    const x = it.transform[4];
    const y = it.transform[5];
    const size = Math.abs(it.transform[0]) || Math.abs(it.transform[3]) || 9;
    if (!line || Math.abs(y - line.y) > size * 0.5) {
      line = { y, text: it.str, endX: x + it.width, size };
      lines.push(line);
    } else {
      const gap = x - line.endX;
      const needsSpace = gap > size * 0.18 && !line.text.endsWith(" ") && !it.str.startsWith(" ");
      line.text += (needsSpace ? " " : "") + it.str;
      line.endX = x + it.width;
    }
  }
  return lines.map((l) => l.text.replace(/\s+/g, " ").trim()).filter(Boolean);
}

(async () => {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data }).promise;
  const meta = await doc.getMetadata().catch(() => null);
  const info = (meta && meta.info) || {};
  const markInfo = await doc.getMarkInfo().catch(() => null);
  const pages = [];
  const links = [];
  let structured = true;
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    pages.push(linesFromItems(content.items));
    const annotations = await page.getAnnotations();
    for (const a of annotations) {
      if (a.subtype === "Link") links.push(a.url || a.unsafeUrl || "(internal link)");
    }
    const tree = await page.getStructTree().catch(() => null);
    if (!tree || !tree.children || tree.children.length === 0) structured = false;
  }
  const all = pages.flat().join("\n");

  console.log(`file: ${path.relative(process.cwd(), pdfPath)} (${(fs.statSync(pdfPath).size / 1024).toFixed(1)} KB)`);
  console.log(`pages: ${doc.numPages}`);
  console.log(`title: ${info.Title || "(none)"}`);
  console.log(`author: ${info.Author || "(none)"}`);
  console.log(`subject: ${info.Subject || "(none)"}`);
  console.log(`keywords: ${info.Keywords || "(none)"}`);
  console.log(`language: ${info.Language || "(none)"}`);
  console.log(`tagged: ${markInfo && markInfo.Marked ? "yes" : "no"}; structure tree on every page: ${structured ? "yes" : "no"}`);
  console.log(`links (${links.length}):`);
  for (const l of links) console.log("  " + l);
  console.log("");
  pages.forEach((lines, i) => {
    console.log(`----- page ${i + 1} (${lines.length} lines) -----`);
    for (const l of lines) console.log(l);
  });

  const problems = [];
  const warnings = [];
  if (doc.numPages > 2) problems.push(`${doc.numPages} pages; two is the ceiling, one is the target`);
  else if (doc.numPages === 2) warnings.push("2 pages; one is the target");
  if (!String(info.Title || "").trim()) problems.push("PDF Title is empty");
  if (!String(info.Author || "").trim()) problems.push("PDF Author is empty");
  if (!String(info.Language || "").trim()) problems.push("PDF has no document language");
  if (!markInfo || !markInfo.Marked) problems.push("PDF is not tagged (no MarkInfo Marked true)");
  if (!structured) problems.push("a page has no structure tree");
  if (/[–—]/.test(all)) problems.push("contains an em or en dash");
  const spaced = all.match(/\b(?:[A-Z] ){3,}[A-Z]\b/g);
  if (spaced) problems.push(`letter-spaced words extracted with gaps: ${[...new Set(spaced)].join(", ")}`);
  // Each heading on its own line, and in reading order.
  const lineList = pages.flat();
  let last = -1;
  for (const heading of HEADINGS) {
    const at = lineList.findIndex((l) => l.toLowerCase() === heading.toLowerCase());
    if (at === -1) problems.push(`section heading "${heading}" not found on its own line`);
    else if (at < last) problems.push(`section heading "${heading}" extracted out of order`);
    else last = at;
  }
  if (!/@/.test(all)) problems.push("no email address extracted");
  if (!/\b(19|20)\d{2}\b/.test(all)) problems.push("no years extracted");
  if (/\bReferences\b/i.test(all)) problems.push("has a References line (dated; remove)");
  const bullets = (all.match(/^•/gm) || []).length;
  console.log("");
  console.log(`bullets extracted as text: ${bullets}`);
  for (const w of warnings) console.log("WARNING: " + w);
  if (problems.length) {
    console.log("PROBLEMS:");
    for (const p of problems) console.log("  - " + p);
    process.exitCode = 1;
  } else {
    console.log("no parsing problems found");
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
