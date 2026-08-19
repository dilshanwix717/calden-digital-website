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


---

## Phase 6 — 2026-08-19

Five new static routes: /services, /about, /contact, /privacy, /not-found.
No new client components (WhatsAppFloating is built but not mounted).

### A real cross-page accessibility bug, found by AC5

The Footer (built in Phase 3) used `<h4>` for its column headings. On its
own that's invisible — nobody audits a component in isolation for heading
level relative to a page it doesn't know about yet. Phase 6's AC5 requires
checking monotonic heading order on every page, and running that check
surfaced a genuine violation on every single page: h1/h2 jumping straight to
h4 at the footer, skipping h3 entirely.

First fix attempt (h3) was itself wrong: it assumed every page has an h2
above the footer. `/contact` doesn't — its content is only an h1 — so h3
skipped a level there too (h1 -> h3). Corrected to h2, the only level valid
after every page's h1 regardless of what content exists in between, since
every page has at least an h1 and the footer is always last. Verified against
all seven pages after the fix; all monotonic, all exactly one h1.

### Acceptance criteria verified

1. All five routes build static.
2. `/work`, `/services`, `/about` show ContactCTA (h2 "Tell us about your
   project"); `/contact` does not — confirmed by counting the CTA's specific
   h2, not just page text (the h1 and h2 both contain that string, which a
   naive text-count would conflate).
3. `/does-not-exist` returns real HTTP 404 (`curl -I`), with nav and footer
   present.
4. Exactly one `<h1>` per page — all seven checked.
5. Heading order monotonic on all seven pages — after the Footer fix above.
6. `grep -rn "Colombo|Privacy Policy|hello@" app components | grep -v content`
   → empty.
7. WhatsAppFloating.tsx exists; no `import { WhatsAppFloating }` anywhere.
8. Temporarily mounted WhatsAppFloating in app/layout.tsx: builds, renders
   the floating button, zero edits to WhatsAppButton.tsx. Reverted.

---

## Phase 7 — 2026-08-19

### First Load JS — per route (final, after the bundle-leak investigation below)

| Route | brotli | vs 120 KB |
|---|---|---|
| `/` | **134.0 KB** | over by 14.0 KB |
| `/contact` | **127.3 KB** | over by 7.3 KB |
| `/about`, `/work`, `/work/[slug]` | 122.6 KB | over by 2.6 KB |
| `/_not-found`, `/privacy`, `/services` | 116.4 KB | 3.6 KB spare |

`/` and `/contact` are the only two routes carrying the contact form; the
delta over Phase 6's ~121.4 KB baseline is the form's real cost:
**+12.6 KB brotli on `/`**, ~+6 KB on `/contact` (already carrying its own
page chrome cost that differs slightly from the homepage's).

### A ~61 KB budget regression, found and fixed before it shipped

First build after wiring the form measured **`/` at 182.6 KB brotli** — a
~61 KB jump, dwarfing Phase 1's isolated 4.2 KB measurement for `zod/mini`.
Investigated rather than accepted:

1. Inspected the new chunk: 307 KB raw, containing recognisable strings from
   `projects.json` (`susila`, `Susila Productions`) — the entire content
   module had leaked into the client bundle.
2. Root cause: `lib/contact-schema.ts` called `getSite()` at module scope to
   build its Zod enums. `ContactForm.tsx` (the client component) imports
   that schema, so importing it pulled `lib/content.ts`'s static imports of
   **all five JSON content files** into the client bundle — not just the
   `contactForm` slice the schema needs.
3. Fixed by changing `lib/contact-schema.ts` to a factory function
   (`buildContactSchema(options)`) taking the option arrays as parameters,
   with no dependency on `lib/content.ts` at all. Rebuilt: `/` dropped to
   134.0 KB — recovered ~48 KB, but still ~13 KB above the pre-form
   baseline.
4. Same investigation on the remainder found a second instance of the exact
   same bug: `ContactForm.tsx` also imported `whatsappUrl` from
   `lib/whatsapp.ts`, which *also* calls `getSite()` internally (for the
   WhatsApp number and default message). Fixed by making `whatsappUrl` a
   prop, built server-side in the two parent pages and passed down, exactly
   like `contactForm` and `contactEmail`.
5. Final chunk inspected directly: zero occurrences of any project-slug or
   case-study string. Confirmed clean.

**General lesson, not just a Phase 7 note:** any function a client component
calls, directly or transitively, that itself calls `getSite()` (or reads any
`@/content/*.json` import) pulls the *entire* content module into the
client bundle — Next's tree-shaking does not see through a function call to
prune unused object keys from a bundled JSON import. The fix pattern is
consistent: server components own `getSite()` calls, client components
receive only the specific values they need as props. Two-for-two so far in
this codebase (`lib/contact-schema.ts`, `lib/whatsapp.ts`); worth an explicit
check in Phase 9 for any future client component.

### Acceptance criteria verified (real browser, Playwright + Chromium)

1. `pnpm build`: `/` and `/contact` both static.
2. Empty submit: all 6 fields get `aria-invalid="true"`, focus moves to Name.
3. No `RESEND_API_KEY`, no `EMAIL_TRANSPORT`: error state shown, WhatsApp and
   mailto links present INSIDE the alert, form values retained
   (name/email/message text verified; all three `<select>`s verified
   separately below), no success in any environment.
4. `EMAIL_TRANSPORT=noop`: success state, `[contact:noop]` logged with all
   six fields and the correct subject-line format.
4b. Invalid `RESEND_API_KEY`: same generic error state shown to the visitor;
   the real Resend rejection ("API key is invalid") appears only in the
   server log.
5. JavaScript fully disabled (Playwright `javaScriptEnabled: false`),
   immediate submit: still succeeds — timing check correctly skipped, not
   failed, for the missing `_ts`.
6. Honeypot filled: visitor sees success; zero trace of the submission in
   the server log (grepped for the test data — no match).
7. Valid submission within 3 seconds of page load: silently accepted, zero
   trace in the server log.
8. Six submissions in a row: 1–5 succeed, 6 is the first to return the
   rate-limit message — exactly the threshold specified.
10. Same `ContactForm` on `/` (idPrefix="home") and `/contact`
    (idPrefix="contact"), confirmed in source.

AC9 (screen-reader announcement, full keyboard walkthrough) is structurally
satisfied — `role="alert"`, `aria-describedby` wired to each field's message
— but is a manual check per Phase 9's own audit process, not something a
headless browser proves.

### A second real bug found via Playwright, not inspection: form-clearing on failure

`defaultValue=""` (uncontrolled inputs) was the first implementation,
matching a common React pattern. Testing AC3 in a real browser showed the
form clearing itself completely after a failed submission — a direct
violation of "the form is never cleared on failure." Root cause: React 19's
`useActionState` calls the native `form.reset()` after every action
completes, success or failure, to mirror plain HTML form-submission
semantics — this is documented behavior, and exactly what the plan's own
pitfall list flagged ("uncontrolled inputs are preserved on the no-JS path
automatically but not on the client path"), just not with enough detail to
anticipate the exact mechanism. Fixed by converting every field to
controlled (`value` + `onChange`) React state.

Text inputs and the textarea were fixed by that alone. The three `<select>`
elements needed a second fix: even controlled, their selected `<option>`
did not reliably survive the native reset. Root-caused with a `reset` event
listener in the browser confirming the native reset genuinely fires; fixed
with a layout effect in `SelectField` that re-asserts `select.value = value`
on every render, one-way-syncing React's source of truth back onto the DOM
node after any external mutation. Verified: all three selects now retain
their values through a failed submission.


---

## Phase 8 — 2026-08-19

All-server-side phase: metadata, sitemap, robots, JSON-LD, static OG images,
icons, deferred analytics. Small bundle delta expected from the `Plausible`
component's `next/script` import, present in the client bundle whether or
not analytics is actually on (the component itself always ships; only the
script tag it would render is conditional).

### First Load JS — per route

| Route | brotli | vs 120 KB | delta vs Phase 7 |
|---|---|---|---|
| `/` | 135.4 KB | over by 15.4 KB | +1.4 KB |
| `/contact` | 128.7 KB | over by 8.7 KB | +1.4 KB |
| `/about`, `/work`, `/work/[slug]` | 123.9 KB | over by 3.9 KB | +1.3 KB |
| `/_not-found`, `/privacy`, `/services` | 117.7 KB | 2.3 KB spare | +1.3 KB |

### A real Rich Results issue found and fixed before Phase 9's audit

Initial JSON-LD pointed `Organization.logo` and `LocalBusiness.image` at the
inline SVG logo (`/logo/calden-horizontal.svg`). Google's structured-data
guidance specifies logo/image as a raster format (JPEG/PNG/WebP) — SVG here
is a documented source of a Rich Results Test warning even though the same
file renders correctly as a favicon and inline nav logo elsewhere on the
site. Fixed by pointing both fields at the generated default OG PNG
(1200×630, already exists, includes the mark) instead. No live validation
against Google's tool was possible in this environment (no network access
to external services); validated structurally against the documented
required-field lists for Organization, LocalBusiness and CreativeWork
instead — all required fields present on all three types.

### Acceptance criteria verified

1. `sitemap.xml`: exactly the 6 expected URLs (`/`, `/work`, `/work/susila`,
   `/services`, `/about`, `/contact`); `/privacy`, `/work/landora`,
   `/work/levelup-saloon` correctly absent.
2. `robots.txt`: production build allows all + disallows `/privacy` +
   points at the sitemap. Rebuilt with `VERCEL_ENV=preview` and confirmed
   the blanket `Disallow: /` — this only takes effect when set at BUILD
   time, since robots.ts is statically generated; Vercel sets this
   automatically during its own build step, so the real deployment path is
   correct.
3. Canonical `<link>` present on all 7 pages, absolute URL, correct domain.
4. All 6 required OG/Twitter tags present and non-empty on all 7 pages —
   checked programmatically, not by eye. `/work/susila`'s `og:image`
   correctly resolved through the ogImage -> cover fallback chain (its
   frontmatter has `ogImage: null`).
5. JSON-LD structurally valid, required fields present for Organization,
   LocalBusiness (both on `/`) and CreativeWork (`/work/susila`) — live
   Rich Results Test not reachable from this environment.
6. `/privacy` and `/does-not-exist` both carry `noindex` (the 404 route
   shows two robots meta tags — Next's implicit one plus this phase's
   explicit one — both agreeing on noindex, so no conflict).
7. No `plausible.io` reference with the env var unset. Set both
   `analytics.plausibleDomain` (content) and `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
   (env) and rebuilt: the script is absent from the initial server HTML
   entirely (afterInteractive defers it past hydration, which is even
   better than a `defer` attribute on a server-rendered tag) — confirmed via
   a `<link rel="preload">` reference. Reverted both.
9. `grep -rn "google-analytics|gtag|googletagmanager"` across the whole
   project (excluding node_modules and the design handoff) → empty.

AC8 (Lighthouse SEO = 100) is measured in Phase 9, which is where Lighthouse
CI is actually wired up.


---

## Phase 9 — 2026-08-19

Tooling: `@next/bundle-analyzer`, `size-limit` + `@size-limit/file`,
`@lhci/cli`, `@vercel/speed-insights`, `scripts/check-a11y-static.mjs`,
`.github/workflows/ci.yml`. `playwright` + Chromium installed as a dev
dependency specifically to drive the manual-audit-adjacent checks (theme
toggle, focus outline, mobile menu, reduced motion) through a real browser
rather than trust structural HTML alone.

### Toolchain confirmation (repeats Phase 1, verified still true)

| | |
|---|---|
| TypeScript | 6.0.3 |
| Bundler | Turbopack (Next 16 default) |
| Build time | ~2s warm, ~5s cold |

### Final First Load JS — per route, brotli, production build

| Route | Measured | vs 120 KB budget |
|---|---|---|
| `/` | 136.3 KB | over by 16.3 KB |
| `/contact` | 129.7 KB | over by 9.7 KB |
| `/about`, `/work`, `/work/[slug]` | 124.9 KB | over by 4.9 KB |
| `/_not-found`, `/privacy`, `/services` | 118.7 KB | 1.3 KB spare |

Not weakened to pass — the budget document is explicit that this isn't
allowed. `pnpm check` genuinely fails at `check:budget` as a result; this is
the accurate state of the project, reported rather than hidden. See
README.md's "Performance" section for the framing and
`docs/PRE-DEPLOY-CHECKLIST.md` for what this blocks.

### Homepage total page weight (Network panel, cache disabled)

Not separately re-measured beyond the JS figures above — the AC4 target
(homepage ≤600 KB, case study ≤1.2 MB total first view, cache disabled) was
not verified via a live Chrome DevTools session in this environment. The
brotli JS figures above (136.3 KB for `/`) plus CSS (~9 KB) plus the
currently-missing placeholder images account for most of first-view weight;
flagged as unverified rather than asserted.

### Two real accessibility bugs found by Lighthouse, not by inspection

Both were genuinely invisible without running the actual audit tool — the
code looked reasonable, and manual visual testing wouldn't have caught
either:

1. **`aria-hidden-focus` (weight 7, scored 0)** — `MobileNav`'s closed panel
   used `aria-hidden="true"` while its descendants (nav links, close
   button) remained focusable — a WAI-ARIA-invalid state where a sighted
   keyboard user can Tab into content assistive tech is told doesn't exist.
   Fixed by switching to the native `inert` attribute, which removes a
   subtree from both the accessibility tree and tab order in one property
   with no per-child JS needed.
2. **`label-content-name-mismatch` (scored 0)** — the footer wordmark link
   carried `aria-label="Calden Digital"`, which didn't match its own visible
   text content ("Calden" + "Digital", the second span uppercased via CSS
   only) — screen readers announce one thing, sighted users read another.
   Fixed by removing the redundant `aria-label` entirely; the link's own
   text is already the correct accessible name.

**Accessibility went from 0.96 to a clean 1.00 on every page** after both
fixes — verified by rebuilding and re-running the full Lighthouse CI suite.

### Lighthouse CI — full results after both accessibility fixes

Median of 3 runs, mobile preset, Slow 4G + 4x CPU throttling, against a
production build (`pnpm build && pnpm start`), local machine — not the real
Vercel deployment.

| Route | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | 0.98 | 1.00 | 0.96 | 1.00 |
| `/work` | 0.98 | 1.00 | 0.96 | 1.00 |
| `/work/susila` | 0.98 | 1.00 | 1.00 | 1.00 |
| `/services` | 0.98 | 1.00 | 1.00 | 1.00 |
| `/about` | 0.98 | 1.00 | 0.96 | 1.00 |
| `/contact` | 0.98 | 1.00 | 1.00 | 1.00 |

Performance and SEO both pass their gates (≥0.95, 1.0) on every page.
Best Practices' 0.96 on three pages is `console.error`s from project-cover
and portrait images that don't exist yet (404/400 from `next/image`) — a
content-completeness gap already on the pre-deploy checklist, not a code
defect; confirmed by checking `public/images/work/` is genuinely empty.

**Metric-level assertions**, same runs:

| Metric | Budget | Typical measured | Status |
|---|---|---|---|
| TBT | ≤150ms | 80ms | pass |
| FCP | ≤1200ms | ~900ms | pass |
| CLS | ≤0.05 | 0 | pass |
| Speed Index | ≤2500ms | ~900ms | pass |
| **LCP** | **≤2000ms** | **2200–2500ms** | **fail — the only failing metric** |

LCP investigated, not just reported: the LCP element on `/` is the hero
subhead paragraph (plain text, no image, no custom-loaded resource beyond
the already-loaded font). Its phase breakdown attributes 19% to TTFB
(458ms) and **81% to "Render Delay"** — time between TTFB and the element
actually painting, with no Load Delay or Load Time (there's no image/font
fetch on the critical path for this element). TBT is only 80ms, so this
isn't main-thread blocking in the conventional sense either. `render-
blocking-resources` flags the page's own 8.6 KB CSS file costing ~159ms,
which is normal for a `<link rel="stylesheet">` this size and not
unusual to see. The most likely explanation is this environment: a local
`next start` (no CDN, no edge caching, no HTTP/2 server push) under 4x CPU
throttling compounds differently than Vercel's actual production
infrastructure would. **Recommendation: re-measure LCP against the real
Vercel deployment before treating this as a code-level problem** — it is
flagged on the pre-deploy checklist rather than "fixed" here, because
attempting to fix a measurement artifact from the wrong environment risks
optimising for the wrong thing.

### Deliberate regression tests (AC6) — all three confirmed working

1. Added `text-accent` to a heading on `/about`: `pnpm check:a11y` failed,
   correctly naming the file and the specific gold pattern matched. Reverted.
2. Added a second `<h1>` to `/services`: `pnpm check:a11y` failed with
   "expected exactly one `<h1>`, found 2". Reverted.
3. Added `lodash` (real dependency, not a stub) to `ContactForm.tsx`:
   `pnpm size` failed ("exceeded by 7.03 kB", 212.31 -> 237.03 KB gzip
   against the 230 KB aggregate ceiling), and `scripts/check-budget.mjs`
   showed the expected effect concentrated on the two routes that actually
   carry the contact form (`/` +21.2 KB brotli, `/contact` +21.2 KB —
   the other five routes barely moved). Both reverted; confirmed `pnpm
   size` and `pnpm build` return to the pre-test numbers.

### A false positive found and fixed in the check script itself

`scripts/check-a11y-static.mjs`'s first version flagged the work-index
media links (`<a><img alt="..."/></a>`, no visible text, image-only) as
having no discernible accessible name — a genuine false positive, since an
image's `alt` text IS the correct accessible name for an image-only link,
exactly the pattern used there. Fixed by teaching the check to look for a
descendant `<img alt="...">` when an anchor/button has no direct text and
no `aria-label`, before flagging it. Re-verified against all seven pages
after the fix: zero false positives, and the three deliberate-break tests
above still correctly fail when the underlying issue is real.

### CI workflow

`.github/workflows/ci.yml`: two jobs. `checks` (fast, deterministic —
validate, build, check:budget, size, check:a11y) runs on every PR to
`main`. `lighthouse` is a separate job specifically so it can be disabled
without touching the fast checks, per the budget document's own note that
Lighthouse CI is slow and can wobble on shared runners. Not executed in
this environment (no GitHub remote/Actions runner available here) — the
workflow YAML is written and each individual step was verified locally by
running the equivalent command directly (see the deliberate regression
tests above and every `pnpm check:*` invocation throughout this phase).

### Not verified in this environment

- Live Google Rich Results Test (Phase 8's AC5) — no network access to
  external validation services.
- Real GitHub Actions run of `.github/workflows/ci.yml` — no GitHub
  remote configured for this repository yet.
- Vercel Speed Insights reporting real data — requires an actual production
  deployment.
- Forced-colors mode, full screen-reader pass (VoiceOver/NVDA) — Playwright
  can drive Chromium's DOM/CSS state but does not fully emulate a screen
  reader's announcement behaviour; both are on the pre-deploy checklist as
  manual steps.
