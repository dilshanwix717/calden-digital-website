# Calden Digital — website

Marketing site for Calden Digital, a software studio in Colombo, Sri Lanka.
Five pages, three case studies (one published), fully static, no per-request
server rendering.

## Stack

| | |
|---|---|
| Framework | Next.js 16.3.1, App Router, Turbopack |
| Language | TypeScript 6.0.3 (see "TypeScript version" below) |
| Styling | Tailwind CSS 4.3.3, CSS-first config (no `tailwind.config.js`) |
| Content | JSON + MDX, validated with Zod at build time |
| Email | Resend, behind an adapter interface |
| Package manager | pnpm 10.30.3 |
| Deploy target | Vercel |

### TypeScript version

Pinned at **6.0.3**, not the newest available (7.0.2). TypeScript 7 is a
native (Go) port whose package `exports` map only exposes a version string
at the root — no compiler API — which breaks `next build`'s own typecheck
step and is outside `typescript-eslint`'s supported range
(`>=4.8.4 <6.1.0`). 6.0.3 is the newest version that works with the rest of
this toolchain; it is also the deliberate "bridge" release that removes the
APIs TS 7 dropped, so code that's clean under 6.0.3 should upgrade cleanly
once the ecosystem catches up. Do not change this pin to `latest` — that
resolves to 7.x and will break the build. See `docs/BUILD-PLAN.md` §4.1 for
the full investigation.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

`.env.local` is gitignored. With it empty or containing only
`EMAIL_TRANSPORT=noop`, the site runs completely — including a fully
functional contact form that logs submissions to the terminal instead of
sending real email. See "Email" below.

## How to edit content

**Nothing a visitor reads lives in a component file.** Every page pulls its
copy from `/content`. Edit the file, rebuild — no code change needed for a
copy change.

| File | Controls | Appears on |
|---|---|---|
| `content/site.json` | Company info, contact details, WhatsApp number, hero copy, homepage section copy, every page's header (eyebrow/title/lead), the Services "taking over" block, the About page (portrait, bio, pull-quote, principles), the contact form's field labels/options/messages, the 404 page, the privacy policy, SEO defaults, analytics config | Every page |
| `content/navigation.json` | Nav links, footer columns, footer legal links | Header, footer, every page |
| `content/services.json` | The four service blocks (exactly 4 — enforced) | Homepage, `/services` |
| `content/process.json` | The five "how we work" steps (exactly 5 — enforced) | Homepage |
| `content/projects.json` | Project metadata: slug, title, summary, role, timeline, stack, cover image, display order | Homepage, `/work`, case study prev/next |
| `content/case-studies/*.mdx` | Case study frontmatter (facts, screens, quote, draft flag) + body copy | `/work/[slug]` |

**To change the phone number, email, or WhatsApp message:** edit
`content/site.json`'s `contact` and `whatsapp` keys. Nothing else changes.

**To add a fourth project:** add an entry to `content/projects.json` with a
unique `slug` and `displayOrder`, and add a matching
`content/case-studies/<slug>.mdx` file (see below). The homepage's featured
grid, `/work`, and `sitemap.xml` all pick it up automatically — no `.tsx`
edit.

**Validation.** Every content file is checked by a Zod schema
(`lib/schemas.ts`) the moment `next build` runs (`pnpm validate` runs it
standalone, and it's also wired as the `prebuild` script, so it's automatic).
A missing or malformed field fails the build with a message naming the exact
file and field — for example, deleting `contact.email` from `site.json`
fails with:

```
content/site.json is invalid:
  • contact.email: Invalid input: expected string, received undefined
```

## How to write a case study

1. Add `content/case-studies/<slug>.mdx`.
2. Frontmatter (all fields required — see `lib/schemas.ts`'s
   `CaseStudyFrontmatterSchema` for the exact shape):
   - `slug` — must match the filename exactly
   - `title`, `subtitle`, `summary` — the lead paragraph
   - `facts.role`, `facts.timeline`, `facts.stack`
   - `decision.eyebrow` / `decision.statement` — `null` if this case study
     has no "decision worth explaining" band
   - `screens` — array of `{ frame: "browser" | "phone", url?, image, caption }`,
     or `[]` if there are no screenshots yet
   - `quote.text` (`null` renders a reserved placeholder) / `quote.attribution`
   - `anonymised`, `draft`, `publishedAt`, `updatedAt`, `ogImage` (`null` falls
     back to the project's cover image, then the site default)
3. Body: standard Markdown, starting at `##` (the page's own `<h1>` is the
   title — never let the MDX body render an `h1`).
4. **`<DecisionBand>`** is available inside the MDX body for the one
   full-bleed dark band a case study can have:
   ```mdx
   <DecisionBand eyebrow="A decision worth explaining" statement="Keep Vimeo. Change how we use it.">
   Paragraph text goes here as normal Markdown, inside the component.
   </DecisionBand>
   ```
5. Set `draft: true` while writing — the page won't be linked from `/work`
   as clickable (it renders "Case study coming soon" instead) and won't be
   in the sitemap, but the URL will genuinely 404 if visited directly
   (`dynamicParams = false`, so nothing not explicitly published renders).
   Flip to `draft: false` and rebuild when ready.

Two case studies currently ship as drafts (`landora`, `levelup-saloon`) with
real facts filled in but only a one-paragraph body — write the rest whenever
ready.

## How to turn on the hero video

The hero ships with `hero.video.enabled: false` in `content/site.json` — a
static hero with an animated hexagon pattern, no video, no poster image. To
turn it on:

1. Add the two video files and a poster image under `public/video/`
   (currently empty except a `.gitkeep`): a desktop source (≤1.5 MB) and a
   mobile source (≤600 KB, max 720p) per `docs/calden-performance-budget.md`.
2. Update `content/site.json`'s `hero.video` block with the real file paths
   and dimensions.
3. Set `hero.video.enabled: true`.
4. Rebuild.

No component changes are needed — `components/home/HeroVideo.tsx` and the
poster/scrim logic already exist and only activate when the flag is on.

## Email

The contact form (`components/contact/ContactForm.tsx`, Server Action at
`app/actions/contact.ts`) needs `RESEND_API_KEY` to send real email.

| State | Behaviour |
|---|---|
| `RESEND_API_KEY` set | Sends via Resend. `CONTACT_FROM_EMAIL` sets the sender (defaults to `onboarding@resend.dev`, useful before a domain is verified). |
| `RESEND_API_KEY` unset, `EMAIL_TRANSPORT` unset | **Error state** — the visitor sees a message pointing them to WhatsApp/email instead, their form values are preserved, nothing is sent. This is deliberate: the form never fakes success. |
| `EMAIL_TRANSPORT=noop` (in `.env.local` only) | Logs the full submission to the terminal (`[contact:noop] ...`) and returns success — for building/testing the success UI before a domain or Resend account exists. **Never set this in production** — `.env.local` is gitignored and never deployed, so it can't happen by accident, but don't override it manually in Vercel's environment variables either. |

To turn email on for real: set `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` in
Vercel's project environment variables (Production, and Preview if you want
test deploys to send too).

## Analytics

Off by default. To turn on Plausible:

1. Set `analytics.plausibleDomain` in `content/site.json` to your domain.
2. Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` in Vercel's environment variables to
   the same value.

Both must agree — content alone or the env var alone won't turn tracking on,
so there's no way to ship analytics live by accident. The script loads
`strategy="afterInteractive"`, deferred past hydration.

## Deployment

1. Connect the repository to Vercel. Framework preset: Next.js (auto-detected).
2. Set environment variables in the Vercel dashboard (see "Email" and
   "Analytics" above).
3. Set the production domain.
4. **Update `content/site.json`'s `seo.siteUrl`** from the placeholder
   (`https://calden.lk`) to the real domain the moment it's registered —
   this one field feeds `metadataBase`, every canonical URL, the sitemap,
   and JSON-LD `@id`s.
5. `robots.ts` automatically blanket-disallows any non-production
   `VERCEL_ENV` (Vercel sets this during its own build step), so preview
   deployments are never indexed without any extra configuration.

## Performance

The binding budget is `docs/calden-performance-budget.md` — read it before
touching anything performance-related. It is stricter than a casual reading
of "Lighthouse 95+" would suggest: Best Practices and SEO must be **100**,
not 95, and it specifies its own enforcement tooling (bundle analyzer,
size-limit, Lighthouse CI), all wired up in this repo.

| Command | What it checks |
|---|---|
| `pnpm check:budget` | Per-route First Load JS against the 120 KB (brotli) ceiling — reads `.next/diagnostics/route-bundle-stats.json` directly, not `next build`'s stdout |
| `pnpm size` | Aggregate client JS and CSS ceiling (`size-limit`, via `@size-limit/file` against what Next actually emitted) |
| `pnpm check:a11y` | Static accessibility pass (heading order, alt text, discernible link/button names) + the gold-usage allowlist check, against a running `pnpm start` |
| `pnpm lighthouse` | Full Lighthouse CI run — mobile, Slow 4G, 4× CPU, 3 runs, median — against every route, asserting the budget document's exact numbers |
| `pnpm analyze` | Opens the bundle analyzer (`ANALYZE=true next build`) |
| `pnpm check` | `validate` → `build` → `check:budget` → `size` → `check:a11y`, in order |

**The rule: a failing check gets fixed, not relaxed.** The budget document
says so explicitly. If a number genuinely can't be met, that's a
conversation to have, not a number to quietly raise.

### Current measured state (2026-08-19)

First Load JS, brotli, from a production build:

| Route | Measured | vs 120 KB budget |
|---|---|---|
| `/` | 136.3 KB | over by 16.3 KB |
| `/contact` | 129.7 KB | over by 9.7 KB |
| `/about`, `/work`, `/work/[slug]` | 124.9 KB | over by 4.9 KB |
| `/_not-found`, `/privacy`, `/services` | 118.7 KB | 1.3 KB spare |

**Every route is over budget except three.** This is a known, open question
— not a regression waiting to be fixed by a code change. A bare Next 16 +
React 19 app measured 116.2 KB brotli in Phase 1, before a line of this
project's own code existed; the framework floor alone leaves very little
headroom against a 120 KB ceiling. Two real bugs that inflated this further
were found and fixed during development (see `docs/MEASUREMENTS.md`'s Phase
7 entry — a client component transitively importing the entire content
module cost ~61 KB brotli at one point, now fixed), so the numbers above are
the honest remaining gap, not an unexamined one.

**Lighthouse, current state:** Performance 0.97–0.99 (passes the ≥0.95 gate
on every page), SEO 1.00 everywhere, Accessibility 1.00 everywhere (two real
issues were found and fixed during Phase 9 — see `docs/MEASUREMENTS.md`),
Best Practices 0.96–1.00 (the 0.96 pages are `console.error`s from
project-cover images that don't exist yet, not a code defect — see "Known
limitations"). The one metric-level failure is **LCP**, measuring 2.2–2.5s
against a 2.0s target; TBT (80ms), FCP (0.9s) and CLS (0) are all
comfortably within budget, and 81% of the LCP timing is "Render Delay" in a
throttled local `next start` — worth re-measuring against the real Vercel
edge deployment before treating it as a code problem.

Full investigation trail, including what was tried, what worked, and what
didn't, is in `docs/MEASUREMENTS.md` — appended after every phase.

## Known limitations

- **Rate limiting is per-instance, not durable.** The contact form's rate
  limiter (`lib/rate-limit.ts`) lives in server memory and resets on cold
  start — it stops a naive script, not a determined attacker. Swapping in a
  durable store (Upstash Redis, Vercel KV) means reimplementing one
  function; the Server Action's call site doesn't change.
- **The privacy policy is a draft.** Content lives in `content/site.json`'s
  `privacy` key. It covers the contact form and analytics honestly but has
  not been reviewed by anyone with legal training — review before launch.
- **The favicon uses a two-layer variant of the brand mark.** The design
  system's three-layer mark muddies below ~28px; the innermost gold hexagon
  is dropped for `app/icon.svg` per the design system's own guidance.
- **Some copy is unapproved.** Per the design handoff, the Services page's
  expanded paragraphs and "included" chips, the Work index's lead
  paragraph, and the entire About page were authored by the design
  assistant, not supplied by the client — review before launch.
- **The WhatsApp number and the domain are both placeholders.**
  `content/site.json`'s `whatsapp.number` is `94000000000` and `seo.siteUrl`
  is `https://calden.lk` — both need replacing with real values before
  launch. `pnpm build` succeeds with the placeholders in place; nothing
  breaks, but the WhatsApp link and every canonical/OG URL will be wrong
  until they're updated.
- **Project cover images and the About portrait don't exist yet.**
  `public/images/work/` and the About portrait path are referenced in
  content but the files aren't there — this is what's costing the two
  Best Practices dips noted above. Drop in real screenshots and it clears.
- **Susila's case study names the client.** The source notes said to
  publish anonymised ("a Sri Lankan film production company") until
  permission is confirmed. Currently shipped named — confirm before launch.
