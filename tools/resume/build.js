/*
 * Renders tools/resume/resume.html to public/Zariff-Danial-Resume.pdf with
 * headless Chrome, fills in the PDF metadata with pdf-lib, and writes
 * tools/resume/preview.png for a quick look. The PDF lives in public/ so it
 * keeps one stable URL, /Zariff-Danial-Resume.pdf, across every rebuild.
 *
 * Usage:  node tools/resume/build.js
 *
 * Needs playwright and pdf-lib, both devDependencies (npm install). It drives
 * the Chrome already on the machine (channel "chrome"), so no browser
 * download is needed. The PDF is tagged (a structure tree built from the
 * HTML, so screen readers and parsers get headings, lists and links) and has
 * a bookmark outline built from the headings.
 */
const path = require("path");
const fs = require("fs");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch (e) {
  console.error("playwright is not installed. Run: npm install");
  process.exit(1);
}

// Metadata is not optional: Chrome leaves Author, Subject, Keywords and the
// document language empty, and recruiters and applicant tracking systems
// read them. Stop here rather than ship a PDF without them.
let PDFDocument;
try {
  ({ PDFDocument } = require("pdf-lib"));
} catch (e) {
  console.error("pdf-lib is not installed. Run: npm install");
  process.exit(1);
}

const here = __dirname;
const htmlPath = path.resolve(here, "resume.html");
const pdfPath = path.resolve(here, "../../public/Zariff-Danial-Resume.pdf");
const previewPath = path.resolve(here, "preview.png");

const META = {
  title: "Zariff Danial, Mobile Developer (Flutter and Dart)",
  author: "Zariff Danial",
  subject: "Resume of Zariff Danial, a Flutter and Dart mobile developer in Klang, Selangor, Malaysia",
  keywords: [
    "Zariff Danial",
    "resume",
    "Flutter",
    "Dart",
    "mobile developer",
    "Flutter developer",
    "iOS",
    "Android",
    "Huawei HMS",
    "Firebase Cloud Messaging",
    "MyTax",
    "LHDN",
    "Selangor",
    "Malaysia",
  ],
  language: "en",
};

(async () => {
  const browser = await chromium
    .launch({ channel: "chrome", headless: true })
    .catch(() => chromium.launch({ headless: true }));
  const page = await browser.newPage();
  await page.goto("file://" + htmlPath, { waitUntil: "load" });
  // Web fonts must be in before the PDF is rasterised, or Chrome falls back.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);

  await page.emulateMedia({ media: "print" });
  const raw = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    tagged: true,
    outline: true,
  });

  // Preview at A4 width (96 dpi) so layout can be eyeballed without a PDF viewer.
  await page.emulateMedia({ media: "screen" });
  await page.setViewportSize({ width: 794, height: 1123 });
  const height = await page.evaluate(() => document.body.scrollHeight);
  await page.screenshot({ path: previewPath, fullPage: true });
  await browser.close();

  const doc = await PDFDocument.load(raw);
  doc.setTitle(META.title, { showInWindowTitleBar: true });
  doc.setAuthor(META.author);
  doc.setSubject(META.subject);
  // pdf-lib joins an array with spaces, which runs multi-word keywords together.
  doc.setKeywords([META.keywords.join(", ")]);
  doc.setLanguage(META.language);
  doc.setProducer("tools/resume/build.js");
  doc.setCreator("tools/resume/resume.html");
  fs.writeFileSync(pdfPath, await doc.save());

  const bytes = fs.statSync(pdfPath).size;
  console.log(`wrote ${path.relative(process.cwd(), pdfPath)} (${(bytes / 1024).toFixed(1)} KB, ${doc.getPageCount()} page${doc.getPageCount() === 1 ? "" : "s"})`);
  console.log(`content height ${height}px of 1123px per A4 page (${(height / 1123).toFixed(2)} pages)`);
  console.log(`preview: ${path.relative(process.cwd(), previewPath)}`);
  if (doc.getPageCount() > 1) console.warn(`WARNING: ${doc.getPageCount()} pages; one is the target`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
