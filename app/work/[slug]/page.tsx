import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdjacentProjects, getProjectBySlug } from "@/lib/content";
import { readCaseStudy, compileCaseStudyBody, getAllCaseStudySlugs } from "@/lib/mdx";
import { Header } from "@/components/layout/Header";
import { CaseStudyHeader } from "@/components/work/CaseStudyHeader";
import { FactsStrip } from "@/components/work/FactsStrip";
import { ScreensSection } from "@/components/work/ScreensSection";
import { QuoteBand } from "@/components/work/QuoteBand";
import { PrevNext } from "@/components/work/PrevNext";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { Section } from "@/components/ui/Section";
import { proseComponents } from "@/components/ui/Prose";
import { DecisionBand } from "@/components/work/DecisionBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { caseStudyJsonLd } from "@/lib/seo-json-ld";

export async function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

// Anything not returned by generateStaticParams 404s rather than trying to
// render on demand — a dynamic fallback would make this route dynamic,
// which violates the "no per-request SSR" rule for this site.
export const dynamicParams = false;

/**
 * ogImage fallback chain: frontmatter.ogImage -> the project's cover image
 * -> lib/seo.ts's own site-default fallback (buildMetadata handles the
 * last step when `image` is undefined). Every case study currently has
 * ogImage: null, so this resolves to `cover` today; setting a per-study
 * ogImage in frontmatter later overrides it with no code change.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = readCaseStudy(slug);
  if (!study || study.frontmatter.draft) return {};

  const project = getProjectBySlug(slug);
  const image = study.frontmatter.ogImage ?? project?.cover;

  return buildMetadata({
    title: study.frontmatter.title,
    // Trimmed to ~155 chars — the conventional meta-description ceiling
    // before search engines truncate it anyway.
    description: study.frontmatter.summary.slice(0, 155),
    path: `/work/${slug}`,
    type: "article",
    image,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = readCaseStudy(slug);
  if (!study || study.frontmatter.draft) notFound();

  const { frontmatter, body } = study;
  const { prev, next } = getAdjacentProjects(slug);

  const content = await compileCaseStudyBody(body, {
    ...proseComponents,
    DecisionBand,
  });

  const project = getProjectBySlug(slug);
  const jsonLd = caseStudyJsonLd(frontmatter, frontmatter.ogImage?.src ?? project?.cover.src ?? "/images/og/default.png");

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header currentPath={`/work/${slug}`} />
      <CaseStudyHeader title={frontmatter.title} subtitle={frontmatter.subtitle} />
      <FactsStrip facts={frontmatter.facts} />

      <Section as="article" surface="page" className="overflow-x-hidden pt-12 desk:pt-20" containerClassName="max-w-read">
        <p
          className="text-[19px] font-normal leading-[1.55] tracking-[-0.01em] text-ink desk:text-[23px]"
          style={{ textWrap: "pretty" }}
        >
          {frontmatter.summary}
        </p>
        {content}
      </Section>

      <ScreensSection screens={frontmatter.screens} />
      <QuoteBand quote={frontmatter.quote} />
      <PrevNext prev={prev} next={next} />
      <ContactCTA />
    </>
  );
}
