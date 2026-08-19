# Calden Digital — Build Plan

Target: a statically generated Next.js marketing site for Calden Digital.
Written 2026-08-18. Source of truth for design: `design_handoff_calden_site/`.

---

## 0. How to use this document

Each phase below is **self-contained**. A phase states its goal, the exact files it
touches, what must already exist, non-obvious implementation notes, acceptance
criteria you can run, and the mistakes most likely to be made in that specific phase.

Rules that apply to every phase:

1. **Do not invent copy, colours, sizes, URLs or phone numbers.** Every literal value
   you need is in Section 2 (tokens) or Section 5 (content). If a value is not there,
   stop and ask rather than guessing.
2. **Do not add dependencies** beyond the pinned list in Section 4. No animation
   library, no icon library, no UI kit, no state manager, no `clsx`/`cva` unless it
   is already in the list.
3. **Run `pnpm build` at the end of every phase.** A phase is not done if the build
   fails or if the reported First Load JS regresses past the budget in
   `docs/calden-performance-budget.md`. That document is binding and is **never**
   edited to make a check pass.
4. **Server Components are the default.** `"use client"` is only permitted in the
   five files named in Section 3, and only at the leaf named there.
5. **No hardcoded copy in components.** Every string a visitor reads comes from
   `lib/content.ts`. The only exception is structural microcopy that is part of an
   accessibility contract (e.g. `aria-label="Toggle theme"`), and even those are
   listed in Section 5 where they exist.

---

## 1. Open decisions

These are conflicts or gaps found between the brief, the design handoff, and the
files actually present in the repository. Each has a **default** that later phases
already assume, so work can proceed without waiting. Override any of them by editing
the single location named, and nothing else in the plan changes.

### 1.1 The performance budget — resolved, and it is stricter than the brief

`docs/calden-performance-budget.md` now exists. It is the binding document. It is
**tighter than the five numbers quoted in the brief**, and it adds requirements the
brief did not mention. Differences that change the work:

| | Brief | Budget document | Effect |
|---|---|---|---|
| Best Practices | not stated | **100**, not 95 | no console errors, no deprecated APIs |
| Fonts, total | — | **≤ 60 KB**, ≤ 30 KB per weight | comfortable for two Latin-subset cuts |
| Single content image | — | **≤ 120 KB** | tighter than the 200 KB I had assumed |
| Homepage, first view | — | **≤ 600 KB total** | |
| Case study, first view | — | **≤ 1.2 MB total** | image-heavy allowance |
| Third-party script | — | **≤ 5 KB** | Plausible fits, nothing else will |
| INP / FCP / Speed Index | not stated | **≤ 150ms / ≤ 1.2s / ≤ 2.5s** | new gates |
| Measurement | not stated | **median of three runs**, incognito, deployed URL | |

It also specifies **enforcement tooling** the brief did not: `@next/bundle-analyzer`,
`size-limit` with a non-zero exit, Lighthouse CI with `lighthouserc.js`, a GitHub Action
on pull requests to `main`, and Vercel Speed Insights. Phase 9 now builds all of that,
and Section 4 carries the extra dev dependencies. This is the single biggest change from
the first draft of this plan.

Two housekeeping notes:

- The document says to save it as `/docs/PERFORMANCE-BUDGET.md`; it is currently at
  `docs/calden-performance-budget.md`. This plan references the **actual** path.
  Rename it if you prefer, and update the two references here and in the README.
- It requires `next.config.ts` to fail the build on TypeScript or ESLint errors —
  no `ignoreBuildErrors`, no `ignoreDuringBuilds`. `create-next-app` does not set those,
  but a later "quick fix" often does. Phase 1 asserts they are absent.

### 1.2 The content documents referenced in the brief do not exist

There is no homepage copy doc, no case-study drafts, no brand notes file. The repo
contains only `design_handoff_calden_site/`. **All copy in Section 5 was extracted
from the prototype JSX** (`homepage-page.jsx`, `work-index.jsx`, `services.jsx`,
`about.jsx`, `contact.jsx`, `case-study.jsx`) and the brand voice rules from
`_ds/.../readme.md`. The handoff README states the homepage, contact and Susila copy
came verbatim from the client and is final; the Services expanded paragraphs, the
"Taking over an existing project" block, the Work intro line, and **all About page
copy** were authored by the design assistant and are **unapproved**. Those are marked
`UNAPPROVED` in Section 5. **Default:** ship them as-is and review before launch.

### 1.3 Light palette — RESOLVED: use the design

Decision: **the mint palette as shipped in the handoff**, not the brief's table.

| Token | Value | Source |
|---|---|---|
| `--surface-page` | `#EEF2F1` | handoff page override |
| `--surface-card` | `#FAFBFB` | handoff card override |
| `--surface-sunken` | `#E3E9E8` | handoff sunken override |
| `--border` | `#CDD6D4` | design system `--grey-200` |

This also settles the "never pure `#FFFFFF`" brand rule, which the brief's `#FFFFFF`
surface would have broken, and it supplies the sunken level the brief's table was
missing. The dark column of the brief's table is kept as-is.

Re-running the contrast check against mint moved **two** derived tokens, because mint's
page is darker than the brief's `#FAF9F5` and the margins were thin:

| Token | Was (on `#FAF9F5`) | Now (on mint) | Why |
|---|---|---|---|
| `--text-subtle` | `#667470` | **`#5A6965`** | `#667470` measures 4.33:1 on the mint page and 3.98:1 on mint sunken — both fail AA. `#5A6965` gives 5.11 / 5.56 / 4.69 across page, card and sunken. |
| `--border-control` | `#869291` | **`#748280`** | `#869291` measures 2.85:1 on the mint page — fails the 3:1 non-text minimum. `#748280` gives 3.55 / 3.86 / 3.26. |

Everything else clears comfortably on mint; the full table is in 2.2.

### 1.4 Tokens the brief's palette did not define — added

Beyond sunken, the design needs these five and the brief's table has none of them. All
values are contrast-verified in 2.2.

| Token | Why it is needed | Light | Dark |
|---|---|---|---|
| `--surface-band` | The full-bleed emphasis bands: homepage "How we work", About pull-quote, case-study "A decision worth explaining" | `#12312F` | `#1F3733` (see 1.6) |
| `--text-on-brand` | Text on a filled teal button | `#FAFBFB` | `#0D1817` |
| `--brand-on-band` | Teal used **on** a band: eyebrows, process-step rings | `#3FAEA5` | `#3FAEA5` |
| `--border-control` | Form fields and other interactive boundaries — WCAG 1.4.11 needs 3:1 | `#748280` | `#586F69` |
| `--text-subtle` | Placeholders and captions — needs 4.5:1 | `#5A6965` | `#7A8A86` |

`--text-on-brand` is the one that bites. In dark mode the brand teal becomes `#2E9B93`,
which is light. Light text on it measures **2.90:1** and fails AA; dark ink on it
measures **5.37:1** and passes. **A dark-mode primary button must have dark text.** You
said to do what is best here — this is it, and it is the kind of thing that ships broken
because it looks fine to someone with good eyesight on a bright screen.

`--brand-on-band` is new since the first draft; see 1.6b.

### 1.5 Accent gold fails WCAG AA as text on light backgrounds — measured on mint

| Pairing | Ratio | Result |
|---|---|---|
| `#D4AF37` on mint page `#EEF2F1` | **1.86:1** | fails AA at every size |
| `#D4AF37` on mint card `#FAFBFB` | **2.03:1** | fails AA at every size |
| `#D4AF37` on band `#12312F` | **6.63:1** | passes AA |
| `#E0BE50` on dark band `#1F3733` | **7.05:1** | passes AA |
| `#E0BE50` on dark page `#0D1817` | **10.04:1** | passes AA |

**Ruling:** on light surfaces gold is **decoration only** — rules, dividers, the inner
stroke of the logo mark. It must never carry text on a light background at any size.
On **dark surfaces it is legitimate for text**, which is what the design already relies
on: the footer column headings and the `DIGITAL` descriptor are gold on the ink footer.
Those stay. Enforced by a check in Phase 9.

The handoff itself notes gold is "not used on the mint pages" outside the footer, so
this ruling costs nothing visually.

### 1.6 Dark bands — RESOLVED: invert them properly

You asked for a real inversion rather than a bordered fudge. Here it is.

In light theme the band is ink `#12312F` on a `#EEF2F1` page: a **12.35:1 step
downward**, which is what makes it read as a weighted, deliberate section. Keeping ink
in dark mode gives 1.30:1 against `#0D1817` — the band disappears.

**The inversion:** in dark mode the band steps **upward** instead. It becomes
`#1F3733`, a teal-tinted elevated surface that is lighter than both the page and the
card. The direction of the step flips; the role of the band does not.

| | Light | Dark |
|---|---|---|
| Page | `#EEF2F1` | `#0D1817` |
| Card | `#FAFBFB` | `#14211F` |
| **Band** | **`#12312F`** (darker than page) | **`#1F3733`** (lighter than page **and** card) |
| Band vs page | 12.35:1 down | 1.42:1 up |
| Band vs card | — | 1.30:1 up |

`#1F3733` was chosen as the highest value that still carries the band's text
comfortably: `--text-on-band` 10.91:1, `--text-on-band-muted` 6.40:1, gold 7.05:1. Going
lighter makes the step more obvious but starts eating the text contrast; going darker
loses the step. Text tokens on the band are **identical in both themes**, so the band
components never branch on theme — only the fill value changes.

A 1.42:1 surface step is subtle but genuinely visible on a calibrated screen, and it is
the correct dark-mode idiom: elevation moves toward the light, not away from it. Keep
the hairline top and bottom borders in dark mode as reinforcement — cheap, and it makes
the boundary unambiguous on a dim phone screen.

### 1.6b The design's `--teal-on-dark` fails on the band — a defect in the handoff

Found while verifying 1.6. The design system defines `--teal-on-dark: #167C78` "for dark
backgrounds only" and the prototype uses it for the case-study band eyebrow
(`A decision worth explaining`, 12px uppercase) and the process-step ring borders.

On the ink band `#167C78` measures **2.78:1**. That fails AA for the eyebrow text
(needs 4.5:1) *and* fails the 3:1 non-text minimum for the ring borders. It is broken in
the handoff as delivered, in light mode, before dark mode enters the picture.

**Fix:** one new token, `--brand-on-band: #3FAEA5`, used for every teal element that
sits on a band, in **both** themes. It measures 5.19:1 on the light band and 4.73:1 on
the dark band, so eyebrows and rings both clear AA everywhere. `#3FAEA5` is the lightest
step of the existing dark-teal ramp, so it stays on-brand rather than introducing a new
hue. `--teal-on-dark` is not used anywhere in this build.

### 1.7 Hero — CONFIRMED: animated hexagons now, video later

You confirmed the hero is not static. The handoff's `homepage-hero.jsx` runs a
`<canvas>` with a `requestAnimationFrame` loop drawing three concentric hexagons that
rotate and breathe slowly in teal at 10–16% opacity, echoing the logo mark.

**Implementation:** reproduce it as **inline SVG with CSS `@keyframes`**, not canvas.
Three `<g>` elements, each with its own rotation direction and a 3% breathing scale,
durations around 87s / 79s / 70s so they never resynchronise. Identical visual result,
and it keeps the hero a Server Component with **zero client JavaScript**, GPU-composited
transforms, and `prefers-reduced-motion` handled by a media query rather than a
`matchMedia` call.

The canvas version would need a client component, a permanent rAF loop, and a
`devicePixelRatio` resize handler — all main-thread work, all for decoration, all
against a 120 KB budget and a 150ms TBT gate.

When the video arrives, it layers **behind** the hexagons and in front of the page
background. Both can coexist, or set the hexagons to fade out when video is enabled —
one flag, decided later. Phase 4 builds the stacking order for both cases.

### 1.8 "The poster image is the LCP element" is only true once video is enabled

You are shipping with video disabled, and the design's hero has no image at all. In the
shipped state the LCP element is the **`<h1>` headline**, which is faster than any
image and is the better outcome. Adding a poster image now would *create* an LCP image
where none exists.

**Default:** while `hero.video.enabled` is `false`, render no poster and no `<video>` —
the LCP element is the h1. The poster is only emitted when video is enabled, at which
point it becomes the LCP element with `priority` and `fetchPriority="high"`. Both
states are built in Phase 4; only the flag changes. Phase 9 measures LCP in the
shipped (disabled) state.

### 1.9 Font weight 500 — RESOLVED in Phase 1: it is free, so keep it

Originally decided as "map 500 to 600" to honour the brief's and the budget's
two-weights rule. **Phase 1 measured it and the premise does not hold.**

Outfit on Google Fonts is a **variable** font. `next/font` splits it by
unicode-range, not by weight, so every declared weight resolves to the same files.
Building with `["400","600"]` and with `["400","500","600"]` produces **byte-identical
output** — same file hashes, 32,228 + 14,760 bytes either way.

The budget document's rationale — *"every additional weight is roughly 25KB for a
difference nobody will notice"* — is correct for static per-weight cuts and simply does
not apply here. This is not a budget being weakened; the measured font transfer is
**32.2 KB against a 60 KB budget**, and adding 500 changes it by zero bytes.

**Decision:** load 400, 500 and 600. Nav links, field labels, tag pills and the
work-index fact labels use the design's real 500 weight instead of being mapped to 600.

Only the latin file (32.2 KB) is fetched for English content; latin-ext loads only if
such a character appears.

### 1.10 Third project — RESOLVED: "LevelUp Saloon" everywhere

One name in all positions. This replaces both the brief's `salon-platform` and the
handoff's split naming ("Level Up" on the work index, "Salon management platform" on the
homepage card).

| | Value |
|---|---|
| Slug and URL | `levelup-saloon` → `/work/levelup-saloon` |
| MDX filename | `content/case-studies/levelup-saloon.mdx` |
| `title` | `LevelUp Saloon` |
| `cardTitle` | `LevelUp Saloon` |

**Spelling confirmed:** `Saloon`, two `o`s. The handoff copy's "salon management SaaS"
and "salon management platform" are typos and are corrected to `saloon` in the two
places they appear — `subtitle` and `summary` in `projects.json` (see 5.5). This is the
only edit made to copy the handoff marked as final, and it is a correction you
authorised, not a rewrite.

### 1.11 Only one case study body exists

The handoff builds out Susila in full. Landora and LevelUp Saloon have a summary, tags, role,
timeline and stack, but **no long-form body copy**. **Default:** Phase 5 ships all
three MDX files; Susila is complete and verbatim, the other two are structured stubs
carrying their real facts and summary with `draft: true` in frontmatter. Draft case
studies are excluded from `sitemap.ts` and render a "Case study coming soon" state on
the work index, exactly as the prototype does. Remove `draft: true` when you write them.

### 1.12 The Susila case study names the client, and the source notes said not to

The handoff README states the source notes asked for the study to be published
anonymised — "a Sri Lankan film production company" — until permission is confirmed,
but the draft names Susila Productions. **Default:** ship as drafted (named), and add
`anonymised: false` to the frontmatter so switching is a content edit, not a rewrite.
**Confirm permission before launch.** Phase 9 has this on the launch checklist.

### 1.13 The WhatsApp number is not in the handoff

The prototype's WhatsApp link is `https://wa.me/?text=...` with **no number**. The
brief supplies an email placeholder but no number.
**Default:** `site.json` carries `"number": "94000000000"` and the Zod schema requires
E.164 digits. The build succeeds, but Phase 9's launch checklist fails until it is
replaced. A comment in the file says so.

### 1.14 Timing check — CONFIRMED: client-side only

The contact page is statically generated, so a server-rendered `Date.now()` in a hidden
field is frozen at **build** time and the "time to fill" check silently becomes "time
since deploy". You confirmed client-side-only is fine.

**Behaviour:** the client component writes `Date.now()` into the hidden field on mount.
If the field is missing or unparsable — the no-JavaScript visitor — the server **skips
the timing check** and relies on the honeypot and rate limit. It never rejects on a
missing timestamp. Detailed in Phase 7.

### 1.15 Missing credentials — RESOLVED: fail visibly, never fake success

Your call, and it is the right one. The form **never** returns success unless an email
was actually sent.

**Behaviour when the adapter cannot send** — no API key, provider error, network failure
— is identical in every case:

- The submission does **not** clear the form. The visitor's input stays exactly where it
  was, so nothing they typed is lost.
- An error message appears, persistent, announced to screen readers, containing the two
  fallbacks as **real clickable links**: `Message us on WhatsApp` and `hello@calden.lk`.
- Copy: `We couldn't send your message just now. Please reach us on WhatsApp or email
  hello@calden.lk — we'll pick it up straight away.`
- The underlying provider error is logged server-side only. The visitor never sees it.

**On presentation:** you said toast. I have specified a **persistent inline block**
directly above the submit button instead, and I would push back on the toast here for
one concrete reason — the message contains links the visitor has to click, and toasts
auto-dismiss. Someone reaching for the WhatsApp link watches it vanish. An inline
`role="alert"` block also announces correctly to screen readers, needs no portal, no
timer and no extra client JavaScript. If you still want it floating, it is a wrapper
around the same component and about fifteen lines. Say the word.

**Local development.** With no credentials, `EMAIL_TRANSPORT=noop` in `.env.local` logs
the submission and returns success, so you can build and test the success UI before you
own a domain. It is **opt-in, off by default, and named** — nothing silent, and it
cannot be reached by accident in production because `.env.local` is not deployed. With
the variable unset and no key, every environment shows the error state.

Turning it on for real is still one variable: set `RESEND_API_KEY`.

### 1.15b Shared Zod validation costs more than the remaining budget — decide before Phase 7

Measured in Phase 1, because it is the largest single threat to the JS budget and it
would have been discovered far too late in Phase 7.

The brief asks for "a Zod schema shared between client and server validation". Bundling
the actual contact schema for the browser (esbuild, minified):

| | raw | gzip | brotli |
|---|---|---|---|
| `zod` (classic) | 319.9 KB | 63.3 KB | **52.8 KB** |
| `zod/mini` | 12.4 KB | 4.6 KB | **4.2 KB** |

Remaining headroom on `/` after Phase 1 is **7.9 KB brotli**. Classic Zod on the client
is 6.7× that. It is not affordable at any point in this build.

**Options:**

| | Client cost | Keeps "shared schema"? | Trade-off |
|---|---|---|---|
| **A. `zod/mini` both sides** | 4.2 KB | **yes** | Different authoring API (`.check()` rather than chained methods). Server bundle size is not budgeted, so using mini there too costs nothing and keeps one syntax. |
| B. Classic on server, mini on client | 4.2 KB | partly | Two schema definitions that can drift — the exact failure the brief wanted to avoid. |
| C. No client Zod | 0 KB | no | Server-only validation plus native HTML constraints (`required`, `type="email"`, `minlength`). Errors appear after the Server Action round-trip rather than instantly. Progressive enhancement already requires this path to work. |

**Recommended: A.** One schema file in `zod/mini` syntax, imported by both the client
component and the Server Action. Satisfies the brief's requirement literally, costs
4.2 KB brotli, and leaves roughly 3.7 KB for the mobile nav and form UI.

Phase 7 assumes A unless you say otherwise.

### 1.17 MEASURED: the framework floor eats most of the 120 KB budget

No longer a prediction. Phase 1 measured it.

| Route | gzip | brotli | vs 120 KB |
|---|---|---|---|
| `/` | 130.9 KB | **112.1 KB** | gzip **over by 10.9** / brotli **7.9 spare** |
| `/_not-found` | 130.0 KB | 111.3 KB | gzip over by 10.0 / brotli 8.7 spare |

The bare scaffold, before a line of this project's code, was 135.7 KB gzip / 116.2 KB
brotli. The numbers above are *lower* only because the scaffold's demo page was removed.
**This is the Next 16 + React 19.2 floor, and almost none of it is ours to reduce.**

The budget document says "**Gzipped or Brotli** transfer size", and Vercel serves Brotli
to every modern browser. On that basis the site is compliant with 7.9 KB to spare — a
legitimate reading of the budget's own wording, not a relaxation. On gzip it is not
compliant and cannot be made so without leaving Next.

**This needs your decision, and the budget document is explicit that the answer is never
to quietly raise the number.** The three honest options:

1. **Measure on Brotli** (what actually ships). Compliant today. Headroom 7.9 KB, which
   with `zod/mini` (1.15b) leaves ~3.7 KB for the mobile nav and form UI. Tight but real.
2. **Raise the JS budget** to something the framework can meet — 140 KB gzip / 120 KB
   brotli would restore sane headroom. Your call to make, not mine.
3. **Change the stack.** A framework with a smaller client runtime (Astro, or plain
   static HTML) would put this site at a fraction of the number. That is a much larger
   decision and contradicts the brief's stated stack.

Phase 2 onward proceeds on **option 1** — brotli, tracked in `docs/MEASUREMENTS.md`
every phase — unless you choose otherwise. Every remaining phase reports its delta so
there is no surprise at Phase 9.

### 1.18 Two smaller notes

- **Section ordering differs between prototype pages.** The homepage "Selected work"
  grid runs Landora, Susila, LevelUp Saloon; the work index runs Susila, Landora, LevelUp Saloon.
  **Resolved:** `projects.json` carries an explicit `displayOrder` and both pages sort
  by it. Work index order wins: Susila 1, Landora 2, Salon 3.
- **The logo SVG is unoptimised.** `calden-digital-horizontal.svg` is 9,902 bytes with
  14 decimal places of coordinate precision. Rounding to 2dp gives 5,054 bytes,
  2,077 bytes gzipped. Phase 1 does this before inlining it.

---

## 2. Design reference

Extracted from `design_handoff_calden_site/_ds/calden-digital-design-system-fe8b3ff5-9a3f-4d98-b737-9dcc4c15a8e3/`.
These values are the contract. Do not round, re-derive or "improve" them.

### 2.1 Colour tokens — final, both themes

Light is the handoff's mint palette (1.3). Dark is the brief's column plus the derived
tokens in 1.4 and 1.6. Authored in `app/globals.css`: light on `:root`, dark under
`.dark`.

| Semantic token | Light | Dark | Notes |
|---|---|---|---|
| `--surface-page` | `#EEF2F1` | `#0D1817` | page background |
| `--surface-card` | `#FAFBFB` | `#14211F` | cards, form card, nav |
| `--surface-sunken` | `#E3E9E8` | `#0A1312` | sunken bands, media wells |
| `--surface-band` | `#12312F` | `#1F3733` | emphasis bands — **inverts direction**, see 1.6 |
| `--border` | `#CDD6D4` | `#23332F` | hairlines, card edges — decorative only |
| `--border-control` | `#748280` | `#586F69` | form fields, interactive edges — 3:1 |
| `--text-primary` | `#12312F` | `#E9EFED` | |
| `--text-secondary` | `#4A5C59` | `#A3B3AF` | |
| `--text-subtle` | `#5A6965` | `#7A8A86` | placeholders, captions — 4.5:1 |
| `--text-on-band` | `#E9EFED` | `#E9EFED` | identical in both themes |
| `--text-on-band-muted` | `#B0BAB9` | `#B0BAB9` | identical; replaces `rgba(237,239,238,0.72)` |
| `--brand-teal` | `#0F5C5C` | `#2E9B93` | |
| `--brand-teal-hover` | `#0C4A4A` | `#3FAEA5` | light darkens, dark lightens |
| `--brand-teal-active` | `#0A3E3E` | `#4CBDB3` | |
| `--brand-on-band` | `#3FAEA5` | `#3FAEA5` | teal **on** a band — see 1.6b |
| `--text-on-brand` | `#FAFBFB` | `#0D1817` | **see 1.4** |
| `--accent-gold` | `#D4AF37` | `#E0BE50` | decoration only on light — see 1.5 |
| `--focus-ring` | `#0F5C5C` | `#2E9B93` | |
| `--danger` | `#A6432F` | `#E08D79` | dark value derived; `#A6432F` is 2.73:1 on dark |
| `--success` | `#2F7D5B` | `#5FBF95` | dark value derived |

Flat values are used instead of `rgba()` overlays so a single token swap covers both
themes. `--text-on-band-muted` `#B0BAB9` is the exact flattening of the prototype's
`rgba(237,239,238,0.72)` over `#12312F`.

**Three tokens are identical in both themes** — `--text-on-band`,
`--text-on-band-muted`, `--brand-on-band`. That is deliberate: band components then
never branch on theme, and only the band fill changes.

**`--teal-on-dark` (`#167C78`) from the design system is not used anywhere.** See 1.6b.

### 2.2 Contrast verification — measured, not assumed

Computed with the WCAG 2.x relative-luminance formula against the final mint/dark
palette above. Text minimum 4.5:1 (3:1 for large); non-text and UI boundaries 3:1.

**Light theme** — page `#EEF2F1`, card `#FAFBFB`, sunken `#E3E9E8`

| Pair | Ratio | Verdict |
|---|---|---|
| text-primary `#12312F` on page | 12.35 | pass |
| text-primary on card | 13.45 | pass |
| text-secondary `#4A5C59` on page | 6.27 | pass |
| text-secondary on card | 6.83 | pass |
| text-secondary on sunken | 5.76 | pass |
| text-subtle `#5A6965` on page | 5.11 | pass |
| text-subtle on card | 5.56 | pass |
| text-subtle on sunken | 4.69 | pass |
| brand teal `#0F5C5C` on page | 6.88 | pass |
| brand teal on card | 7.49 | pass |
| brand teal on sunken | 6.32 | pass |
| on-brand `#FAFBFB` on teal fill | 7.49 | pass |
| focus ring on page | 6.88 | pass (3:1 non-text) |
| border-control `#748280` on page | 3.55 | pass (3:1) |
| border-control on card | 3.86 | pass (3:1) |
| border-control on sunken | 3.26 | pass (3:1) |
| **gold `#D4AF37` on page** | **1.86** | **fail — decoration only** |
| **gold on card** | **2.03** | **fail — decoration only** |

**Light theme, on the band `#12312F`**

| Pair | Ratio | Verdict |
|---|---|---|
| text-on-band `#E9EFED` | 11.97 | pass |
| text-on-band-muted `#B0BAB9` | 7.02 | pass |
| gold `#D4AF37` | 6.63 | pass — gold is legitimate here |
| brand-on-band `#3FAEA5` | 5.19 | pass |
| ~~`--teal-on-dark` `#167C78`~~ | 2.78 | **fail — do not use, see 1.6b** |

**Dark theme** — page `#0D1817`, card `#14211F`, band `#1F3733`

| Pair | Ratio | Verdict |
|---|---|---|
| text-primary `#E9EFED` on page | 15.54 | pass |
| text-secondary `#A3B3AF` on page | 8.30 | pass |
| text-secondary on card | 7.60 | pass |
| text-subtle `#7A8A86` on page | 5.01 | pass |
| text-subtle on card | 4.58 | pass |
| brand teal `#2E9B93` on page | 5.37 | pass |
| brand teal on card | 4.91 | pass |
| **light text on teal fill** | **2.90** | **fail — use `--text-on-brand`** |
| **`#0D1817` on teal fill** | **5.37** | **pass — this is the button** |
| gold `#E0BE50` on page | 10.04 | pass |
| border-control `#586F69` on card | 3.07 | pass (3:1) |
| border-control on page | 3.36 | pass (3:1) |
| focus ring `#2E9B93` on page | 5.37 | pass (3:1 non-text) |
| text-on-band `#E9EFED` on band | 10.91 | pass |
| text-on-band-muted `#B0BAB9` on band | 6.40 | pass |
| gold `#E0BE50` on band | 7.05 | pass |
| brand-on-band `#3FAEA5` on band | 4.73 | pass |

**Surface steps** (perception, not WCAG): light band vs page 12.35:1 down; dark band vs
page 1.42:1 **up**, vs card 1.30:1 up.

`--border` (`#CDD6D4` light, `#23332F` dark) is **decorative only** — 1.31:1 and
1.25:1. Correct for card hairlines and section rules, which carry no information and are
not interactive. It must never be the only boundary of a form control; that is what
`--border-control` is for.

### 2.3 Type scale

Outfit. Headings 600, body 400. See 1.9 on weight 500.

| Token | Desktop | Mobile (≤640px) | Line height D/M | Tracking |
|---|---|---|---|---|
| `--fs-display` | 64px | 40px | 1.06 / 1.08 | −0.022em |
| `--fs-h1` | 48px | 34px | 1.10 / 1.14 | −0.02em |
| `--fs-h2` | 36px | 28px | 1.18 / 1.20 | −0.015em |
| `--fs-h3` | 24px | 21px | 1.28 / 1.30 | −0.01em |
| `--fs-body-lg` | 20px | 18px | 1.6 / 1.55 | 0 |
| `--fs-body` | 17px | 16px | 1.65 / 1.62 | 0 |
| `--fs-small` | 15px | 14px | 1.55 / 1.5 | 0 |
| `--fs-caption` | 13px | 12px | 1.4 / 1.35 | 0.06em |

Reading measure `--measure: 68ch`.

**Page-specific sizes that override the scale.** These are in the prototype and are
deliberate; reproduce them exactly.

| Element | Desktop | Mobile |
|---|---|---|
| Homepage hero h1 | 58px / 1.05 / −0.022em, max-width 17ch | 30px / 1.12 |
| Homepage hero subhead | 20px / 1.6, max-width 58ch | 16px |
| Page header h1 (Work, Services, About) | 58px / 1.05 / −0.022em | 36px |
| Page header lead | 21px / 1.5, max-width 56ch | 17px |
| Contact page h1 | 52px / 1.06 / −0.022em | 34px |
| Case study h1 | 54px / 1.06 / −0.022em | 34px |
| Case study subtitle | 22px / 1.4, max-width 32ch | 18px |
| Case study lead paragraph | 23px / 1.55 / −0.01em | 19px |
| Case study body paragraph | 18px / 1.72 | 16px |
| Case study pull statement | 40px / 1.1 / −0.02em | 28px |
| Work index project title | 34px / −0.02em | 28px |
| Services block title | 32px / −0.02em | 26px |
| About pull-quote | 44px / 1.12 / −0.02em | 28px |
| About intro h2 | 34px / −0.02em | 26px |
| Streaming band h2 | 32px / −0.015em | 26px |
| Eyebrow | 12px / 0.14em / uppercase / 600 | same |

### 2.4 Spacing, radius, motion

8px base. `--space-1` 4, `-2` 8, `-3` 12, `-4` 16, `-5` 24, `-6` 32, `-7` 48,
`-8` 64, `-9` 96, `-10` 128.

Section padding **96px desktop / 56px mobile** (`py-24 sm:py-24`, see Phase 1 for the
exact utility pairing). Horizontal gutter **64px desktop / 20px mobile**.
Container max **1200px**. Case-study reading column **760px**. Streaming/CTA narrow
column **820px**.

Radius: 3 / 6 / 10 / 14px and `999px` pill. Buttons use 6px, cards 10px.

Motion: 120 / 200 / 320ms, `cubic-bezier(0.2, 0, 0, 1)` standard,
`cubic-bezier(0.16, 1, 0.3, 1)` for entrances. Fades and colour transitions only. No
bounce, no scale-pop.

**No box shadows anywhere, in either theme.** Elevation is borders plus surface steps.
This includes focus rings: the design system's form focus uses `box-shadow: 0 0 0 3px`,
which this build replaces with `outline` so the "no shadows in dark mode" rule holds
literally and one implementation serves both themes.

### 2.5 Breakpoints

The design has exactly two, and mixing them up is the most common layout bug here.

| Name | Width | Governs |
|---|---|---|
| `sm` | 640px | type scale and section padding switch |
| `desk` | 820px | **layout** switch: nav collapses to hamburger, all multi-column grids collapse, footer goes 4-col to 2-col |

`sm` is a Tailwind default. `desk` is custom and must be added. Verify every page at
**390px and 1440px**, the two widths the design was checked at.

### 2.6 Component specifications

Ported from the design-system bundle. Class names below are the ones to create; the
`cd-` prefixed originals are reference only.

**Button** — inline-flex, gap 8px, weight 600, tracking −0.01em, line-height 1,
radius 6px, 1px border, transitions on background/color/border-color at 200ms.

| Size | Font | Padding |
|---|---|---|
| `sm` | 13px | 8px 16px |
| `md` | 15px | 12px 22px |
| `lg` | 17px | 16px 30px |

- primary: fill `--brand-teal`, text `--text-on-brand`, border `--brand-teal`;
  hover `--brand-teal-hover`, active `--brand-teal-active`.
- secondary: transparent fill, text and border `--brand-teal`; hover fills
  `color-mix(in srgb, var(--brand-teal) 7%, transparent)`, active 13%.
- text: transparent, teal, 6px horizontal padding, radius 3px; hover underlines with
  3px offset.
- focus-visible: `outline: 2px solid var(--focus-ring); outline-offset: 3px`.
- disabled: `opacity: 0.4; pointer-events: none`.

**Form control** — 16px text (never smaller; iOS zooms on focus below 16px),
line-height 1.5, padding 11px 14px, radius 6px, background `--surface-card`,
**border 1px `--border-control`**, full width, `appearance: none`.
Focus: `outline: 2px solid var(--focus-ring); outline-offset: 0` and border becomes
`--brand-teal`. Invalid: border `--danger`. Placeholder `--text-subtle`.
Textarea: `resize: vertical; min-height: 120px`.
Select: 40px right padding with a 16×16 chevron absolutely positioned 14px from the
right, `pointer-events: none`, stroke 1.6.

**Field wrapper** — column, 8px gap. Label 14px weight 600 tracking −0.005em colour
`--text-primary`. Required marker is a teal `*`. Hint 13px `--text-subtle`.
Error 13px `--danger`. Error replaces hint when present.

**Card** — background `--surface-card`, 1px `--border`, radius 10px, no shadow,
border-color transition 200ms. Link cards deepen the border to `--border-control` on
hover and turn the title teal. **No lift, no scale.**

**Project card** (homepage grid) — 4:3 media area with `--surface-sunken` background
and a 1px bottom border, `object-fit: cover`; body padding 24px, 12px gap; title 22px
600 −0.015em; summary 15px/1.6 `--text-secondary`; meta caption 12px, 0.04em,
uppercase, weight 600, `--text-subtle`.

**Service card** (homepage grid) — padding 32px, 16px gap. Top row: index 13px 600
0.06em teal, then a 1px `--border` rule filling the remaining width. Title 21px 600
−0.01em. Description 15px/1.62 `--text-secondary`, max-width 46ch.

**Process step ring** — 48px circle, 2px border. On a normal page surface the border is
`--brand-teal`. **On a band** — which is where the homepage uses it — the border is
`--brand-on-band` and the numeral is `--text-on-band`, identical in both themes. Number
18px weight 600. See 1.6b for why `--teal-on-dark` is not used. The desktop connecting line is
2px, inset 10% each side, positioned at `top: 24px` behind the rings; the mobile rail
is a 2px vertical line at `left: 23px`.

**Eyebrow** — 12px, 0.14em, uppercase, weight 600. On a light surface it is
`--brand-teal`; **on a band it is `--brand-on-band`**, never `--teal-on-dark`.

**Tag pill** — 12px, 0.04em, uppercase, weight 600, `--text-subtle`,
background `--surface-sunken`, pill radius, padding 4px 10px.
The services "included" chips differ: 13px, sentence case, weight 600,
`--text-primary`, background `--surface-card`, 1px `--border`, padding 5px 12px.

**Nav** — sticky top, `z-index: 20`, background `--surface-page`, 1px bottom
`--border`. Height **76px desktop / 60px mobile**. Logo left at 30px / 26px tall.
Links 15px weight 600 tracking −0.005em, 32px gap, hover teal, current page teal with
a 2px teal underline 2px below the text.

**Footer** — background `--surface-band`, text `--text-on-band`. Inner max 1200px,
padding 96px `--section-x` 48px. Top grid `1.4fr 1fr 1fr 1fr`, collapsing to `1fr 1fr`
at 820px. Wordmark is **type, not the logo file**: `Calden` at 24px weight 600
tracking −0.02em in `--text-on-band`, then `Digital` at 11px, 0.24em, uppercase, in
`--accent-gold`, baseline-aligned. Tagline 16px/1.6 `--text-on-band-muted`, max 34ch.
Column headings 12px, 0.08em, uppercase, weight 600, `--accent-gold`. Column links
15px `--text-on-band-muted`, hover `--text-on-band`. Bottom bar has a 1px top border
in `color-mix(in srgb, var(--text-on-band) 16%, transparent)`, 13px muted text, space
between.

---

## 3. Target file tree

`"use client"` appears in exactly five files, marked below. If it appears anywhere
else, that is a bug.

```
/
  package.json
  pnpm-lock.yaml
  next.config.ts
  tsconfig.json
  postcss.config.mjs
  eslint.config.mjs
  .vercelignore                   excludes docs/ and the design handoff from deploys
  .env.example
  .env.local                      (gitignored)
  README.md
  /docs
    BUILD-PLAN.md                 (this file)
    calden-performance-budget.md  (exists — binding, never edited)
    MEASUREMENTS.md               (Phase 1, appended each phase)
    PRE-DEPLOY-CHECKLIST.md       (Phase 9)
  /content
    site.json
    navigation.json
    services.json
    process.json
    projects.json
    /case-studies
      susila.mdx
      landora.mdx
      levelup-saloon.mdx
  /lib
    content.ts                    typed accessors — the only reader of /content
    schemas.ts                    all Zod schemas
    mdx.ts                        MDX loading + frontmatter validation
    contact-schema.ts             shared client/server form schema
    email.ts                      EmailAdapter interface + resend + noop
    rate-limit.ts                 in-memory limiter
    whatsapp.ts                   URL builder
    seo.ts                        metadata + JSON-LD helpers
    cn.ts                         3-line class joiner (no dependency)
  /components
    /layout
      Header.tsx                  server
      Nav.tsx                     server
      MobileNav.tsx               "use client"  (1)
      ThemeToggle.tsx             "use client"  (2)
      Footer.tsx                  server
      ThemeScript.tsx             server, emits the blocking inline script
    /ui
      Button.tsx                  server, polymorphic a/button
      Card.tsx                    server
      Tag.tsx                     server
      Eyebrow.tsx                 server
      Section.tsx                 server, owns section padding + surface
      Container.tsx               server, owns max-width + gutters
      Prose.tsx                   server, MDX body styles
      Field.tsx                   server, label + control + message
      Logo.tsx                    server, inline themed SVG
    /icons
      ChatGlyph.tsx  Menu.tsx  Close.tsx  Chevron.tsx  Sun.tsx  Moon.tsx  Arrow.tsx
    /home
      Hero.tsx                    server
      HeroVideo.tsx               "use client"  (3)
      WhatWeDo.tsx  HowWeWork.tsx  SelectedWork.tsx  StreamingBand.tsx
      WhyCalden.tsx  ContactSection.tsx
    /work
      ProjectCard.tsx  ProjectRow.tsx  CaseStudyHeader.tsx  FactsStrip.tsx
      ScreensSection.tsx  QuoteBand.tsx  PrevNext.tsx
      BrowserFrame.tsx  PhoneFrame.tsx
    /contact
      ContactForm.tsx             "use client"  (4)
      ContactActions.tsx          server, WhatsApp + email buttons
    /seo
      JsonLd.tsx                  server, inline application/ld+json
    /analytics
      Plausible.tsx               server, renders next/script or null
    /shared
      ContactCTA.tsx  PageHeader.tsx  BandSection.tsx
      WhatsAppButton.tsx          server
      WhatsAppFloating.tsx        "use client"  (5) — built, not mounted
  /app
    layout.tsx
    globals.css
    page.tsx                      /
    not-found.tsx
    sitemap.ts
    robots.ts
    /actions
      contact.ts                  "use server"
    /work
      page.tsx
      /[slug]
        page.tsx
    /services/page.tsx
    /about/page.tsx
    /contact/page.tsx
    /privacy/page.tsx
  /public
    /images/…                     project covers, portrait, og images
    /video/…                      empty until you add the hero video
    favicon.ico  icon.svg  apple-icon.png
  /scripts
    validate-content.ts           prebuild gate
    check-budget.mjs              Phase 9
    check-a11y-static.mjs         Phase 9
  .size-limit.json                Phase 9
  lighthouserc.js                 Phase 9
  /.github/workflows
    ci.yml                        Phase 9
```

---

## 4. Dependencies

Verified against the npm registry on 2026-08-19. Pin exactly; do not use `latest`.
The budget document requires a written justification for any new dependency over 10 KB.

**Runtime**

| Package | Version | Why |
|---|---|---|
| `next` | `16.3.1` | |
| `react` / `react-dom` | `19.2.8` | Next 16 peer range is `^19.0.0` |
| `zod` | `4.4.3` | content + form schemas |
| `next-mdx-remote` | `6.0.0` | RSC MDX compile at build time |
| `gray-matter` | `4.0.3` | frontmatter parse |
| `resend` | `6.20.0` | default email adapter |
| `@vercel/speed-insights` | `2.0.0` | required by the budget document |

**Dev**

| Package | Version | Why |
|---|---|---|
| `typescript` | **`6.0.3`** | newest version the toolchain supports — see 4.1 |
| `tailwindcss` / `@tailwindcss/postcss` | `4.3.3` | |
| `@types/node` | `26.2.0` | |
| `@types/react` / `@types/react-dom` | `19.2.18` / matching | |
| `eslint` + `eslint-config-next` | `16.3.1` | |
| `tsx` | latest | runs `scripts/*.ts` |
| `@next/bundle-analyzer` | `16.3.1` | budget doc, Phase 9 |
| `size-limit` + `@size-limit/file` | `13.0.3` | budget doc, Phase 9 |
| `@lhci/cli` | `0.15.1` | budget doc, Phase 9 |

### 4.1 TypeScript — use 6.0.3, the newest version the toolchain supports

You were right to push on this. **TypeScript 6.0.3 is published as stable** and it works
with everything here. That is the pin.

Why 6 and not 7, precisely:

| | 5.9.3 | **6.0.3** | 7.0.2 |
|---|---|---|---|
| Compiler API at package root | yes | **yes** | **no** — `exports` is `'.': './lib/version.cjs'` |
| Implementation | TypeScript | TypeScript | Go, native binaries |
| Works with `next build` typecheck | yes | **yes** | **no** — Next loads the TS API from `node_modules` |
| `typescript-eslint@8.67.0` peer `>=4.8.4 <6.1.0` | yes | **yes** — 6.0.3 < 6.1.0 | **no** |
| Newest language features | no | **yes** | yes |

Verify both claims yourself in two commands:

```
npm view typescript@6.0.3 bin dependencies   # → tsc + tsserver, no native deps
npm view typescript@7.0.2 exports            # → '.': './lib/version.cjs'
```

There is a second reason 6.0.3 is the right stop, beyond "it is the newest that works".
**TypeScript 6 is the bridge release**: it removes the deprecated APIs and aligns
semantics with 7, so code that compiles clean under 6 compiles under 7. Adopting it now
*is* the migration. When typescript-eslint ships TS 7 support and Next declares
compatibility, the upgrade becomes a one-line version bump with no code changes.

**Be careful with the dist-tag.** `typescript@latest` currently resolves to **7.0.2**, so
`pnpm add -D typescript` installs the version that breaks the build. Pin the exact
string `"typescript": "6.0.3"` in `package.json`, no caret.

**Phase 1 smoke test.** TS 6 removes deprecated compiler APIs, and Next 16 does not
formally declare support for it, so prove it before building on it:

```
pnpm tsc --version          # → 6.0.3
pnpm tsc --noEmit           # → clean
pnpm exec next build        # typecheck runs inside this — must not error on TS itself
pnpm exec next lint         # typescript-eslint must load without a version warning
```

All four pass → keep 6.0.3. Any of them fails on TypeScript itself rather than on your
code → drop to `5.9.3`, note it in `docs/MEASUREMENTS.md`, and carry on. Nothing else in
this plan depends on the choice.

### 4.2 Build and dev speed

You also asked to make the app faster. Separating the two things that means, because
they have different answers:

**Toolchain speed.** TypeScript 6 is still the TypeScript-in-TypeScript compiler, so it
is *not* meaningfully faster than 5.9 — the order-of-magnitude win is the native port in
7, which the section above rules out for now. You can still have it for the inner loop
without touching the build, by installing 7 under an alias:

```jsonc
"devDependencies": {
  "typescript": "6.0.3",
  "typescript-native": "npm:typescript@7.0.2"
},
"scripts": {
  "typecheck": "tsc --noEmit",
  "typecheck:fast": "node_modules/typescript-native/bin/tsc --noEmit"
}
```

**Tried in Phase 1 and removed.** Both packages declare `bin: { tsc }`, so they collide
in `node_modules/.bin/tsc` and pnpm links whichever it processed last — which was TS 7.
`pnpm exec tsc --version` then reported **7.0.2** while `next build` correctly used 6.0.3
via module resolution. A local typecheck silently running a different compiler from the
build is exactly the kind of inconsistency that costs hours, and the honest saving on a
codebase this size is a second or two. **Do not add the alias.**

Two `tsconfig.json` settings that do matter for repeat runs:

```jsonc
"incremental": true,
"tsBuildInfoFile": "node_modules/.cache/tsconfig.tsbuildinfo",
"skipLibCheck": true    // create-next-app sets this; keep it
```

**Bundler.** Next 16 ships Turbopack. Phase 1 must **confirm which bundler the build
actually used** — read the `next build` banner — and use Turbopack for both `dev` and
`build` if it is not already the default, via `next dev --turbopack` /
`next build --turbopack`. Record the before/after build time in `docs/MEASUREMENTS.md`.
If Turbopack produces different bundle sizes from webpack, the budget applies to
whichever one ships, so re-run `pnpm check:budget` after switching.

**React Compiler** (`babel-plugin-react-compiler@1.0.0`, an optional peer of Next 16) —
**not used.** Its win is automatic memoization of client components, and this site has
five small ones totalling a few KB. It would add a Babel pass to every build for close to
zero runtime gain, on a project whose budget is about shipping *less* JavaScript, not
re-rendering it more cleverly. Revisit only if a client component grows real interactive
state.

**Runtime speed** of the shipped site is already governed by
`docs/calden-performance-budget.md` and the architecture in this plan: everything static,
Server Components by default, five client leaves, no animation/icon/UI libraries, two
font weights. There is one further lever worth *measuring* in Phase 9 — Next's
experimental CSS inlining, which folds the stylesheet into the HTML and removes a
render-blocking round-trip from the critical path. With a ≤20 KB CSS budget and a 2.0s
LCP target on Slow 4G that could be worth real milliseconds. Treat it as
measure-then-keep: turn it on, run Lighthouse three times, keep it only if LCP improves
and CLS does not. Do not enable it blind.

**On Tailwind:** this is **v4**, which is CSS-first. There is **no `tailwind.config.js`**.
Configuration lives in `app/globals.css` using `@import "tailwindcss"`, `@theme`, and
`@custom-variant`. A model trained mostly on v3 will try to create a config file and a
`content: []` array. It will not work. Phase 1 gives the exact syntax.

**Not used, deliberately:** `next-themes` (the toggle is ~30 lines and the dependency
adds a provider and its own client boundary), `clsx`, `tailwind-merge`, `framer-motion`,
`lucide-react`, `@next/mdx` (it wants MDX files routed as pages, which conflicts with
keeping content in `/content`), `@vercel/og` (see Phase 8). The budget document also
names jQuery, lodash and moment as prohibited — including transitively, so check
`pnpm why` if a dependency is ever added.

---

## 5. Content inventory

This is the complete text of the site. It was extracted from the prototype JSX because
the content documents named in the brief are not in the repository (see 1.2). Phase 2
writes these files verbatim.

**Copy status:** items marked `UNAPPROVED` were authored by the design assistant, not
supplied by the client. Everything else is client copy and is final.

Note the punctuation. The brand voice uses em dashes and typographic apostrophes
(`’`), en dashes in ranges (`1–3`), and **no exclamation marks, no emoji**. Preserve
the exact characters. In JSON they are literal UTF-8, not escapes.

### 5.1 `content/site.json`

```json
{
  "company": {
    "name": "Calden Digital",
    "shortName": "Calden",
    "tagline": "Building the digital foundation for modern businesses",
    "description": "A software studio in Sri Lanka. We plan, design and build custom websites, web applications and software for businesses here and abroad.",
    "foundedYear": 2024
  },
  "contact": {
    "email": "hello@calden.lk",
    "replyTime": "We reply within a day.",
    "locationShort": "Colombo, Sri Lanka",
    "locationLong": "Based in Sri Lanka. Working with clients locally and worldwide.",
    "contactPageNote": "Based in Sri Lanka, working with clients locally and worldwide. We reply within a day."
  },
  "whatsapp": {
    "number": "94000000000",
    "defaultMessage": "Hi Calden — I’d like to talk about a project.",
    "label": "Message us on WhatsApp"
  },
  "socials": [],
  "hero": {
    "headline": "We design and build websites, web apps and custom software.",
    "subhead": "A software studio in Sri Lanka. We work through the whole process — understanding what your business needs, designing it, and building it properly.",
    "primaryCta": { "label": "Start a project", "href": "/contact" },
    "video": {
      "enabled": false,
      "poster": { "src": "/video/hero-poster.jpg", "alt": "", "width": 1920, "height": 1080 },
      "sources": {
        "mobile": { "src": "/video/hero-720.mp4", "type": "video/mp4", "maxWidth": 819 },
        "desktop": { "src": "/video/hero-1080.mp4", "type": "video/mp4" }
      },
      "scrimOpacity": 0.55
    }
  },
  "seo": {
    "siteUrl": "https://calden.lk",
    "defaultTitle": "Calden — Web design and software development in Sri Lanka",
    "titleTemplate": "%s — Calden Digital",
    "defaultDescription": "A software studio in Sri Lanka. We plan, design and build custom websites, web applications and software for businesses here and abroad.",
    "defaultOgImage": { "src": "/images/og-default.png", "width": 1200, "height": 630, "alt": "Calden Digital" },
    "twitterHandle": null
  },
  "analytics": { "plausibleDomain": null },
  "copyright": "© 2026 Calden"
}
```

`whatsapp.number` is a **placeholder** (see 1.13). `seo.siteUrl` is a placeholder until
the domain is registered. `analytics.plausibleDomain: null` keeps the script off.
`hero.video.enabled: false` is the shipping state.

### 5.2 `content/navigation.json`

```json
{
  "primary": [
    { "label": "Work", "href": "/work" },
    { "label": "Services", "href": "/services" },
    { "label": "About", "href": "/about" },
    { "label": "Contact", "href": "/contact" }
  ],
  "navCta": { "label": "Start a project", "href": "/contact" },
  "footerColumns": [
    {
      "title": "Pages",
      "links": [
        { "label": "Work", "href": "/work" },
        { "label": "Services", "href": "/services" },
        { "label": "About", "href": "/about" },
        { "label": "Contact", "href": "/contact" }
      ]
    },
    {
      "title": "Contact",
      "links": [
        { "label": "hello@calden.lk", "href": "mailto:hello@calden.lk" },
        { "label": "WhatsApp", "href": "whatsapp" }
      ]
    }
  ],
  "legal": [{ "label": "Privacy", "href": "/privacy" }]
}
```

`"href": "whatsapp"` is a sentinel. `lib/content.ts` resolves it through
`lib/whatsapp.ts` so the number lives in one place. The schema accepts either a path
starting `/`, a `mailto:`, or the literal `"whatsapp"`.

### 5.3 `content/services.json`

Four blocks. The homepage uses `index`, `title`, `lead`. The services page uses all
five fields. The two pages currently show identical `lead` text in the prototype, so
there is one source.

```json
[
  {
    "slug": "websites",
    "index": "01",
    "title": "Websites",
    "lead": "Fast, well-built sites that work properly on a phone. Easy for your team to update, and set up so people can actually find you.",
    "body": "We build the site around one job: helping a visitor decide you’re worth contacting. Clear structure, quick pages, and content your team can change without calling us. Search and analytics are set up from the start, so you can see what’s working and what isn’t.",
    "includes": ["Marketing & content sites", "Landing pages", "SEO groundwork", "Analytics setup"]
  },
  {
    "slug": "web-applications",
    "index": "02",
    "title": "Web applications",
    "lead": "Booking systems, dashboards, admin panels, internal tools. Software shaped around how your business already works, rather than forcing you to change how you work.",
    "body": "We start from the process you already run and build the screens your staff actually use and the reports you actually read. It is built to be maintained rather than to impress — so it keeps working long after launch.",
    "includes": ["Booking & scheduling", "Dashboards", "Admin panels", "Internal tools"]
  },
  {
    "slug": "custom-software",
    "index": "03",
    "title": "Custom software",
    "lead": "When off-the-shelf doesn’t fit, we build what does — designed around your process, and built so it can grow with you.",
    "body": "Some problems have no product you can buy. We design and build the thing you actually need, keep it simple enough to run day to day, and structure it so it can change as your business does.",
    "includes": ["Bespoke systems", "Integrations", "Data & reporting", "APIs"]
  },
  {
    "slug": "ongoing-support",
    "index": "04",
    "title": "Ongoing support",
    "lead": "Hosting, updates, changes and improvements after launch. Someone to call when something needs doing.",
    "body": "Launch is not the end of the work. We stay on to keep things running, make changes as they come up, and improve the parts that matter — so the site or system keeps earning its place.",
    "includes": ["Hosting", "Maintenance", "Changes", "Improvements"]
  }
]
```

All four `body` fields and all `includes` arrays are `UNAPPROVED`.

### 5.4 `content/process.json`

```json
{
  "heading": "How we work",
  "intro": "We plan before we build. Every project moves through the same five steps.",
  "steps": [
    { "step": "1", "title": "Understand the business", "description": "We start with a conversation about what your business actually does and where it’s losing time or customers. Not a feature list — the problem underneath it." },
    { "step": "2", "title": "Plan and scope", "description": "We map out what needs building and why, then put it in writing: what you’re getting, how long it takes, what it costs. Nothing starts until that’s agreed." },
    { "step": "3", "title": "Design", "description": "We design the structure and the interface before writing code. You see it, comment on it, and change it while changing it is still cheap." },
    { "step": "4", "title": "Build", "description": "Regular progress you can look at and respond to. No disappearing for six weeks and hoping it’s what you wanted." },
    { "step": "5", "title": "Launch and after", "description": "Deployment, handover, training your team if needed — and support once it’s live." }
  ]
}
```

### 5.5 `content/projects.json`

`title` is the work-index and case-study name. `cardTitle` and `cardSummary` are the
shorter homepage variants. `displayOrder` governs both pages (see 1.18).

```json
[
  {
    "slug": "susila",
    "displayOrder": 1,
    "featured": true,
    "title": "Susila",
    "subtitle": "Rebuilding the streaming layer of a Sinhala film platform",
    "cardTitle": "Susila — streaming platform",
    "cardSummary": "A film streaming platform whose video delivery wasn’t working. We rebuilt it around adaptive playback, added live streaming, and took it to launch.",
    "cardMeta": "One developer · one month",
    "summary": "Susila Productions had a subscription streaming platform that had already been built — and the streaming itself didn’t work properly. We were brought in to fix the part that mattered most. We rebuilt video delivery around adaptive streaming, added live broadcast, and integrated recurring subscription billing.",
    "tags": ["Web app", "Streaming"],
    "role": "Sole developer on the rebuild",
    "timeline": "Roughly one month, part-time",
    "stack": ["React", "Node.js", "MongoDB", "HLS", "Stripe"],
    "cover": { "src": "/images/work/susila-cover.jpg", "alt": "The Susila streaming platform playing a film in the custom HLS player", "width": 1600, "height": 1000 }
  },
  {
    "slug": "landora",
    "displayOrder": 2,
    "featured": true,
    "title": "Landora Tours",
    "subtitle": "Full content site for a Sri Lankan tour operator",
    "cardTitle": "Landora Tours — travel site",
    "cardSummary": "Seventeen itineraries, thirty-plus experiences, an interactive island map, and multi-language support. Designed and built in two weeks.",
    "cardMeta": "Design and build · two weeks",
    "summary": "Landora Tours design private journeys across Sri Lanka for travellers from Europe, Australia and Asia. Almost all of their enquiries begin with a stranger abroad deciding whether this company looks trustworthy. We designed and built the entire site — seventeen itineraries, thirty-plus experiences, destination guides, an interactive island map, and a journal — with enquiry routed straight to WhatsApp.",
    "tags": ["Website", "Multi-language"],
    "role": "Design and build from scratch",
    "timeline": "Two weeks",
    "stack": ["Next.js", "Tailwind CSS", "Vercel"],
    "cover": { "src": "/images/work/landora-cover.jpg", "alt": "The Landora Tours homepage showing an itinerary and the interactive island map", "width": 1600, "height": 1000 }
  },
  {
    "slug": "levelup-saloon",
    "displayOrder": 3,
    "featured": true,
    "title": "LevelUp Saloon",
    "subtitle": "Inherited a saloon management platform mid-flight and shipped it on deadline",
    "cardTitle": "LevelUp Saloon",
    "cardSummary": "A booking and management system days from its deadline with unresolved defects. We audited the system end to end, found what was breaking it, and delivered on schedule.",
    "cardMeta": "Audit and delivery · shipped on time",
    "summary": "A saloon management SaaS was days from delivery with defects the original developers hadn’t been able to resolve. We came in cold, audited the entire system end to end, found three real bugs — including one that silently broke appointment editing for every user — fixed them, and delivered on the original date.",
    "tags": ["Rescue", "Web app"],
    "role": "Audit and delivery",
    "timeline": "3–5 days, against a fixed deadline",
    "stack": ["Next.js", "TypeScript", "Supabase", "Zod"],
    "cover": { "src": "/images/work/levelup-saloon-cover.jpg", "alt": "The LevelUp Saloon dashboard showing the appointment calendar", "width": 1600, "height": 1000 }
  }
]
```

### 5.6 Homepage section copy

**Section 2 — "What we do"** — heading `What we do`, then the four `services.json`
entries as cards (index, title, lead).

**Section 3 — "How we work"** — dark band, from `process.json`.

**Section 4 — "Selected work"** — heading `Selected work`, link `See all work →`
to `/work`. Cards from `projects.json` where `featured` is true, sorted by
`displayOrder`, using `cardTitle`, `cardSummary`, `cardMeta`, `cover`.

**Section 5 — "Streaming band"** (sunken, hairline top and bottom, 820px centred)

- h2: `We’ve built streaming platforms`
- body: `Video is one of the harder things to get right — it has to adapt to the viewer’s connection, and it has to do it without an infrastructure bill that sinks the business. We’ve delivered video-on-demand and live streaming for two media companies, on two different commercial models.`
- link: `See how we did it →` → `/work/susila`

**Section 6 — "Why Calden"** — three items, each with a 2px teal top rule.

1. `You talk to the person building it` — `No account managers, no handover to someone junior. The person who plans your project is the person who builds it.`
2. `We plan before we build` — `Every project starts with understanding the business and agreeing a scope in writing. You know what you’re getting before anything is made.`
3. `Built properly, so it can grow` — `Custom code rather than a template with the logo swapped. Your site does what your business needs — and it can be changed as your business changes.`

**Section 7 — Contact** (sunken, `id="contact"`, 5fr/6fr)

- h2: `Tell us about your project`
- body: `New site, a system you need built, or you’re not yet sure what you need — send us a message and we’ll tell you honestly whether we can help.`
- buttons: WhatsApp, then `hello@calden.lk`
- form hint beside submit: `We reply within a day.`

Store these six blocks in a `homepage` key in `site.json` rather than in components.
Phase 2 defines the shape; Phase 4 consumes it.

### 5.7 Shared page chrome copy

**Contact CTA band** (Work, Services, About, case studies — not the Contact page):
same heading, body and buttons as homepage section 7, centred, sunken, 1px top border.

**Page headers**

| Page | Eyebrow | h1 | Lead |
|---|---|---|---|
| Work | `Selected work` | `Work` | `Websites, web applications and custom software for businesses in Sri Lanka and abroad. Three we can talk about in detail.` `UNAPPROVED` |
| Services | `Services` | `What we do` | `Web and software work leads. Everything else supports it. Here is each in more detail.` |
| About | `About` | `Calden is one person.` | `I design and build websites and software for businesses — from the first conversation through to launch and beyond.` `UNAPPROVED` |
| Contact | `Contact` | `Tell us about your project` | `New site, a system you need built, or you’re not yet sure what you need — send us a message and we’ll tell you honestly whether we can help.` |

### 5.8 Services page — "Taking over an existing project" `UNAPPROVED`

Reading column, 1px top rule, no card, no button.

- h2: `Taking over an existing project`
- body: `If you have a build that stalled — a developer who stopped replying, or a project that’s nearly there but not working — we can take it over. We audit what exists, tell you honestly what it needs, and finish it. Two of the projects in our work started this way.`

### 5.9 About page `UNAPPROVED` — all of it

- Portrait slot: 4:5, alt `Dilshan Wickramasinghe, founder of Calden Digital`
- h2: `Dilshan Wickramasinghe`, role line: `Developer & founder, Calden Digital`
- Para 1: `Calden Digital is one person. I started it to do software properly for businesses that had been let down by templates, by agencies that hand you to someone junior, or by developers who stopped replying halfway through.`
- Para 2: `I work across the whole thing — understanding the problem, designing the solution, writing the code, and staying on after launch. Because it’s one person, nothing gets lost in a handover, and you always know who you’re talking to.`
- Dark band pull-quote: `You talk to the person who builds it.` plus `No account managers. No handover. The person who plans your project is the person who builds it.`
- `How I work`, three items with 2px teal top rules:
  1. `Plan before build` — `Every project starts with understanding your business and agreeing a scope in writing. You know what you’re getting before anything is made.`
  2. `Honest about scope` — `If something isn’t worth building, or isn’t something I can do well, I’ll say so. A clear no is worth more than a vague yes.`
  3. `Built to last` — `Custom code, kept simple, and structured so it can change as your business changes.`
- `Where we are based` — `Based in Colombo, Sri Lanka. Working with clients here and abroad.`

**Voice note:** the brand rules say use "we" for the studio, not "I". The About page
deliberately breaks that because its subject is that Calden is one person. Keep the
mixture exactly as written. Do not normalise it.

### 5.10 Contact form options

Shared by the homepage section and the Contact page. Store in `site.json` under
`contactForm`; the Zod enum in `lib/contact-schema.ts` is generated from these.

- **Project type:** `Website`, `Web application`, `Custom software`, `Ongoing support`, `Not sure yet` — placeholder `Select one`
- **Timeline:** `As soon as possible`, `Within 1–3 months`, `3–6 months`, `Flexible` — placeholder `Select one`
- **Budget range:** `Under $2,000`, `$2,000 – $5,000`, `$5,000 – $10,000`, `$10,000+`, `Not sure yet` — placeholder `Select a range`

Field labels: `Name`, `Email`, `Project type`, `Timeline`, `Budget range`, `Message`.
Placeholders: `Your name`, `you@company.com`, and `A few lines about what you need.`
Submit: `Send message →`. Hint: `We reply within a day.`

Budget uses en dashes and non-breaking-space-free plain spaces exactly as shown.

### 5.11 Case study — Susila (complete, client copy, final)

Frontmatter facts:

- Role: `Sole developer on the rebuild. Brought in after the original team, working across the web client, the Node.js API, and the React admin panel.`
- Timeline: `Roughly one month, part-time.`
- Stack: `React, Vite, SCSS · Node.js REST API · MongoDB · HLS playback with Vimeo as origin · Stripe for recurring subscriptions · Firebase Cloud Messaging · deployed to AWS with GitHub-triggered CI/CD`

Body structure and copy, in order:

1. **Lead paragraph** — the `summary` from `projects.json`.
2. **`The problem`**
   - `The platform existed. Audiences could sign up. But the video layer had been built in a way that couldn’t scale or serve viewers well.`
   - `Each film had been uploaded to Vimeo as **separate files per quality**, and playback ran through Vimeo’s own embedded player. Two consequences followed. Viewers were locked to whichever quality they landed on — no adapting when a mobile connection dropped, so the video stalled instead of stepping down. And the platform had no real control over the playback experience, because the player belonged to someone else.`
   - `For a service whose entire product is video, on an audience largely watching over mobile data in Sri Lanka, that’s not a rough edge. That’s the product not working.`
3. **`What we built`**
   - `**Adaptive streaming playback.** We moved delivery onto **HLS** — pulling \`.m3u8\` manifests from Vimeo and playing them through a player built into the platform itself rather than a third-party embed. The playback engine is built on hls.js, which handles manifest parsing and adaptive bitrate switching; the player, its interface, and everything around it — controls, states, error handling, integration with the platform’s entitlement checks — we built ourselves, working from the HLS specification and Vimeo’s API documentation.`
   - `The result: instead of a fixed file per quality, the stream steps up and down automatically with the viewer’s connection. A weak signal softens the picture for a moment rather than stopping the film.`
   - `**Live streaming.** Vimeo Live integrated directly into the platform, alongside the on-demand catalogue — a capability it hadn’t had before.`
   - `**Subscription billing.** Stripe integrated for recurring subscriptions, with entitlement checks tying an active subscription to what a viewer can watch.`
   - `Alongside this we worked across the web client, the Node.js API, and the React admin panel used to manage the catalogue and subscribers.`
4. **Dark band — eyebrow `A decision worth explaining` (in `--brand-on-band`), statement `Keep Vimeo. Change how we use it.`**
   - `The obvious move when video delivery is broken is to take control of it — self-host, run your own transcoding, serve from your own CDN. It’s also how you turn a fixable problem into an unbounded infrastructure bill. Transcoding is compute-heavy, storage grows forever, and bandwidth is the largest recurring cost in any streaming business.`
   - `The actual problem wasn’t Vimeo. Vimeo was already doing the expensive work — transcoding and CDN delivery — and doing it well. The problem was that the platform was consuming it in the least useful way: one static file per quality, played through someone else’s embed.`
   - `So we kept the origin and changed the consumption. Pulling the HLS manifests and playing them in our own player kept transcoding and bandwidth costs predictable, while moving playback control back inside the product — adaptive quality, and a player that behaves the way the platform needs it to.`
   - `The trade-off is a continued dependency on a third party for the most critical part of the product. For a company running its first streaming service, that’s the right trade: predictable monthly cost instead of an infrastructure project, with the budget going into the product.`
5. **`Since then`** — `We’ve since built the same architecture for a second client — a video-on-demand service using one-time purchase rather than subscription, where a customer buys a title and can stream it indefinitely. Same delivery approach, different commercial model.`
6. **`Outcome`**
   - `The platform went live. It hadn’t been deployed before this work — adaptive playback, live streaming and recurring subscriptions all shipped as part of taking it to launch.`
   - `Handed over to the client on completion.`
7. **Screens** — eyebrow `Screens`. Desktop in a browser frame, URL `susila.lk/watch`,
   caption `The custom HLS player — desktop`. Mobile in a phone frame, caption
   `Browse — mobile`.
8. **Quote band** — reserved. Placeholder text
   `Space reserved for a client quote from Susila Productions.` attributed
   `— Susila Productions`. Rendered in `--text-subtle`, not as a real quote.
9. **Prev / next** — derived from `displayOrder`, wrapping.

### 5.12 Case studies — Landora and LevelUp Saloon

`draft: true`. Frontmatter carries the real title, subtitle, summary and facts from
`projects.json`. Body is a single paragraph: the `summary`. Nothing invented. Phase 5
gives the exact file contents.

---
## Phase 0 — Preflight: budget reconciliation and scaffold clearance

**Goal.** Confirm the binding budget is in place, and leave the working directory in a
state where Phase 1's scaffold can actually run.

**Files**

- `docs/calden-performance-budget.md` — **already exists**, verify only, do not edit
- `docs/PRE-DEPLOY-CHECKLIST.md` — new, stub (filled in Phase 9)

**Dependencies.** None. This is the first phase.

**Implementation notes**

*Read the budget first.* `docs/calden-performance-budget.md` is binding. Its numbers
supersede anything in this plan that disagrees; Section 1.1 lists where it is stricter
than the original brief. **Do not rewrite it.** Record its SHA-256 now so later phases
can prove it was not quietly edited to make a check pass.

Its final section is an embedded prompt describing enforcement tooling. That prompt is
absorbed into **Phase 9** — do not run it separately, or you will end up with two
competing configurations.

*Do not create `public/` in this phase.* `create-next-app` refuses to scaffold into a
directory containing files outside its allowlist, and `public` is not on it. The
allowlist, read from `create-next-app@16.3.1`, is exactly:

```
.DS_Store  .git  .gitattributes  .gitignore  .gitlab-ci.yml  .hg  .hgcheck
.hgignore  .idea  .npmignore  .travis.yml  .vscode  .zed  LICENSE
Thumbs.db  docs  mkdocs.yml  npm-debug.log  yarn-debug.log  yarn-error.log
yarnrc.yml  .yarn
```

`docs` is allowed, which is why this phase may write there and nowhere else. The asset
directories move to Phase 1, created **after** the scaffold.

*`design_handoff_calden_site/` is also not on the allowlist*, and it is already present.
Phase 1 handles it by scaffolding into a temporary directory and copying in — see there.
Do not delete or move it; it is the design source of truth and the README references it.

*Stub file.* `docs/PRE-DEPLOY-CHECKLIST.md` containing a heading and the single line
`Filled in Phase 9.` The budget document's enforcement section references it.

**Acceptance criteria**

1. `test -f docs/calden-performance-budget.md` succeeds.
2. `shasum -a 256 docs/calden-performance-budget.md` matches the value recorded at the
   top of `docs/PRE-DEPLOY-CHECKLIST.md`.
3. `docs/PRE-DEPLOY-CHECKLIST.md` exists.
4. `ls` in the project root shows **exactly** `design_handoff_calden_site` and `docs`.
   No `public/`, no `package.json`, nothing else.

**Common pitfalls**

- **Creating `public/` here.** It blocks Phase 1's scaffold. Phase 1 creates it.
- **Rewriting or "tidying" the budget document.** It is the contract. Read it, do not
  edit it.
- **Running the enforcement prompt at the bottom of the budget document.** That is
  Phase 9's job, and running it now would scaffold tooling against a project that does
  not exist yet.
- **Weakening a number to match this plan.** If this plan and the budget disagree, the
  budget wins and the plan is wrong — say so rather than adjusting the budget.
- **Deleting `design_handoff_calden_site/` to clear the way for the scaffold.** Phase 1
  works around it without touching it.
- **Creating a Next.js app in this phase.** That is Phase 1.

---

## Phase 1 — Project setup, tokens, fonts, dark mode

**Goal.** A running Next.js 16 app whose design tokens, type scale, breakpoints and
dark-mode plumbing exactly reproduce the handoff, with no flash of the wrong theme.

**Files**

- `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `next.config.ts`,
  `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore`, `.vercelignore` — new
- `public/images/work/.gitkeep`, `public/images/og/.gitkeep`,
  `public/video/.gitkeep` — new (deferred from Phase 0)
- `app/layout.tsx`, `app/globals.css`, `app/page.tsx` (temporary placeholder) — new
- `components/layout/ThemeScript.tsx` — new
- `components/layout/ThemeToggle.tsx` — new, `"use client"`
- `components/ui/Logo.tsx` — new
- `public/logo/calden-horizontal.svg` — optimised copy of the handoff asset
- `lib/cn.ts` — new
- `docs/MEASUREMENTS.md` — new, record the measured baseline

**Dependencies.** Phase 0.

**Implementation notes**

*Git first.* `git init` in the project root before anything else. `.git` is on
`create-next-app`'s allowlist, so this is safe, and every later phase's "no other file
changed" check depends on it. Commit the current state (`docs/` and
`design_handoff_calden_site/`) as the first commit so the scaffold arrives as a reviewable
diff.

*Scaffold — read this before running it.* `create-next-app` **refuses to run in this
directory as-is**, because `design_handoff_calden_site/` is not on its allowlist (see
Phase 0). Scaffold into a temporary directory and copy in:

```bash
cd /Users/dilshan/Projects/Calden
pnpm dlx create-next-app@16.3.1 /tmp/calden-scaffold \
  --ts --tailwind --app --eslint --no-src-dir --import-alias "@/*" --use-pnpm
cp -R /tmp/calden-scaffold/. .
rm -rf /tmp/calden-scaffold
```

**Strip the scaffold before copying.** `create-next-app` runs `git init` in its target
directory, and `cp -R .../. .` would copy that `.git` straight over the repo you just
created. It also writes files this project already owns. Delete these first:

```bash
rm -rf /tmp/calden-scaffold/.git \
       /tmp/calden-scaffold/.next \
       /tmp/calden-scaffold/node_modules \
       /tmp/calden-scaffold/README.md \
       /tmp/calden-scaffold/AGENTS.md \
       /tmp/calden-scaffold/CLAUDE.md
rm -f  /tmp/calden-scaffold/public/*.svg      # Next's demo icons
```

Then copy. `cp -R <src>/. <dest>` takes dotfiles (`.gitignore`) as well as visible ones;
`cp -R <src>/* <dest>` silently would not. Verify `.gitignore` arrived.

Also delete `app/favicon.ico` after copying — Phase 8 supplies the real one.

Then pin every version from Section 4 exactly — replace every `^` range
`create-next-app` writes, including the TypeScript one, which it will set to whatever
`latest` is (currently 7.0.2, which breaks the build — see 4.1).

*Asset directories*, deferred from Phase 0 because they would have blocked the scaffold:

```bash
mkdir -p public/images/work public/images/og public/video public/logo
touch public/images/work/.gitkeep public/images/og/.gitkeep public/video/.gitkeep
```

*Keep the handoff out of the deploy.* Add a `.vercelignore` containing
`design_handoff_calden_site` and `docs`. Neither is needed at runtime, and the handoff
bundle is a few hundred KB of prototype that would otherwise be uploaded on every deploy.

*TypeScript.* Pin **exactly** `"typescript": "6.0.3"` — no caret. `typescript@latest`
resolves to 7.0.2, which breaks `next build`'s typecheck and `next lint` (see 4.1). Run
the four-command smoke test in 4.1 **before** writing any other code in this phase; if it
fails on TypeScript itself, drop to `5.9.3` and record it in `docs/MEASUREMENTS.md`.

`tsconfig.json` must have `"strict": true` plus `"noUncheckedIndexedAccess": true` and
`"noImplicitOverride": true`. The first one matters: content arrays are indexed in
several places and it forces the null checks. Also set `"incremental": true` and
`"tsBuildInfoFile": "node_modules/.cache/tsconfig.tsbuildinfo"`, and keep
`"skipLibCheck": true`.

*Bundler.* Read the `next build` banner and record which bundler ran. If Turbopack is not
already the default, switch both scripts to it (`next dev --turbopack`,
`next build --turbopack`) and note the before/after build time in
`docs/MEASUREMENTS.md`. The budget applies to whichever bundler ships, so re-measure
First Load JS after any switch.

*Tailwind is v4.* There is no `tailwind.config.js` and no `content` array. All
configuration is in `app/globals.css`. `postcss.config.mjs` is:

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

*`app/globals.css`* — the whole design system lives here, in this order:

```css
@import "tailwindcss";

/* Dark mode is class-based, not media-based. */
@custom-variant dark (&:where(.dark, .dark *));

/* ---------- Light theme (default) ---------- */
:root {
  --surface-page: #EEF2F1;
  --surface-card: #FAFBFB;
  --surface-sunken: #E3E9E8;
  --surface-band: #12312F;
  --border: #CDD6D4;
  --border-control: #748280;
  --text-primary: #12312F;
  --text-secondary: #4A5C59;
  --text-subtle: #5A6965;
  --text-on-band: #E9EFED;
  --text-on-band-muted: #B0BAB9;
  --brand-teal: #0F5C5C;
  --brand-teal-hover: #0C4A4A;
  --brand-teal-active: #0A3E3E;
  --brand-on-band: #3FAEA5;
  --text-on-brand: #FAFBFB;
  --accent-gold: #D4AF37;
  --focus-ring: #0F5C5C;
  --danger: #A6432F;
  --success: #2F7D5B;

  /* Logo — see Logo.tsx */
  --logo-stroke: #0F5C5C;
  --logo-accent: #D4AF37;
  --logo-word: #0F5C5C;

  /* Type scale — desktop */
  --fs-display: 64px; --lh-display: 1.06; --tr-display: -0.022em;
  --fs-h1: 48px;      --lh-h1: 1.10;      --tr-h1: -0.02em;
  --fs-h2: 36px;      --lh-h2: 1.18;      --tr-h2: -0.015em;
  --fs-h3: 24px;      --lh-h3: 1.28;      --tr-h3: -0.01em;
  --fs-body-lg: 20px; --lh-body-lg: 1.6;
  --fs-body: 17px;    --lh-body: 1.65;
  --fs-small: 15px;   --lh-small: 1.55;
  --fs-caption: 13px; --lh-caption: 1.4;  --tr-caption: 0.06em;

  /* Motion */
  --dur-fast: 120ms; --dur: 200ms; --dur-slow: 320ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

/* Type scale — mobile. Same variable names, so every consumer follows. */
@media (max-width: 640px) {
  :root {
    --fs-display: 40px; --lh-display: 1.08;
    --fs-h1: 34px;      --lh-h1: 1.14;
    --fs-h2: 28px;      --lh-h2: 1.20;
    --fs-h3: 21px;      --lh-h3: 1.30;
    --fs-body-lg: 18px; --lh-body-lg: 1.55;
    --fs-body: 16px;    --lh-body: 1.62;
    --fs-small: 14px;   --lh-small: 1.5;
    --fs-caption: 12px; --lh-caption: 1.35;
  }
}

/* ---------- Dark theme ---------- */
.dark {
  --surface-page: #0D1817;
  --surface-card: #14211F;
  --surface-sunken: #0A1312;
  --surface-band: #1F3733;   /* inverts UP, lighter than page and card — see 1.6 */
  --border: #23332F;
  --border-control: #586F69;
  --text-primary: #E9EFED;
  --text-secondary: #A3B3AF;
  --text-subtle: #7A8A86;
  --brand-teal: #2E9B93;
  --brand-teal-hover: #3FAEA5;
  --brand-teal-active: #4CBDB3;
  --text-on-brand: #0D1817;   /* dark text on the light dark-mode teal — see 1.4 */
  --accent-gold: #E0BE50;
  --focus-ring: #2E9B93;
  --danger: #E08D79;
  --success: #5FBF95;
  --logo-stroke: #2E9B93;
  --logo-accent: #E0BE50;
  --logo-word: #E9EFED;
  /* --brand-on-band and the two --text-on-band-* values are intentionally NOT
     redefined here. They are identical in both themes — see 2.1. */
}

/* ---------- Tailwind theme mapping ----------
   `inline` matters: it makes utilities emit var(--surface-page) rather than the
   resolved literal, which is what lets the .dark block above take effect. */
@theme inline {
  --color-page: var(--surface-page);
  --color-surface: var(--surface-card);
  --color-sunken: var(--surface-sunken);
  --color-band: var(--surface-band);
  --color-line: var(--border);
  --color-line-control: var(--border-control);
  --color-ink: var(--text-primary);
  --color-muted: var(--text-secondary);
  --color-subtle: var(--text-subtle);
  --color-on-band: var(--text-on-band);
  --color-on-band-muted: var(--text-on-band-muted);
  --color-brand: var(--brand-teal);
  --color-brand-hover: var(--brand-teal-hover);
  --color-brand-on-band: var(--brand-on-band);
  --color-on-brand: var(--text-on-brand);
  --color-accent: var(--accent-gold);
  --color-danger: var(--danger);
  --color-success: var(--success);
}

@theme {
  --font-sans: var(--font-outfit), ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --breakpoint-desk: 820px;
  --container-site: 1200px;
  --container-band: 820px;
  --container-read: 760px;
  --radius-xs: 3px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
}

@layer base {
  html { color-scheme: light; }
  html.dark { color-scheme: dark; }
  body {
    background: var(--surface-page);
    color: var(--text-primary);
    font-family: var(--font-sans);
    font-size: var(--fs-body);
    line-height: var(--lh-body);
    -webkit-font-smoothing: antialiased;
  }
  :focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 3px;
  }
  ::selection { background: var(--brand-teal); color: var(--text-on-brand); }
}

/* Semantic type classes. In `components` so utilities can still override. */
@layer components {
  .t-display { font-size: var(--fs-display); line-height: var(--lh-display); letter-spacing: var(--tr-display); font-weight: 600; }
  .t-h1      { font-size: var(--fs-h1);      line-height: var(--lh-h1);      letter-spacing: var(--tr-h1);      font-weight: 600; }
  .t-h2      { font-size: var(--fs-h2);      line-height: var(--lh-h2);      letter-spacing: var(--tr-h2);      font-weight: 600; }
  .t-h3      { font-size: var(--fs-h3);      line-height: var(--lh-h3);      letter-spacing: var(--tr-h3);      font-weight: 600; }
  .t-lead    { font-size: var(--fs-body-lg); line-height: var(--lh-body-lg); font-weight: 400; }
  .t-body    { font-size: var(--fs-body);    line-height: var(--lh-body);    font-weight: 400; }
  .t-small   { font-size: var(--fs-small);   line-height: var(--lh-small);   font-weight: 400; }
  .t-caption { font-size: var(--fs-caption); line-height: var(--lh-caption); letter-spacing: var(--tr-caption); font-weight: 600; text-transform: uppercase; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

*Fonts.* In `app/layout.tsx`:

```ts
import { Outfit } from "next/font/google";
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-outfit",
});
```

`next/font/google` self-hosts at build time — there is no runtime request to Google
and no `<link rel="preconnect">` to add. Apply `outfit.variable` to `<html>`.

*Theme script.* `ThemeScript.tsx` is a **Server Component** that returns a raw
`<script>` with `dangerouslySetInnerHTML`, rendered as the first child of `<head>`.
Not `next/script`. The body must be minified to one line:

```
(function(){try{var s=localStorage.getItem('calden-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var e=document.documentElement;if(d)e.classList.add('dark');e.style.colorScheme=d?'dark':'light';}catch(e){}})()
```

`<html>` needs `suppressHydrationWarning` because this script mutates it before React
hydrates.

*Theme toggle.* `ThemeToggle.tsx`, `"use client"`, roughly 30 lines. It reads nothing
on first render — it renders **both** the sun and moon icons and lets CSS decide which
is visible (`.dark .icon-moon { display: none }` and the inverse). This is the key
trick: it means the button's server-rendered HTML is correct for either theme, so
there is no hydration mismatch and no icon flicker. On click it toggles
`document.documentElement.classList`, sets `style.colorScheme`, and writes
`localStorage.setItem("calden-theme", …)`. It also listens to
`matchMedia("(prefers-color-scheme: dark)")` and follows the system **only while no
explicit choice is stored**. `aria-label="Switch to dark theme"` / `"Switch to light
theme"` is set imperatively after mount so the static HTML has a neutral
`aria-label="Toggle theme"`; `aria-pressed` is not used because this is not a toggle
button in the ARIA sense, it is a mode switch.

*Logo.* Copy `design_handoff_calden_site/assets/calden-digital-horizontal.svg` to
`public/logo/`, first rounding all coordinates to 2 decimal places — the source has 14
and is 9,902 bytes; rounded it is 5,054 bytes, 2,077 gzipped (see 1.18). Then write
`components/ui/Logo.tsx` as an **inline** SVG server component with the three
hardcoded colours replaced: the two `stroke="#0F5C5C"` become `var(--logo-stroke)`,
`stroke="#D4AF37"` becomes `var(--logo-accent)`, and both `fill="#0F5C5C"` on the
wordmark paths become `var(--logo-word)`. Inline, not `next/image`, because the logo is
above the fold, must swap with the theme with zero flash, and would otherwise be a
second above-the-fold request. Props: `height` (number) and `title` (string, goes in
`<title>` inside the SVG with `role="img"`).

*ESLint must ignore the design handoff.* `design_handoff_calden_site/` is
React-18-in-the-browser prototype code and will produce ~30 errors if linted. Add it to
`globalIgnores` in `eslint.config.mjs` alongside the eslint-config-next defaults. Read
it, do not lint it, do not "fix" it.

*Note on `eslint-config-next` 16.* It ships React Compiler-aware rules
(`react-hooks/set-state-in-effect`, `react-hooks/immutability`) that are stricter than
most models expect. Calling `setState` synchronously in an effect body is an **error**,
not a warning. `ThemeToggle` is written with a ref and imperative attribute writes
specifically to satisfy this, and it is better code for it — no component state, no
re-render on mount or click.

*Build guards, required by the budget document.* `next.config.ts` must **not** contain
`typescript.ignoreBuildErrors` or `eslint.ignoreDuringBuilds`. `create-next-app` does not
add them, but they are the standard "quick fix" when a build breaks, so assert their
absence now and again in Phase 9. Also set:

```ts
images: { formats: ["image/avif", "image/webp"] },
```

*Baseline measurement.* Run `pnpm build` with only the placeholder `app/page.tsx`.
Record the reported "First Load JS shared by all" and the `/` route total in
a new `docs/MEASUREMENTS.md` under "Baseline — empty app", with the date and the Next
version. Every later phase appends its own row, so the growth is traceable to the phase
that caused it.

Record it there, **not** in `docs/calden-performance-budget.md` — that document is the
contract and stays untouched. **If the baseline is already above 120 KB, stop and raise
it** (see 1.17) rather than continuing.

**Acceptance criteria**

1. `pnpm build && pnpm start` serves a page at `http://localhost:3000`.
1b. `ls -a` shows `.git`, `.gitignore` and `.vercelignore` present, and
   `design_handoff_calden_site/` still intact and unmodified.
2. `pnpm tsc --version` prints `6.0.3`, and `pnpm tsc --noEmit` passes with
   `strict: true`.
2b. `pnpm exec next lint` runs with no typescript-eslint "unsupported TypeScript version"
   warning. A warning here means the pin is wrong — check for a hoisted `typescript@7`
   with `pnpm why typescript`.
3. `ls tailwind.config.*` returns nothing.
4. In DevTools, with `localStorage` empty and OS set to dark, a **hard reload shows no
   white flash** at any point. Repeat with OS set to light and `calden-theme=dark`
   stored — no light flash.
5. Toggling the theme changes `document.documentElement.className` and persists across
   a reload.
6. `getComputedStyle(document.body).backgroundColor` is `rgb(238, 242, 241)` in light
   and `rgb(13, 24, 23)` in dark.
7. At 1440px wide, `getComputedStyle(document.documentElement).getPropertyValue('--fs-h1')`
   is `48px`; at 390px it is `34px`.
8. A `<div class="desk:hidden">` is hidden at 1440px and visible at 390px, and the
   boundary is at exactly 820px.
9. Network tab shows **two** font files, both `woff2`, both first-party, each under
   30 KB and under 60 KB combined (budget document). No request to
   `fonts.googleapis.com`.
11. `grep -n "ignoreBuildErrors\|ignoreDuringBuilds" next.config.ts` returns nothing.
12. `docs/MEASUREMENTS.md` records the TypeScript version actually used, the bundler the
    build ran, and the build time.
10. `docs/MEASUREMENTS.md` contains the baseline First Load JS figure, and
    `git diff --stat docs/calden-performance-budget.md` shows no change.

**Common pitfalls**

- **Installing `typescript@latest` or leaving a caret range.** `latest` is 7.0.2, whose
  package root exports only a version object — `next build`'s typecheck and
  typescript-eslint both break. Pin `6.0.3` exactly.
- **Writing a `tailwind.config.js`.** Tailwind 4 does not read one. All of the design
  tokens above go in `globals.css`.
- **Using `@theme` without `inline` for the colours.** Without `inline`, Tailwind
  resolves `--color-page` to the literal `#EEF2F1` at build time and the `.dark` block
  has no effect. Dark mode will appear to be broken with no error.
- **Using `darkMode: 'class'`.** That is v3 syntax. v4 needs the `@custom-variant`
  line exactly as written.
- **Putting the theme script in `next/script`.** Any strategy, including
  `beforeInteractive`, can land after first paint in App Router. It must be a raw
  inline `<script>` in `<head>`.
- **Forgetting `suppressHydrationWarning` on `<html>`.** React will log a mismatch
  warning on every load in dev.
- **Rendering the toggle icon from state.** `useState(() => isDark())` reads
  `localStorage` during render, which does not exist on the server, and produces either
  a hydration error or a one-frame icon flip. Render both icons, hide one with CSS.
- **Setting `color-scheme` only in CSS.** The inline script must also set
  `style.colorScheme`, or native form controls and the scrollbar paint light for one
  frame in dark mode.
- **Loading Outfit from the Google CDN**, as `tokens/fonts.css` does. That file is
  prototype convenience. Use `next/font/google`, which self-hosts.
- **Loading four weights** because the design system lists 400/500/600/700. Two only —
  see 1.9.
- **Referencing `--fs-h1` from a Tailwind arbitrary value** like `text-[var(--fs-h1)]`.
  It works but drops line-height and tracking. Use the `.t-h1` class.

---

## Phase 2 — Content schemas, validation, typed accessors, MDX

**Goal.** Every piece of site copy lives in `/content`, is validated by Zod, and is
reachable only through typed functions in `lib/content.ts`. A malformed or missing
field fails `pnpm build` with a message naming the file and the field.

**Files**

- `content/site.json`, `content/navigation.json`, `content/services.json`,
  `content/process.json`, `content/projects.json` — new, contents from Section 5
- `content/case-studies/susila.mdx`, `landora.mdx`, `levelup-saloon.mdx` — new
  (bodies in Phase 5; frontmatter now)
- `lib/schemas.ts`, `lib/content.ts`, `lib/mdx.ts`, `lib/whatsapp.ts` — new
- `scripts/validate-content.ts` — new
- `package.json` — modified, add `prebuild` and `validate` scripts

**Dependencies.** Phase 1.

**Implementation notes**

*Schemas.* One file, `lib/schemas.ts`, exporting a schema per content file plus the
inferred types. Zod 4 syntax (`z.object`, `z.enum`, `z.url()`, `z.email()` — note
these are top-level in Zod 4, not `z.string().url()`).

Rules the schemas must enforce, because these are the failures that actually happen:

- `whatsapp.number`: `/^[1-9]\d{7,14}$/` — E.164 digits, no `+`, no spaces. The
  `wa.me` URL format requires exactly this.
- `contact.email`: `z.email()`.
- Every image object requires `src`, `alt`, `width`, `height` — all four. `alt` may be
  the empty string for decorative images but the key must be present, so that omitting
  it is an error rather than a silent default.
- `seo.siteUrl`: `z.url()`, and it must not end in `/` (`.refine`), because
  `sitemap.ts` concatenates paths onto it.
- `projects`: `displayOrder` unique across the array, `slug` unique, `slug` matches
  `/^[a-z0-9-]+$/` (`.superRefine` on the array).
- `navigation` hrefs: `z.union([z.string().startsWith("/"), z.string().startsWith("mailto:"), z.literal("whatsapp")])`.
- `services`: exactly 4 items (`.length(4)`). `process.steps`: exactly 5.

*Accessors.* `lib/content.ts` is the **only** module that imports from `content/`.
Import the JSON directly (`import siteRaw from "@/content/site.json"`) rather than
using `fs`, so the bundler statically includes it and typos are caught at compile time.
Parse once at module scope:

```ts
const site = SiteSchema.parse(siteRaw);
export function getSite(): Site { return site; }
export function getNavigation(): Navigation { … }
export function getServices(): Service[] { … }
export function getProcess(): Process { … }
export function getProjects(): Project[] { … }              // sorted by displayOrder
export function getFeaturedProjects(): Project[] { … }
export function getProjectBySlug(slug: string): Project | undefined { … }
export function getAdjacentProjects(slug: string): { prev: Project; next: Project } { … }
```

Module-scope `parse` means the failure happens at import, which during `next build`
means the build fails. That is the desired behaviour. Wrap it so the message is useful:

```ts
function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const r = schema.safeParse(data);
  if (r.success) return r.data;
  throw new Error(
    `content/${file} is invalid:\n` +
    r.error.issues.map(i => `  • ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n")
  );
}
```

*The build-time gate.* Importing JSON only validates files that some page imports. Add
`scripts/validate-content.ts`, which imports every accessor and every MDX file, and
wire it as `"prebuild": "tsx scripts/validate-content.ts"`. Now an unreferenced or
newly added content file is still checked. It should print a one-line success summary
(`✓ 5 JSON files, 3 case studies`) and `process.exit(1)` on failure.

*MDX — split frontmatter parsing from body compilation, found necessary in Phase 2.*
`lib/mdx.ts` reads `content/case-studies/*.mdx` with `fs` at build time (runs only in
RSC during static generation, never at request time).

**`next-mdx-remote/rsc` cannot be imported from `scripts/validate-content.ts`.** It pulls
in `@mdx-js/mdx` → `estree-util-build-jsx` → `estree-walker@3`, which ships an ESM-only
`exports` map with no `require` condition. `tsx`'s CJS path-alias resolver throws
`ERR_PACKAGE_PATH_NOT_EXPORTED` the instant that chain is imported — reproduced with a
probe script containing nothing but `import { compileMDX } from "next-mdx-remote/rsc"`,
independent of any project code. Next's own bundler (Turbopack) resolves the same
package fine; this is a `tsx`-only problem, verified by mounting a page that calls
`compileMDX` and confirming `pnpm build && pnpm start` renders it correctly.

So `lib/mdx.ts` exports two tiers:

```ts
// Frontmatter + raw body via gray-matter only. No MDX compilation. Safe under
// tsx — this is what scripts/validate-content.ts calls.
export function readCaseStudy(slug: string): CaseStudy | null
export function getAllCaseStudySlugs(): string[]             // excludes draft
export function getAllCaseStudyFrontmatter(): CaseStudyFrontmatter[]

// Compiles the body to a React element via next-mdx-remote/rsc. Import this
// ONLY from a Server Component (Phase 5's case-study page) — never from the
// validate script.
export async function compileCaseStudyBody(
  body: string,
  components?: Record<string, React.ComponentType>,
): Promise<React.ReactElement>
```

The practical effect: `pnpm validate` catches a missing field or a bad frontmatter type,
but a body-level MDX **syntax** error is caught by `next build` itself, the same way any
other compile error is — not by the prebuild gate. That is an acceptable boundary: syntax
errors are rare and `next build` fails loudly on them; the gate's job is content shape,
which it still covers completely.

Frontmatter schema:

| Field | Type | Notes |
|---|---|---|
| `slug` | string | must equal the filename, enforced by `.refine` in `lib/mdx.ts` |
| `title` | string | |
| `subtitle` | string | |
| `summary` | string | the lead paragraph |
| `facts.role` | string | long form, for the facts strip |
| `facts.timeline` | string | |
| `facts.stack` | string | the `·`-separated line |
| `decision.eyebrow` | string \| null | dark band |
| `decision.statement` | string \| null | |
| `screens` | array | `{ frame: "browser" \| "phone", url?, image: {src,alt,width,height}, caption }` |
| `quote.text` | string \| null | null renders the reserved placeholder |
| `quote.attribution` | string | |
| `anonymised` | boolean | see 1.12 |
| `draft` | boolean | see 1.11 |
| `publishedAt` | ISO date string | for JSON-LD |
| `updatedAt` | ISO date string | |
| `ogImage` | image object \| null | falls back to `cover` then site default |

`prevSlug`/`nextSlug` are **not** in frontmatter — they are derived from
`displayOrder` by `getAdjacentProjects`, so reordering projects is a one-field edit.

*WhatsApp URL.* `lib/whatsapp.ts`:

```ts
export function whatsappUrl(message?: string): string {
  const { whatsapp } = getSite();
  const text = encodeURIComponent(message ?? whatsapp.defaultMessage);
  return `https://wa.me/${whatsapp.number}?text=${text}`;
}
```

`encodeURIComponent`, not `encodeURI` — the default message contains an em dash and a
typographic apostrophe, and `encodeURI` leaves characters that break the link.

**Acceptance criteria**

1. `pnpm validate` exits 0 and prints the summary line.
2. Delete `contact.email` from `site.json`; `pnpm build` fails with a message
   containing `content/site.json` and `contact.email`. Restore it.
3. Set `whatsapp.number` to `"+94 77 123 4567"`; `pnpm build` fails naming
   `whatsapp.number`. Restore.
4. Give two projects `displayOrder: 1`; `pnpm build` fails naming `displayOrder`.
   Restore.
5. `grep -rn "hello@calden.lk" app components | grep -v content` returns nothing.
6. `grep -rln "from \"@/content" lib components app | grep -v "lib/content.ts"` returns
   nothing except `lib/mdx.ts`.
7. In a scratch script, `whatsappUrl()` returns
   `https://wa.me/94000000000?text=Hi%20Calden%20%E2%80%94%20I%E2%80%99d%20like%20to%20talk%20about%20a%20project.`
8. `getProjects().map(p => p.slug)` is `["susila", "landora", "levelup-saloon"]`.
9. `getAdjacentProjects("susila")` returns `prev` = levelup-saloon, `next` = landora
   (the list wraps).

**Common pitfalls**

- **Reading content with `fs` in `lib/content.ts`.** JSON must be imported so the
  bundler includes it and TypeScript sees the shape. `fs` is correct only in
  `lib/mdx.ts`, where the filename is dynamic.
- **Validating inside a React component or a `useEffect`.** Validation must happen at
  module scope so it runs during `next build`.
- **Using `z.string().url()` / `z.string().email()`.** Zod 4 moved these to top-level
  `z.url()` / `z.email()`; the old forms are deprecated and will warn.
- **Making `alt` optional.** It must be required-but-allowed-empty, or missing alt text
  ships silently and Phase 9 fails.
- **Adding `prevSlug`/`nextSlug` to frontmatter.** Derive them; duplicated ordering
  goes stale the first time a project is reordered.
- **`JSON.parse(fs.readFileSync(...))` losing the typographic characters.** Write the
  JSON files as UTF-8. Verify with `grep -c '—' content/site.json` — it should be
  non-zero. If em dashes have become `—` escapes that is fine functionally, but do
  not let them become plain hyphens.
- **Compiling MDX with `@next/mdx`.** It routes MDX files as pages, which puts content
  inside `app/`. Use `next-mdx-remote/rsc`.
- **Importing `next-mdx-remote/rsc` anywhere `tsx` will load it** — the validate script,
  or any other `tsx`-run tool. It throws `ERR_PACKAGE_PATH_NOT_EXPORTED` on
  `estree-walker`, unconditionally, regardless of what imports it. Keep frontmatter
  parsing (`readCaseStudy`, `gray-matter`) and body compilation
  (`compileCaseStudyBody`, `next-mdx-remote/rsc`) in separate exports, and only call the
  second from a Server Component.

---
## Phase 3 — Layout: nav, mobile menu, footer, shared shell

**Goal.** Every page renders inside a shared shell with a working sticky nav, an
accessible mobile menu, the theme toggle in place, and the dark footer — all driven by
`navigation.json`.

**Files**

- `components/layout/Header.tsx`, `Nav.tsx`, `Footer.tsx` — new, server
- `components/layout/MobileNav.tsx` — new, `"use client"`
- `components/ui/Container.tsx`, `Section.tsx`, `Button.tsx`, `Eyebrow.tsx` — new
- `components/shared/WhatsAppButton.tsx` — new, server
- `components/icons/*.tsx` — new: `Menu`, `Close`, `ChatGlyph`, `Arrow`, `Chevron`,
  `Sun`, `Moon`
- `app/layout.tsx` — modified, mount Header and Footer
- `app/globals.css` — modified, `.skip-link` only

**Dependencies.** Phases 1, 2.

**Implementation notes**

*Shell — resolved ambiguity.* As phrased above this contradicts itself: it says
`app/layout.tsx` renders `<Header />`, but the very next section says `Nav` receives
`currentPath` as a prop from **each page**, and a root layout has no access to the
segment path without becoming a client component via `usePathname` — the exact thing
"Active link state" below says not to do.

**Resolution, built this way in Phase 3:** `app/layout.tsx` renders `<ThemeScript />`,
the skip link, `<main id="main">{children}</main>`, and `<Footer />` — none of which are
path-dependent. `<Header currentPath="..." />` is **not** in the root layout; each
`page.tsx` renders it as the first element of its own return value, e.g.
`<><Header currentPath="/work" />{...rest of the page}</>`. Six pages, one line each,
zero client JavaScript for navigation. `main` is `flex flex-1 flex-col` inside a
`flex min-h-screen flex-col` body, so short pages still push the footer down regardless
of where Header ends up in the tree.

*Container and Section.* These two components own all page-level spacing, so no page
file ever writes a padding value.

```
<Container>   →  mx-auto w-full max-w-site px-5 desk:px-16
<Section surface="page" | "sunken" | "band" | "card">
              →  py-14 sm:py-24  plus the surface background and any hairlines
```

Note the two different breakpoints: the **horizontal gutter** switches at `desk`
(820px, a layout concern), the **vertical padding** switches at `sm` (640px, matching
`--section-y`). This is deliberate and matches the handoff. Section also accepts
`width="site" | "band" | "read"` to pick the inner max-width, and `borderTop` /
`borderBottom` booleans for the hairlines the streaming band and CTA band need.

*Nav.* Sticky, `z-20`, `bg-page`, `border-b border-line`, height `h-[60px]
desk:h-[76px]`. Logo left at 26/30px. Desktop: links, then `<ThemeToggle />`, then the
`Start a project` button. Below `desk`: logo, spacer, `<ThemeToggle />`, hamburger.

The theme toggle is visible in **both** states. It is the only interactive element
outside the mobile menu, so it must not be hidden behind the hamburger.

*Active link state.* The obvious way to know the current route is `usePathname`, which
is client-only and would drag the whole header — logo, links, button — into the client
bundle. **Do not do that.** Instead, `Nav` stays a Server Component and receives the
route as a prop: each `page.tsx` renders its shell with `currentPath="/work"` and so on.
Six pages, one prop each, zero client JavaScript. `Nav` compares `currentPath` against
each link's `href` and applies `aria-current="page"` plus the 2px teal underline.

*Mobile menu.* `MobileNav.tsx` is `"use client"` and contains **only** the trigger
button and the panel. The link list is passed in as `children` (server-rendered),
so the links themselves cost no client JavaScript.

Requirements, all of which are commonly missed:

- The trigger is a `<button>` with `aria-expanded`, `aria-controls`, and an
  `aria-label` that changes between `Open menu` and `Close menu`.
- The panel is a `<div role="dialog" aria-modal="true" aria-label="Menu">`.
- **Focus moves into the panel on open** (focus the close button) and **returns to the
  trigger on close**.
- **Focus is trapped** while open: `Tab` from the last element wraps to the first.
- `Escape` closes it.
- `document.body.style.overflow = "hidden"` while open, restored on close and in the
  effect cleanup.
- Closes on route change. Since the links are plain `<Link>`s passed as children, wire
  this with a click handler on the panel container that closes when the target is an
  anchor.
- The panel is a full-height sheet from the right, `bg-page`, entering with a 200ms
  opacity and translate transition using `--ease-standard`. No library.

*Footer.* Server component, `bg-band text-on-band`. Grid `1.4fr 1fr 1fr 1fr`,
collapsing to `1fr 1fr` below `desk`. Wordmark is **type**, per Section 2.6 —
`Calden` in `--text-on-band`, `Digital` in `--accent-gold`. Gold on the band measures
6.63:1 light / 10.68:1 dark, so this is the one place gold legitimately carries text
(see 1.5). Column headings are also gold. The `"whatsapp"` sentinel href resolves
through `whatsappUrl()`.

*Button.* One polymorphic component. If `href` starts with `/` it renders `next/link`;
if it starts with `http`, `mailto:` or `tel:` it renders `<a>` with
`rel="noopener noreferrer"` and `target="_blank"` for `http` only; otherwise
`<button type={type}>`. Variants and sizes per Section 2.6. **Do not** use
`opacity` for hover on primary — the brand rules forbid it; change the background.

*WhatsAppButton.* Server component. This is the component that must survive being
reused in the nav, hero, contact section and later as a floating widget, so its API is
fixed now:

```tsx
type WhatsAppButtonProps = {
  variant?: "primary" | "secondary" | "text";
  size?: "sm" | "md" | "lg";
  message?: string;          // overrides site.json defaultMessage
  label?: string;            // overrides site.json label
  showIcon?: boolean;        // default true
  fullWidth?: boolean;
  className?: string;
};
```

It renders a `<Button>` with `href={whatsappUrl(message)}` and the chat glyph. It holds
**no positioning, no layout, no fixed/absolute styles** — that is what makes the
floating variant in Phase 6 a wrapper rather than a rewrite.

*Icons.* Each is a server component returning inline SVG, `stroke="currentColor"`,
`strokeWidth={1.6}`, `strokeLinecap="round"`, `strokeLinejoin="round"`,
`aria-hidden="true"`, `focusable="false"`, with a `size` prop defaulting to 18. Path
data for the chat glyph, hamburger and chevron is in `homepage-hero.jsx` and the
design-system `Select` — copy it exactly. `Arrow` is the character `→` in a
`<span aria-hidden="true">`, not an SVG, per the brand rules.

*Skip link.* `<a href="#main" class="skip-link">Skip to content</a>`, visually hidden
until focused, then positioned top-left with the standard focus outline.

**Acceptance criteria**

1. Every page shows the nav and footer; the footer sits at the bottom of the viewport
   on a short page.
2. At 1440px the nav is 76px tall with four links, a theme toggle and a CTA button. At
   390px it is 60px with a logo, theme toggle and hamburger. The switch happens at
   exactly 820px.
3. Keyboard only, from page load: `Tab` reaches the skip link first; `Enter` jumps
   focus to `<main>`.
4. Keyboard only at 390px: `Tab` to the hamburger, `Enter` opens the menu, focus is on
   the close button, `Tab` cycles **only** within the panel, `Escape` closes it, and
   focus returns to the hamburger.
5. With the menu open, the page behind does not scroll.
6. `grep -rn "use client" components/layout` returns exactly `MobileNav.tsx` and
   `ThemeToggle.tsx`.
7. `grep -rn "wa.me\|hello@calden\|/work\"" components | grep -v content` returns
   nothing — every link comes from `navigation.json`.
8. The footer wordmark's `Digital` computed colour is `rgb(212, 175, 55)` in light and
   `rgb(224, 190, 80)` in dark.
9. `pnpm build` reports First Load JS still under budget; record the delta from the
   Phase 1 baseline.

**Common pitfalls**

- **Making `Nav` a client component to use `usePathname`.** That drags the whole header,
  logo and button tree into the client bundle. Pass `currentPath` as a prop.
- **Putting `"use client"` at the top of `Header.tsx`.** The boundary belongs on
  `MobileNav` and `ThemeToggle` only.
- **Rendering the mobile links inside the client component.** Pass them as `children`
  so they stay server-rendered.
- **Forgetting focus return.** Closing the menu and dropping focus to `<body>` is the
  single most common accessibility bug in this component.
- **Hiding the mobile panel with `display: none` while animating.** Use
  `visibility`/`opacity`/`transform`, or the transition never runs.
- **Leaving `overflow: hidden` on `body`** after an unmount. Restore it in the effect
  cleanup, not just in the close handler.
- **Using `hidden desk:flex` on the theme toggle.** It must be visible at every width.
- **Adding a box shadow to the sticky nav on scroll.** The design system forbids
  shadows; the 1px bottom border is the entire treatment.
- **`target="_blank"` on `mailto:`.** Only `http(s)` links open in a new tab.

---

## Phase 4 — Homepage

**Goal.** The homepage renders all seven sections from content files, statically, with
the hero built so that enabling a background video is a `site.json` edit.

**Files**

- `app/page.tsx` — replace the placeholder
- `components/home/Hero.tsx`, `HeroVideo.tsx` (`"use client"`), `WhatWeDo.tsx`,
  `HowWeWork.tsx`, `SelectedWork.tsx`, `StreamingBand.tsx`, `WhyCalden.tsx`,
  `ContactSection.tsx` — new
- `components/ui/Card.tsx`, `Tag.tsx` — new
- `components/work/ProjectCard.tsx` — new
- `components/shared/BandSection.tsx` — new
- `components/contact/ContactActions.tsx` — new
- `content/site.json` — modified, add the `homepage` key from Section 5.6

**Dependencies.** Phases 1, 2, 3. The contact form itself is Phase 7 — this phase
renders the section around it with a static, non-submitting form markup placeholder, or
better, leaves a clearly marked slot that Phase 7 fills.

**Implementation notes**

*Section order:* Hero, What we do, How we work (band), Selected work, Streaming band
(sunken), Why Calden, Contact (sunken, `id="contact"`).

*Hero.* Server component. Structure:

```
<section class="relative flex min-h-[auto] desk:min-h-[min(84vh,720px)]">
  <HexPattern />                      {/* decorative, aria-hidden */}
  {video.enabled && <HeroVideo … />}  {/* renders poster + video */}
  {video.enabled && <div class="scrim" />}
  <div class="relative z-10 …">h1, subhead, two buttons</div>
</section>
```

The `<h1>` is `text-[30px] leading-[1.12] desk:text-[58px] desk:leading-[1.05]
tracking-[-0.022em] font-semibold desk:max-w-[17ch]`, centred. Subhead 16/20px,
`--text-secondary`, `max-w-[58ch]`. Buttons: primary `Start a project →` to `/contact`,
then `<WhatsAppButton variant="secondary" />`. On mobile they stack full-width with a
10px gap; on desktop they sit in a centred row with a 12px gap.

*HexPattern.* Static inline SVG replacing the prototype's canvas (see 1.7). Three
concentric hexagons, centred at `cx = 50%`, `cy = 46%`, radii `R`, `0.72R`, `0.46R`,
`stroke-width: 2`, no fill, opacities `0.10`, `0.11`, `0.16`, the outer two in
`--logo-stroke` and the inner in `--brand-teal`. Each hexagon is its own `<g>` with a
`transform-origin: center` and a CSS `@keyframes` rotating it slowly in alternating
directions plus a 3% breathing scale — durations around 87s, 79s and 70s so they never
resynchronise. Wrap the animations in `@media (prefers-reduced-motion: no-preference)`
so the reduced-motion default is a still frame. `aria-hidden="true"`,
`pointer-events: none`, `position: absolute; inset: 0`.

*HeroVideo.* `"use client"`, and it is the **only** client component in the hero. It
renders nothing at all when `enabled` is false — the parent does not even import it in
that branch, so it must be behind a dynamic boundary or, simpler and better, the parent
renders `{video.enabled ? <HeroVideo … /> : null}`; Next still ships the chunk, so also
guard the import with `next/dynamic` if the budget measurement shows it mattering.

Behaviour when enabled:

- Poster renders immediately as `next/image` with `priority`, `fetchPriority="high"`,
  explicit `width`/`height`, `sizes="100vw"`, `object-cover`, and it is the LCP element.
- The `<video>` element is **not** in the initial markup. After mount, in a
  `useEffect` scheduled with `requestIdleCallback` (falling back to `setTimeout(…, 0)`),
  the component creates the video, sets `muted`, `autoplay`, `playsInline`, `loop`,
  `preload="none"` then `"auto"`, and picks the source by
  `window.matchMedia("(max-width: 819px)")` — mobile source below `desk`, desktop at or
  above. One source is loaded, never both.
- The video starts at `opacity: 0` and transitions to `1` over `--dur-slow` on the
  `canplaythrough` event. The poster stays beneath it and is never removed, so a
  stalled video degrades to the poster.
- If `matchMedia("(prefers-reduced-motion: reduce)").matches`, **return before creating
  the video at all**. Poster only.
- The scrim is a sibling `div`, `background: var(--surface-page)`, opacity from
  `hero.video.scrimOpacity`, `z-index` between video and text. In dark mode it uses the
  dark page colour automatically because it references the token.

*How we work.* `BandSection` wrapper: `bg-band text-on-band`, plus `border-y
border-line` **in dark mode only** — the dark band steps *upward* now (see 1.6), and the
hairlines make the boundary unambiguous on a dim phone screen. Express it as
`dark:border-y dark:border-line`. Heading in `--text-on-band`, intro in
`--text-on-band-muted`, `max-w-[52ch]`. Desktop: `grid-cols-5`, gap 24px, with a 2px
horizontal rule absolutely positioned at `top: 24px`, `left: 10%`, `right: 10%`, behind
the rings. Mobile: a vertical stack with a 2px rail at `left: 23px` running from
`top: 24px` to `bottom: 24px`. The rings need `position: relative; z-index: 1` and a
`background: var(--surface-band)` so the rule does not show through them. Ring border is
`--brand-on-band` in **both** themes — do **not** use the design system's
`--teal-on-dark` `#167C78`, which measures 2.78:1 on the band and fails the 3:1 non-text
minimum (see 1.6b). The connecting rule uses `--border` at 2px.

*Selected work.* Header row: `Selected work` + `See all work →`, the link dropping
below the grid at mobile (`desk:` controls this). `grid-cols-1 desk:grid-cols-3`,
gap 16/24px. Cards from `getFeaturedProjects()`.

*ProjectCard.* Whole card is one `<Link>`. Media area 4:3, `bg-sunken`, 1px bottom
border, `next/image` with `fill` and
`sizes="(max-width: 820px) 100vw, (max-width: 1200px) 33vw, 384px"`. Because the
aspect ratio is fixed by the container, CLS is zero. Body per Section 2.6. Hover
deepens the border and turns the title teal — one transition on the card, one on the
title, both 200ms.

**Screenshots and light images need a border in dark mode** (brief requirement): add
`dark:ring-1 dark:ring-line` — or, since ring is a shadow in Tailwind and shadows are
forbidden, use `dark:border dark:border-line` on the media wrapper and account for the
1px in the layout. Prefer `border`.

*Streaming band.* `Section surface="sunken" width="band" borderTop borderBottom`,
centred, `py-12 sm:py-20`. The `See how we did it →` link points at `/work/susila`.

*Why Calden.* `grid-cols-1 desk:grid-cols-3`, gap 28/40px, each item
`border-t-2 border-brand pt-5`.

*Contact section.* `Section surface="sunken" id="contact"`, grid
`1fr` / `desk:grid-cols-[5fr_6fr]`, gap 32/64px. Left column: h2, paragraph,
`<ContactActions />` (WhatsApp button then the email button, stacked, left-aligned,
full-width on mobile). Right column: the form card — `bg-surface border border-line
rounded-md p-5 sm:p-8`. In this phase render the card with a comment marking where
Phase 7 mounts `<ContactForm />`.

**Acceptance criteria**

1. `/` builds as **static**: `pnpm build` marks it `○ (Static)`, not `ƒ (Dynamic)`.
2. All seven sections appear in the order listed, at 390px and 1440px.
3. `grep -rn "use client" components/home` returns only `HeroVideo.tsx`.
4. With `hero.video.enabled: false`: view source shows **no** `<video>` element and no
   poster `<img>`; the hero's largest painted element is the `<h1>`.
5. Set `hero.video.enabled: true` with any placeholder files present: the poster paints
   immediately, the video fades in after `canplaythrough`, only one video file appears
   in the Network tab, and it is the 720p one at a 390px viewport.
6. With `hero.video.enabled: true` and the OS set to reduce motion: **no** video request
   is made at all, and the hexagons do not animate.
7. Changing a `title` in `services.json` changes the homepage without touching any
   `.tsx` file.
8. Lighthouse CLS on `/` is `0`. Every image has `width` and `height` in the DOM.
9. In dark mode, screenshots in project cards have a visible 1px border and there are
   **no** `box-shadow` values anywhere: run
   `document.querySelectorAll("*")` and assert every computed `boxShadow` is `none`.
10. First Load JS for `/` is under budget with video disabled and with it enabled.

**Common pitfalls**

- **Rendering the poster while video is disabled.** That introduces an LCP image that
  the design does not have (see 1.8) and will cost you the 2.0s target on Slow 4G.
- **Putting `<video autoPlay>` in the server-rendered markup.** The browser starts
  fetching it during initial page load and it competes with the LCP. It must be created
  after first paint.
- **Loading both video sources.** Using two `<source>` elements with `media` attributes
  is unreliable across browsers — Safari has historically fetched both. Pick one source
  in JavaScript with `matchMedia`.
- **Forgetting `playsInline`.** Without it iOS Safari opens the video fullscreen.
- **Using `useState` for the mobile breakpoint** the way `homepage-hero.jsx` does. That
  is a prototype shortcut. Use CSS at `desk`; the layout must be correct before
  hydration.
- **Animating the hexagons with `requestAnimationFrame`.** See 1.7 — CSS transforms
  only, no canvas, no client component.
- **Animating `width`/`height`/`top` instead of `transform`.** Only `transform` and
  `opacity` are composited; anything else causes layout thrash on a continuous loop.
- **Omitting `sizes` on `next/image` with `fill`.** Next will warn and serve an
  oversized image, blowing the image budget.
- **Making the process-step connecting line cross in front of the rings.** The rings
  need their own background and a higher `z-index`.
- **Using `rgba(237,239,238,0.72)` for the band's muted text** because the prototype
  does. Use `--text-on-band-muted`, so the value is themeable.

---

## Phase 5 — Work index and case study template

**Goal.** `/work` lists all three projects, and `/work/[slug]` statically generates a
long-form case study from MDX.

**Files**

- `app/work/page.tsx`, `app/work/[slug]/page.tsx` — new
- `components/work/ProjectRow.tsx`, `CaseStudyHeader.tsx`, `FactsStrip.tsx`,
  `ScreensSection.tsx`, `QuoteBand.tsx`, `PrevNext.tsx`, `BrowserFrame.tsx`,
  `PhoneFrame.tsx` — new
- `components/ui/Prose.tsx` — new
- `components/shared/PageHeader.tsx`, `ContactCTA.tsx` — new
- `content/case-studies/*.mdx` — bodies filled in

**Dependencies.** Phases 1–3. Phase 4 is not required but shares `ProjectCard`.

**Implementation notes**

*`/work`.* `PageHeader` (eyebrow, h1, lead), then three `ProjectRow`s in a column with
56/104px gaps, then `ContactCTA`. Rows alternate: at `desk` and above, even indices are
image-left, odd indices are `flex-row-reverse`. Below `desk` all rows stack image-first.
The media is 16:10 with `rounded-md border border-line`, and the whole media block is a
link to the case study. The body column carries tags, title, subtitle, summary,
a 2-column `Role`/`Timeline` fact grid capped at 440px, a `Stack` line, and the link.
Projects whose case study is `draft` render the text `Case study coming soon` as a
**non-link** `<span>` — not an `<a href="#">`.

*`/work/[slug]`.*

```ts
export async function generateStaticParams() {
  return (await getAllCaseStudySlugs()).map(slug => ({ slug }));
}
export const dynamicParams = false;   // 404 anything not pre-generated
```

`getAllCaseStudySlugs()` excludes drafts, so `/work/landora` correctly 404s until the
body is written. Call `notFound()` if `getCaseStudy` returns null.

Page structure, in order: `CaseStudyHeader` (back link `← Work`, h1, subtitle),
`FactsStrip`, the MDX body split around the decision band, `ScreensSection`,
`QuoteBand`, `PrevNext`, `ContactCTA`.

*Splitting the body around the dark band.* The band is full-bleed and sits in the
middle of the article, which MDX cannot express as a single flow inside a 760px column.
Two workable options; **use option A**:

- **A.** Export a `<DecisionBand>` component into the MDX scope via `MDXRemote`'s
  `components` prop, and place `<DecisionBand>…</DecisionBand>` inline in the MDX file.
  The component breaks out of the reading column with
  `w-screen relative left-1/2 -translate-x-1/2`. One file, natural authoring.
- **B.** Split the MDX into two frontmatter-delimited bodies. Rejected — it makes the
  content file harder to edit, which is the opposite of the goal.

Other components exposed to MDX: `Mono` (inline code chip, `--surface-sunken`
background, 4px radius), plus overrides mapping `h2` to `.t-h2`, `p` to the case-study
body size (18/16px, line-height 1.72), `strong` to weight 600, and `a` to the teal link
style. Put those in `components/ui/Prose.tsx` and pass them as the `components` prop.

Do **not** add `remark-gfm` or `rehype-pretty-code`. The case study copy needs bold,
inline code and paragraphs, nothing more, and both packages add build weight for
features no content uses.

*`FactsStrip`.* `bg-sunken`, hairline top and bottom, grid
`1fr` / `desk:grid-cols-[1fr_1fr_1.6fr]` with 24/48px gaps. Labels are teal eyebrows
at 12px/0.14em; values 15px/1.6.

*`ScreensSection` and the device frames.* `BrowserFrame` and `PhoneFrame` are pure CSS
and server components — the handoff versions (`browser-window.jsx`, `ios-frame.jsx`) are
352 and 127 lines of prototype scaffolding. Re-implement them minimally: the browser
frame is a rounded container with a 36px title bar containing three 10px dots and a
URL pill; the phone frame is a rounded rectangle with a bezel and a notch. Both take
`children` and clip them. Both need `dark:border dark:border-line` around the image so
light screenshots do not glare (brief requirement). Images use `next/image` with
explicit dimensions from frontmatter.

*`QuoteBand`.* When `quote.text` is null, render the reserved placeholder in
`--text-subtle` at the same size, and mark the whole block `aria-hidden="false"` but do
**not** wrap it in `<blockquote>` — it is not a quote yet. When text is present, use
`<figure><blockquote>…</blockquote><figcaption>…</figcaption></figure>`.

*`ContactCTA`.* Shared by `/work`, `/work/[slug]`, `/services` and `/about`. Not used on
`/contact`. `Section surface="sunken" borderTop`, centred, h2 + paragraph +
WhatsApp/email buttons.

**Acceptance criteria**

1. `pnpm build` output lists `/work` and `/work/susila` as static, and shows
   `generateStaticParams` produced exactly one slug while the other two are drafts.
2. `/work/landora` returns 404 with the styled not-found page while `draft: true`.
   Setting `draft: false` and rebuilding makes it render.
3. `/work` shows three rows; rows 1 and 3 are image-left at 1440px, row 2 is
   image-right; all three are image-first at 390px.
4. The Landora and LevelUp Saloon rows show `Case study coming soon` as plain text with no
   `href`.
5. On `/work/susila`, the decision band is full-bleed edge to edge while the body text
   stays in a 760px column.
6. `/work/susila` has exactly one `<h1>`, and its `h2` elements appear in the order
   `The problem`, `What we built`, `Since then`, `Outcome`.
7. Editing a paragraph in `susila.mdx` changes the page with no `.tsx` edit.
8. `getAdjacentProjects` drives PrevNext: on `/work/susila` the previous card is
   `LevelUp Saloon` and the next is `Landora Tours`.
9. `grep -rn "use client" components/work app/work` returns nothing.
10. Dark mode: every screenshot inside a device frame has a visible 1px border.

**Common pitfalls**

- **Omitting `dynamicParams = false`.** Without it, an unknown slug tries to render on
  demand, which turns the route dynamic and violates the "no per-request SSR" rule.
- **`await params`.** In Next 15+ `params` is a Promise. `const { slug } = await params`.
- **Reading MDX with `fs` inside a client component or at request time.** It belongs in
  `lib/mdx.ts`, called from the server component during static generation.
- **Full-bleed with `margin-left: calc(-50vw + 50%)`.** It breaks when a scrollbar is
  present. Use `w-screen left-1/2 -translate-x-1/2 relative` and set
  `overflow-x: hidden` on a wrapper, or better, place the band outside the reading
  column entirely if option A proves awkward.
- **Letting MDX render an `h1`.** The page's `h1` is the case-study title, rendered by
  `CaseStudyHeader`. The MDX body starts at `h2`.
- **Rendering `Case study coming soon` as `<a href="#">`.** It is a link to nowhere and
  fails the accessibility pass.
- **Adding `remark-gfm` "just in case".** Budget.
- **Reusing the homepage `ProjectCard` for the work-index rows.** They are different
  components with different content fields; the row uses `summary`, the card uses
  `cardSummary`.

---

## Phase 6 — Services, About, Contact, Privacy, 404

**Goal.** The five remaining pages, all static, all content-driven.

**Files**

- `app/services/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`,
  `app/privacy/page.tsx`, `app/not-found.tsx` — new
- `components/shared/WhatsAppFloating.tsx` — new, `"use client"`, built but **not
  mounted**
- `content/site.json` — modified, add `about`, `privacy` and `notFound` keys
- `content/services.json` — no change; the takeover block goes in `site.json`

**Dependencies.** Phases 1–3, and Phase 5 for `PageHeader` and `ContactCTA`.

**Implementation notes**

*Services.* `PageHeader`, then four blocks separated by 1px top rules. Each block is
`flex-col desk:flex-row` with a 64px gap; the left column is a fixed
`desk:basis-[300px]` holding the index (14px, 600, 0.06em, teal) and the title
(26/32px). The right column has the lead (17/19px, `--text-primary`), the body
(16px, `--text-secondary`), and the "included" chips. Then the understated
`Taking over an existing project` block in the 820px reading column with a 1px top
rule, then `ContactCTA`.

*About.* `PageHeader`, then a `desk:grid-cols-[5fr_6fr]` intro with the 4:5 portrait
left (rounded-md, 1px border, `next/image`, explicit dimensions), then the dark band
pull-quote, then the `How I work` three-column grid with 2px teal top rules, then the
`Where we are based` block with a 1px top rule, then `ContactCTA`. Note the voice
mixture flagged in 5.9 — do not normalise "I" to "we".

*Contact.* `desk:grid-cols-[5fr_6fr]`, no `ContactCTA` (it is already the contact
page), footer only. Left: eyebrow, h1 (34/52px), paragraph, `ContactActions`, then the
reply-time note in `--text-subtle`. Right: the form card. The form itself is Phase 7;
this phase renders the card and the `<ContactForm />` slot.

*Privacy.* Draft content, stored in `site.json` under a `privacy` key as an array of
`{ heading, body }` sections so it stays editable without touching code. Render in the
760px reading column with `PageHeader`. Draft the following sections, all marked for
your review:

1. **Who we are** — Calden Digital, a software studio based in Colombo, Sri Lanka.
   Contact `hello@calden.lk`.
2. **What we collect** — only what you send through the contact form: name, email
   address, project type, timeline, budget range and your message. Nothing else is
   collected, and there is no account system.
3. **Why we collect it** — to reply to your enquiry and, if we work together, to
   discuss the project. Lawful basis: your consent, given by submitting the form.
4. **How long we keep it** — enquiry emails are retained for as long as needed to
   respond and for our own records, and deleted on request.
5. **Who else sees it** — the form is delivered by Resend, our email provider, and the
   site is hosted by Vercel. Neither uses the content of your message for anything
   else. No data is sold or shared with advertisers.
6. **Analytics** — we use Plausible Analytics, which is cookie-free and does not track
   individuals or build profiles. It records aggregate page views, referrers and
   country. No personal data is collected and nothing is shared across sites.
7. **Cookies** — we set no cookies for tracking. The only browser storage the site uses
   is a single `localStorage` entry remembering your light or dark theme choice.
8. **WhatsApp** — if you contact us on WhatsApp, that conversation is governed by
   WhatsApp's own privacy policy, not this one.
9. **Your rights** — you may ask what we hold about you, ask for it to be corrected, or
   ask us to delete it. Email `hello@calden.lk`.
10. **Changes** — the date this policy was last updated appears at the top.

Store a `lastUpdated` ISO date alongside. Flag clearly in the README that this is a
draft for the owner's review, not legal advice.

*A dependency worth stating up front: Footer's heading level.* Phase 3 built the
footer with `<h4>` column headings, copying the design system's own markup. Phase 6's
AC5 (heading order monotonic on every page) fails on **every** page because of it —
Footer is the last thing on every page, and no page here reaches h3/h4 depth before it.
Fix it to `<h2>` in `components/layout/Footer.tsx` before or during this phase, not
after — `h2` is the only level valid after every page's `h1` regardless of what content
exists in between (some pages, like `/contact`, have no `h2` of their own at all, so
even `h3` is wrong). This is called out here because a phase built in isolation from
Phase 6 has no way to know its heading choice will fail an acceptance criterion four
phases later.

*404.* `app/not-found.tsx`. Uses the full shell — nav, footer, page header treatment.
Heading `Page not found`, a line explaining the page may have moved, and two links:
`Go to the homepage` and `See our work`. Keep it in `site.json` under `notFound`.
It must have exactly one `h1`.

*`WhatsAppFloating`.* Build it now, mount nothing. It is a `"use client"` wrapper that
positions `<WhatsAppButton>` `fixed bottom-5 right-5 z-30` and, optionally, only reveals
it after the user scrolls past the hero (`IntersectionObserver` on a sentinel, not a
scroll listener). It takes the same props as `WhatsAppButton` and forwards them
untouched. Because `WhatsAppButton` holds no positioning of its own, this file is about
25 lines and requires no change to the button. Export it, do not import it in any
layout. Add a comment in `app/layout.tsx` saying where to mount it.

**Acceptance criteria**

1. All five routes build as static.
2. `/contact` has no `ContactCTA` band; the other four content pages have one.
3. Visiting `/does-not-exist` shows the styled 404 **with nav and footer**, and returns
   HTTP 404 (check with `curl -I`, not the browser).
4. Every page has exactly one `<h1>`. Verify per page:
   `document.querySelectorAll("h1").length === 1`.
5. Heading order on every page is monotonic — no `h2` followed by `h4`. Run the axe
   DevTools "heading-order" rule, or the Phase 9 script.
6. `grep -rn "Colombo\|Privacy Policy\|hello@" app components | grep -v content`
   returns nothing.
7. `components/shared/WhatsAppFloating.tsx` exists and is imported by nothing:
   `grep -rn "WhatsAppFloating" app components | wc -l` returns 1.
8. Temporarily mounting `<WhatsAppFloating />` in `app/layout.tsx` renders a working
   floating button with **no edit to `WhatsAppButton.tsx`**. Revert the mount.

**Common pitfalls**

- **Putting the 404 at `app/(site)/not-found.tsx` or a route group** where it does not
  catch top-level unmatched paths. Root `app/not-found.tsx`.
- **Returning 200 from the 404 page.** Rendering `not-found.tsx` directly from a page
  component rather than calling `notFound()` produces a 200. For unmatched routes Next
  handles the status automatically; verify with `curl -I`.
- **Hardcoding the privacy policy in JSX** because it is long. It is content.
- **Copying the About page's "I" into other pages.** The brand voice is "we"
  everywhere except About.
- **Giving `WhatsAppFloating` its own button markup.** It must wrap `WhatsAppButton`,
  or Phase 6's whole point is lost.
- **Using a `scroll` event listener for the reveal.** `IntersectionObserver`, or the
  main thread pays on every frame.

---
## Phase 7 — Contact form and Server Action

**Goal.** A working contact form with shared client/server validation, a pluggable
email adapter, spam defences that do not use reCAPTCHA, and full loading, success and
error states — that still submits with JavaScript disabled.

**Files**

- `lib/contact-schema.ts`, `lib/email.ts`, `lib/rate-limit.ts` — new
- `app/actions/contact.ts` — new, `"use server"`
- `components/contact/ContactForm.tsx` — new, `"use client"`
- `components/ui/Field.tsx` — new (if not already created in Phase 4)
- `app/contact/page.tsx`, `components/home/ContactSection.tsx` — modified, mount the form
- `.env.example`, `.env.local` — new
- `README.md` — modified, document the environment variables

**Dependencies.** Phases 1, 2, 6.

**Implementation notes**

*Shared schema — READ THIS BEFORE WRITING IT, it is the single most consequential
line in this phase.* `lib/contact-schema.ts` has no `"use client"` and no `"use server"`,
so both sides import the same object. **Do not write `const { contactForm } = getSite()`
at module scope in this file.** `ContactSchema.ts` (or whatever it's called) is imported
by `ContactForm.tsx`, a client component — and `lib/content.ts` statically imports **all
five JSON content files** at its own module scope. Calling `getSite()` from anywhere a
client component reaches, even transitively through a schema file, drags the entire
content module — `projects.json`, `services.json`, everything — into the browser
bundle. Measured cost of getting this wrong, found in Phase 7: **~61 KB brotli**, taking
`/` from ~121 KB to 182.6 KB. `zod/mini` itself, isolated, is 4.2 KB (Phase 1).

Write it as a **factory function taking the option arrays as parameters** instead:

```ts
import * as z from "zod/mini"; // NOT classic zod — see 1.15b, measured 52.8 vs 4.2 KB

export type ContactFormOptions = {
  projectTypes: readonly [string, ...string[]];
  timelines: readonly [string, ...string[]];
  budgets: readonly [string, ...string[]];
};

export function buildContactSchema({ projectTypes, timelines, budgets }: ContactFormOptions) {
  return z.object({
    name: z.string().check(z.trim(), z.minLength(2, { error: "Please enter your name." }), z.maxLength(100)),
    email: z.string().check(z.email({ error: "Please enter a valid email address." }), z.maxLength(200)),
    projectType: z.enum(projectTypes, { error: "Please choose a project type." }),
    timeline: z.enum(timelines, { error: "Please choose a timeline." }),
    budget: z.enum(budgets, { error: "Please choose a budget range." }),
    message: z.string().check(z.trim(), z.minLength(20, { error: "Please tell us a little more — 20 characters or so." }), z.maxLength(4000)),
  });
}
```

`app/actions/contact.ts` (server, no bundle concern) calls `getSite()` and passes
`contactForm` into `buildContactSchema`. `ContactForm.tsx` (client) receives
`contactForm` as a **prop** from its server-rendered parent (`ContactSection.tsx`,
`app/contact/page.tsx`) and builds its own copy of the schema from that prop for
client-side validation — it never imports `getSite` at all.

**This same trap exists in `lib/whatsapp.ts`.** `whatsappUrl()` calls `getSite()`
internally too. If `ContactForm.tsx` imports it directly (e.g. for the error message's
WhatsApp link), the same leak happens through a second door. Pass the built URL down as
a `whatsappUrl` **prop** instead, computed server-side by the parent page, exactly like
`contactForm`. Both leaks were found and fixed in Phase 7 — see
`docs/MEASUREMENTS.md`'s "A ~61 KB budget regression" for the full trace. **The general
rule this establishes: no client component, and nothing a client component imports —
directly or transitively — may call `getSite()` or `getNavigation()`. Pass values down
as props from the nearest server component instead.**

Zod's Note: zod/mini's syntax differs from classic zod — `z.string().check(z.trim(),
z.minLength(2, { error: "..." }))`, not `.trim().min(2, "...")`. `z.enum()` takes a
plain readonly tuple of literals, not the classic `as [string, ...string[]]` cast alone
— TypeScript still needs that cast when the source array is a plain `string[]` from
JSON, but the mini API itself is otherwise the shape above.

The honeypot and timestamp are **not** in this schema. They are read from `FormData`
directly in the action, so they never appear in client validation and never leak into
the email body.

*Server Action.* `app/actions/contact.ts`, `"use server"` at the top of the file.
Signature must match `useActionState`:

```ts
export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; formError?: string; fieldErrors?: Record<string, string> };

export async function submitContact(
  prev: ContactState,
  formData: FormData,
): Promise<ContactState>
```

Order of checks, which matters:

1. **Honeypot.** Read `formData.get("company_website")`. If it is a non-empty string,
   return `{ status: "success" }` — a silent accept, so the bot learns nothing. Do not
   send an email and do not log it as an error.
2. **Timing.** Read `_ts`. If it parses to a number and `Date.now() - ts < 3000`,
   treat it as a bot and return `{ status: "success" }`. **If `_ts` is missing or does
   not parse, skip this check** — that is the no-JavaScript path (see 1.14), not a bot.
3. **Rate limit.** Key on the client IP from `(await headers()).get("x-forwarded-for")`,
   taking the **first** comma-separated entry. Allow 5 submissions per 10 minutes. On
   exceed, return `{ status: "error", formError: "Too many messages from this
   connection. Please try again in a few minutes, or message us on WhatsApp." }`.
4. **Validate.** `ContactSchema.safeParse(Object.fromEntries(formData))`. On failure,
   map `error.issues` to `fieldErrors` keyed by `issue.path[0]`.
5. **Send.** `await getEmailAdapter().send({ … })`. On a thrown error, log it server-side
   and return a generic `formError` that names the WhatsApp and email fallbacks. Never
   surface the provider's error text to the visitor.
6. Return `{ status: "success" }`.

*Email adapter.* `lib/email.ts`:

```ts
export interface EmailMessage {
  to: string; replyTo: string; subject: string; text: string;
}
export interface EmailAdapter { send(m: EmailMessage): Promise<void>; }
export function getEmailAdapter(): EmailAdapter
```

Selection logic, which resolves 1.15. **There is no environment in which a missing key
produces a success response.**

```
if (process.env.EMAIL_TRANSPORT === "noop")   → noop      (explicit, opt-in only)
if (!process.env.RESEND_API_KEY)              → throw     (caught in step 5 →
                                                           visitor sees the error state)
otherwise                                     → resend
```

That is the whole rule. `EMAIL_TRANSPORT=noop` is a named, deliberate switch you put in
`.env.local` while building the success UI before you own a domain; `.env.local` is
gitignored and never deployed, so it cannot be reached by accident in production. With
the variable unset and no key, **every** environment shows the error state.

The noop adapter logs the full message with a `[contact:noop]` prefix so it is greppable
in the Vercel log drain.

*Failure copy.* One message for every send failure — no key, provider rejected, network
timeout. It goes in `site.json` under `contactForm.errorMessage` so it is editable:

> `We couldn't send your message just now. Please reach us on WhatsApp or email
> hello@calden.lk — we'll pick it up straight away.`

The WhatsApp and email fragments render as **real links**, not plain text.

Resend implementation: `from` comes from `CONTACT_FROM_EMAIL` (must be a verified
domain — until `calden.lk` is registered, Resend's `onboarding@resend.dev` works for
testing), `to` from `site.json`'s `contact.email`, `replyTo` the submitter's address so
replying from the inbox reaches them directly. Subject:
`New enquiry — ${name} (${projectType})`. Body is plain text, not HTML.

*Environment variables.* `.env.example`:

```
# Email — required for the contact form to work.
# Without RESEND_API_KEY the form shows the error state with WhatsApp/email fallbacks.
RESEND_API_KEY=
CONTACT_FROM_EMAIL=onboarding@resend.dev

# Local development only: set to "noop" to log submissions and return success,
# so the success UI can be built before a domain exists. Never set this in production.
EMAIL_TRANSPORT=

# Analytics. Leave unset to keep Plausible off. (Phase 8)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

*Rate limiting.* `lib/rate-limit.ts` exports
`checkRateLimit(key: string): { allowed: boolean }` backed by a module-scope
`Map<string, number[]>` of timestamps, pruned on each call. Add a comment stating
plainly that this is per-instance and best-effort on serverless (see 1.16), and that
swapping in a durable store means reimplementing this one function.

*Client component.* `ContactForm.tsx`:

```tsx
const [state, formAction, isPending] = useActionState(submitContact, { status: "idle" });
```

- `<form action={formAction} noValidate>`. Using `action` rather than `onSubmit` is what
  gives progressive enhancement: with JavaScript disabled the browser posts the form and
  React's server-action endpoint handles it.
- **Every control must be CONTROLLED (`value` + `onChange`), not `defaultValue`.**
  React 19's `useActionState` calls the native `form.reset()` after every action
  completes — success **or failure** — to mirror plain HTML form-submission semantics.
  An uncontrolled field (`defaultValue`) is wiped by that reset, which directly violates
  "never clear the form on failure" below. This is documented React 19 behaviour, found
  the hard way in Phase 7 via a real browser test — it does not show up in a build or a
  typecheck, only in an actual failed submission. Hold every field's value in a single
  `values` state object, validate against that object (not `FormData`) in
  `handleSubmit`, and let each `<input>`/`<textarea>` read `value={values.x}`.
- **`<select>` needs a second fix beyond being controlled.** Even with `value` +
  `onChange`, a `<select>`'s selected `<option>` does not reliably survive the native
  reset the same way an `<input>`'s value does — confirmed by attaching a `reset` event
  listener and observing it fire. Fix: in the select's own component, add a layout
  effect that re-asserts `selectRef.current.value = value` on every render, one-way
  syncing React's controlled value back onto the DOM node after any external mutation.
  Skipping this means every dropdown silently resets to its placeholder on a failed
  submission while text fields correctly retain their values — an easy thing to miss if
  you only manually test with text inputs.
- The timestamp: `<input type="hidden" name="_ts" ref={tsRef} />`, and a `useEffect`
  that sets `tsRef.current.value = String(Date.now())` on mount. Not `defaultValue` —
  that would be baked into the static HTML at build time (see 1.14).
- Honeypot: a wrapper with `aria-hidden="true"` and the field
  `name="company_website" tabIndex={-1} autoComplete="off"`. Hide the wrapper with
  `position:absolute; left:-9999px` — **not** `display:none`, which some bots detect and
  skip. Label it plausibly (`Company website`) for the same reason.
- `isPending`: submit button shows `Sending…`, gets `disabled` and `aria-busy="true"`.
- Client-side validation runs `ContactSchema.safeParse` in the submit path before
  invoking the action, and merges those errors into the same `fieldErrors` shape, so
  there is exactly one error-rendering path.
- Errors: each field's message goes in the `Field` component's error slot, the input
  gets `aria-invalid="true"` and `aria-describedby` pointing at the message id. On a
  failed submit, move focus to the first invalid control.
- A form-level error renders **directly above the submit button** in a
  `<div role="alert">`, with the WhatsApp and email fallbacks as real links. It is
  **persistent** — it does not auto-dismiss. See 1.15 for why this is an inline block
  rather than a toast: the message exists to be clicked, and a toast that disappears
  after four seconds takes the fallback with it. It is also announced correctly by
  screen readers with no portal, no timer and no extra client JavaScript.
- **The form is never cleared on failure.** Every value the visitor typed stays in
  place, so a retry costs them nothing.
- Success replaces the form with a `<div role="status">` containing a heading, a line
  confirming the reply time from `site.json`, and a link back. Do not simply toast.

*Layout.* Name and Email side by side at `desk`, Project type and Timeline side by side,
Budget range full width, Message full width, then the submit row with the
`We reply within a day.` hint beside the button. 18px gaps. All controls at 16px font.

**Acceptance criteria**

1. `pnpm build` still reports `/contact` and `/` as **static**. A Server Action does not
   make its page dynamic; if the build says otherwise, something else did it.
2. Submit with an empty form: five field errors appear, focus lands on `Name`, no
   network request beyond the action, and `aria-invalid="true"` is on each control.
3. Submit a valid form with **no** `RESEND_API_KEY` and **no** `EMAIL_TRANSPORT`: the
   visitor sees the error state with working WhatsApp and email links, the form still
   holds every value they typed, and **no success message appears in any environment**.
4. Set `EMAIL_TRANSPORT=noop` in `.env.local` and resubmit: success state renders and
   the terminal shows the `[contact:noop]` line with all six fields.
4b. Set `RESEND_API_KEY` to an invalid value and submit: the visitor sees the same
   generic error state; the provider's real error appears only in the server log, never
   in the DOM.
5. Disable JavaScript entirely and submit a valid form: it still succeeds. The timing
   check is skipped, not failed.
6. Fill the honeypot via DevTools and submit: the response is the success state and no
   email is sent (`[contact:noop]` does not appear).
7. Submit a valid form within 3 seconds of page load with JavaScript on: silently
   accepted, no email sent.
8. Submit six times in a row: the sixth returns the rate-limit message.
9. Keyboard only: every control is reachable, every focus state is visible, the select
   chevrons do not trap focus, and the error messages are announced (verify with
   VoiceOver or NVDA that `role="alert"` fires).
10. The same `<ContactForm />` renders on `/` and `/contact` with no prop differences
    beyond an `idPrefix` to keep element ids unique if both ever appear on one page.
11. First Load JS for `/contact` and `/` remain under budget. Report the delta — this is
    the largest client component in the project.

**Common pitfalls**

- **Using an API route.** The brief specifies a Server Action, and it also avoids a
  second serialisation layer.
- **Rendering `Date.now()` on the server into the hidden field.** The page is static, so
  the value is frozen at build time. See 1.14. This is the single most likely bug in
  this phase.
- **Rejecting submissions whose `_ts` is missing.** That is exactly the no-JavaScript
  visitor the progressive-enhancement requirement is about.
- **Returning an error for the honeypot.** Tell the bot it succeeded. This is the one
  and only place a success response is returned without an email being sent, and it is
  deliberate — see 1.15 for why every other path fails loudly.
- **Clearing the form on a send failure.** The visitor loses everything they wrote and
  will not retype it.
- **Building a toast system for the error.** Persistent inline block; see 1.15.
- **`onSubmit={handler}` instead of `action={formAction}`.** The first breaks
  progressive enhancement entirely.
- **Two separate Zod schemas** that drift. One file, imported by both.
- **Putting `"use server"` inside the component file.** It goes at the top of
  `app/actions/contact.ts`.
- **Trusting `x-forwarded-for` wholesale.** Take the first entry; the header can carry a
  client-supplied chain.
- **Including the honeypot or `_ts` in the email body.** Read them, then discard.
- **Form controls below 16px.** iOS Safari zooms the viewport on focus, which reads as a
  layout bug.
- **Losing the user's input on error.** The action returns errors, not values, so use
  `defaultValue` from React state, or keep the form controlled. Uncontrolled inputs are
  preserved on the no-JavaScript path automatically but not on the client path.

---

## Phase 8 — SEO, sitemap, structured data, analytics

**Goal.** Correct per-page metadata, Open Graph and Twitter cards, a sitemap and robots
file, JSON-LD, and deferred Plausible that stays off until a domain exists.

**Files**

- `lib/seo.ts` — new
- `app/layout.tsx` — modified, `metadataBase` and default metadata
- Every `page.tsx` — modified, add `metadata` or `generateMetadata`
- `app/sitemap.ts`, `app/robots.ts` — new
- `components/seo/JsonLd.tsx` — new, server
- `components/analytics/Plausible.tsx` — new, server (renders `next/script`)
- `public/images/og-default.png` and one per case study — new
- `app/icon.svg`, `app/apple-icon.png`, `public/favicon.ico` — new

**Dependencies.** Phases 1–7.

**Implementation notes**

*`metadataBase`.* Set once in `app/layout.tsx` from `site.seo.siteUrl`. Without it,
Next emits relative OG image URLs, which most crawlers reject. Because the domain is a
placeholder today, add a note in the README to update `seo.siteUrl` the moment
`calden.lk` is registered — it feeds `metadataBase`, canonicals, the sitemap and JSON-LD
from that one field.

*Per-page metadata.* `lib/seo.ts` exports `buildMetadata({ title, description, path,
image })` returning a `Metadata` object with `title`, `description`,
`alternates.canonical` (the absolute URL), `openGraph` (type `website`, or `article` for
case studies, with `url`, `siteName`, `images`, `locale: "en_LK"`) and `twitter`
(`card: "summary_large_image"`; omit `site`/`creator` while `twitterHandle` is null —
do not emit empty strings).

Page titles, using `titleTemplate` `%s — Calden Digital`:

| Route | Title | Description source |
|---|---|---|
| `/` | uses `seo.defaultTitle` in full, no template | `seo.defaultDescription` |
| `/work` | `Work` | the Work page lead |
| `/work/[slug]` | the case study `title` | the case study `summary`, trimmed to ~155 chars |
| `/services` | `Services` | the Services page lead |
| `/about` | `About` | the About page lead |
| `/contact` | `Contact` | the Contact page lead |
| `/privacy` | `Privacy` | a one-line description |

`/privacy` and `not-found` get `robots: { index: false, follow: true }`.

*Sitemap.* `app/sitemap.ts` returns an array built from the routes plus
`getAllCaseStudySlugs()` — which excludes drafts, so unwritten case studies are never
advertised. `lastModified` comes from the MDX `updatedAt` for case studies and from a
constant for static pages. Set `changeFrequency` and `priority` conservatively
(`monthly`, `0.8` for the homepage, `0.5` elsewhere). Do **not** include `/privacy`.

*Turbopack puts CSS in `chunks/`, not a `css/` subdirectory — a Phase 9 note that
also matters here.* If you write a size-limit or analyzer config assuming Webpack's
`static/css/*.css` convention (see Phase 9), it silently matches nothing under
Turbopack. Verify with `find .next/static -name "*.css"` before trusting a glob.

*Robots.* `app/robots.ts`: allow all, point `sitemap` at
`${siteUrl}/sitemap.xml`, disallow `/privacy`. Note: while the site is on a
`*.vercel.app` preview domain, you may want a blanket disallow — add a check on
`process.env.VERCEL_ENV !== "production"` returning `disallow: "/"`, so preview deploys
are never indexed. That is worth doing now.

*A real Rich Results Test issue, found in Phase 8.* `Organization.logo` and
`LocalBusiness.image` were first pointed at the inline SVG logo
(`/logo/calden-horizontal.svg`). Google's structured-data guidance specifies
logo/image as a raster format (JPEG/PNG/WebP) — SVG here is a documented
source of a Rich Results Test warning, even though the identical file
renders correctly as the favicon and the inline nav logo elsewhere. Point
both fields at the generated default OG PNG instead (1200×630, already
exists once Phase 8's OG-image step runs, includes the mark).

*JSON-LD.* One `<script type="application/ld+json">` per page, rendered by a small
server component using `dangerouslySetInnerHTML` with `JSON.stringify`. Do **not** use
`next/script` for JSON-LD.

Homepage carries a `@graph` with two nodes:

- `Organization` — `name`, `url`, `logo` (absolute URL to the SVG or a PNG),
  `description`, `email`, `sameAs` from `socials` (omit the key entirely when the array
  is empty), `foundingDate`.
- `LocalBusiness` — `name`, `url`, `image`, `email`, `address` as a `PostalAddress`
  with `addressLocality: "Colombo"`, `addressCountry: "LK"`, `areaServed`, and
  `priceRange` omitted (do not invent one). Give both nodes an `@id` and have
  `LocalBusiness.parentOrganization` reference the Organization `@id`.

  `ProfessionalService` is the more precise subtype for a studio and is a valid
  drop-in if you prefer it later; `LocalBusiness` is used here because the brief says so.

Each case study carries a `CreativeWork` with `name`, `headline`, `description`,
`about`, `datePublished`, `dateModified`, `author` and `publisher` referencing the
Organization `@id`, `url`, and `image`.

Validate every page's output in the Google Rich Results Test before closing the phase.

*Open Graph images.* Use **static PNGs** in `public/images/`, 1200×630, one default plus
one per case study. Do not add `@vercel/og` / `ImageResponse`: it pulls satori and a
font binary into the build for a handful of images that never change. Compose them from
the brand mark, the wordmark and the page title.

*Icons.* `app/icon.svg` (the three-layer mark, using the light-theme colours — favicons
do not follow the site theme), `app/apple-icon.png` at 180×180, and a
`public/favicon.ico`. The design system notes the two-layer favicon variant was never
supplied; below about 28px the three-layer mark will muddy, so drop the innermost gold
hexagon for the icon and note the substitution in the README.

*Plausible.* `components/analytics/Plausible.tsx` returns `null` when
`site.analytics.plausibleDomain` is null **or** `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is
unset. When set, it renders:

```tsx
<Script
  defer
  strategy="afterInteractive"
  data-domain={domain}
  src="https://plausible.io/js/script.js"
/>
```

`afterInteractive` with `defer` keeps it off the critical path. Do not use
`beforeInteractive`. Do not self-host the script unless you are running Plausible
yourself, in which case only the `src` changes.

**Acceptance criteria**

1. `curl -s localhost:3000/sitemap.xml` lists `/`, `/work`, `/work/susila`,
   `/services`, `/about`, `/contact` — and **not** `/privacy`, `/work/landora` or
   `/work/levelup-saloon`.
2. `curl -s localhost:3000/robots.txt` shows the sitemap URL and, on a preview build,
   `Disallow: /`.
3. Every page has exactly one `<link rel="canonical">` with an absolute URL on the
   configured domain.
4. Every page has `og:title`, `og:description`, `og:image`, `og:url`, `og:type` and
   `twitter:card`. No tag has an empty `content`.
5. The Rich Results Test reports zero errors for `/` (Organization + LocalBusiness) and
   `/work/susila` (CreativeWork).
6. `/privacy` has `<meta name="robots" content="noindex, follow">`.
7. With `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` unset, view source contains no reference to
   `plausible.io`. With it set, the script appears with `defer` and loads after
   `DOMContentLoaded`.
8. Lighthouse SEO scores 100 on every page.
9. `grep -rn "google-analytics\|gtag\|googletagmanager" .` returns nothing.

**Common pitfalls**

- **Forgetting `metadataBase`.** Relative OG image URLs are the most common cause of a
  broken preview card.
- **Emitting `twitter:site` as an empty string** because `twitterHandle` is null. Omit
  the key.
- **Putting JSON-LD in `next/script`.** It works, but it delays the script into the body
  and some validators miss it. Inline it.
- **Including draft case studies in the sitemap.** They 404, which costs crawl budget
  and looks broken in Search Console.
- **A canonical pointing at `localhost` or the `vercel.app` preview.** It comes from
  `seo.siteUrl` in content, not from a runtime header.
- **`priority: 1.0` on everything.** Meaningless, and it signals inexperience to nobody
  but reads badly in review.
- **Adding `@vercel/og`.** See above.
- **Setting `metadata.title` as a plain string on the homepage** and getting
  `Calden — … — Calden Digital` from the template. Use `title: { absolute: … }`.

---

## Phase 9 — Performance enforcement and accessibility pass

**Goal.** Make the budget self-enforcing — bundle analysis, size limits, Lighthouse CI, a
pull-request workflow and real-user monitoring — and complete the accessibility audit.

This phase is substantially larger than the original brief implied, because
`docs/calden-performance-budget.md` specifies enforcement tooling the brief did not.
Its embedded prompt is absorbed here; **do not run that prompt separately.**

**Files**

- `.size-limit.json` — new
- `lighthouserc.js` — new
- `.github/workflows/ci.yml` — new
- `next.config.ts` — modified, wrap with `@next/bundle-analyzer`
- `app/layout.tsx` — modified, mount `<SpeedInsights />`
- `scripts/check-a11y-static.mjs` — new
- `docs/PRE-DEPLOY-CHECKLIST.md` — completed
- `docs/MEASUREMENTS.md` — modified, final figures
- `package.json` — modified: `analyze`, `size`, `lighthouse`, `check:a11y`, `check`
- `README.md` — completed
- Any component files needing fixes found by the audit

**Dependencies.** Phases 1–8.

**Implementation notes**

*1. Bundle analyzer.* Wrap the config, gated on an env flag so normal builds are
unaffected:

```ts
import withBundleAnalyzer from "@next/bundle-analyzer";
export default withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(nextConfig);
```

Script: `"analyze": "ANALYZE=true next build"`.

*2. size-limit.* This is the deterministic gate and the one that matters most, because
JavaScript weight is what actually regresses. Point it at the built client chunks and
assert the budget's numbers. Use `@size-limit/file` — **not** the webpack or esbuild
preset, which would rebuild rather than measure what Next actually emitted.

**Two path corrections found running this in Phase 9.** First, `.next/static/css/*.css`
matches nothing — Turbopack emits CSS inside `.next/static/chunks/`, not a separate
`css/` directory (that's a Webpack-era convention). Use
`.next/static/chunks/**/*.css`. Second, `"limit": "120 KB"` on the aggregate-glob entry
is not achievable and was never meant to be — the plan's own next sentence says this
glob "will read high," and it does: it sums the shared framework runtime plus every
route's page-specific code together, which measured 206–212 KB gzip on this project
with nothing wrong. Setting the literal 120 KB budget number here makes the check fail
permanently regardless of any real regression, which defeats its purpose as a
regression detector. Measure the actual aggregate once (`npx size-limit` with a
deliberately generous limit) and set the ceiling a reasonable margin above that instead
— on this project, 230 KB against a measured 211–212 KB baseline left enough headroom
to still catch a real regression (verified: adding `lodash` to a client component
pushed it to 237 KB and correctly failed) without being a tripwire on day one.

```json
[
  { "name": "All client JS chunks (ceiling, not per-route)", "path": ".next/static/chunks/**/*.js", "limit": "230 KB", "gzip": true },
  { "name": "CSS — all routes",                              "path": ".next/static/chunks/**/*.css", "limit": "20 KB",  "gzip": true }
]
```

This glob is a **ceiling**, not a per-route figure. Keep `scripts/check-budget.mjs` as
the per-route check that actually enforces the budget document's 120 KB number — **do
both**, they catch different regressions, and the per-route number is the one that
matters.

`scripts/check-budget.mjs`: read **`.next/diagnostics/route-bundle-stats.json`** —
verified present in Next 16 with Turbopack — which lists `route`,
`firstLoadUncompressedJsBytes` and `firstLoadChunkPaths` per route. Compress each chunk
and sum per route. `app-build-manifest.json` does **not** exist under Turbopack; do not
look for it. Do **not** parse `next build` stdout either — Next 16 no longer prints
route sizes at all.

Compress with **Brotli at quality 11** as the primary figure (see 1.17), and report gzip
alongside it. The `noModule` polyfill chunk is correctly absent from the stats file;
modern browsers never fetch it, so it must not be counted.

*3. Lighthouse CI.* `lighthouserc.js`, mobile preset, Slow 4G, 4× CPU,
`numberOfRuns: 3`, median. Assert against the budget document exactly:

| Assertion | Value |
|---|---|
| `categories:performance` | ≥ 0.95 |
| `categories:accessibility` | 1.0 |
| `categories:best-practices` | **1.0** |
| `categories:seo` | 1.0 |
| `largest-contentful-paint` | ≤ 2000ms |
| `cumulative-layout-shift` | ≤ 0.05 |
| `total-blocking-time` | ≤ 150ms |
| `first-contentful-paint` | ≤ 1200ms |
| `speed-index` | ≤ 2500ms |

URLs: `/`, `/work`, `/work/susila`, `/services`, `/about`, `/contact`.
Script: `"lighthouse": "lhci autorun"`, with `startServerCommand: "pnpm start"`.

**INP is not measurable in Lighthouse** — it is a field metric. TBT is its lab proxy, so
the ≤150ms TBT assertion stands in for the ≤150ms INP budget, and Speed Insights covers
the real number.

*4. GitHub Actions.* `.github/workflows/ci.yml`, on pull requests to `main`:
install with a frozen lockfile, `pnpm validate`, `pnpm build`, `pnpm check:budget`,
`pnpm size`, `pnpm check:a11y`, then `pnpm lighthouse`. Fail the job on any non-zero
exit. Post Lighthouse results as a PR comment via the LHCI action.

The budget document itself notes Lighthouse CI is slow and can wobble a few points on
shared runners. If it becomes irritating, **keep size-limit and `check:budget` in CI**
(fast, deterministic) and move Lighthouse to a manual pre-deploy step. Structure the
workflow as two jobs so Lighthouse can be disabled without touching the rest.

*5. Speed Insights.* `@vercel/speed-insights/next`, `<SpeedInsights />` in
`app/layout.tsx`. It is first-party and does not count against the 5 KB third-party
script budget, but confirm it in the analyzer anyway.

*6. Build guards.* Re-assert that `next.config.ts` has no `ignoreBuildErrors` and no
`ignoreDuringBuilds` — the budget document requires TypeScript and ESLint errors to fail
the build.

*7. Static accessibility script.* `scripts/check-a11y-static.mjs` fetches each built
route from a running `pnpm start` and asserts, by parsing the HTML:

- exactly one `<h1>` per page
- heading levels never skip on the way down
- every `<img>` has an `alt` attribute (present, possibly empty)
- every `<a>` and `<button>` has discernible text or an `aria-label`
- no `<a href="#">`
- `<html lang="en">` present

**A false positive to build in from the start, not discover the hard way.** An
image-only link or button (`<a href="..."><img alt="..."/></a>`, no visible text, no
`aria-label`) is a valid, common pattern — the image's `alt` text IS its accessible
name. A naive check that only inspects an anchor's own text content and `aria-label`
flags every one of these as broken. This project's work-index media links are exactly
this pattern. Before asserting "no discernible text or aria-label", also check for a
descendant `<img alt="...">` with non-empty alt text and treat that as satisfying the
requirement.

**Two real, load-bearing accessibility bugs this exact script (or the equivalent Lighthouse/axe
run) will find, not from code review:**

1. **`aria-hidden="true"` on a container with focusable descendants is WAI-ARIA-invalid**
   — a sighted keyboard user can still Tab into content assistive tech is told doesn't
   exist. If your mobile nav panel hides itself with `aria-hidden` while its links and
   close button remain in the tab order (CSS `opacity`/`pointer-events` alone doesn't
   remove them from the DOM's focus order), this fails. Use the native `inert` attribute
   instead — `inert={!open}` on the panel removes the whole subtree from both the
   accessibility tree and tab order in one property, with no per-child JS.
2. **An `aria-label` that doesn't match the element's own visible text is a
   `label-content-name-mismatch` failure** — screen readers announce the label, sighted
   users read the text, and if they disagree that's a confusing experience by definition.
   A common way to trip this: writing `aria-label="Company Name"` on a link that already
   contains the company name as visible text (e.g. a footer wordmark split across two
   `<span>`s). If the visible text is already correct, delete the redundant label rather
   than trying to make it match — one source of truth, and it can't drift out of sync
   with a future copy change.

*8. Gold usage check.* In the same script: `text-accent`, `--accent-gold` and
`#D4AF37` may appear only in files on an allowlist — `components/layout/Footer.tsx`,
`components/ui/Logo.tsx`, and anything rendering inside `BandSection`. This is the
mechanical enforcement of 1.5. Fail on any other occurrence.

*9. Manual audit*, once, on a production build (`pnpm build && pnpm start`), never
`next dev`:

1. Keyboard traversal of every page: nav, mobile menu, theme toggle, every link, the
   form, the device-frame images. Every focused element shows the 2px teal outline at
   3px offset. Nothing reachable but invisible.
2. Both themes, at 390px and 1440px, every page. **Check the dark band specifically** —
   1.6 inverted it, so confirm the step reads correctly on a real phone screen and not
   just a bright monitor.
3. `prefers-reduced-motion: reduce` — hexagons freeze, mobile menu appears without a
   transition, video never loads.
4. Zoom to 200% and 400% at 390px width; no horizontal scrolling, no clipped text.
5. Forced-colors mode — the mobile menu and theme toggle remain usable.
6. Screen reader pass on the mobile menu, the contact form, and the form error state.
7. axe DevTools on all seven routes, both themes.

*10. Documentation.* `docs/PRE-DEPLOY-CHECKLIST.md` and the README's Performance
section: how to run each check, what the budgets are, what to do when one fails. The
README's full contents are listed below.

*README sections.* This is the handover artefact — write it properly:

1. What this is, the stack, the pinned versions, and the TypeScript 7 note from 4.1.
2. Setup: `pnpm install`, `cp .env.example .env.local`, `pnpm dev`.
3. **How to edit content** — the most important section. A table of every file in
   `/content`, what it controls, and which pages it appears on. State plainly: to change
   the phone number, edit `content/site.json`; to add a project, add an entry to
   `projects.json` and an MDX file, and the work index, homepage and sitemap follow.
   Explain that a validation error at build time names the file and the field.
4. How to write a case study: frontmatter fields, the `draft` flag, `<DecisionBand>`.
5. How to turn on the hero video: add the two files, set `hero.video.enabled: true`,
   respect the 600 KB / 1.5 MB limits.
6. How to turn on email: set `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` in Vercel. State
   explicitly that without them the form shows the error state — it does not fail
   silently, and it never fakes success.
7. How to turn on analytics: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` and
   `analytics.plausibleDomain`.
8. Deployment: connect to Vercel, framework preset Next.js, set the environment
   variables, set the production domain, then update `seo.siteUrl`.
9. **Performance:** the budget lives in `docs/calden-performance-budget.md`; how to run
   `pnpm size`, `pnpm analyze`, `pnpm lighthouse`, `pnpm check`; and the rule that a
   failing check is fixed, never relaxed.
10. Known limitations: rate limiting is per-instance; the privacy policy is a draft for
    review; the favicon uses a two-layer variant of the mark; the About and Services copy
    is unapproved; the WhatsApp number and domain are placeholders.

**Acceptance criteria**

1. `pnpm check` runs `validate`, `build`, `check:budget`, `size` and `check:a11y` and
   exits 0.
2. `pnpm lighthouse` passes every assertion in the table above on all six URLs.
3. Every route reports First Load JS ≤ 120 KB **brotli** (see 1.17), with the actual
   numbers pasted into the README and appended to `docs/MEASUREMENTS.md`.
4. Homepage total first view ≤ 600 KB; case study ≤ 1.2 MB. Measure in the Network panel
   with cache disabled, not from the build output.
5. LCP ≤ 2.0s, CLS ≤ 0.05, TBT ≤ 150ms, FCP ≤ 1.2s, Speed Index ≤ 2.5s on `/`, median of
   three runs.
6. Break something deliberately and confirm the checks catch it:
   - add `className="text-accent"` to a heading on `/about` → `check:a11y` fails
   - add a second `<h1>` to `/services` → `check:a11y` fails
   - add a 30 KB dependency to a client component → `size` fails
   Revert all three.
7. Opening a pull request runs the workflow and the Lighthouse comment appears.
8. axe DevTools reports zero violations on all seven routes, in both themes.
9. Keyboard-only traversal of all seven pages completes with no focus trap outside the
   mobile menu and no invisible focus.
10. At 400% zoom on a 390px viewport, no page scrolls horizontally.
11. `grep -n "ignoreBuildErrors\|ignoreDuringBuilds" next.config.ts` returns nothing.
12. `docs/MEASUREMENTS.md` records the TypeScript version actually used, the bundler the
    build ran, and the build time.
12. Speed Insights is reporting in the Vercel dashboard after the first production
    deploy.

**Common pitfalls**

- **Relaxing a number to make a check pass.** The budget document is explicit: *"Do not
  weaken any budget to make a check pass. If something cannot meet the budget, tell me
  what and why, and propose options."* If a gate cannot be met, stop and report.
- **Running Lighthouse against `next dev`.** Development builds are unminified and carry
  DevTools hooks; the score is meaningless.
- **Taking the best of three runs.** The budget says median.
- **Parsing `next build` stdout** for the budget check. Read the manifest.
- **Measuring uncompressed sizes.** The budget is gzip or Brotli transfer size.
- **Using `@size-limit/webpack`.** It rebuilds with its own config and measures something
  that is not what Next shipped. Use `@size-limit/file` against `.next/static`.
- **Asserting INP in Lighthouse.** It is a field metric and is not in the lab report.
  TBT is the proxy.
- **Treating Accessibility 100 as done.** Lighthouse catches perhaps a third of what
  matters. The keyboard and screen-reader passes are the real test.
- **Fixing a contrast failure by changing a token.** Every token in 2.1 is
  contrast-verified. If something fails, the component is using the wrong token — most
  likely `--border` where it needs `--border-control`, light text on the dark-mode teal
  button (1.4), or `--teal-on-dark` where it needs `--brand-on-band` (1.6b).
- **Adding `will-change` or `transform: translateZ(0)`** to chase a score. The hexagons
  already animate only composited properties.
- **Deferring the README.** It is the deliverable that makes everything else
  maintainable.

---

## 6. Launch checklist

Not a phase. These are the items that must be true before the site goes to a real
domain, several of which are content decisions rather than code.

- [ ] `whatsapp.number` in `site.json` replaced with the real number, E.164 digits, no
      `+` (1.13). Test the link on a real phone.
- [ ] `seo.siteUrl` set to the registered domain (1.13, Phase 8).
- [ ] `hello@calden.lk` verified as a real, monitored mailbox, and verified in Resend.
- [ ] `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` set in Vercel production. Send a live
      test and confirm receipt and that Reply-To works (1.15).
- [ ] `EMAIL_TRANSPORT` is **unset** in every Vercel environment. If it is set to
      `noop` in production, the form logs and reports success while sending nothing.
- [ ] Permission confirmed to name Susila Productions, or `anonymised` flipped and the
      copy adjusted (1.12).
- [ ] All `UNAPPROVED` copy reviewed: the four Services `body` paragraphs and
      `includes` chips, the "Taking over an existing project" block, the Work index
      lead, and the entire About page (1.2, 5.3, 5.7–5.9).
- [ ] Privacy policy reviewed and amended (Phase 6). It is a draft, not legal advice.
- [ ] Real screenshots in place for all three project covers and the case-study screens;
      About portrait supplied. Each with real `alt` text in the content file.
- [ ] OG images produced for the homepage and each published case study.
- [ ] Landora and LevelUp Saloon case studies written, or left `draft: true` deliberately
      (1.11).
- [ ] `robots.ts` preview-disallow confirmed working, then confirmed **not** blocking
      production.
- [ ] Plausible account created, `analytics.plausibleDomain` and
      `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` set, and a real page view confirmed.
- [ ] Lighthouse CI green on the production domain; `pnpm check` green on `main`.
- [ ] Vercel Speed Insights reporting real-user data.
- [ ] Final Lighthouse run against the production domain, not a preview URL.

---

## 7. What this plan deliberately does not do

Stated so nobody adds them halfway through and wonders why the budget broke.

- No CMS. Content is files in the repository, edited in an editor and deployed by push.
- No blog or journal. `projects.json` and the case studies are the only collection.
- No i18n. The design and copy are English-only; `en_LK` is set in Open Graph.
- No contact-form persistence. Submissions become email, and nothing else.
- No image CDN beyond Vercel's built-in `next/image` optimiser.
- No `@vercel/og` runtime image generation.
- No testing framework. For a six-page static marketing site, build-time content
  validation plus the Phase 9 checks carry more weight than unit tests would. Add
  Playwright later if the contact form grows.
