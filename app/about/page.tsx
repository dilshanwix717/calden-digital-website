import type { Metadata } from "next";
import Image from "next/image";
import { getSite } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BandSection } from "@/components/shared/BandSection";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const { pageHeaders } = getSite();
  return buildMetadata({
    title: pageHeaders.about.title,
    description: pageHeaders.about.lead ?? "",
    path: "/about",
  });
}

/**
 * Speaks in "we", like the rest of the site. This page previously used "I"
 * and stated the studio was one person; that framing was dropped
 * deliberately — it set the wrong expectation for the size of engagement
 * Calden takes on. The continuity claim is unchanged and still true: the
 * people who scope a project are the people who deliver it.
 */
export default function AboutPage() {
  const { pageHeaders, aboutPage, company } = getSite();
  const { vision, howWeWork, team, pullQuote, location, founder } = aboutPage;

  return (
    <>
      <Header currentPath="/about" />
      <PageHeader {...pageHeaders.about} />

      <Section surface="page" className="pb-12 pt-2 sm:pb-20 sm:pt-4">
        <Eyebrow>{vision.heading}</Eyebrow>
        <p
          className="mt-4 max-w-[20ch] text-[28px] font-semibold leading-[1.14] tracking-[-0.02em] text-ink desk:max-w-[24ch] desk:text-[42px]"
          style={{ textWrap: "balance" }}
        >
          {vision.statement}
        </p>
        <div className="mt-6 grid max-w-[76ch] grid-cols-1 gap-5 desk:mt-8 desk:grid-cols-2 desk:gap-10">
          {vision.body.map((para) => (
            <p key={para} className="text-base leading-[1.72] text-muted" style={{ textWrap: "pretty" }}>
              {para}
            </p>
          ))}
        </div>
        {/* The tagline closes this section rather than opening the page: the
            copy above ends on "Not a launch date. A foundation." — the
            strapline lands as the conclusion of that argument instead of an
            unearned claim before it. Rule + brand colour so it reads as a
            signature line, not another paragraph. */}
        <p className="mt-8 border-t border-line pt-6 text-[19px] font-semibold leading-[1.4] tracking-[-0.015em] text-brand desk:mt-11 desk:pt-7 desk:text-[22px]">
          {company.tagline}
        </p>
      </Section>

      {/* reveal off on the Section: each item below reveals itself individually. */}
      <Section surface="sunken" reveal={false}>
        <h2 className="t-h2 text-ink">{howWeWork.heading}</h2>
        <p className="mt-3.5 max-w-[60ch] text-lg leading-[1.6] text-muted">{howWeWork.lead}</p>
        <div className="mt-7 grid grid-cols-1 gap-7 desk:mt-11 desk:grid-cols-3 desk:gap-x-10 desk:gap-y-11">
          {howWeWork.items.map((item) => (
            <div key={item.title} className="reveal border-t-2 border-brand pt-5">
              <h3 className="text-[19px] font-semibold tracking-[-0.01em] text-ink desk:text-[21px]">
                {item.title}
              </h3>
              <p className="t-small mt-3 text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section surface="page">
        <h2 className="t-h2 max-w-[22ch] text-ink">{team.heading}</h2>
        <p className="mt-4 max-w-[62ch] text-base leading-[1.72] text-muted" style={{ textWrap: "pretty" }}>
          {team.body}
        </p>
        <ul className="mt-7 flex flex-wrap gap-2.5">
          {team.disciplines.map((d) => (
            <li
              key={d}
              className="rounded-sm border border-line bg-surface px-3.5 py-2 text-[14px] font-medium text-ink"
            >
              {d}
            </li>
          ))}
        </ul>

        <div className="mt-11 border-t border-line pt-8 desk:mt-16 desk:pt-11">
          <h2 className="text-xl font-semibold tracking-[-0.015em] text-ink desk:text-2xl">
            {location.heading}
          </h2>
          <p className="mt-3.5 max-w-[52ch] text-lg leading-[1.6] text-muted desk:text-xl">
            {location.body}
          </p>
        </div>
      </Section>

      <BandSection className="text-center">
        <p
          className="text-[28px] font-semibold leading-[1.12] tracking-[-0.02em] text-on-band desk:text-[44px]"
          style={{ textWrap: "balance" }}
        >
          {pullQuote.statement}
        </p>
        <p className="mx-auto mt-4.5 max-w-[48ch] text-base leading-[1.6] text-on-band-muted desk:mt-5.5 desk:text-lg">
          {pullQuote.support}
        </p>
      </BandSection>

      {/* Founder, last and deliberately small: a signature on the studio's
          work rather than the subject of the page. The portrait is a fixed
          88/104px square, not the half-width 4:5 portrait it used to be. */}
      <Section surface="page">
        <div className="flex max-w-[64ch] flex-col gap-5 border-t border-line pt-7 sm:flex-row sm:items-start sm:gap-6">
          <Image
            src={founder.portrait.src}
            alt={founder.portrait.alt}
            width={founder.portrait.width}
            height={founder.portrait.height}
            sizes="104px"
            className="h-22 w-22 shrink-0 rounded-md border border-line bg-sunken object-cover desk:h-26 desk:w-26"
          />
          <div>
            <Eyebrow>{founder.eyebrow}</Eyebrow>
            <h2 className="mt-2.5 text-[19px] font-semibold tracking-[-0.015em] text-ink desk:text-[21px]">
              {founder.name}
            </h2>
            <p className="mt-1 text-[14px] font-medium tracking-[0.02em] text-brand">{founder.role}</p>
            {founder.bio.map((para) => (
              <p key={para} className="t-small mt-3.5 text-muted" style={{ textWrap: "pretty" }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <ContactCTA />
    </>
  );
}
