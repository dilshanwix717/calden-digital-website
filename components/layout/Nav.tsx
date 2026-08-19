import Link from "next/link";
import { getNavigation } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
// DARK MODE (1/2): uncomment this import to re-enable the theme toggle.
// import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn } from "@/lib/cn";

/* ───────────────────────────────────────────────────────────────────────────
 *  LOGO SIZE — change these two numbers and nothing else.
 *  Height in px; the width follows the lockup's aspect ratio automatically,
 *  so it can't be stretched. The navbar itself is 60px tall on mobile and
 *  76px on desktop, so keep some breathing room: ~40 and ~52 are about the
 *  practical ceiling before it starts crowding the bar.
 * ─────────────────────────────────────────────────────────────────────────── */
const LOGO_HEIGHT_MOBILE = 36;
const LOGO_HEIGHT_DESKTOP = 46;

/**
 * Server Component. Deliberately does NOT use usePathname to know the
 * current route — that would force this entire tree (logo, links, CTA
 * button) into the client bundle for one visual detail. Instead each
 * page.tsx passes its own path down; six pages, one prop each, zero client
 * JavaScript for navigation itself. See BUILD-PLAN §3 "Active link state".
 */
export function Nav({ currentPath }: { currentPath: string }) {
  const { primary, navCta } = getNavigation();

  return (
    <nav className="sticky top-0 z-20 h-[60px] desk:h-[76px] border-b border-line bg-page">
      <div className="mx-auto flex h-full max-w-site items-center gap-6 px-5 desk:px-16">
        <Link href="/" aria-label="Calden Digital home" className="flex flex-none items-center">
          <Logo height={LOGO_HEIGHT_MOBILE} className="desk:hidden" />
          <Logo height={LOGO_HEIGHT_DESKTOP} className="hidden desk:block" />
        </Link>

        <span className="flex-1" />

        {/* Desktop: links, theme toggle, CTA. */}
        <div className="hidden items-center gap-6 desk:flex">
          {primary.map((link) => {
            const active = link.href === currentPath;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-1.5 text-[15px] font-medium tracking-[-0.005em] transition-colors duration-200 hover:text-brand",
                  active ? "text-brand" : "text-ink",
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-brand" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden desk:block">
          <Button variant="primary" size="sm" href={navCta.href}>
            {navCta.label}
          </Button>
        </div>

        {/* DARK MODE (2/2): uncomment the line below (and the import at the
            top of this file) to put the theme toggle back. It sits last, so
            it lands in the far-right corner, and it must stay visible at
            every width — it's the only interactive element outside the
            mobile menu. Left commented rather than conditionally rendered
            because a `{FLAG && <ThemeToggle />}` still bundles the component
            for every visitor: measured at ~1 KB brotli on every route, dead
            weight while the flag is false. See DARK_MODE_ENABLED in
            lib/theme.ts. */}
        {/* {DARK_MODE_ENABLED && <ThemeToggle />} */}

        <MobileNav>
          {primary.map((link) => {
            const active = link.href === currentPath;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-2xl font-semibold tracking-[-0.01em] transition-colors duration-200",
                  active ? "text-brand" : "text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Button variant="primary" size="lg" href={navCta.href} className="mt-4 w-full box-border">
            {navCta.label}
          </Button>
        </MobileNav>
      </div>
    </nav>
  );
}
