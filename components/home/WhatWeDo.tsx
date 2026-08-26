import Link from "next/link";
import { getSite, getServices } from "@/lib/content";
import { Section } from "@/components/ui/Section";

/**
 * Service cards, index + title + lead. The design system's ServiceCard
 * component is reference markup only (see the handoff README) — this is a
 * plain reimplementation matching its visual spec.
 *
 * Five services in a three-column grid leave one slot empty, so the sixth
 * tile is a call to action rather than a service. That is why the grid is
 * 3x2 and not 4+1: a fifth card spanning four columns read as a wrapping
 * accident, and the empty slot is more useful as a conversion point than as
 * whitespace. The CTA is styled apart from the service cards — brand border,
 * no index number — so it is never mistaken for a sixth thing we sell.
 */
export function WhatWeDo() {
  const { homepage } = getSite();
  const services = getServices();
  const { cta } = homepage.whatWeDo;

  return (
    <Section surface="page">
      <h2 className="t-h2 text-ink">{homepage.whatWeDo.heading}</h2>
      <div className="mt-7 grid grid-cols-1 gap-3 desk:mt-11 desk:grid-cols-3 desk:gap-5">
        {services.map((s) => (
          <div className="reveal flex flex-col gap-4 rounded-md border border-line bg-surface p-8 transition-[translate,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-brand" key={s.slug}>
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-semibold tracking-[0.06em] text-brand">{s.index}</span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <h3 className="text-xl font-semibold tracking-[-0.01em] text-ink">{s.title}</h3>
            <p className="t-small max-w-[46ch] text-muted">{s.lead}</p>
          </div>
        ))}

        <Link
          href={cta.href}
          className="reveal flex flex-col gap-4 rounded-md border border-brand bg-[color-mix(in_srgb,var(--brand-teal)_5%,var(--surface-card))] p-8 transition-[translate,background-color] duration-500 ease-out hover:-translate-y-1 hover:bg-[color-mix(in_srgb,var(--brand-teal)_9%,var(--surface-card))]"
        >
          <h3 className="text-xl font-semibold tracking-[-0.01em] text-ink">{cta.title}</h3>
          <p className="t-small max-w-[46ch] text-muted">{cta.body}</p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-[15px] font-semibold text-brand">
            {cta.label}
            <span aria-hidden="true" className="arrow">
              →
            </span>
          </span>
        </Link>
      </div>
    </Section>
  );
}
