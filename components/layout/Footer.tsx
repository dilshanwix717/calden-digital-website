import Link from "next/link";
import { getSite, getNavigation } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";
import { Logo } from "@/components/ui/Logo";
import { MapPin } from "@/components/icons/MapPin";
import { Mail } from "@/components/icons/Mail";
import { ChatGlyph } from "@/components/icons/ChatGlyph";
import { SOCIAL_ICONS } from "@/components/icons/social";

/**
 * Footer.
 *
 * No gold anywhere. The design system permits gold as text on a dark band
 * (6.63:1, so it passes contrast), but it read harshly here against the deep
 * green — the accent is the on-band teal (--brand-on-band, #3FAEA5, 5.19:1)
 * instead, which is on-brand without the clash.
 *
 * The lockup uses tone="onDark": the brand teal is ~1.4:1 on this band and
 * would be effectively invisible, so the mark and wordmark swap to the band's
 * light text colour. See components/ui/Logo.tsx and the .logo-on-dark rule in
 * app/globals.css.
 *
 * Column headings are h2, not h4 as the design system's own footer had them.
 * Every page here has exactly one h1 and the footer is always the last
 * landmark, so h2 is the only level that never skips — /contact and /privacy
 * have no h2 of their own, which is what made h3 wrong. Found by the
 * cross-page heading-order check in scripts/check-a11y-static.mjs.
 */

/** Change the footer lockup size here. Width follows the aspect ratio. */
const LOGO_HEIGHT = 54;

export function Footer() {
  const { company, contact, whatsapp, socials, copyright } = getSite();
  const { footerColumns, legal } = getNavigation();

  function resolveHref(href: string): string {
    return href === "whatsapp" ? whatsappUrl() : href;
  }

  return (
    <footer className="bg-band text-on-band">
      <div className="mx-auto max-w-site px-5 py-14 desk:px-16 desk:py-20">
        <div className="grid grid-cols-1 gap-12 desk:grid-cols-[1.5fr_1fr_1.2fr] desk:gap-16">
          {/* Brand + about + socials */}
          <div>
            <Link href="/" className="inline-flex" aria-label={`${company.name} home`}>
              <Logo height={LOGO_HEIGHT} tone="onDark" title="" />
            </Link>
            <p className="mt-5 max-w-[42ch] text-[15px] leading-[1.7] text-on-band-muted">
              {company.description}
            </p>

            {socials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {socials.map((social) => {
                  const Icon = SOCIAL_ICONS[social.platform];
                  return (
                    <li key={social.platform}>
                      <a
                        href={resolveHref(social.href)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="flex h-10 w-10 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--text-on-band)_9%,transparent)] text-on-band-muted transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--brand-on-band)_18%,transparent)] hover:text-on-band"
                      >
                        <Icon size={18} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-on-band">
                {col.title}
              </h2>
              <ul className="mt-5 flex flex-col gap-3">
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

          {/* Contact details — circular icon badge per row */}
          <div>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-on-band">
              Get in touch
            </h2>
            <ul className="mt-5 flex flex-col gap-5">
              <ContactRow icon={<MapPin size={17} />} label="Where we are">
                <span className="text-[15px] text-on-band">{contact.locationShort}</span>
              </ContactRow>

              <ContactRow icon={<ChatGlyph size={17} />} label="WhatsApp">
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] text-on-band transition-colors duration-200 hover:text-[var(--brand-on-band)]"
                >
                  {whatsapp.label}
                </a>
              </ContactRow>

              <ContactRow icon={<Mail size={17} />} label="Email">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[15px] text-on-band transition-colors duration-200 hover:text-[var(--brand-on-band)]"
                >
                  {contact.email}
                </a>
              </ContactRow>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-[color-mix(in_srgb,var(--text-on-band)_14%,transparent)] pt-6 desk:mt-16 desk:flex-row desk:items-center desk:justify-between">
          <p className="text-[13px] text-on-band-muted">{copyright}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="text-[13px] text-on-band-muted">{contact.locationLong}</p>
            {legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-on-band-muted underline-offset-4 transition-colors duration-200 hover:text-on-band hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * One contact line: a circular icon badge, a small muted label, and the value
 * beneath it. The label is visible text rather than an aria-label so the
 * accessible name and the rendered name can't drift apart — the exact
 * mismatch that failed an axe audit on this footer's wordmark in Phase 9.
 */
function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3.5">
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--text-on-band)_9%,transparent)] text-[var(--brand-on-band)]"
      >
        {icon}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[12px] uppercase tracking-[0.1em] text-on-band-muted">{label}</span>
        {children}
      </span>
    </li>
  );
}
