import { getSite } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { ContactActions } from "@/components/contact/ContactActions";
import { ContactForm } from "@/components/contact/ContactForm";
import { whatsappUrl } from "@/lib/whatsapp";

export function ContactSection() {
  const site = getSite();
  const { contact } = site.homepage;

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
          <ContactForm idPrefix="home" contactForm={site.contactForm} contactEmail={site.contact.email} whatsappUrl={whatsappUrl()} />
        </div>
      </div>
    </Section>
  );
}
