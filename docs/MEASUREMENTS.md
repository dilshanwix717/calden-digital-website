# Measurements

Running record of what the build actually produces, appended each phase, so a
regression is traceable to the phase that caused it.

Budget: `docs/calden-performance-budget.md`. **Never edited to make a number pass.**

---

## Phase 1 — 2026-08-19

### Toolchain

| | |
|---|---|
| Node | v22.21.1 |
| pnpm | 10.30.3 |
| Next.js | 16.3.1 |
| React | 19.2.8 |
| **TypeScript** | **6.0.3** — all four smoke-test commands pass |
| **Bundler** | **Turbopack** — already the default in Next 16, no flag needed |
| Build time | ~6s (warm cache) |

### First Load JS — per route

Next 16 no longer prints route sizes in the build banner. Figures below are
computed from `.next/diagnostics/route-bundle-stats.json`, which lists the exact
first-load chunk paths per route, compressed at maximum level. The `noModule`
polyfill chunk is correctly excluded — modern browsers never fetch it.

| Route | raw | gzip | brotli | vs 120 KB |
|---|---|---|---|---|
| `/` | 444.6 KB | 130.9 KB | **112.1 KB** | gzip **over by 10.9** / brotli **7.9 spare** |
| `/_not-found` | 442.6 KB | 130.0 KB | **111.3 KB** | gzip over by 10.0 / brotli 8.7 spare |

**This is essentially the framework floor.** The bare scaffold before any of this
phase's code measured 135.7 KB gzip / 116.2 KB brotli on `/`; the figures above are
*lower* because the scaffold's demo page and its `next/image` usage were removed.
Almost none of it is ours to reduce.

See the open question at the bottom of this file.

### CSS

| | |
|---|---|
| Files | 1 |
| Raw | 22.4 KB |
| **Gzip** | **5.7 KB** — budget 20 KB, comfortable |

### Fonts

Outfit is a **variable** font, so `next/font` splits it by unicode-range, not by
weight. All declared weights resolve to the same two files.

| File | Bytes | Fetched for English |
|---|---|---|
| latin | 32,228 | yes |
| latin-ext | 14,760 | only if such a character appears |

**Actual transfer: 32.2 KB.** Budget is 60 KB total. First-party, self-hosted, zero
requests to `fonts.googleapis.com`.

**Weight 500 is free.** Measured: building with `["400","600"]` and with
`["400","500","600"]` produces byte-identical output — same file hashes, same sizes.
The budget's "every additional weight is roughly 25KB" holds for static cuts, not for
a variable font. The site therefore uses the design's real 500 weight for nav links,
field labels and tag pills rather than mapping them to 600. See BUILD-PLAN §1.9.

### Assets

| | Raw | Gzip |
|---|---|---|
| Logo SVG, source | 9,902 B | 2,827 B |
| Logo SVG, coordinates rounded to 2dp | 5,054 B | **2,077 B** |

Inlined by `components/ui/Logo.tsx` with the three brand colours wired to CSS
custom properties, so it swaps with the theme without a second request.

---

## Open question for Phase 7 — measured, needs a decision

The brief asks for "a Zod schema shared between client and server validation".
Measured cost of that schema bundled for the browser (esbuild, minified):

| | raw | gzip | brotli |
|---|---|---|---|
| `zod` (classic) | 319.9 KB | 63.3 KB | **52.8 KB** |
| `zod/mini` | 12.4 KB | 4.6 KB | **4.2 KB** |

Classic Zod on the client is impossible — it alone is 6.7× the remaining brotli
headroom. `zod/mini` fits. Options are written up in BUILD-PLAN §1.15b.


---

## Phase 2 — 2026-08-19

Content-only phase; no client-side code, no route changes. First Load JS on `/`
unchanged from Phase 1.

### Content validated

`pnpm validate`: 5 JSON files, 3 case studies (1 published — susila; 2 draft —
landora, levelup-saloon), 4 services, 3 projects.

### Finding: `next-mdx-remote/rsc` cannot be imported under `tsx`

Discovered running `pnpm validate` for the first time. `tsx`'s CJS path-alias
resolver throws `ERR_PACKAGE_PATH_NOT_EXPORTED` on `estree-walker@3` (an
`@mdx-js/mdx` transitive dependency, ESM-only exports map) the instant
`next-mdx-remote/rsc` is imported — reproduced in isolation, confirmed
independent of this project's code, confirmed Next's own bundler is unaffected
by mounting a page that calls `compileMDX` and rendering it under
`pnpm build && pnpm start`. `lib/mdx.ts` now splits frontmatter parsing
(`gray-matter`, safe under `tsx`) from body compilation
(`next-mdx-remote/rsc`, Server-Component-only). See BUILD-PLAN §Phase 2 for
the full writeup.


---

## Phase 3 — 2026-08-19

### First Load JS — per route

| Route | raw | gzip | brotli | vs 120 KB | delta vs Phase 1 |
|---|---|---|---|---|---|
| `/` | 456.2 KB | 135.3 KB | **116.0 KB** | brotli **4.0 spare** | +3.9 KB brotli |
| `/_not-found` | 451.3 KB | 133.5 KB | 114.5 KB | brotli 5.5 spare | +3.2 KB brotli |

The full shared shell — Nav, MobileNav (the only new client component besides
ThemeToggle), Footer, Button, WhatsAppButton, seven icon components, Container
and Section — cost **3.9 KB brotli**. Headroom on `/` is now 4.0 KB, tighter
than Phase 1's 7.9 KB but still compliant on the brotli reading (§1.17).

`/` still renders as `○ (Static)`.

### Acceptance criteria verified

1. Nav and footer present on `/`, confirmed in served HTML; footer pinned to
   viewport bottom via `flex flex-col` body + `flex-1` main (structural,
   short-page visual check still worth a manual look).
2. Nav height classes `h-[60px] desk:h-[76px]` confirmed in compiled CSS;
   `min-width:820px` appears **exactly once** in the entire stylesheet — the
   only layout breakpoint in the build.
3. Skip link `<a href="#main" class="skip-link">Skip to content</a>` is the
   first element in `<body>`, before Header/Nav.
4. Mobile trigger ships `aria-expanded="false" aria-controls="mobile-nav-panel"
   aria-label="Open menu"`; panel ships `role="dialog" aria-modal="true"
   aria-label="Menu"` with a `aria-label="Close menu"` button inside. Focus
   trap, Escape handling and scroll lock are implemented per spec; full
   keyboard walkthrough is a manual check (Phase 9 audit).
5. Scroll lock: `document.body.style.overflow` set/restored in a `useEffect`
   keyed on `open`, restored on unmount as well as on close.
6. `grep -rln '"use client"' components/layout` → exactly `MobileNav.tsx` and
   `ThemeToggle.tsx`.
7. `grep -rn 'wa\.me\|hello@calden\|"/work"' components | grep -v content` →
   empty.
8. `--accent-gold` computed values: `#d4af37` (light) / `#e0be50` (dark) in
   the built CSS, applied via `text-accent` on the footer's "Digital" span —
   `rgb(212,175,55)` / `rgb(224,190,80)` as specified.
9. First Load JS reported above; within budget on the brotli reading.


---

## Phase 4 — 2026-08-19

### First Load JS — per route

| Route | raw | gzip | brotli | vs 120 KB | delta vs Phase 3 |
|---|---|---|---|---|---|
| `/` | 472.6 KB | 141.0 KB | **121.1 KB** | **OVER by 1.1 KB, even on brotli** | +5.1 KB brotli |
| `/_not-found` | 451.3 KB | 133.5 KB | 114.4 KB | brotli 5.6 spare | -0.1 KB |

### `/` crosses the 120 KB budget — flagged, not hidden

Phase 3 left 4.0 KB of brotli headroom. The homepage's own markup and shared
UI (Hero, WhatWeDo, HowWeWork, SelectedWork, StreamingBand, WhyCalden,
ContactSection, Card, Tag, ProjectCard, BandSection, ContactActions) plus
`HeroVideo` consumed 5.1 KB, tipping `/` **1.1 KB over budget on the brotli
reading** — the reading Phase 1 proposed as compliant when gzip alone could
not be met (§1.17).

**Investigated whether this was a fixable bug before accepting it as real
homepage weight:**

1. `next/dynamic(() => import(".../HeroVideo"))` was tried first, per the
   plan's own fallback suggestion ("guard the import with next/dynamic if
   the budget measurement shows it mattering"). It made things **worse**
   (121.1 -> 121.8 KB) — the loader wrapper adds its own overhead, and
   Turbopack still lists the chunk in `firstLoadChunkPaths` for the route
   because `hero.video.enabled` is a build-time-known content value, not a
   runtime condition — there is nothing for a dynamic *runtime* import to
   defer. Reverted.
2. Stubbed `HeroVideo` to `return null` and remeasured: **120.6 KB**, only
   0.5 KB less than the real 121.1 KB. HeroVideo's actual video-handling
   logic is cheap. It is not the cause.
3. Inspected the chunk Turbopack groups HeroVideo into
   (`2tmg6nivxqgzb.js`, 6.7 KB brotli): it is the same chunk as `MobileNav`
   and `ThemeToggle` from Phase 3 — Turbopack bundles sibling client
   components together by default. That grouping, not HeroVideo's code, is
   most of the 6.7 KB, and it was already present (smaller) in Phase 3's
   116.0 KB.
4. Counted internal `next/link`s rendered on `/`: only 4 top-level anchors
   (nav links come from a shared component already counted). Not the driver.

**Conclusion: this is real homepage weight, not a bundling defect.** A
seven-section page with this much shared UI, against a 120 KB ceiling with
only 4.0 KB of headroom after the shell alone, was always going to be tight
— see §1.17's own warning that the framework floor leaves "on the order of
10–20 KB for the theme toggle, mobile nav, contact form, WhatsApp button and
hero video controller combined." The homepage additionally carries every
other shared component in the design (services grid, process stepper,
project cards, why-Calden grid, contact actions) on top of that list.

**Not fixed in Phase 4.** Per your instruction to finish the plan before
revisiting the budget, this is logged and left as-is. Options once the
budget conversation resumes: raise the JS ceiling slightly (1.1 KB is a
rounding-error-sized breach), split less-critical below-the-fold sections
(WhyCalden, the contact form once Phase 7 lands) behind `next/dynamic` with
a genuine runtime trigger (e.g. `IntersectionObserver`, not a build-time
boolean) rather than a static prop, or accept it — Google's own Core Web
Vitals thresholds do not hard-fail at 120 KB, this project's budget document
does.


---

## Phase 5 — 2026-08-19

### First Load JS — per route

| Route | raw | gzip | brotli | vs 120 KB |
|---|---|---|---|---|
| `/` | 473.8 KB | 141.5 KB | 121.5 KB | over by 1.5 KB |
| `/work` | 471.8 KB | 140.9 KB | 121.0 KB | over by 1.0 KB |
| `/work/[slug]` (susila) | 471.8 KB | 140.9 KB | 121.0 KB | over by 1.0 KB |
| `/_not-found` | 452.5 KB | 133.9 KB | 114.8 KB | 5.2 spare |

Same story as Phase 4: `/work` and `/work/susila` share the Phase 1-3 framework
+ shell floor (~116 KB) and land at essentially the same weight as the
homepage, ~1 KB over on the brotli reading. Not investigated further per
Phase 4's conclusion — this is accumulated shared-shell weight (Nav,
MobileNav, ThemeToggle, Footer, Button, Card, Tag, WhatsAppButton), not a
Phase 5-specific regression. Left for the budget conversation once the plan
is complete, per your instruction.

### A real content bug found by AC6, not by inspection

`content/case-studies/susila.mdx`'s body was missing the `## The problem`
heading — the section's paragraphs followed directly after the frontmatter
closing `---` with no heading at all, so the rendered `h2` sequence was
`What we built, Since then, Outcome` instead of the four sections Section
5.11 specifies. This is exactly the class of error the acceptance criteria
exist to catch: it would have shipped invisibly, since the page still
"looked fine" — three sections instead of four reads as complete unless you
know to count. Fixed by adding the missing `## The problem` heading; verified
by rebuilding and re-checking the h2 order.

### Acceptance criteria verified

1. `/work` and `/work/susila` static/SSG; `generateStaticParams` produced
   exactly one slug (landora, levelup-saloon correctly excluded as drafts).
2. `/work/landora` returns real HTTP 404 while `draft: true`; flipping to
   `draft: false` and rebuilding makes it prerender — tested both directions,
   reverted.
3. Row alternation confirmed in compiled classes: rows 1 & 3
   `desk:flex-row`, row 2 `desk:flex-row-reverse`.
4. Two draft rows render "Case study coming soon" as plain text, never
   wrapped in `<a>`.
5. Full-bleed decision band confirmed: `w-screen -translate-x-1/2` breaks out
   of the 760px reading column.
6. Exactly one `<h1>` ("Susila"); h2 order `The problem, What we built,
   Since then, Outcome` — after the fix above.
7. Editing susila.mdx's body text changed the rendered page with zero `.tsx`
   edits — tested and reverted.
8. `/work/susila` PrevNext: prev = LevelUp Saloon, next = Landora Tours,
   matching `getAdjacentProjects`'s wrap-around order.
9. `grep -rn "use client" components/work app/work` → empty.
10. Device-frame images carry `dark:border dark:border-line` — confirmed in
    served HTML (16 occurrences on the case-study page across device frames,
    project cards and work-index media).
