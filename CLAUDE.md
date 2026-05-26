# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site built with Create React App (react-scripts 5), deployed to Vercel at https://portfolioo-beta.vercel.app/. Owner-facing content (about, projects, resume) lives in JSX — there is no CMS or data layer.

## Commands

- `npm install` — install dependencies
- `npm start` — dev server on http://localhost:3000 (hot reload)
- `npm run build` — production build to `build/`
- `npm test` — Jest watch mode via react-scripts. Run a single test: `npm test -- --testPathPattern=<file>` or press `p` in watch mode.

There is no lint script; ESLint runs implicitly via `react-scripts` using the `react-app` config in [package.json](package.json).

## Architecture

Single-page React 17 app with `react-router-dom` v6 client-side routing. Entry: [src/index.js](src/index.js) → [src/App.js](src/App.js), which wires four top-level routes (`/`, `/about`, `/project`, `/resume`) inside a `<Router>` and falls back unknown paths to `/`. A 1.2s timer in `App.js` gates the `Preloader` overlay before revealing the app.

Each route is one folder under [src/components/](src/components/):
- [Home/](src/components/Home/) — `Home.js` composes `Home2.js` and `Type.js` (typewriter intro)
- [About/](src/components/About/) — `About.js` composes `AboutCard`, `Techstack`, `Toolstack`, `Github` (GitHub contribution calendar via `react-github-calendar`)
- [Projects/Projects.js](src/components/Projects/Projects.js) — hard-codes the project list inline, passing image imports + metadata to [ProjectCards.js](src/components/Projects/ProjectCards.js). Adding a project means editing this file directly.
- [Resume/ResumeNew.js](src/components/Resume/ResumeNew.js) — renders [src/Assets/ZARIFF DANIAL RESUME .pdf](src/Assets/) via `react-pdf`. The pdf.js worker is loaded from a CDN URL pinned to the installed `pdfjs` version (see top of file).

Shared chrome: [Navbar.js](src/components/Navbar.js), [Footer.js](src/components/Footer.js), [ScrollToTop.js](src/components/ScrollToTop.js) (scrolls to top on route change), and [Particle.js](src/components/Particle.js) (tsparticles background reused across pages).

Styling: global [src/style.css](src/style.css) + [src/App.css](src/App.css) + Bootstrap 5 via `react-bootstrap`. The `purple` class and CSS variables in `style.css` drive the accent color used throughout.

Assets (images, resume PDF) are imported as ES modules from [src/Assets/](src/Assets/) so CRA fingerprints them at build time — don't reference them by URL string.

## Content edits

To update portfolio content, edit the JSX directly. There is no config file:
- Projects: [src/components/Projects/Projects.js](src/components/Projects/Projects.js)
- Tech/tool icons: `Techstack.js` and `Toolstack.js` in [About/](src/components/About/) (uses `react-icons`)
- Resume PDF: replace the file in `src/Assets/` and update the import path in [ResumeNew.js](src/components/Resume/ResumeNew.js)
- Bio/intro text: [Home2.js](src/components/Home/Home2.js), [Type.js](src/components/Home/Type.js), [AboutCard.js](src/components/About/AboutCard.js)
