import { getSite } from "@/lib/content";

export interface EmailMessage {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
}

export interface EmailAdapter {
  send(message: EmailMessage): Promise<void>;
}

/**
 * There is no environment in which a missing key produces a success
 * response. See BUILD-PLAN §1.15.
 *
 *   EMAIL_TRANSPORT=noop  -> noop, explicit and opt-in only
 *   no RESEND_API_KEY     -> throw (the Server Action catches this and
 *                            returns the error state to the visitor)
 *   otherwise              -> resend
 *
 * EMAIL_TRANSPORT=noop belongs in .env.local for local development, so the
 * success UI can be built before a domain or Resend account exists.
 * .env.local is gitignored and never deployed, so it cannot reach
 * production by accident. With the variable unset and no key — the state
 * of every real deployment until RESEND_API_KEY is set — every environment
 * shows the error state, never a fake success.
 */
export function getEmailAdapter(): EmailAdapter {
  if (process.env.EMAIL_TRANSPORT === "noop") {
    return noopAdapter;
  }
  if (!process.env.RESEND_API_KEY) {
    throw new Error(
      "RESEND_API_KEY is not set. Set it to send real email, or set " +
        'EMAIL_TRANSPORT=noop in .env.local for local development.',
    );
  }
  return resendAdapter;
}

const noopAdapter: EmailAdapter = {
  async send(message) {
    // Prefixed so it's greppable in the Vercel log drain if this were ever
    // (wrongly) set in a deployed environment.
    console.log(
      `[contact:noop] to=${message.to} replyTo=${message.replyTo} subject=${JSON.stringify(message.subject)}\n${message.text}`,
    );
  },
};

const resendAdapter: EmailAdapter = {
  async send(message) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

    const { error } = await resend.emails.send({
      from,
      to: message.to,
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
    });

    if (error) {
      throw new Error(`Resend rejected the message: ${error.message}`);
    }
  },
};

/** Builds the message the Server Action sends — kept here so the subject-line
 * format has one source of truth. */
export function buildContactMessage(input: {
  name: string;
  email: string;
  projectType: string;
  timeline: string;
  budget: string;
  message: string;
}): EmailMessage {
  const { contact } = getSite();
  return {
    to: contact.email,
    replyTo: input.email,
    subject: `New enquiry — ${input.name} (${input.projectType})`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Project type: ${input.projectType}`,
      `Timeline: ${input.timeline}`,
      `Budget: ${input.budget}`,
      "",
      "Message:",
      input.message,
    ].join("\n"),
  };
}
