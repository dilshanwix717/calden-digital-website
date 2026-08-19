import Link from "next/link";
import { getSite, getNavigation } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Footer is the one place gold legitimately carries text: 6.63:1 on the
 * light band, 10.68:1 in dark. See BUILD-PLAN §1.5. Wordmark is TYPE, not
 * the logo file — the handoff's design system sets it as type in
 * --text-on-dark on the footer specifically, because the dark lockup
 * variant was never supplied.
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
            <Link href="/" aria-label={company.name} className="mb-4 flex items-baseline gap-2">
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
              <h4 className="mb-4 t-caption text-accent">{col.title}</h4>
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
