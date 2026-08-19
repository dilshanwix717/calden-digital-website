import { getSite } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/ui/Section";

/**
 * DRAFT content, owner review required before launch — see the note at the
 * bottom of this file and docs/BUILD-PLAN.md §Phase 6. Not legal advice.
 * Content lives in site.json's `privacy` key, not JSX — it's copy, and the
 * usual "no hardcoded copy in components" rule applies even to a long page.
 */
export default function PrivacyPage() {
  const { pageHeaders, privacy } = getSite();

  return (
    <>
      <Header currentPath="/privacy" />
      <PageHeader {...pageHeaders.privacy} />
      <Section surface="page" className="pb-14 pt-2 sm:pb-24 sm:pt-4" containerClassName="max-w-read">
        <p className="text-sm text-subtle">
          Last updated {new Date(privacy.lastUpdated).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <div className="mt-8 flex flex-col gap-8 desk:mt-11 desk:gap-11">
          {privacy.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-xl font-semibold tracking-[-0.015em] text-ink desk:text-2xl">
                {section.heading}
              </h2>
              <p className="mt-3 text-base leading-[1.65] text-muted">{section.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
