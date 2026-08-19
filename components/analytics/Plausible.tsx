import Script from "next/script";
import { getSite } from "@/lib/content";

/**
 * Deferred, off by default. Returns null unless BOTH content
 * (site.json's analytics.plausibleDomain) and the environment
 * (NEXT_PUBLIC_PLAUSIBLE_DOMAIN) agree — content alone can't turn tracking
 * on without also setting the env var, and vice versa, so there's no way
 * to accidentally ship analytics live.
 *
 * strategy="afterInteractive" + defer keeps this off the critical path —
 * never beforeInteractive. Self-hosting Plausible would only mean changing
 * `src` below, nothing else in this component.
 */
export function Plausible() {
  const { analytics } = getSite();
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  if (!analytics.plausibleDomain || !domain) return null;

  return (
    <Script
      defer
      strategy="afterInteractive"
      data-domain={domain}
      src="https://plausible.io/js/script.js"
    />
  );
}
