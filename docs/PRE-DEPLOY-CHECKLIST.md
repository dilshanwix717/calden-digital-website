# Pre-deploy checklist

Run through this before pointing the real domain at a production deploy.
See `README.md`'s "Known limitations" for the full detail behind each item.

## Content and copy

- [ ] `content/site.json`'s `whatsapp.number` replaced with the real number
      (E.164 digits, no `+`, no spaces) — currently `94000000000`, a placeholder.
- [ ] `content/site.json`'s `socials` array updated with the real Facebook,
      Instagram and TikTok profile URLs — currently placeholders pointing at
      `/caldendigital` handles that have not been confirmed to exist. Delete
      any entry you don't have a profile for; the footer renders whatever is
      in the array. The WhatsApp entry needs no URL (it resolves from
      `whatsapp.number`).
- [ ] `content/site.json`'s `seo.siteUrl` updated from `https://calden.lk`
      once the domain is confirmed/registered — feeds `metadataBase`, every
      canonical URL, the sitemap, and JSON-LD `@id`s from one field.
- [ ] Susila case study: confirm permission to name "Susila Productions",
      or set `anonymised: true` in `content/case-studies/susila.mdx` and
      rewrite the client references per the source notes.
- [ ] Review unapproved copy: `content/services.json`'s `body` fields and
      `includes` chips, the Work index lead in `content/site.json`'s
      `pageHeaders.work`, and all of `content/site.json`'s `aboutPage`.
- [ ] Privacy policy (`content/site.json`'s `privacy` key) reviewed —
      it is a draft, not legal advice.
- [ ] Real cover images in place for all three projects
      (`public/images/work/*.jpg`, referenced from `content/projects.json`)
      and the About portrait (`public/images/about-portrait.jpg`). Currently
      missing — this is what's causing the Best Practices dip on affected
      pages (console errors from 404ing image requests).
- [ ] Landora and LevelUp Saloon case studies written in full, or
      deliberately left `draft: true` for launch.

## Configuration

- [ ] `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` set in Vercel (Production).
      Send a real test submission and confirm receipt + that replying from
      the inbox reaches the sender (Reply-To wiring).
- [ ] `EMAIL_TRANSPORT` is **unset** in every Vercel environment. If it's
      `noop` in production the form silently stops sending real email while
      still showing success.
- [ ] If using Plausible: `analytics.plausibleDomain` (content) and
      `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (Vercel env) both set to the real
      domain, and a real page view confirmed in the Plausible dashboard.
- [ ] Vercel Speed Insights reporting real data after the first deploy.

## Performance and quality gates

- [ ] `pnpm check` green (`validate` → `build` → `check:budget` → `size` →
      `check:a11y`). At the time of writing, `check:budget` fails — every
      route except `/_not-found`, `/privacy` and `/services` exceeds the
      120 KB brotli First Load JS budget. This is a known, open question;
      see README.md's "Performance" section and `docs/MEASUREMENTS.md`.
      **This checklist item cannot be checked off until that's resolved.**
- [ ] `pnpm lighthouse` green on all six URLs. At the time of writing, LCP
      (2.2–2.5s vs a 2.0s target) is the one failing metric; everything
      else — including Performance, Accessibility, Best Practices and SEO
      category scores — passes. Re-measure against the real Vercel
      deployment before deciding whether this needs code changes; a large
      share of the current gap is "Render Delay" measured against a
      throttled local server, not confirmed against production infrastructure.
- [ ] Final manual pass on the deployed production URL: keyboard traversal
      of all eight pages at 390px and 1440px, `prefers-reduced-motion:
      reduce`, 400% zoom at 390px, axe DevTools on all eight routes. Light
      theme only — there is no dark mode, so there is no second theme to
      check.

## Budget document integrity

The binding performance budget is `docs/calden-performance-budget.md`. It is never
edited to make a check pass. Recorded at Phase 0:

| | |
|---|---|
| SHA-256 | `10cadec25b00e317982d4960d602510db7d165dbce737afba85e197deff01a52` |
| Size | 6960 bytes |
| Recorded | 2026-08-19 (Phase 0) |

Reverified at the end of Phase 9 (2026-08-19): **unchanged.**

Verify at any time:

```bash
shasum -a 256 docs/calden-performance-budget.md
```

If this no longer matches, someone changed the budget. Find out who and why before
trusting any passing check.
