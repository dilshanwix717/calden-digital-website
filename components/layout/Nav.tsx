import Link from "next/link";
import { getNavigation } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn } from "@/lib/cn";

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
        <Link href="/" aria-label="Calden Digital home" className="flex flex-none">
          <Logo height={26} className="desk:hidden" />
          <Logo height={30} className="hidden desk:block" />
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

        {/* Theme toggle is visible at every width — it is the only
            interactive element outside the mobile menu, so it must never
            be hidden behind the hamburger. */}
        <ThemeToggle />

        <div className="hidden desk:block">
          <Button variant="primary" size="sm" href={navCta.href}>
            {navCta.label}
          </Button>
        </div>

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
