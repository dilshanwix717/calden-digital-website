import { getSite } from "@/lib/content";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { HeroVideo } from "@/components/home/HeroVideo";

/**
 * Server Component. The only client boundary anywhere in the hero is
 * HeroVideo, and even that is only mounted when hero.video.enabled is true
 * — while it's false (the shipping state) this file imports nothing that
 * runs in the browser at all.
 *
 * LCP note (BUILD-PLAN §1.8): with video disabled there is no hero image.
 * The <h1> is the LCP element, which is faster than any image would be.
 * Only when video is enabled does a poster appear and become the new LCP
 * element — both states are built here; only the content flag changes.
 */
export function Hero() {
  const { hero } = getSite();
  const videoEnabled = hero.video.enabled;

  return (
    <section className="relative flex min-h-0 desk:min-h-[min(84vh,720px)]">
      {/* The hexagons read as texture on the light page but as scratches over
          video, and they compete with the clip's own motion. Over video the
          clip IS the texture, so they come out entirely. */}
      {!videoEnabled && <HexPattern />}

      {videoEnabled && (
        <>
          <HeroVideo video={hero.video} />
          {/* --surface-band, not bg-page: the scrim has to darken toward the
              same colour the on-band text tokens were contrast-checked
              against. A light scrim over a graded clip lands in the muddy
              middle where neither ink nor on-band text passes. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] bg-band"
            style={{ opacity: hero.video.scrimOpacity }}
          />
        </>
      )}

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-14 text-center desk:px-16 desk:py-20">
        <div className="max-w-full desk:max-w-[760px]">
          <h1
            className={cn(
              "max-w-full text-[30px] font-semibold leading-[1.12] tracking-[-0.022em] desk:max-w-[17ch] desk:text-[58px] desk:leading-[1.05]",
              videoEnabled ? "text-on-band" : "text-ink",
            )}
          >
            {hero.headline}
          </h1>
          {/* Over video this is --text-on-band, NOT --text-on-band-muted.
              The muted token tops out at 3.68:1 over the graded clip at every
              scrim opacity that still shows water — it cannot be made to
              pass, so the subhead goes full-strength rather than the scrim
              going opaque. */}
          <p
            className={cn(
              "mx-auto mt-4 max-w-full text-base leading-[1.6] desk:mt-[22px] desk:max-w-[58ch] desk:text-xl",
              videoEnabled ? "text-on-band" : "text-muted",
            )}
          >
            {hero.subhead}
          </p>
          <div className="mt-[22px] flex w-full flex-col items-stretch gap-2.5 desk:mt-8 desk:w-auto desk:flex-row desk:items-center desk:justify-center desk:gap-3">
            <Button variant="primary" size="lg" href={hero.primaryCta.href} className="w-full box-border desk:w-auto">
              {hero.primaryCta.label}
              <span aria-hidden="true">→</span>
            </Button>
            <WhatsAppButton variant={videoEnabled ? "secondaryOnBand" : "secondary"} size="lg" fullWidth={false} className="w-full box-border desk:w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Static inline SVG replacing the prototype's canvas rAF loop (BUILD-PLAN
 * §1.7). Three concentric hexagons echoing the logo mark, teal strokes at
 * low opacity, each with its own slow rotation + 3% breathing scale via CSS
 * @keyframes. Zero JavaScript, GPU-composited (transform/opacity only),
 * respects prefers-reduced-motion via a media query rather than a JS check.
 */
function HexPattern() {
  const hex = (r: number) => {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / 3;
      const x = 50 + r * Math.cos(a);
      const y = 46 + (r * Math.sin(a) * 100) / 146; // squash to viewBox aspect
      return `${x},${y}`;
    }).join(" ");
    return pts;
  };

  return (
    <svg
      viewBox="0 0 100 92"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <g style={{ transformOrigin: "50% 46%" }} className="hex-outer">
        <polygon points={hex(46)} fill="none" stroke="var(--logo-stroke)" strokeWidth="0.5" opacity="0.1" />
      </g>
      <g style={{ transformOrigin: "50% 46%" }} className="hex-mid">
        <polygon points={hex(33.1)} fill="none" stroke="var(--logo-stroke)" strokeWidth="0.5" opacity="0.11" />
      </g>
      <g style={{ transformOrigin: "50% 46%" }} className="hex-inner">
        <polygon points={hex(21.2)} fill="none" stroke="var(--brand-teal)" strokeWidth="0.5" opacity="0.16" />
      </g>
    </svg>
  );
}
