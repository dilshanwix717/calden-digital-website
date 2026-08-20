import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Plausible } from "@/components/analytics/Plausible";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSite } from "@/lib/content";
import "./globals.css";

/**
 * Outfit is the brand's real typeface, not a substitution.
 *
 * 400 / 500 / 600. The budget document asks for two weights on the premise that
 * "every additional weight is roughly 25KB" — that is true of static cuts, but
 * Outfit on Google Fonts is a VARIABLE font. next/font splits it by
 * unicode-range, not by weight, so all three weights resolve to the same two
 * files. Measured in Phase 1: 400/600 and 400/500/600 produce byte-identical
 * output (same file hashes, 32,228 + 14,760 bytes). Weight 500 is free, so the
 * design's real label weight is used rather than being mapped to 600.
 *
 * Only the latin file (32 KB) is fetched for English content; latin-ext loads
 * on demand. Total well inside the 60 KB font budget.
 *
 * next/font self-hosts at build time: no request to fonts.googleapis.com and
 * no preconnect needed, unlike the handoff's tokens/fonts.css.
 */
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-outfit",
});

const { seo } = getSite();

/**
 * metadataBase is the one setting every other page's relative URLs resolve
 * against — OG images, canonicals via alternates.canonical in lib/seo.ts.
 * Sourced from content/site.json's seo.siteUrl, which is a placeholder
 * (calden.lk) until the domain is registered. Update that single field and
 * this, the sitemap, robots.ts and every page's JSON-LD all follow.
 *
 * title/description here are the site-wide fallback; every page overrides
 * them via buildMetadata() in lib/seo.ts. The homepage's own metadata
 * export (app/page.tsx) still takes precedence over this default.
 */
export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: {
    default: seo.defaultTitle,
    template: seo.titleTemplate,
  },
  description: seo.defaultDescription,
};

/**
 * Root shell. Header is intentionally NOT mounted here: Nav needs the
 * current route to render aria-current and the teal underline, and a root
 * layout has no access to the segment path without becoming a client
 * component (usePathname) — which would drag the logo/links/CTA tree into
 * the client bundle for a single visual detail (BUILD-PLAN §3, "Active link
 * state"). Instead every page.tsx renders <Header currentPath="/its-path" />
 * as the first thing inside <main>. Footer has no path dependency, so it
 * lives here.
 *
 * <main> is flex:1 inside a flex-col body so short pages still push the
 * footer to the bottom of the viewport (Phase 3, AC1).
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer />
        {/* WhatsAppFloating (components/shared/WhatsAppFloating.tsx) is built
            but deliberately not mounted — see BUILD-PLAN §Phase 6. To turn it
            on: import it above and render <WhatsAppFloating /> here, after
            Footer, so it sits on top of everything via its own fixed
            positioning. No other file needs to change. */}
        <Plausible />
        {/* First-party, does not count against the 5 KB third-party
            script budget. Reports real-user Core Web Vitals in the Vercel
            dashboard once deployed — this is what covers real INP, since
            Lighthouse only measures TBT as its lab proxy. */}
        <SpeedInsights />
      </body>
    </html>
  );
}
