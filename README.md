# Calden Digital — website

Next.js 16 / TypeScript 6.0.3 / Tailwind 4. See `docs/BUILD-PLAN.md` for the full
build plan and `docs/MEASUREMENTS.md` for the running performance record.

**This is a stub.** The complete README — setup, content editing, deployment,
performance — is written in Phase 9. This section exists early because Phase 7
requires the environment variables to be documented as they're introduced.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | For real email | Without it, the contact form shows its error state — it never fakes success. See `lib/email.ts`. |
| `CONTACT_FROM_EMAIL` | No | Verified sender address. Defaults to `onboarding@resend.dev` for testing before a domain exists. |
| `EMAIL_TRANSPORT` | No | Set to `noop` **in `.env.local` only** to log submissions and return success without sending real email — lets you build/test the success UI before owning a domain. Never set this in production; `.env.local` is gitignored and never deployed, so it can't reach production by accident. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | Leave unset to keep analytics off. Wired in Phase 8. |

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Local development |
| `pnpm build` | Production build (runs `pnpm validate` first, automatically) |
| `pnpm validate` | Content-only check: every JSON file and MDX frontmatter, no Next build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
