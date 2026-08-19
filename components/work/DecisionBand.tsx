import { BandSection } from "@/components/shared/BandSection";

/**
 * The one component exposed into MDX scope (via compileCaseStudyBody's
 * `components` prop) for case-study bodies. Breaks the full-bleed dark band
 * out of the 760px reading column while staying inline in the .mdx file —
 * see susila.mdx for the authoring shape:
 *
 *   <DecisionBand eyebrow="A decision worth explaining" statement="...">
 *   paragraph...
 *   </DecisionBand>
 *
 * `w-screen relative left-1/2 -translate-x-1/2` breaks out of any ancestor
 * max-width without the scrollbar-width bug that `calc(-50vw + 50%)` has;
 * the case-study page wraps the article in `overflow-x-hidden` as a second
 * line of defence.
 */
export function DecisionBand({
  eyebrow,
  statement,
  children,
}: {
  eyebrow: string | null;
  statement: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="relative left-1/2 my-12 w-screen -translate-x-1/2 desk:my-20">
      <BandSection containerClassName="max-w-read">
        {eyebrow && (
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-on-band">
            {eyebrow}
          </div>
        )}
        {statement && (
          <p className="mt-4.5 text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-on-band desk:mt-5.5 desk:text-[40px]">
            {statement}
          </p>
        )}
        <div className="[&>p]:mt-4.5 [&>p]:text-base [&>p]:leading-[1.72] [&>p]:text-on-band-muted desk:[&>p]:mt-5.5 desk:[&>p]:text-lg">
          {children}
        </div>
      </BandSection>
    </div>
  );
}
