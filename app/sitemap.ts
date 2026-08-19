import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";
import { getAllCaseStudySlugs, readCaseStudy } from "@/lib/mdx";

const STATIC_LAST_MODIFIED = new Date("2026-08-19");

/**
 * /privacy is deliberately absent — it's a noindex page (see lib/seo.ts's
 * buildMetadata noindex flag on that route), and advertising a noindex page
 * in the sitemap is contradictory. Draft case studies are excluded via
 * getAllCaseStudySlugs(), which already filters draft: true — they 404, and
 * a 404 in the sitemap costs crawl budget and looks broken in Search
 * Console.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const { seo } = getSite();
  const { siteUrl } = seo;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/work`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/services`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/about`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/faq`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.5 },
  ];

  const caseStudyRoutes: MetadataRoute.Sitemap = getAllCaseStudySlugs().map((slug) => {
    const study = readCaseStudy(slug);
    return {
      url: `${siteUrl}/work/${slug}`,
      lastModified: study ? new Date(study.frontmatter.updatedAt) : STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.5,
    };
  });

  return [...staticRoutes, ...caseStudyRoutes];
}
