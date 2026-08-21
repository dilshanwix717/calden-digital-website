import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BrowserFrame } from "@/components/work/BrowserFrame";
import { PhoneFrame } from "@/components/work/PhoneFrame";
import type { CaseStudyFrontmatter } from "@/lib/schemas";

/**
 * Renders nothing when there are no screens (the two draft case studies).
 * Frame chosen per-screen from frontmatter's `frame` field.
 *
 * Layout is flex-wrap rather than a single row, and the count is not assumed.
 * A browser frame takes w-full so it always claims its own line; phone frames
 * are narrow and pair up on a shared line. The previous version put every
 * frame in one desk:flex-row at a fixed 640px, which fitted the original
 * browser + phone pair and silently overflowed the page as soon as a third
 * screen was added — 3 x 640 plus gaps is 2032px inside a 1200px container.
 *
 * Each image sets its own aspect-ratio from the width/height in frontmatter
 * instead of being forced into a fixed 16/10.5 box. Screenshots come in
 * whatever shape the app is; cropping them to a house ratio cut the sides off
 * exactly the UI the screenshot exists to show.
 */
type Screen = CaseStudyFrontmatter["screens"][number];

/**
 * .reveal-image (the clip-path wipe) lives on the <figure> itself, NOT on
 * the inner image div, and .reveal (fade+lift) is combined on the same
 * element rather than split across figure/inner-div as the first version
 * had it. Found by measurement, not by inspection: animation-timeline:
 * view() with no explicit scroller resolves against the NEAREST ANCESTOR
 * SCROLL CONTAINER, and overflow-hidden — which both BrowserFrame and
 * PhoneFrame use to clip their chrome — legally counts as one, even though
 * it never visibly scrolls. Putting .reveal-image inside a BrowserFrame
 * meant its timeline was measured against that frame's own tiny box
 * instead of the page, so the animation finished before it had ever
 * meaningfully started — verified with getAnimations(), which reported
 * playState "finished" and progress null at every real scroll position.
 * The <figure> itself has no such ancestor between it and the page
 * scroller, so both animations resolve correctly there.
 */

const isPortrait = (s: Screen) => s.image.height > s.image.width;

/**
 * A browser frame always claims its own line. Unframed images size to their
 * own orientation: a portrait device mockup at 420px reads as a phone shot,
 * while a landscape one gets the full column like any other wide screenshot.
 */
function figureWidth(s: Screen) {
  if (s.frame === "browser") return "w-full max-w-[900px]";
  if (s.frame === "phone") return "w-[240px] max-w-full";
  // 300px, not more: the content column is 1072px and the row gap is 56, so
  // three portrait device shots need to be under 320 each to share one
  // desktop row. They still wrap cleanly to two and then one as it narrows.
  return isPortrait(s) ? "w-[300px] max-w-full" : "w-full max-w-[900px]";
}

export function ScreensSection({ screens }: { screens: CaseStudyFrontmatter["screens"] }) {
  if (screens.length === 0) return null;

  return (
    // reveal off on the Section: each figure reveals itself (.reveal) and
    // its screenshot wipes in (.reveal-image) independently — see below.
    <Section surface="page" reveal={false}>
      <Eyebrow>Screens</Eyebrow>
      <div className="mt-7 flex flex-wrap items-start justify-center gap-10 desk:mt-11 desk:gap-14">
        {screens.map((screen) => {
          const ratio = `${screen.image.width} / ${screen.image.height}`;
          return (
            <figure key={screen.image.src} className={`reveal reveal-image ${figureWidth(screen)}`}>
              {screen.frame === "browser" ? (
                <BrowserFrame url={screen.url}>
                  <div className="relative w-full" style={{ aspectRatio: ratio }}>
                    <Image
                      src={screen.image.src}
                      alt={screen.image.alt}
                      fill
                      sizes="(max-width: 820px) 100vw, 900px"
                      className="object-cover"
                    />
                  </div>
                </BrowserFrame>
              ) : screen.frame === "phone" ? (
                <PhoneFrame>
                  <div className="relative w-full" style={{ aspectRatio: ratio }}>
                    <Image
                      src={screen.image.src}
                      alt={screen.image.alt}
                      fill
                      sizes="240px"
                      className="object-cover"
                    />
                  </div>
                </PhoneFrame>
              ) : (
                <div className="relative w-full" style={{ aspectRatio: ratio }}>
                  <Image
                    src={screen.image.src}
                    alt={screen.image.alt}
                    fill
                    sizes={isPortrait(screen) ? "300px" : "(max-width: 820px) 100vw, 900px"}
                    className="object-contain"
                  />
                </div>
              )}
              <figcaption className="mt-3.5 text-[13px] text-subtle">{screen.caption}</figcaption>
            </figure>
          );
        })}
      </div>
    </Section>
  );
}
