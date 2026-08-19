import { getSite } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactActions } from "@/components/contact/ContactActions";
import { ContactForm } from "@/components/contact/ContactForm";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * No ContactCTA here — this page already is the contact experience; that
 * band exists so /work, /services and /about have a way to reach this
 * content, and repeating it on the page it points to would be redundant.
 */
export default function ContactPage() {
  const { pageHeaders, contact, contactForm } = getSite();
  const { eyebrow, title, lead } = pageHeaders.contact;

  return (
    <>
      <Header currentPath="/contact" />
      <Section surface="page" className="pb-14 pt-11 sm:pb-24 sm:pt-[72px]">
        <div className="grid grid-cols-1 items-start gap-8 desk:grid-cols-[5fr_6fr] desk:gap-16">
          <div>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h1 className="mt-4 text-[34px] font-semibold leading-[1.06] tracking-[-0.022em] text-ink desk:mt-5 desk:text-[52px]">
              {title}
            </h1>
            {lead && (
              <p className="mt-4 max-w-[48ch] text-base leading-[1.62] text-muted desk:mt-5 desk:text-lg">
                {lead}
              </p>
            )}
            <ContactActions className="mt-6 desk:mt-8" />
            <p className="mt-6 max-w-[44ch] text-[15px] leading-[1.6] text-subtle">
              {contact.contactPageNote}
            </p>
          </div>

          <div className="rounded-md border border-line bg-surface p-5 sm:p-8">
            <ContactForm idPrefix="contact" contactForm={contactForm} contactEmail={contact.email} whatsappUrl={whatsappUrl()} />
          </div>
        </div>
      </Section>
    </>
  );
}
