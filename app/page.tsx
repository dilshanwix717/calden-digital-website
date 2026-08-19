import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

/**
 * TEMPORARY — Phase 1 verification harness.
 *
 * This page exists to prove the token system, type scale, breakpoints and theme
 * switching work. Phase 4 replaces it entirely with the real homepage.
 */
export default function Page() {
  return (
    <main className="mx-auto max-w-site px-5 py-14 sm:px-16 sm:py-24">
      <div className="flex items-center justify-between gap-6">
        <Logo height={30} />
        <ThemeToggle />
      </div>

      <h1 className="t-h1 mt-10 text-ink">Phase 1 verification</h1>
      <p className="t-lead mt-4 max-w-[60ch] text-muted">
        Tokens, type scale, breakpoints and dark mode. Replaced in Phase 4.
      </p>

      {/* Surfaces */}
      <section className="mt-12">
        <h2 className="t-h3 text-ink">Surfaces</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 desk:grid-cols-4">
          <div className="rounded-md border border-line bg-page p-5 text-ink">page</div>
          <div className="rounded-md border border-line bg-surface p-5 text-ink">surface</div>
          <div className="rounded-md border border-line bg-sunken p-5 text-ink">sunken</div>
          <div className="rounded-md bg-band p-5 text-on-band dark:border dark:border-line">
            band — <span className="text-on-band-muted">muted</span> —{" "}
            <span className="text-accent">gold</span> —{" "}
            <span className="text-brand-on-band">teal</span>
          </div>
        </div>
      </section>

      {/* Type scale */}
      <section className="mt-12">
        <h2 className="t-h3 text-ink">Type scale</h2>
        <div className="mt-4 space-y-2">
          <p className="t-display text-ink">Display</p>
          <p className="t-h1 text-ink">Heading 1</p>
          <p className="t-h2 text-ink">Heading 2</p>
          <p className="t-h3 text-ink">Heading 3</p>
          <p className="t-lead text-muted">Body large</p>
          <p className="t-body text-ink">Body</p>
          <p className="t-small text-muted">Small</p>
          <p className="t-caption text-subtle">Caption</p>
        </div>
      </section>

      {/* Buttons — note text-on-brand, which is dark in dark mode */}
      <section className="mt-12">
        <h2 className="t-h3 text-ink">Buttons</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button className="rounded-sm bg-brand px-[22px] py-3 text-[15px] font-semibold leading-none tracking-[-0.01em] text-on-brand transition-colors duration-200 hover:bg-brand-hover">
            Primary
          </button>
          <button className="rounded-sm border border-brand px-[22px] py-3 text-[15px] font-semibold leading-none tracking-[-0.01em] text-brand transition-colors duration-200">
            Secondary
          </button>
          <input
            className="rounded-sm border border-line-control bg-surface px-[14px] py-[11px] text-base text-ink placeholder:text-subtle"
            placeholder="Form control"
          />
        </div>
      </section>

      {/* Breakpoint probe */}
      <section className="mt-12">
        <h2 className="t-h3 text-ink">Breakpoints</h2>
        <p className="t-body mt-2 text-muted">
          <span className="desk:hidden">Below 820px — mobile layout</span>
          <span className="hidden desk:inline">820px and up — desktop layout</span>
        </p>
      </section>
    </main>
  );
}
