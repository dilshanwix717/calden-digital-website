import * as z from "zod/mini";

/**
 * The contact form's shared client/server validation schema. No "use client"
 * and no "use server" — both ContactForm.tsx and app/actions/contact.ts
 * import this exact object, so there is exactly one place validation rules
 * live.
 *
 * zod/mini, not classic zod, and this is not a style choice. Measured in
 * Phase 1 (docs/MEASUREMENTS.md, "Open question for Phase 7"): classic zod
 * bundled for the browser costs 52.8 KB brotli — 6.7x the entire remaining
 * First Load JS headroom on this site. zod/mini is 4.2 KB. Only this file
 * uses the mini import; every other schema (lib/schemas.ts, content
 * validation) is server/build-time only and uses classic zod, where bundle
 * size is irrelevant.
 *
 * buildContactSchema takes the option arrays as PARAMETERS rather than
 * calling getSite() itself. Found necessary in Phase 7, the hard way: this
 * file used to read `const { contactForm } = getSite()` at module scope,
 * and because ContactForm.tsx (a client component) imports this schema,
 * that pulled lib/content.ts's entire static import of all five JSON
 * content files into the client bundle — including projects.json and
 * services.json, which the contact form never uses. Measured cost: the
 * homepage's First Load JS jumped from ~121 KB to 182.6 KB brotli, a ~61 KB
 * regression, dwarfing the 4.2 KB zod/mini was supposed to cost. Passing
 * the option arrays as arguments keeps this module free of any dependency
 * on lib/content.ts, so importing it costs exactly what it contains.
 *
 * The honeypot field and the timing field are deliberately NOT here — see
 * app/actions/contact.ts, which reads them straight from FormData so they
 * never enter client-side validation and never reach the email body.
 */

export type ContactFormOptions = {
  projectTypes: readonly [string, ...string[]];
  timelines: readonly [string, ...string[]];
  budgets: readonly [string, ...string[]];
};

export function buildContactSchema({ projectTypes, timelines, budgets }: ContactFormOptions) {
  return z.object({
    name: z.string().check(
      z.trim(),
      z.minLength(2, { error: "Please enter your name." }),
      z.maxLength(100),
    ),
    email: z.string().check(
      z.email({ error: "Please enter a valid email address." }),
      z.maxLength(200),
    ),
    projectType: z.enum(projectTypes, { error: "Please choose a project type." }),
    timeline: z.enum(timelines, { error: "Please choose a timeline." }),
    budget: z.enum(budgets, { error: "Please choose a budget range." }),
    message: z.string().check(
      z.trim(),
      z.minLength(1, { error: "Please enter a message." }),
      z.maxLength(4000),
    ),
  });
}

export type ContactInput = z.infer<ReturnType<typeof buildContactSchema>>;
