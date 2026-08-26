import { getProcess } from "@/lib/content";
import { BandSection } from "@/components/shared/BandSection";

/**
 * Horizontal 5-step stepper on desktop, vertical rail on mobile. The
 * connecting line sits behind the number rings via z-index + the rings
 * carrying their own bg-band background — otherwise the rule would cross
 * in front of them (a listed common pitfall).
 *
 * Both layouts draw the connector per step, not as one rule/line spanning
 * the whole row or stack — a single line has to guess where the first and
 * last rings are, and both original versions guessed wrong in the same
 * way: assuming symmetric spacing that only holds when every step's
 * content is the same size.
 *
 * Desktop: the previous single rule guessed left-[10%] right-[10%]. The
 * rings sit at the LEFT edge of their grid column (items-start), not
 * centred in it, so the line began past ring 1 and overshot ring 5.
 *
 * Mobile: the previous single line ran from top-6 to bottom-6 of the whole
 * flex container, which only reaches ring 5's centre if the container's
 * bottom edge sits exactly 24px past it — true only when every step's
 * title/description is the same height. A longer last step pushed the
 * real container bottom further down, so the line overshot ring 5 and ran
 * on behind its text.
 *
 * Both are now anchored to each ring instead, using the same technique in
 * each axis: start the segment at this ring's own edge, and extend it PAST
 * this row/column's own far edge by exactly one gap, rather than giving it
 * a fixed length. "Past its own edge by one gap" always lands exactly on
 * the next row/column's near edge, regardless of how tall or wide that
 * row/column's content is — which matters here because each step's title
 * and description are a different height, so "one gap's worth of pixels
 * below this ring" (a fixed height) is NOT the same distance as "the next
 * ring's top" once text height varies; a fixed h-7 undershot every
 * segment by however much taller that step's text was than a bare ring.
 * Desktop: left-12 (ring's own right edge, ring being h-12) to -right-6
 * (this column's right edge, projected out by gap-6). Mobile: top-12
 * (ring's own bottom edge) to -bottom-7 (this row's bottom edge —
 * wherever its text actually ends — projected out by gap-7). The last
 * step simply draws no segment in either layout.
 *
 * Ring border and numeral use --brand-on-band, NOT the design system's
 * --teal-on-dark (2.78:1, fails AA on the band — see §1.6b).
 */
export function HowWeWork() {
  const { heading, intro, steps } = getProcess();

  return (
    <BandSection>
      <h2 className="t-h2 text-on-band">{heading}</h2>
      <p className="mt-3.5 max-w-[52ch] text-lg leading-[1.6] text-on-band-muted desk:mt-4">{intro}</p>

      {/* Mobile: vertical rail. Each connector is drawn per step, not as one
          line spanning the whole stack — a single top-6..bottom-6 line only
          reaches the last ring's centre if the container's bottom edge sits
          exactly 24px past it, which is only true when every step's text is
          the same height. Steps with a longer title/description push the
          container bottom further down, so that line overshot ring 5 and
          ran on behind its text. Anchoring each segment to its own ring
          (top-12, its 48px height, for a gap-7 = 28px reach into the next
          row) is exact regardless of how tall any step's text is. */}
      <div className="relative mt-8 flex flex-col gap-7 desk:hidden">
        {steps.map((step, i) => (
          <div key={step.step} className="relative grid grid-cols-[auto_1fr] items-start gap-[18px]">
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute left-[23px] top-12 -bottom-7 w-0.5 bg-line"
              />
            )}
            <StepRing>{step.step}</StepRing>
            <div className="pt-1">
              <h3 className="text-[19px] font-semibold tracking-[-0.01em] text-on-band">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-on-band-muted">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: horizontal stepper */}
      <div className="relative mt-14 hidden desk:block">
        <div className="relative grid grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <div key={step.step} className="relative flex flex-col items-start">
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-12 -right-6 top-6 h-0.5 -translate-y-1/2 bg-line"
                />
              )}
              <StepRing>{step.step}</StepRing>
              <h3 className="mt-[22px] text-[19px] font-semibold tracking-[-0.01em] text-on-band">
                {step.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-[1.6] text-on-band-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </BandSection>
  );
}

function StepRing({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-[1] flex h-12 w-12 flex-none items-center justify-center rounded-full border-2 border-brand-on-band bg-band text-lg font-semibold text-on-band">
      {children}
    </div>
  );
}
