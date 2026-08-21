import Link from "next/link";
import { getSite, getNavigation } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";
import { MapPin } from "@/components/icons/MapPin";
import { Mail } from "@/components/icons/Mail";
import { ChatGlyph } from "@/components/icons/ChatGlyph";
import { SOCIAL_ICONS } from "@/components/icons/social";

/**
 * Footer.
 *
 * Dark band (bg-band), not a light surface: the section immediately above the
 * footer is bg-sunken on the homepage and bg-page on /contact — both light —
 * so a light footer sat flush against them with no visible seam. The band is
 * what actually separates "page content" from "footer" on every route.
 *
 * The lockup is a white circle holding the mark
 * (public/logo/calden-mark.svg, true colours — legible because the circle,
 * not the band, is what's behind it) plus the company name set as real text
 * in `--text-on-band`, not the wordmark's own letterforms. Mark left, name
 * right, per the brief.
 *
 * Column headings are h2, not h4 as the design system's own footer had them.
 * Every page here has exactly one h1 and the footer is always the last
 * landmark, so h2 is the only level that never skips — /contact and /privacy
 * have no h2 of their own, which is what made h3 wrong. Found by the
 * cross-page heading-order check in scripts/check-a11y-static.mjs.
 */

/** Change the footer mark-badge size here. Mark width follows its own aspect ratio. */
const BADGE_SIZE = 60;
const MARK_HEIGHT = 34;
const MARK_ASPECT = 145 / 161;

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
            <Link
              href="/"
              className="inline-flex items-center gap-4"
              aria-label={`${company.name} home`}
            >
              <span
                className="flex flex-none items-center justify-center rounded-full bg-white"
                style={{ height: BADGE_SIZE, width: BADGE_SIZE }}
              >
                <svg
                  viewBox="0 0 145 161"
                  height={MARK_HEIGHT}
                  width={MARK_HEIGHT * MARK_ASPECT}
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M124.43 50.51 L72.47 20.51 L20.51 50.51 L20.51 110.51 L72.47 140.51 L124.43 110.51"
                    fill="none"
                    stroke="#0F5C5C"
                    strokeWidth="13.02"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M108.84 59.51 L72.47 38.51 L36.10 59.51 L36.10 101.51 L72.47 122.51 L108.84 101.51"
                    fill="none"
                    stroke="#0F5C5C"
                    strokeWidth="10.98"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M92.37 69.02 L72.47 57.53 L52.57 69.02 L52.57 92.00 L72.47 103.49 L92.37 92.00"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="9.00"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-[26px] font-semibold tracking-[-0.01em] text-on-band">
                {company.name}
              </span>
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
                  className="text-[15px] text-on-band transition-colors duration-200 hover:text-brand-on-band"
                >
                  {whatsapp.label}
                </a>
              </ContactRow>

              <ContactRow icon={<Mail size={17} />} label="Email">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[15px] text-on-band transition-colors duration-200 hover:text-brand-on-band"
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
                className="underline-grow text-[13px] text-on-band-muted transition-colors duration-200 hover:text-on-band"
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
        className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--text-on-band)_9%,transparent)] text-brand-on-band"
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
