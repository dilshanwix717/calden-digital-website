import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";

/**
 * Indexing is allowed only from the real canonical domain.
 *
 * Two things have to be true, not one. VERCEL_ENV must be "production"
 * (which rules out preview deploys), AND the deployment must actually be
 * served from seo.siteUrl's host.
 *
 * The second check is what stops the production *.vercel.app URL being
 * indexed while the domain is still unregistered. Every canonical, OG url
 * and JSON-LD @id on the site is absolute and points at seo.siteUrl, so a
 * crawlable vercel.app deployment would serve a full set of pages whose
 * canonicals all point at a host that does not resolve — the worst of both
 * outcomes: the .vercel.app URL competing for the brand name, and the
 * canonical target returning NXDOMAIN.
 *
 * VERCEL_PROJECT_PRODUCTION_URL is the production domain Vercel considers
 * canonical for the project: the custom domain once one is attached, and
 * the .vercel.app hostname until then. Comparing it to seo.siteUrl's host
 * means this flips to Allow on its own the moment calden.lk is registered
 * and attached — no code change, nothing to remember.
 */
export default function robots(): MetadataRoute.Robots {
  const { seo } = getSite();

  const canonicalHost = new URL(seo.siteUrl).host;
  const servedHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  const isProduction = process.env.VERCEL_ENV === "production";
  // No VERCEL_PROJECT_PRODUCTION_URL means a local build (`pnpm build`),
  // where the host is unknowable and nothing is crawlable anyway — treat
  // that as matching so local output still shows the real production rules.
  const isCanonicalHost = !servedHost || servedHost === canonicalHost;

  if (!isProduction || !isCanonicalHost) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    // /privacy is noindex via buildMetadata, which is the right tool and
    // sufficient on its own. It is deliberately NOT disallowed here:
    // Disallow blocks the crawl, which would stop Google ever reading the
    // noindex it is meant to reinforce. The two directives contradict each
    // other, and robots.txt is the one that loses.
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${seo.siteUrl}/sitemap.xml`,
  };
}
