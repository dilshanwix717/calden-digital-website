import { Section } from "@/components/ui/Section";
import type { CaseStudyFrontmatter } from "@/lib/schemas";

/**
 * A null quote is filtered out by the page before this renders at all.
 * When quote.text is null, renders the reserved placeholder in --text-subtle
 * — visually present but NOT wrapped in <blockquote>, because it is not a
 * real quote yet. When text exists, it's a proper <figure><blockquote>.
 */
export function QuoteBand({ quote }: { quote: NonNullable<CaseStudyFrontmatter["quote"]> }) {
  return (
    <Section surface="sunken" borderTop borderBottom className="text-center">
      <span aria-hidden="true" className="text-[56px] leading-[0.6] text-brand desk:text-[80px]">
        “
      </span>
      {quote.text ? (
        <figure className="mt-5 desk:mt-7">
          <blockquote className="text-xl leading-[1.45] tracking-[-0.015em] text-ink desk:text-[27px]">
            {quote.text}
          </blockquote>
          <figcaption className="mt-5 text-sm tracking-[0.02em] text-subtle">— {quote.attribution}</figcaption>
        </figure>
      ) : (
        <div className="mt-5 desk:mt-7">
          <p className="text-xl font-normal leading-[1.45] tracking-[-0.015em] text-subtle desk:text-[27px]">
            Space reserved for a client quote from {quote.attribution}.
          </p>
          <p className="mt-5 text-sm tracking-[0.02em] text-subtle">— {quote.attribution}</p>
        </div>
      )}
    </Section>
  );
}
