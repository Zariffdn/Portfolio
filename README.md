# Zariff Danial, portfolio

Live at [zariffdanial.vercel.app](https://zariffdanial.vercel.app/).

A personal site for a Flutter developer: the MyTax case study, a second case study on the Bestinet TOTP work, selected projects, a one-page resume, and an about page with experience, education, certifications and a contact form. Dark and light themes, English and Bahasa Malaysia.

## Stack

- React 19 with Vite 8
- react-router-dom 7, react-i18next, framer-motion
- react-pdf for the resume page
- A token-based design system in plain CSS (`src/styles/tokens.css`, no CSS framework)
- Vitest for tests, ESLint 10 for lint, Playwright plus axe-core for the browser quality sweep
- Deployed on Vercel

## Running it

```
npm install
npm run dev        # http://localhost:3000
npm run build      # production build to dist/
npm run preview    # serve dist/ locally
npm run lint
npm test
npm run qa         # build first; screenshots every route in both themes, both viewports and both languages, then runs axe
```

Node 22 or newer.

## Where things live

- Copy: `src/i18n/locales/en.json` and `ms.json` (keep the two in sync)
- Projects: `src/data/projects.js`; screenshots and store links: `src/data/screenshots.js`, `src/data/mytax.js`
- Design contract: `docs/DESIGN.md`; architecture notes for tooling: `CLAUDE.md`
- Resume source: `tools/resume/resume.html`, rebuilt to PDF with `node tools/resume/build.js`

## Credit

The design direction, the content and the decisions are mine. Much of the code was written with Claude Code as a pair programmer, which the co-author lines in the commit history record. If you fork it, a link back to [Zariffdn/Portfolio](https://github.com/Zariffdn/Portfolio) is appreciated.
