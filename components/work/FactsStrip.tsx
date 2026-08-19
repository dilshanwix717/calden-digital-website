import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { CaseStudyFrontmatter } from "@/lib/schemas";

export function FactsStrip({ facts }: { facts: CaseStudyFrontmatter["facts"] }) {
  const items: [string, string][] = [
    ["Role", facts.role],
    ["Timeline", facts.timeline],
    ["Stack", facts.stack],
  ];
  return (
    <Section
      as="header"
      surface="sunken"
      borderTop
      borderBottom
      className="py-8 desk:py-10"
    >
      <div className="grid grid-cols-1 gap-6 desk:grid-cols-[1fr_1fr_1.6fr] desk:gap-12">
        {items.map(([label, value]) => (
          <div key={label}>
            <Eyebrow>{label}</Eyebrow>
            <p className="mt-2.5 text-[15px] leading-[1.6] text-ink">{value}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
