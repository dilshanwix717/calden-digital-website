import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { CaseStudyFrontmatter } from "@/lib/schemas";

/**
 * liveUrl is passed separately rather than living in frontmatter: the URL is a
 * property of the project, not of the write-up, and the work index needs the
 * same value. One source in projects.json, rendered in both places.
 *
 * reveal={false}: this sits directly under CaseStudyHeader, always in the
 * initial viewport, so there's nothing for a scroll-triggered fade to
 * reveal — same reasoning as PageHeader and CaseStudyHeader.
 *
 * Was sticky (pinned under Nav while the article body scrolled past) —
 * removed on request. Plain flow now.
 */
export function FactsStrip({
  facts,
  liveUrl,
}: {
  facts: CaseStudyFrontmatter["facts"];
  liveUrl?: string;
}) {
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
      reveal={false}
      className="py-8 desk:py-10"
    >
      <div
        className={
          liveUrl
            ? "grid grid-cols-1 gap-6 desk:grid-cols-[1fr_1fr_1.6fr_auto] desk:gap-12"
            : "grid grid-cols-1 gap-6 desk:grid-cols-[1fr_1fr_1.6fr] desk:gap-12"
        }
      >
        {items.map(([label, value]) => (
          <div key={label}>
            <Eyebrow>{label}</Eyebrow>
            <p className="mt-2.5 text-[15px] leading-[1.6] text-ink">{value}</p>
          </div>
        ))}
        {liveUrl && (
          <div>
            <Eyebrow>Live site</Eyebrow>
            <p className="mt-2.5 text-[15px] leading-[1.6]">
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand underline underline-offset-2 hover:text-[var(--brand-teal-hover)]"
              >
                {liveUrl.replace(/^https?:\/\//, "")}
                <span aria-hidden="true"> ↗</span>
              </a>
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}
