import Image from "next/image";
import { getSite } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { Section } from "@/components/ui/Section";
import { BandSection } from "@/components/shared/BandSection";

/**
 * The only page that speaks in "I" instead of "we" — Calden's whole point
 * is that it's one person, so About deliberately breaks the brand's usual
 * voice rule. See BUILD-PLAN §5.9. Do not normalise it to "we".
 */
export default function AboutPage() {
  const { pageHeaders, aboutPage } = getSite();

  return (
    <>
      <Header currentPath="/about" />
      <PageHeader {...pageHeaders.about} />

      <Section surface="page" className="pb-12 pt-2 sm:pb-20 sm:pt-4">
        <div className="grid grid-cols-1 items-center gap-7 desk:grid-cols-[5fr_6fr] desk:gap-16">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md border border-line bg-sunken">
            <Image
              src={aboutPage.portrait.src}
              alt={aboutPage.portrait.alt}
              fill
              sizes="(max-width: 820px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-ink desk:text-[34px]">
              {aboutPage.name}
            </h2>
            <p className="mt-1.5 text-[15px] font-medium tracking-[0.02em] text-brand">{aboutPage.role}</p>
            {aboutPage.bio.map((para) => (
              <p key={para} className="mt-[18px] text-base leading-[1.72] text-ink" style={{ textWrap: "pretty" }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <BandSection className="text-center">
        <p
          className="text-[28px] font-semibold leading-[1.12] tracking-[-0.02em] text-on-band desk:text-[44px]"
          style={{ textWrap: "balance" }}
        >
          {aboutPage.pullQuote.statement}
        </p>
        <p className="mx-auto mt-4.5 max-w-[48ch] text-base leading-[1.6] text-on-band-muted desk:mt-5.5 desk:text-lg">
          {aboutPage.pullQuote.support}
        </p>
      </BandSection>

      <Section surface="page">
        <h2 className="t-h2 text-ink">{aboutPage.howIWork.heading}</h2>
        <div className="mt-7 grid grid-cols-1 gap-7 desk:mt-11 desk:grid-cols-3 desk:gap-10">
          {aboutPage.howIWork.items.map((item) => (
            <div key={item.title} className="border-t-2 border-brand pt-5">
              <h3 className="text-[19px] font-semibold tracking-[-0.01em] text-ink desk:text-[21px]">
                {item.title}
              </h3>
              <p className="t-small mt-3 text-muted">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-11 border-t border-line pt-8 desk:mt-16 desk:pt-11">
          <h2 className="text-xl font-semibold tracking-[-0.015em] text-ink desk:text-2xl">
            {aboutPage.location.heading}
          </h2>
          <p className="mt-3.5 max-w-[52ch] text-lg leading-[1.6] text-muted desk:text-xl">
            {aboutPage.location.body}
          </p>
        </div>
      </Section>

      <ContactCTA />
    </>
  );
}
