import Link from "next/link";
import { getSite, getNavigation } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Footer is the one place gold legitimately carries text: 6.63:1 on the
 * light band, 10.68:1 in dark. See BUILD-PLAN §1.5. Wordmark is TYPE, not
 * the logo file — the handoff's design system sets it as type in
 * --text-on-dark on the footer specifically, because the dark lockup
 * variant was never supplied.
 *
 * Column headings are h2, not the design system's h4. First attempt was h3
 * on the assumption every page has an h2 above the footer — wrong: /contact
 * has none, so h3 skipped a level there (h1 -> h3). h2 is the only level
 * that's valid after every page's h1 regardless of what page content
 * exists in between, since every page has at least an h1 and the footer
 * is always the last landmark. Found by Phase 6's cross-page heading-order
 * check — see docs/MEASUREMENTS.md.
 */
export function Footer() {
  const { company, contact, copyright } = getSite();
  const { footerColumns, legal } = getNavigation();

  function resolveHref(href: string): string {
    if (href === "whatsapp") return whatsappUrl();
    return href;
  }

  return (
    <footer className="bg-band text-on-band">
      <div className="mx-auto max-w-site px-5 py-16 desk:px-16 desk:py-24">
        <div className="grid grid-cols-2 gap-8 desk:grid-cols-[1.4fr_1fr_1fr_1fr] desk:gap-12">
          <div>
            {/* No aria-label here — found by Lighthouse/axe in Phase 9:
                aria-label="Calden Digital" didn't match the link's own
                visible text ("Calden" + "Digital", the second span visually
                uppercased via CSS only), which is exactly the
                "label-content-name-mismatch" failure — screen-reader users
                hear one thing while sighted users read another. The link's
                own text content is already the correct accessible name, so
                the label was redundant as well as wrong. */}
            <Link href="/" className="mb-4 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tracking-[-0.02em] text-on-band">
                {company.shortName}
              </span>
              <span className="text-[11px] font-semibold tracking-[0.24em] text-accent uppercase">
                Digital
              </span>
            </Link>
            <p className="max-w-[34ch] text-base leading-[1.6] text-on-band-muted">
              {company.tagline}
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 t-caption text-accent">{col.title}</h2>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={resolveHref(link.href)}
                      className="text-[15px] text-on-band-muted transition-colors duration-200 hover:text-on-band"
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[color-mix(in_srgb,var(--text-on-band)_16%,transparent)] pt-6">
          <p className="text-[13px] text-on-band-muted">{copyright}</p>
          <p className="text-[13px] text-on-band-muted">{contact.locationLong}</p>
          {legal.length > 0 && (
            <ul className="flex gap-4">
              {legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-on-band-muted transition-colors duration-200 hover:text-on-band"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
