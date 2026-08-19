import { getSite } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { ContactActions } from "@/components/contact/ContactActions";

/**
 * Shared by /work, /work/[slug], /services and /about. NOT used on
 * /contact — that page already is the contact experience.
 */
export function ContactCTA() {
  const { contactCta } = getSite();
  return (
    <Section surface="sunken" borderTop className="text-center">
      <h2 className="t-h2 text-ink">{contactCta.heading}</h2>
      <p className="mx-auto mt-4 max-w-[52ch] text-base leading-[1.62] text-muted desk:mt-5 desk:text-lg">
        {contactCta.body}
      </p>
      <ContactActions layout="row" className="mt-6 desk:mt-8" />
    </Section>
  );
}
