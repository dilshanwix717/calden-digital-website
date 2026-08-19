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
