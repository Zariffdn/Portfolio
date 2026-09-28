/*
 * Renders the per-route link preview cards in public/og/ (1200x630 JPEG) with
 * headless Chrome: the case-study title, name and domain on the left and the
 * project's card art on the right, on the site's dark background. A card with
 * `phone` instead of `art` shows that screenshot in a phone frame instead.
 *
 * Usage:  node tools/og/build.cjs [--only=slug,slug]
 *
 * Colours are read from the :root block of src/styles/tokens.css (the dark
 * theme) and the fonts are the site's own, loaded from Google Fonts, so the
 * cards follow the design tokens. Needs playwright (a devDependency) and
 * network access for the fonts; it drives the installed Chrome (channel
 * "chrome"), falling back to Playwright's Chromium. The `image` entries in
 * routes.mjs point og:image for /bestinet, /silent-support and /baglock at
 * these files; every other route keeps public/og/home.jpg. Never use the bag
 * lock photo here: it is too small to upscale and the originals must stay
 * local. Only screenshots with no personal data on screen belong on a card.
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

const repo = path.resolve(__dirname, "../..");
const outDir = path.resolve(repo, "public/og");
const WIDTH = 1200;
const HEIGHT = 630;
const MAX_BYTES = 300 * 1024;

// Titles match each case study's h1 and eyebrow.
const CARDS = [
  {
    slug: "bestinet",
    eyebrow: "Case study · Company work",
    title: "TOTP authenticator",
    art: "src/Assets/Projects/bestinet.svg",
  },
  {
    slug: "silent-support",
    eyebrow: "Case study · Personal project",
    title: "Silent Support",
    // The check-in grid: no account, history or times on screen.
    phone: "src/Assets/featured/silent-1.webp",
  },
  {
    slug: "baglock",
    eyebrow: "Case study · Final year project",
    title: "Anti-theft fingerprint bag lock",
    art: "src/Assets/Projects/baglock.svg",
  },
];

const FONTS =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=block";

function darkTokens() {
  const css = fs.readFileSync(path.resolve(repo, "src/styles/tokens.css"), "utf8");
  const block = css.match(/:root\s*\{([^}]*)\}/);
  if (!block) throw new Error("no :root block in src/styles/tokens.css");
  return block[1];
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

// The right-hand panel: the card art, or a screenshot in a phone frame.
function artMarkup(card) {
  if (card.phone) {
    const shot = fs.readFileSync(path.resolve(repo, card.phone));
    const src = "data:image/webp;base64," + shot.toString("base64");
    return `<div class="art art--phone"><div class="phone"><img src="${src}" alt=""></div></div>`;
  }
  const svg = fs.readFileSync(path.resolve(repo, card.art));
  const art = "data:image/svg+xml;base64," + svg.toString("base64");
  return `<div class="art"><img src="${art}" alt=""></div>`;
}

function page(card, tokens) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>
:root {${tokens}}
* { box-sizing: border-box; margin: 0; }
html, body { width: ${WIDTH}px; height: ${HEIGHT}px; }
body {
  position: relative;
  overflow: hidden;
  background: var(--bg-0);
  color: var(--text-1);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}
.aurora {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, var(--accent-glow) 0%, rgba(155, 107, 255, 0) 62%);
  filter: blur(40px);
}
.aurora--main { width: 1400px; height: 700px; left: 150px; top: -420px; opacity: 0.6; }
.aurora--art { width: 760px; height: 560px; right: -160px; top: 60px; opacity: 0.5; }
.grain {
  position: absolute;
  inset: 0;
  opacity: 0.04;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 220px 220px;
}
.text {
  position: absolute;
  left: 72px;
  top: 64px;
  bottom: 64px;
  width: 560px;
  display: flex;
  flex-direction: column;
}
.wordmark {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 34px;
  letter-spacing: -0.04em;
  line-height: 1;
}
.wordmark span { color: var(--accent); margin-left: 1px; }
.middle { margin-top: auto; margin-bottom: auto; }
.eyebrow {
  display: flex;
  align-items: center;
  gap: 14px;
  font-family: var(--font-mono);
  font-size: 17px;
  font-weight: 500;
  letter-spacing: var(--track-eyebrow);
  text-transform: uppercase;
  color: var(--accent-text);
  line-height: 1;
}
.eyebrow::before {
  content: "";
  width: 24px;
  height: 1px;
  background: currentColor;
  opacity: 0.7;
}
h1 {
  margin-top: 26px;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 72px;
  line-height: var(--lh-tight);
  letter-spacing: var(--track-display);
  text-wrap: balance;
}
.byline { display: flex; flex-direction: column; gap: 10px; }
.name { font-size: 26px; font-weight: 600; line-height: 1.1; }
.domain { font-family: var(--font-mono); font-size: 18px; color: var(--text-2); line-height: 1; }
/* The art is drawn in the middle of a 1280x800 canvas; show that middle
   large in a square frame so it still reads in a small preview. */
.art {
  position: absolute;
  right: 64px;
  top: 50%;
  width: 460px;
  height: 460px;
  transform: translateY(-50%);
  border-radius: var(--r-xl);
  border: 1px solid var(--line-strong);
  background: radial-gradient(ellipse at 50% 110%, var(--accent-soft-2), transparent 70%), var(--bg-3);
  box-shadow: var(--shadow-glow);
  overflow: hidden;
}
.art > img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 768px;
  height: 480px;
  transform: translate(-50%, -50%);
}
/* A phone rising from the bottom of the panel, like the site's PhoneFrame. */
.art--phone .phone {
  position: absolute;
  left: 50%;
  top: 44px;
  width: 256px;
  transform: translateX(-50%);
  padding: 9px;
  border-radius: 42px;
  background: linear-gradient(160deg, #2a2338 0%, #0d0915 100%);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.09), 0 0 0 5px #06040b,
    0 30px 80px -30px var(--accent-glow);
}
.art--phone .phone img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 33px;
}
</style>
</head>
<body>
<div class="aurora aurora--main"></div>
<div class="aurora aurora--art"></div>
<div class="text">
  <div class="wordmark">ZD<span>.</span></div>
  <div class="middle">
    <div class="eyebrow">${esc(card.eyebrow)}</div>
    <h1>${esc(card.title)}</h1>
  </div>
  <div class="byline">
    <div class="name">Zariff Danial</div>
    <div class="domain">zariffdanial.vercel.app</div>
  </div>
</div>
${artMarkup(card)}
<div class="grain"></div>
</body>
</html>`;
}

(async () => {
  const tokens = darkTokens();
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium
    .launch({ channel: "chrome", headless: true })
    .catch(() => chromium.launch({ headless: true }));
  const tab = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  // --only=slug,slug renders just those cards and leaves the others alone.
  const only = process.argv
    .filter((arg) => arg.startsWith("--only="))
    .flatMap((arg) => arg.slice("--only=".length).split(","))
    .filter(Boolean);
  const unknown = only.filter((slug) => !CARDS.some((card) => card.slug === slug));
  if (unknown.length) throw new Error(`unknown card: ${unknown.join(", ")}`);
  const cards = only.length ? CARDS.filter((card) => only.includes(card.slug)) : CARDS;

  for (const card of cards) {
    await tab.setContent(page(card, tokens), { waitUntil: "networkidle" });
    await tab.evaluate(() => document.fonts.ready);
    // A card in a fallback font is worse than no card: stop instead.
    const missing = await tab.evaluate(() =>
      [
        '800 72px "Bricolage Grotesque"',
        '600 26px "Inter"',
        '500 17px "JetBrains Mono"',
      ].filter((font) => !document.fonts.check(font))
    );
    if (missing.length) {
      throw new Error(`fonts did not load (network?): ${missing.join(", ")}`);
    }
    const overflow = await tab.evaluate(() => {
      const text = document.querySelector(".text").getBoundingClientRect();
      const art = document.querySelector(".art").getBoundingClientRect();
      return text.right > art.left || document.body.scrollHeight > window.innerHeight;
    });
    if (overflow) throw new Error(`${card.slug}: the text runs into the art or off the card`);

    const file = path.resolve(outDir, `${card.slug}.jpg`);
    await tab.screenshot({
      path: file,
      type: "jpeg",
      quality: 90,
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    });
    const bytes = fs.statSync(file).size;
    if (bytes > MAX_BYTES) {
      throw new Error(`${card.slug}.jpg is ${(bytes / 1024).toFixed(0)} KB; keep it under 300 KB`);
    }
    console.log(`wrote ${path.relative(process.cwd(), file)} (${(bytes / 1024).toFixed(1)} KB)`);
  }

  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
