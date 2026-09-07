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
- Status `--ok`, `--ok-soft`, `--ok-line`, `--danger`
- Type `--font-display` (Bricolage Grotesque), `--font-body` (Inter), `--font-mono` (JetBrains Mono); fluid sizes `--fs-display`, `--fs-h1` to `--fs-h3`, `--fs-lead`, `--fs-body`, `--fs-small`, `--fs-xs`, `--fs-eyebrow`, `--fs-stat`; tracking `--track-display`, `--track-heading`, `--track-eyebrow`
- Space `--s-1` (4px) to `--s-24`, `--section-y`, `--container`, `--container-narrow`, `--gutter`
- Radii `--r-sm` to `--r-xl`, `--r-full`; shadows `--shadow-1`, `--shadow-2`, `--shadow-glow` (hero-level objects only)
- Motion `--ease-out`, `--ease-spring`, `--dur-fast`, `--dur`, `--dur-slow`; chrome `--nav-h`, `--nav-bg`, z-index scale

Dark values live on `:root`; `html[data-theme="light"]` redefines the same names. Components never branch on theme.

## Primitives

CSS classes in `src/styles/base.css`:
`.container` (+ `--narrow`), `.section` (+ `--alt`, `--tight`, `--hairline`, `--flush-top`), `.eyebrow` (+ `--plain`), `.section-head` (+ `--center`, `--row`), `.display`, `.h1` to `.h3`, `.lead`, `.btn` (+ `--primary`, `--accent`, `--ghost`, `--soft`, `--sm`, `--lg`, `--icon`), `.link-arrow`, `.chip` (+ `--accent`, `--ok`), `.chip-row`, `.surface` (+ `--interactive`, `--raised`), `.prose`, `.meta-list`, `.phone` (+ `--sm`), `.wordmark`, `.site-backdrop`, `.text-2`, `.text-3`, `.mono`, `.tabular`, `.sr-only`.

React components in `src/components/ui/`:
`Container`, `Section`, `SectionHeading` (eyebrow + title + lead, optional `aside`), `Button` (renders Link / anchor / button by props), `Chip`, `Reveal` / `Stagger` / `StaggerItem`, `PhoneFrame` (bezel around a 589x1280 screenshot), `Wordmark`, `Backdrop`.

Shared: `StoreLinks` (store buttons with install-count chips) and `Projects/ProjectCard` (`variant="default|wide"`, `clamp`), both fed by `src/data/`.

## Layout vocabulary

- Editorial two-column split: `minmax(0, 1.1fr) minmax(0, 0.9fr)`, gap `--s-12`, one column under 900px.
- Card grid: `repeat(auto-fill, minmax(300px, 1fr))`, gap `--s-6`; cards are `.surface .surface--interactive`.
- Stat tiles: 4 columns desktop, 2 mobile; numeral in `--font-display` at `--fs-stat` weight 800, mono label beneath.
- List rows (certifications, FAQ, uses): full-width rows separated by `border-top: 1px solid var(--line)`, `padding-block: var(--s-5)`. Prefer rows over cards for lists of similar items.
- Timeline (experience, education): left rail, small accent dot per entry, mono period, `h3` role, `.text-3` meta, `.text-2` bullets.
- Section headings: single colour. Old locale keys are split into `Pre` / `Highlight` halves from the template era; render them as one plain string.

## Typography rules

- One `h1` per page. `.display` is used on the Home hero only.
- Section titles are `h2` via `SectionHeading`; card and row titles are `h3`. Never skip levels.
- Body copy in `.prose` (68ch cap); supporting sentences as `.lead`.
- Labels, dates, categories, tags, counts: mono.

## Hard rules

- No Bootstrap. No `!important`. No `text-align: justify`. No centred body copy.
- No em dashes or en dashes in copy.
- Only tokens; never a raw hex or px that a token covers.
- Every visible string comes from `t()`, and `en.json` / `ms.json` keep key parity.
- Keep `usePageMeta`, `aria-*`, `rel="noopener noreferrer"` and `loading="lazy"` wherever they exist.
- Grids collapse cleanly at 767px; no horizontal overflow at 390px.
