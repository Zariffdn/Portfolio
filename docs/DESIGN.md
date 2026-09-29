# Design system

The portfolio follows one direction: **product-first editorial dark**. It leads with the product (MyTax and real screenshots), uses one accent sparingly, and lets typography and whitespace do the work. Anything that reads as a template (stock illustrations, particle backgrounds, two-tone headings, glowing card borders) is out.

## Principles, in priority order

1. **Lead with the strongest fact.** Real screenshots and real numbers, not placeholders.
2. **Restraint reads as premium.** One violet accent, used only for interactive states, eyebrows, and at most one highlight per section. Surfaces are layered near-blacks. Hairlines over drop shadows. No glow on cards.
3. **Type carries the design.** Large display sizes, tight tracking, real weights. Mono eyebrows and labels are the signature. Left-aligned by default; never justified.
4. **Whitespace is a feature.** Sections breathe (`--section-y`). Fewer boxes; when something must be a box it uses `.surface`.
5. **Motion with intent.** One reveal per block, staggered lists, a 4px lift on hover. Nothing loops except the tiny availability pulse. `prefers-reduced-motion` is honoured globally.
6. **Both themes, both languages, every viewport.** Only tokens are used, so light theme is never an afterthought. Bahasa Malaysia strings run longer; check them.

## Tokens (`src/styles/tokens.css`)

- Surfaces `--bg-0` (page) to `--bg-3` and `--bg-elev`; hairlines `--line`, `--line-strong`
- Text `--text-1` / `--text-2` / `--text-3`, `--text-inverse`
- Accent `--accent`, `--accent-strong`, `--accent-deep`, `--accent-text` (for accent-coloured copy), `--accent-soft`, `--accent-soft-2`, `--accent-glow`
- Status `--ok`, `--ok-text` (green copy on a surface; each theme sets its own shade), `--ok-soft`, `--ok-line`, `--danger`
- Type `--font-display` (Bricolage Grotesque), `--font-body` (Inter), `--font-mono` (JetBrains Mono); fluid sizes `--fs-display`, `--fs-h1` to `--fs-h3`, `--fs-lead`, `--fs-body`, `--fs-small`, `--fs-xs`, `--fs-eyebrow`, `--fs-stat`; line heights `--lh-tight` (display), `--lh-snug` (headings), `--lh-body`; tracking `--track-display`, `--track-heading`, `--track-eyebrow`
- Space `--s-1` (4px) to `--s-24`, `--section-y`, `--container`, `--container-narrow`, `--gutter`
- Radii `--r-sm` to `--r-xl`, `--r-full`; shadows `--shadow-1`, `--shadow-2`, `--shadow-glow` (hero-level objects only)
- Motion `--ease-out`, `--ease-spring`, `--dur-fast`, `--dur`, `--dur-slow`; chrome `--nav-h`, `--nav-bg`, z-index scale

Dark values live on `:root`; `html[data-theme="light"]` redefines the same names, and `@media print` in base.css redefines them once more with the light values so paper is never dark. Components never branch on theme.

## Primitives

CSS classes in `src/styles/base.css`:
`.container` (+ `--narrow`), `.section` (+ `--alt`, `--tight`, `--hairline`, `--flush-top`), `.eyebrow` (+ `--plain`), `.section-head` (+ `--center`, `--row`), `.display`, `.h1` to `.h3`, `.lead`, `.small`, `.btn` (+ `--primary`, `--accent`, `--ghost`, `--soft`, `--sm`, `--lg`, `--icon`), `.link-arrow`, `.chip` (+ `--accent`, `--ok`), `.chip-row`, `.surface` (+ `--interactive`, `--raised`), `.prose`, `.meta-list`, `.hr`, `.phone` (+ `--sm`), `.wordmark`, `.site-backdrop`, `.skip-link`, `.fatal` (the `RootErrorBoundary` fallback, which may lean on nothing but the tokens and this file), `.text-1`, `.text-2`, `.text-3`, `.accent`, `.mono`, `.tabular`, `.balance`, `.sr-only`.

React components in `src/components/ui/`:
`Container` (`narrow`), `Section` (`tone="alt"`, `hairline`, `tight`, `flushTop`, `as`), `SectionHeading` (eyebrow + title + lead, optional `aside`, `align="center"`, `as` for the heading level), `Button` (renders Link / anchor / button by props; `variant`, `size`, `icon`, `iconPosition`, `iconArrow`, `external`), `Chip` (`tone`, `icon`), `Reveal` / `Stagger` / `StaggerItem`, `PhoneFrame` (bezel around a 589x1280 screenshot; `size="sm"`, `sizes`, and `priority` for the one shot above the fold, which loads eagerly at high fetch priority while the rest load lazily), `Wordmark`, `Backdrop`.

Shared, outside `ui/`, fed by `src/data/` and the locale files:
- `StoreLinks`: store buttons with install-count chips; `compact` drops the chips and shortens the buttons, `lng="en"` pins the language on an English-only case study
- `Projects/ProjectCard`: `variant="default|wide"`, `clamp`, `priority` for the first card above the fold (passed on to its `PhoneFrame` or image); `coursework: "fyp" | "team"` in `projects.js` adds the university badge
- `StatTile` / `StatGrid`: the Home stats, four columns and two under 768px; the count-up numeral stays `aria-hidden` while a visually hidden span carries the final value
- `CtaBand`: the closing call to action on Home and /project (eyebrow, `h2`, lead, the contact button and the email); `resume` adds the Download CV button, `flushTop` drops the top padding
- `CaseStudy/`: `CaseStudyTop` (back link, plus the Malay English-only note), `Block` (numbered body block; `id` makes it a hash target), `Trace` (numbered stepper; `flag` of `fixed` or `defect`, or a plain `chip`), `CodeFigure` (code excerpt with a `caption`), `Moment` (headline line with a `label`), `ScreensBand` (scrolling screenshot row, a Tab stop only while it overflows) and `CaseStudyEnd` (contact line, Next case study card, back link); `BackLink` stays internal to the folder; the next-study chain is `caseStudies` in `studies.js`, wrapping from the last to the first

## Layout vocabulary

- Editorial two-column split: `minmax(0, 1.1fr) minmax(0, 0.9fr)`, gap `--s-12`, one column under 900px.
- Card grid: `repeat(auto-fill, minmax(min(320px, 100%), 1fr))`, gap `--s-6`; the `min()` lets a card shrink below 320px on a narrow or large-text viewport instead of overflowing. Cards are `.surface .surface--interactive`.
- Stat tiles: 4 columns desktop, 2 mobile; numeral in `--font-display` at `--fs-stat` weight 800, mono label beneath.
- List rows (certifications, FAQ, uses): full-width rows separated by `border-top: 1px solid var(--line)`, `padding-block: var(--s-5)`. Prefer rows over cards for lists of similar items.
- Timeline (experience, education): left rail, small accent dot per entry, mono period, `h3` role, `.text-3` meta, `.text-2` bullets.
- Section headings: single colour. Old locale keys are split into `Pre` / `Highlight` halves from the template era; render them as one plain string.

## Typography rules

- One `h1` per page. `.display` is used on the Home hero and on each case study hero `h1`; section and card titles never use it.
- Section titles are `h2` via `SectionHeading`; card and row titles are `h3`. Never skip levels.
- Body copy in `.prose` (68ch cap); supporting sentences as `.lead`.
- Labels, dates, categories, tags, counts: mono.

## Modes

The sweep covers both themes, both viewports and Bahasa Malaysia. These modes are handled in CSS alone and are easy to break without noticing.

- **Large text.** `@media (max-width: 20em)` in base.css, with matching rules in about-sections.css and casestudy.css. An em breakpoint follows the reader's default font size, not the page: 20em is 320px at 16px but 480px at 24px, the phone of someone who has turned text up. Under it `body` gets `overflow-wrap: anywhere`, headings hyphenate, `.meta-list` and the case study meta go to one column, and `.btn`, `.chip` and the certification pills wrap instead of widening the page. A new single-line control needs a rule here.
- **Print.** `@media print` in base.css: the light palette on `:root` whatever the theme, `--nav-h` at 0, the fixed chrome hidden (nav, menu, skip link, preloader, backdrop, social sidebar, back to top, scroll progress, toasts, Konami overlay, cursor, footer), sections tightened, no page break inside a figure, phone, stat tile, surface, trace step or compare row (a case study block may break, but its index stays with its heading), and the phone bezel drawn as a flat ring. `utils/printReveal.js` shows the blocks still waiting to reveal on scroll.
- **Forced colors.** `@media (forced-colors: active)` in chrome.css (burger bars in `CanvasText`, the current nav link underlined instead of the dot), projects.css (the filter pill in `Highlight` / `HighlightText`) and casestudy.css (the MyTax diagram in system colours). Windows contrast themes paint every background as Canvas, so anything conveyed only by a background colour needs a rule here.
- **Reduced motion.** Honoured globally in base.css; `utils/motion.js` exposes `prefersReducedMotion` and `scrollBehavior`, `useCountUp` jumps straight to the value, and the preloader never runs.

## Hard rules

- No Bootstrap. No `!important`. No `text-align: justify`. No centred body copy.
- No em dashes or en dashes in copy.
- Only tokens; never a raw hex or px that a token covers.
- Every visible string comes from `t()`, and `en.json` / `ms.json` keep key parity.
- Keep `usePageMeta`, `aria-*`, `rel="noopener noreferrer"` and `loading="lazy"` wherever they exist.
- Grids collapse cleanly at 767px; no horizontal overflow at 390px.
