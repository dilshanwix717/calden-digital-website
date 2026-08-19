import { Header } from "@/components/layout/Header";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";

/**
 * TEMPORARY — Phase 1/3 verification harness.
 *
 * Proves the token system, type scale, breakpoints, theme switching, and now
 * the full page shell (Header/Nav/MobileNav/Footer) work end to end. Phase 4
 * replaces this entirely with the real homepage.
 */
export default function Page() {
  return (
    <>
      <Header currentPath="/" />

      <Section surface="page">
        <Logo height={30} />
        <h1 className="t-h1 mt-10 text-ink">Phase 1–3 verification</h1>
        <p className="t-lead mt-4 max-w-[60ch] text-muted">
          Tokens, type scale, breakpoints, dark mode, and the shared shell
          (nav, mobile menu, footer). Replaced in Phase 4.
        </p>
      </Section>

      <Section surface="sunken">
        <Eyebrow>Surfaces</Eyebrow>
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
      </Section>

      <Section surface="page">
        <Eyebrow>Buttons</Eyebrow>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="text">Text link</Button>
          <WhatsAppButton variant="primary" size="md" />
        </div>
      </Section>
    </>
  );
}
