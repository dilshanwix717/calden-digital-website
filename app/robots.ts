import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";

/**
 * Blanket-disallows every environment except production (VERCEL_ENV ===
 * "production"). Vercel preview deployments would otherwise be crawlable
 * and indexable under their own *.vercel.app URL, competing with the real
 * domain for search ranking — worth doing from day one, not bolted on
 * after a preview URL accidentally gets indexed.
 */
export default function robots(): MetadataRoute.Robots {
  const { seo } = getSite();

  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/privacy" },
    sitemap: `${seo.siteUrl}/sitemap.xml`,
  };
}
