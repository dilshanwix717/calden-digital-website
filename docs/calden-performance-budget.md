# Calden site — performance budget

A budget is only useful if it's specific and checked. These are the numbers.
Anything that breaches them doesn't ship until the cause is found.

Save this as `/docs/PERFORMANCE-BUDGET.md` in the project.

---

## Test conditions

All lab numbers are measured under the same conditions, or they mean nothing:

- **Lighthouse, Mobile preset**, simulated Slow 4G, 4× CPU throttling
- Incognito window, no extensions
- Production build against the deployed URL, never `next dev`
- Median of three runs, not the best one

Desktop scores are meaninglessly optimistic. Ignore them.

---

## Core Web Vitals

| Metric | Budget | Fail |
|---|---|---|
| **LCP** — Largest Contentful Paint | ≤ 2.0s | > 2.5s |
| **CLS** — Cumulative Layout Shift | ≤ 0.05 | > 0.1 |
| **INP** — Interaction to Next Paint | ≤ 150ms | > 200ms |
| **FCP** — First Contentful Paint | ≤ 1.2s | > 1.8s |
| **TBT** — Total Blocking Time | ≤ 150ms | > 300ms |
| **Speed Index** | ≤ 2.5s | > 3.4s |

The "fail" column is Google's own poor-performance threshold. The budget column
is where you should actually sit — a static Next.js marketing site has no excuse
for being near the failure line.

## Lighthouse scores

| Category | Budget |
|---|---|
| Performance | ≥ 95 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Accessibility, Best Practices and SEO should be 100, not 95. On a site this
size, anything less is an unforced error.

---

## Asset budgets

Gzipped or Brotli transfer size, not uncompressed.

### Per page — homepage

| Asset | Budget |
|---|---|
| HTML | ≤ 30 KB |
| CSS | ≤ 20 KB |
| JavaScript, first load | ≤ 120 KB |
| Fonts, total | ≤ 60 KB |
| Images, above the fold | ≤ 200 KB |
| **Total, first view** | **≤ 600 KB** |

### Per page — case study

Image-heavy by nature, so a wider allowance:

| Asset | Budget |
|---|---|
| JavaScript, first load | ≤ 120 KB |
| **Total, first view** | **≤ 1.2 MB** |

Everything below the fold lazy-loads. It doesn't count against first view, but
it still counts against the visitor's data plan — keep it lean.

### Individual assets

| Asset | Budget |
|---|---|
| Hero poster image | ≤ 150 KB |
| Any single content image | ≤ 120 KB |
| Project card thumbnail | ≤ 60 KB |
| Font file, per weight | ≤ 30 KB |
| Hero video, desktop | ≤ 1.5 MB |
| Hero video, mobile | ≤ 600 KB |
| Any third-party script | ≤ 5 KB |

Two weights of Outfit only — SemiBold 600 and Regular 400. Latin subset. Every
additional weight is roughly 25KB for a difference nobody will notice.

---

## Hard rules

These aren't targets, they're constraints:

- **No animation library.** No Framer Motion, no GSAP, no AOS. CSS transitions
  and `@keyframes` only.
- **No icon library.** Inline the six or eight SVGs you actually use.
- **No UI component library.** No MUI, no Chakra, no Ant.
- **No jQuery, no lodash, no moment.** Not even accidentally, via a dependency.
- **No Google Analytics.** Plausible only — roughly 1KB against GA's ~45KB, and
  no cookie banner needed.
- **No web fonts beyond Outfit.** Self-hosted via `next/font`, never Google's CDN.
- **No render-blocking third-party scripts.** Ever.
- **Every image goes through `next/image`** with explicit dimensions.
- **Any new dependency over 10KB needs a justification** written in the PR or
  commit message.

---

## Field data

Lab numbers are a proxy. What actually matters is real visitors on real devices
— many of yours on mid-range Androids on Sri Lankan mobile networks.

- Enable **Vercel Speed Insights** — free tier, real-user Core Web Vitals
- Check **Google Search Console → Core Web Vitals** monthly once you have traffic
- Field LCP will be *worse* than lab. If lab LCP is 1.9s, real-world p75 might be
  3s. That gap is the reason for the headroom in these budgets.

---

## When you breach

1. Run `pnpm build` and read the route-by-route output — Next.js prints first-load
   JS per route. The culprit is usually obvious.
2. Run the bundle analyzer to see what's inside.
3. Check the Lighthouse "Opportunities" and "Diagnostics" panels.
4. Most common causes, in order: an unoptimised image, a dependency that pulled
   in something large, a `"use client"` boundary placed too high in the tree, or
   a font that isn't subset.

**Fix it before shipping.** A budget you breach and move past isn't a budget.

---

# Prompt — add enforcement to the build

Add this as a phase in your build plan, or run it separately after the site is
working.

```
Add performance budget enforcement to this project. The budget is
documented at /docs/PERFORMANCE-BUDGET.md — read it first and treat those
numbers as the source of truth.

## 1. Bundle size checking
- Add @next/bundle-analyzer, wired to an ANALYZE=true env flag and a
  "pnpm analyze" script.
- Add size-limit with a config enforcing the JavaScript budgets from the
  document. It must fail with a non-zero exit code when breached.
- Add a "pnpm size" script.

## 2. Lighthouse CI
- Add @lhci/cli with a lighthouserc.js config.
- Assert against the Core Web Vitals and category scores in the budget
  document, using the Mobile preset with Slow 4G and 4x CPU throttling.
- Run three times per URL and use the median.
- Test these routes: /, /work, /work/susila, /services, /about, /contact
- Add a "pnpm lighthouse" script that builds, starts, and asserts.

## 3. GitHub Actions
- A workflow running on pull requests to main: install, build, size check,
  Lighthouse CI.
- The job fails if any budget is breached.
- Post the Lighthouse results as a PR comment.

## 4. Real-user monitoring
- Add Vercel Speed Insights.
- Add Plausible analytics — script loaded correctly for the Next.js App
  Router, deferred, not render-blocking.

## 5. Build-time guards
- Configure next.config to fail the build on TypeScript or ESLint errors.
  No ignoreBuildErrors.
- Add an ESLint rule set that flags large imports and accidental client
  components.

## 6. Documentation
- A "Performance" section in the README: how to run each check, what the
  budgets are, what to do when one fails.
- A pre-deploy checklist as a markdown file.

Do not weaken any budget to make a check pass. If something cannot meet
the budget, tell me what and why, and propose options — don't quietly
raise the number.
```

That last paragraph matters. The default behaviour when a threshold fails is to
adjust the threshold. Say explicitly that isn't allowed.

---

## One caveat about Lighthouse CI

It adds a minute or two to every pull request and it can be flaky on shared CI
runners — scores wobble by a few points between identical runs. That's why the
config takes a median of three.

If it becomes irritating, keep the size-limit check in CI (fast, deterministic)
and run Lighthouse manually before deploys instead. The size check catches most
regressions anyway, because JavaScript weight is what usually degrades.
