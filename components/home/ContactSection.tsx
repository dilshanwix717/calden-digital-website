import { getSite } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { ContactActions } from "@/components/contact/ContactActions";

/**
 * The right-column form card is a static placeholder until Phase 7 mounts
 * <ContactForm />. Nothing here submits — that is deliberate for this
 * phase; Phase 7 replaces the marked slot below with the real Server
 * Action form and nothing else on this page changes.
 */
export function ContactSection() {
  const { homepage } = getSite();
  const { contact } = homepage;

  return (
    <Section surface="sunken" id="contact">
      <div className="grid grid-cols-1 items-start gap-8 desk:grid-cols-[5fr_6fr] desk:gap-16">
        <div>
          <h2 className="t-h2 text-ink">{contact.heading}</h2>
          <p className="mt-4 max-w-[48ch] text-base leading-[1.62] text-muted desk:mt-5 desk:text-lg">
            {contact.body}
          </p>
          <ContactActions layout="stack" className="mt-6 desk:mt-8" />
        </div>

        <div className="rounded-md border border-line bg-surface p-5 sm:p-8">
          {/* PHASE 7 SLOT: <ContactForm /> mounts here. Everything else on
              this page is unaffected by that change. */}
          <p className="t-small text-subtle">Contact form — built in Phase 7.</p>
        </div>
      </div>
    </Section>
  );
}
