import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BrowserFrame } from "@/components/work/BrowserFrame";
import { PhoneFrame } from "@/components/work/PhoneFrame";
import type { CaseStudyFrontmatter } from "@/lib/schemas";

/**
 * Renders nothing when there are no screens (the two draft case studies).
 * Frame chosen per-screen from frontmatter's `frame` field.
 */
export function ScreensSection({ screens }: { screens: CaseStudyFrontmatter["screens"] }) {
  if (screens.length === 0) return null;

  return (
    <Section surface="page">
      <Eyebrow>Screens</Eyebrow>
      <div className="mt-7 flex flex-col items-center justify-center gap-10 desk:mt-11 desk:flex-row desk:items-start desk:gap-14">
        {screens.map((screen) => (
          <figure key={screen.image.src} className="w-full desk:w-auto">
            {screen.frame === "browser" ? (
              <BrowserFrame url={screen.url}>
                <div className="relative aspect-[16/10.5] w-full dark:border dark:border-line desk:w-[640px]">
                  <Image
                    src={screen.image.src}
                    alt={screen.image.alt}
                    fill
                    sizes="(max-width: 820px) 100vw, 640px"
                    className="object-cover"
                  />
                </div>
              </BrowserFrame>
            ) : (
              <PhoneFrame>
                <div className="relative aspect-[402/780] w-[240px] dark:border dark:border-line">
                  <Image
                    src={screen.image.src}
                    alt={screen.image.alt}
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                </div>
              </PhoneFrame>
            )}
            <figcaption className="mt-3.5 text-[13px] text-subtle">{screen.caption}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
