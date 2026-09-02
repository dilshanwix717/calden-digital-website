import Link from "next/link";
import { getSite } from "@/lib/content";
import { Section } from "@/components/ui/Section";

export function CapabilityBand() {
  const { homepage } = getSite();
  const { capability } = homepage;

  return (
    <Section surface="sunken" width="band" borderTop borderBottom className="py-12 text-center sm:py-20">
      <h2 className="text-2xl font-semibold tracking-[-0.015em] text-ink desk:text-[32px]">
        {capability.heading}
      </h2>
      <p className="mx-auto mt-4 max-w-[62ch] text-base leading-[1.62] text-muted desk:mt-5 desk:text-lg">
        {capability.body}
      </p>
      <Link href={capability.linkHref} className="mt-5 inline-block text-[15px] font-semibold text-brand no-underline desk:mt-6">
        {capability.linkLabel}
        <span aria-hidden="true" className="arrow">→</span>
      </Link>
    </Section>
  );
}
