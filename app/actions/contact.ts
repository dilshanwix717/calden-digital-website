"use server";

import { headers } from "next/headers";
import { getSite } from "@/lib/content";
import { buildContactSchema } from "@/lib/contact-schema";
import { getEmailAdapter, buildContactMessage } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; formError?: string; fieldErrors?: Record<string, string> };

const TIMING_THRESHOLD_MS = 3000;

/**
 * Signature matches useActionState: (prevState, formData) -> newState.
 * Order of checks matters — see BUILD-PLAN §Phase 7 for why each one is
 * where it is. Honeypot and timing are read directly from FormData, never
 * from ContactSchema, so they can never leak into the email body and never
 * participate in client-side validation.
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const { contactForm } = getSite();
  const ContactSchema = buildContactSchema({
    projectTypes: contactForm.projectTypes as [string, ...string[]],
    timelines: contactForm.timelines as [string, ...string[]],
    budgets: contactForm.budgets as [string, ...string[]],
  });

  // 1. Honeypot. A filled "company_website" field means a bot — accept
  // silently, so it learns nothing. This is the ONLY path that returns
  // success without sending an email; every other failure is a real error.
  const honeypot = formData.get("company_website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success" };
  }

  // 2. Timing. A missing/unparsable _ts is the no-JavaScript visitor —
  // the timestamp is written client-side on mount (see ContactForm.tsx),
  // so its absence means progressive enhancement, not a bot. Skip, don't
  // reject.
  const tsRaw = formData.get("_ts");
  const ts = typeof tsRaw === "string" ? Number(tsRaw) : NaN;
  if (!Number.isNaN(ts) && Date.now() - ts < TIMING_THRESHOLD_MS) {
    return { status: "success" };
  }

  // 3. Rate limit. Best-effort, per-instance — see lib/rate-limit.ts.
  // Take only the first x-forwarded-for entry; the header can carry a
  // client-supplied chain and trusting all of it defeats the point.
  const forwardedFor = (await headers()).get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip).allowed) {
    return { status: "error", formError: contactForm.rateLimitMessage };
  }

  // 4. Validate.
  const result = ContactSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in fieldErrors)) {
        fieldErrors[key] = issue.message;
      }
    }
    return { status: "error", fieldErrors };
  }

  // 5. Send. On any failure — no key, provider rejection, network error —
  // log server-side and return the generic fallback message. The
  // visitor never sees the provider's real error text.
  try {
    const adapter = getEmailAdapter();
    await adapter.send(buildContactMessage(result.data));
  } catch (error) {
    console.error("[contact] send failed:", error);
    return { status: "error", formError: contactForm.errorMessage };
  }

  // 6.
  return { status: "success" };
}
