import type { Metadata } from "next";
import { getSite } from "@/lib/content";

/**
 * Central metadata builder — every page.tsx (or generateMetadata) calls
 * this instead of hand-writing a Metadata object, so canonical URLs, OG
 * images and the title template all come from one place.
 *
 * metadataBase is set in app/layout.tsx from site.seo.siteUrl. Without it
 * Next emits relative OG image URLs, which most crawlers reject. Both
 * metadataBase and this file derive everything from seo.siteUrl — update
 * that one field in content/site.json the moment calden.lk is registered
 * and canonicals, the sitemap and JSON-LD all follow.
 */

type BuildMetadataInput = {
  title: string;
  description: string;
  /** Path only, e.g. "/work/susila" — joined to seo.siteUrl. */
  path: string;
  image?: { src: string; width: number; height: number; alt: string };
  type?: "website" | "article";
  /** Use for the homepage, where the title is NOT run through the template. */
  absoluteTitle?: boolean;
  noindex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  absoluteTitle = false,
  noindex = false,
}: BuildMetadataInput): Metadata {
  const { seo, company } = getSite();
  const url = `${seo.siteUrl}${path}`;
  const ogImage = image ?? seo.defaultOgImage;
  const ogImageUrl = `${seo.siteUrl}${ogImage.src}`;

  const metadata: Metadata = {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: company.name,
      title,
      description,
      locale: "en_LK",
      images: [{ url: ogImageUrl, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
      // seo.twitterHandle is null until one exists — omit the keys entirely
      // rather than emit site/creator as "", which is worse than absent.
      ...(seo.twitterHandle ? { site: seo.twitterHandle, creator: seo.twitterHandle } : {}),
    },
  };

  if (noindex) {
    metadata.robots = { index: false, follow: true };
  }

  return metadata;
}
