import { getSite, getServices } from "@/lib/content";
import { Section } from "@/components/ui/Section";

/**
 * Service cards, index + title + lead. The design system's ServiceCard
 * component is reference markup only (see the handoff README) — this is a
 * plain reimplementation matching its visual spec.
 */
export function WhatWeDo() {
  const { homepage } = getSite();
  const services = getServices();

  return (
    <Section surface="page">
      <h2 className="t-h2 text-ink">{homepage.whatWeDo.heading}</h2>
      <div className="mt-7 grid grid-cols-1 gap-3 desk:mt-11 desk:grid-cols-4 desk:gap-5">
        {services.map((s) => (
          <div key={s.slug} className="flex flex-col gap-4 rounded-md border border-line bg-surface p-8">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-semibold tracking-[0.06em] text-brand">{s.index}</span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <h3 className="text-xl font-semibold tracking-[-0.01em] text-ink">{s.title}</h3>
            <p className="t-small max-w-[46ch] text-muted">{s.lead}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
