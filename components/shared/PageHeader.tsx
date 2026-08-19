import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Shared header band for Work, Services, About and Contact — eyebrow, h1,
 * optional lead paragraph. Content comes from site.json's pageHeaders map,
 * keyed per page (lib/content.ts's getSite().pageHeaders).
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string | null;
}) {
  return (
    <Section surface="page" className="pb-2 pt-11 sm:pb-4 sm:pt-[72px]">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1
        className={`text-[36px] font-semibold leading-[1.05] tracking-[-0.022em] text-ink desk:text-[58px] ${
          eyebrow ? "mt-4 desk:mt-5" : ""
        }`}
      >
        {title}
      </h1>
      {lead && (
        <p className="mt-[18px] max-w-[56ch] text-[17px] leading-[1.5] text-muted desk:mt-[22px] desk:text-xl">
          {lead}
        </p>
      )}
    </Section>
  );
}
