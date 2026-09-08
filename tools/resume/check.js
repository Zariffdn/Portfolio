/*
 * Reads src/Assets/Zariff-Danial-Resume.pdf the way an applicant tracking
 * system does (text layer only, top to bottom) and flags the usual parsing
 * problems. Run after build.js:  node tools/resume/check.js
 *
 * Uses pdfjs-dist, which is already installed as a dependency of react-pdf.
 */
const fs = require("fs");
const path = require("path");
const pdfjs = require("pdfjs-dist/legacy/build/pdf.js");

const pdfPath = path.resolve(__dirname, "../../src/Assets/Zariff-Danial-Resume.pdf");

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
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data }).promise;
  const meta = await doc.getMetadata().catch(() => null);
  const pages = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    pages.push(linesFromItems(content.items));
  }
  const all = pages.flat().join("\n");

  console.log(`file: ${path.relative(process.cwd(), pdfPath)} (${(fs.statSync(pdfPath).size / 1024).toFixed(1)} KB)`);
  console.log(`pages: ${doc.numPages}`);
  if (meta && meta.info) console.log(`title: ${meta.info.Title || "(none)"}  author: ${meta.info.Author || "(none)"}`);
  console.log("");
  pages.forEach((lines, i) => {
    console.log(`----- page ${i + 1} (${lines.length} lines) -----`);
    for (const l of lines) console.log(l);
  });

  const problems = [];
  if (doc.numPages > 2) problems.push(`${doc.numPages} pages; two is the ceiling, one is the target`);
  if (/[–—]/.test(all)) problems.push("contains an em or en dash");
  const spaced = all.match(/\b(?:[A-Z] ){3,}[A-Z]\b/g);
  if (spaced) problems.push(`letter-spaced words extracted with gaps: ${[...new Set(spaced)].join(", ")}`);
  for (const heading of ["Summary", "Experience", "Skills", "Education"]) {
    if (!new RegExp(`^${heading}$`, "im").test(all)) problems.push(`section heading "${heading}" not found on its own line`);
  }
  if (!/@/.test(all)) problems.push("no email address extracted");
  if (!/\b(19|20)\d{2}\b/.test(all)) problems.push("no years extracted");
  if (/\bReferences\b/i.test(all)) problems.push("has a References line (dated; remove)");
  const bullets = (all.match(/^•/gm) || []).length;
  console.log("");
  console.log(`bullets extracted as text: ${bullets}`);
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
