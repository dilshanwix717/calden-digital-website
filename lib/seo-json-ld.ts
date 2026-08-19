import { getSite } from "@/lib/content";
import type { CaseStudyFrontmatter } from "@/lib/schemas";

/**
 * JSON-LD builders. Kept separate from lib/seo.ts (Metadata objects) since
 * these return plain JS objects for JsonLd.tsx, not Next's Metadata type.
 */

const ORG_ID = "#organization";
const BUSINESS_ID = "#local-business";

/**
 * Homepage only: an Organization + LocalBusiness pair sharing one @graph,
 * with LocalBusiness.parentOrganization referencing the Organization by
 * @id. LocalBusiness is what the brief specifies; ProfessionalService is
 * the more precise subtype for a software studio and is a valid drop-in
 * later if wanted — not changed here without being asked.
 */
export function organizationAndLocalBusinessJsonLd() {
  const { seo, company, contact, socials } = getSite();
  // Google's structured-data guidance specifies logo/image as a raster
  // format (JPEG/PNG/WebP) — an SVG here is a common source of a Rich
  // Results Test warning even though it renders fine as a favicon
  // elsewhere. The generated default OG PNG (1200x630) already exists and
  // includes the mark, so it doubles as this.
  const logoUrl = `${seo.siteUrl}${seo.defaultOgImage.src}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${seo.siteUrl}/${ORG_ID}`,
        name: company.name,
        url: seo.siteUrl,
        logo: logoUrl,
        description: company.description,
        email: contact.email,
        foundingDate: String(company.foundedYear),
        // sameAs is for profile URLs the entity controls. The "whatsapp"
        // sentinel isn't one (it resolves to a wa.me deep link, not a
        // profile), so it's filtered out rather than resolved.
        ...(() => {
          const profiles = socials.filter((s) => s.href !== "whatsapp").map((s) => s.href);
          return profiles.length > 0 ? { sameAs: profiles } : {};
        })(),
      },
      {
        "@type": "LocalBusiness",
        "@id": `${seo.siteUrl}/${BUSINESS_ID}`,
        name: company.name,
        url: seo.siteUrl,
        image: logoUrl,
        email: contact.email,
        parentOrganization: { "@id": `${seo.siteUrl}/${ORG_ID}` },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Colombo",
          addressCountry: "LK",
        },
        areaServed: "Worldwide",
        // priceRange intentionally omitted — nothing in content states one,
        // and inventing a figure here would be fabricated structured data.
      },
    ],
  };
}

/** One case study page: a CreativeWork referencing the Organization as author/publisher. */
export function caseStudyJsonLd(frontmatter: CaseStudyFrontmatter, coverImage: string) {
  const { seo } = getSite();
  const url = `${seo.siteUrl}/work/${frontmatter.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: frontmatter.title,
    headline: frontmatter.title,
    description: frontmatter.summary,
    about: frontmatter.subtitle,
    url,
    image: `${seo.siteUrl}${coverImage}`,
    datePublished: frontmatter.publishedAt,
    dateModified: frontmatter.updatedAt,
    author: { "@id": `${seo.siteUrl}/${ORG_ID}` },
    publisher: { "@id": `${seo.siteUrl}/${ORG_ID}` },
  };
}

/** FAQPage structured data for /faq. Each answer is plain text, so it needs
 * no HTML escaping beyond what JSON.stringify already does in JsonLd.tsx. */
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
