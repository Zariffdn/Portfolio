# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio for Zariff Danial, built with Create React App (react-scripts 5, React 17) and deployed to Vercel at https://zariffdanial.vercel.app/. All content lives in the locale files and a few data modules; there is no CMS. The design system is documented in [docs/DESIGN.md](docs/DESIGN.md).

## Commands

- `npm install` — install dependencies
- `npm start` — dev server on http://localhost:3000 (hot reload)
- `npm run build` — production build to `build/`. Vercel builds with `CI=true`, which turns ESLint warnings into errors, so run `CI=true npm run build` before pushing.
- `npm test` — Jest watch mode. `CI=true npm test -- --watchAll=false` runs once. [src/App.test.js](src/App.test.js) renders the whole app; jsdom shims for `matchMedia`, `IntersectionObserver` and `scrollTo` live in [src/setupTests.js](src/setupTests.js).

There is no lint script; ESLint runs implicitly via `react-scripts` using the `react-app` config in [package.json](package.json).

## Architecture

Single-page React 17 app with `react-router-dom` v6. Entry: [src/index.js](src/index.js) → [src/App.js](src/App.js), which lazy-loads each route inside `<main id="main">`, mounts the shared chrome, and gates a 0.7s wordmark preloader.

Routes:
- `/` — [Home.js](src/components/Home/Home.js): hero (MyTax phone composition), selected work, about teaser with stats, CTA band
- `/about` — [About.js](src/components/About/About.js) composes twelve self-contained sections in a fixed order; each renders its own `<Section>` and heading
- `/project` — [Projects.js](src/components/Projects/Projects.js): segmented filter plus a grid of `ProjectCard`
- `/resume` — [ResumeNew.js](src/components/Resume/ResumeNew.js) renders the PDF in [src/Assets/](src/Assets/) via `react-pdf`; the worker URL is pinned to the installed pdfjs version
- `/uses` — [Uses.js](src/components/Uses.js)
- `/mytax` — [MyTaxCaseStudy.js](src/components/MyTaxCaseStudy.js), English only
- anything else — [NotFound.js](src/components/NotFound.js)

Shared chrome in [src/components/](src/components/): `Navbar.js` (desktop links, full-screen mobile menu, theme and language toggles), `Footer.js`, `SocialSidebar.js`, `ScrollProgress.js`, `BackToTop.js`, `CustomCursor.js`, `ToastContainer.js`, `KonamiEgg.js`, `ScrollToTop.js` (also resolves `#hash` targets on lazy routes), and [ui/Backdrop.js](src/components/ui/Backdrop.js) (fixed aurora + film grain behind every page).

Primitives in [src/components/ui/](src/components/ui/): `Container`, `Section`, `SectionHeading`, `Button`, `Chip`, `Reveal` / `Stagger` / `StaggerItem` (framer-motion scroll reveals), `PhoneFrame`, `Wordmark`. Import them from `"../ui"`. Shared components: [StoreLinks.js](src/components/StoreLinks.js) (App Store / Google Play / AppGallery buttons with install counts), [Projects/ProjectCard.js](src/components/Projects/ProjectCard.js) (used by both Home and Projects) and [StatTile.js](src/components/StatTile.js) (`StatGrid` + `StatTile`, used by Home and About).

Data modules in [src/data/](src/data/): `projects.js` (the project list; copy keys are `projects.<id>_title` and `projects.<id>_desc`), `mytax.js` (screenshots, store links, press), `stats.js`. Hooks in [src/hooks/](src/hooks/): `useCountUp`, `useInViewOnce`, `usePageMeta` (title, description, per-route canonical and og:url, optional `noindex`). Utilities in [src/utils/](src/utils/): `formatMonth(iso, lang)` renders `YYYY-MM` dates in the active language.

Contexts: `ThemeContext` (dark by default, persisted in localStorage `theme`, also applied before first paint by an inline script in [public/index.html](public/index.html)) and `ToastContext`.

i18n: `react-i18next` with [en.json](src/i18n/locales/en.json) and [ms.json](src/i18n/locales/ms.json). The two files must keep key parity, and every visible string goes through `t()`.

## Styling

No Bootstrap and no `!important` anywhere. Components read design tokens only.
- [tokens.css](src/styles/tokens.css) — every colour, type, spacing, radius, shadow, motion and z-index token; dark values on `:root`, light values under `html[data-theme="light"]`
- [base.css](src/styles/base.css) — reset, typography, focus rings, scrollbar, reduced motion, and the shared classes (`.container`, `.section`, `.eyebrow`, `.section-head`, `.btn`, `.chip`, `.surface`, `.prose`, `.meta-list`, `.phone`, `.wordmark`, `.site-backdrop`)
- [chrome.css](src/styles/chrome.css) — navbar, mobile menu, footer and the fixed elements
- One stylesheet per route (`home.css`, `about.css`, `about-sections.css`, `projects.css`, `resume.css`, `uses.css`, `casestudy.css`, `notfound.css`) plus `project-card.css`, `store-links.css` and `stat-tile.css`, each imported by the component that uses it so it code-splits with the route. Home is imported statically in `App.js` (it is the landing route); the others are lazy.

`src/index.css` loads tokens and base; `src/style.css` loads chrome. Fonts (Bricolage Grotesque for display, Inter for body, JetBrains Mono for labels) come from Google Fonts via `public/index.html`.

## Content edits

- Copy: edit both locale files. Never use em or en dashes in copy; the owner treats them as a tell. Page titles and descriptions live under `meta.*`; store button labels under `store.*`.
- Projects: [src/data/projects.js](src/data/projects.js) plus the two copy keys per project; card art goes in `src/Assets/Projects/`
- Experience, education, FAQ: locale files under `experience.*`, `education.*`, `faq.*`; the components only list keys
- Certifications and testimonials: the arrays at the top of [Certifications.js](src/components/About/Certifications.js) and [Testimonials.js](src/components/About/Testimonials.js) (dates as `YYYY-MM`); press mentions: `press` in `data/mytax.js`
- Skills and tools: [Stack.js](src/components/About/Stack.js). Hardware and daily tools: [Uses.js](src/components/Uses.js), with notes localised under `uses.notes.*`
- Headline stats: [src/data/stats.js](src/data/stats.js)
- Resume: edit [tools/resume/resume.html](tools/resume/resume.html) (single column, real text, no letter-spacing, dates as "Mon YYYY to Mon YYYY"), then `node tools/resume/build.js` to regenerate `src/Assets/Zariff-Danial-Resume.pdf` and `node tools/resume/check.js` to confirm it still parses in reading order on one page. The build needs `playwright` (uses the installed Chrome) and `pdf-lib`, neither a project dependency; install them ad hoc or via NODE_PATH. Bump `resume.lastUpdated` in both locale files.

Assets are imported as ES modules so CRA fingerprints them at build time; never reference them by URL string. The MyTax screenshots have 300px variants (`pic N-300.jpeg`) that `PhoneFrame` picks up through `srcSetFor()` in `data/mytax.js`; regenerate both sizes if a screenshot changes. App icons (`public/icon-*.png`, `apple-touch-icon.png`, `favicon-32.png`) are rendered from the wordmark; `public/preview.jpg` is the Open Graph image, a 2400x1260 capture of the home hero.
