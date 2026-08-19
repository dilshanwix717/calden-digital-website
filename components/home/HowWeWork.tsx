import { getProcess } from "@/lib/content";
import { BandSection } from "@/components/shared/BandSection";

/**
 * Horizontal 5-step stepper on desktop, vertical rail on mobile. The
 * connecting line sits behind the number rings via z-index + the rings
 * carrying their own bg-band background — otherwise the rule would cross
 * in front of them (a listed common pitfall).
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

      {/* Mobile: vertical rail */}
      <div className="relative mt-8 flex flex-col gap-7 desk:hidden">
        <div className="absolute bottom-6 left-[23px] top-6 w-0.5 bg-line" aria-hidden="true" />
        {steps.map((step) => (
          <div key={step.step} className="relative grid grid-cols-[auto_1fr] items-start gap-[18px]">
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
        <div className="absolute left-[10%] right-[10%] top-6 h-0.5 bg-line" aria-hidden="true" />
        <div className="relative grid grid-cols-5 gap-6">
          {steps.map((step) => (
            <div key={step.step} className="flex flex-col items-start">
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
