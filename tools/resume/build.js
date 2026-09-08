/*
 * Renders tools/resume/resume.html to src/Assets/Zariff-Danial-Resume.pdf
 * with headless Chrome, and writes tools/resume/preview.png for a quick look.
 *
 * Usage:  node tools/resume/build.js
 *
 * Needs the playwright package (not a project dependency), and optionally
 * pdf-lib for the metadata step. Either
 *   npm i -D playwright pdf-lib
 * or point NODE_PATH at a folder that has them installed. It drives the Chrome
 * already on the machine (channel "chrome"), so no browser download is needed.
 */
const path = require("path");
const fs = require("fs");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch (e) {
  console.error("playwright is not installed. Run: npm i -D playwright");
  process.exit(1);
}

const here = __dirname;
const htmlPath = path.resolve(here, "resume.html");
const pdfPath = path.resolve(here, "../../src/Assets/Zariff-Danial-Resume.pdf");
const previewPath = path.resolve(here, "preview.png");

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
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  // Preview at A4 width (96 dpi) so layout can be eyeballed without a PDF viewer.
  await page.emulateMedia({ media: "screen" });
  await page.setViewportSize({ width: 794, height: 1123 });
  const height = await page.evaluate(() => document.body.scrollHeight);
  await page.screenshot({ path: previewPath, fullPage: true });
  await browser.close();

  // Chrome leaves the PDF metadata empty; recruiters and parsers read it.
  try {
    const { PDFDocument } = require("pdf-lib");
    const doc = await PDFDocument.load(fs.readFileSync(pdfPath));
    doc.setTitle("Zariff Danial, Mobile Developer (Flutter and Dart)");
    doc.setAuthor("Zariff Danial");
    doc.setSubject("Resume");
    doc.setKeywords(["Flutter", "Dart", "mobile developer", "iOS", "Android", "Huawei HMS", "Malaysia"]);
    doc.setProducer("tools/resume/build.js");
    doc.setCreator("tools/resume/resume.html");
    fs.writeFileSync(pdfPath, await doc.save());
  } catch (e) {
    console.warn("pdf-lib not installed; metadata left as Chrome wrote it (npm i -D pdf-lib to set it)");
  }

  const bytes = fs.statSync(pdfPath).size;
  console.log(`wrote ${path.relative(process.cwd(), pdfPath)} (${(bytes / 1024).toFixed(1)} KB)`);
  console.log(`content height ${height}px of 1123px per A4 page (${(height / 1123).toFixed(2)} pages)`);
  console.log(`preview: ${path.relative(process.cwd(), previewPath)}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
