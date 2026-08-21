import type { Metadata } from "next";
import { getSite, getServices } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const { pageHeaders } = getSite();
  return buildMetadata({
    title: pageHeaders.services.title,
    description: pageHeaders.services.lead ?? "",
    path: "/services",
  });
}

export default function ServicesPage() {
  const { pageHeaders } = getSite();
  const services = getServices();

  return (
    <>
      <Header currentPath="/services" />
      <PageHeader {...pageHeaders.services} />

      {/* reveal off on the Section: each row below reveals itself individually. */}
      <Section surface="page" reveal={false} className="pb-2 pt-0 sm:pb-4">
        {services.map((s) => (
          <div
            key={s.slug}
            className="reveal flex flex-col gap-4 border-t border-line py-9 desk:flex-row desk:gap-16 desk:py-13"
          >
            <div className="flex items-center gap-4 desk:basis-[300px] desk:flex-none desk:items-start">
              <span className="text-sm font-semibold tracking-[0.06em] text-brand">{s.index}</span>
              <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-ink desk:text-[32px]">
                {s.title}
              </h2>
            </div>
            <div className="flex-1">
              <p className="max-w-[60ch] text-lg font-normal leading-[1.55] text-ink desk:text-xl" style={{ textWrap: "pretty" }}>
                {s.lead}
              </p>
              <p className="mt-4 max-w-[60ch] text-base leading-[1.65] text-muted" style={{ textWrap: "pretty" }}>
                {s.body}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {s.includes.map((i) => (
                  <Tag key={i} variant="chip">
                    {i}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Section>

      <ContactCTA />
    </>
  );
}
