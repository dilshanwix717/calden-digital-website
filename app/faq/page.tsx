import type { Metadata } from "next";
import { getSite } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/seo-json-ld";

export function generateMetadata(): Metadata {
  const { pageHeaders } = getSite();
  return buildMetadata({
    title: pageHeaders.faq.title,
    description: pageHeaders.faq.lead ?? "",
    path: "/faq",
  });
}

/**
 * Native <details>/<summary> accordion — no client component, no state, no
 * JavaScript at all. The browser handles open/close, keyboard interaction
 * and the expanded/collapsed announcement for free, and the answers stay in
 * the DOM while collapsed so they're still indexed (and still found by
 * in-page search).
 *
 * Questions are not <h2>s: a <summary> is already an interactive, labelled
 * element, and wrapping a heading inside one produces a confusing "heading,
 * button" double announcement. The FAQPage structured data below is what
 * gives search engines the question/answer semantics.
 */
export default function FaqPage() {
  const { pageHeaders, faq } = getSite();

  return (
    <>
      <JsonLd data={faqJsonLd(faq.items)} />
      <Header currentPath="/faq" />
      <PageHeader {...pageHeaders.faq} />

      <Section surface="page" className="pb-14 pt-2 sm:pb-24 sm:pt-4" containerClassName="max-w-read">
        <ul className="flex flex-col">
          {faq.items.map((item) => (
            <li key={item.question} className="border-b border-line first:border-t">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-lg font-semibold tracking-[-0.01em] text-ink transition-colors duration-200 hover:text-brand [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="mt-1 flex-none text-brand transition-transform duration-200 group-open:rotate-45"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="max-w-[64ch] pb-6 text-base leading-[1.72] text-muted" style={{ textWrap: "pretty" }}>
                  {item.answer}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </Section>

      <ContactCTA />
    </>
  );
}
