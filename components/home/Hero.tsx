import { getSite } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

/**
 * Server Component, and entirely server-rendered — nothing in this file
 * ships JavaScript to the browser. The hexagon pattern below is inline SVG
 * animated by CSS, not script.
 *
 * LCP note (BUILD-PLAN §1.8): there is no hero image, so the <h1> is the
 * LCP element, which is faster than any image would be.
 *
 * The hero sits on --surface-sunken rather than --surface-page so it reads
 * as its own panel against the page-coloured sections below it. That is not
 * only decoration: the hexagon pattern is clipped by the section edge, and
 * without a change of surface that clip looks like the pattern has simply
 * been cut in half. With one, the edge reads as the panel's boundary and
 * the pattern reads as contained by it. Ink is 11.35:1 here, against
 * 12.35:1 on the page surface.
 */
export function Hero() {
  const { hero } = getSite();

  return (
    <section className="relative flex min-h-0 overflow-hidden border-b border-line bg-sunken desk:min-h-[min(84vh,720px)]">
      <HexPattern />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-14 text-center desk:px-16 desk:py-20">
        <div className="max-w-full desk:max-w-[760px]">
          <h1 className="max-w-full text-[30px] font-semibold leading-[1.12] tracking-[-0.022em] text-ink desk:max-w-[17ch] desk:text-[58px] desk:leading-[1.05]">
            {hero.headline}
          </h1>
          <p className="mx-auto mt-4 max-w-full text-base leading-[1.6] desk:mt-[22px] desk:max-w-[58ch] desk:text-xl text-muted">
            {hero.subhead}
          </p>
          <div className="mt-[22px] flex w-full flex-col items-stretch gap-2.5 desk:mt-8 desk:w-auto desk:flex-row desk:items-center desk:justify-center desk:gap-3">
            <Button variant="primary" size="lg" href={hero.primaryCta.href} className="w-full box-border desk:w-auto">
              {hero.primaryCta.label}
              <span aria-hidden="true" className="arrow">→</span>
            </Button>
            <WhatsAppButton variant="secondary" size="lg" fullWidth={false} className="w-full box-border desk:w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Static inline SVG replacing the prototype's canvas rAF loop (BUILD-PLAN
 * §1.7). Three nested rings echoing the logo mark, each with its own slow
 * rotation + 3% breathing scale via CSS @keyframes. Zero JavaScript,
 * GPU-composited (transform/opacity only), respects prefers-reduced-motion
 * via a media query rather than a JS check.
 *
 * Geometry is taken from public/logo/calden-mark.svg rather than
 * approximated. That mark is three nested REGULAR pointy-top hexagons at
 * R = 60 / 42 / 22.98 — ratios 1 : 0.700 : 0.383 — each drawn with its
 * right edge left open, which is what forms the "C". Reproducing the gap
 * here is also what makes the rotation legible: a closed hexagon has
 * 60-degree rotational symmetry, so spinning one looks almost static. The
 * open shape has none, so the motion actually reads.
 *
 * The previous version squashed y by 100/146 to "correct for the viewBox
 * aspect". That was wrong — preserveAspectRatio="xMidYMid slice" already
 * scales uniformly — and it stretched every hexagon to a width:height of
 * 1.264 against the 0.866 a regular hexagon requires, i.e. 46% too wide.
 * There is no squash now; the viewBox is square and the hexagons are
 * regular by construction.
 *
 * All rings are the teal logo stroke. The mark's inner ring is gold, but
 * gold reads as a second colour competing with the copy at this scale, and
 * keeping it out means this file stays off the gold allowlist in
 * scripts/check-a11y-static.mjs.
 */
const RING_STROKE = "var(--logo-stroke)";

/**
 * Five rings, spaced 11 apart. The seven-ring version at spacing 7 read as
 * a packed mass instead of a pattern — the eye needs clear page between the
 * lines for them to feel like structure.
 *
 * 56 is the largest useful radius, and the limit is geometric rather than
 * aesthetic. preserveAspectRatio slice scales the 100-unit box to COVER the
 * hero, so on a wide viewport the full width is visible but only a
 * horizontal band of the height is. A hexagon's own side edges sit at
 * 50 +/- r*cos(30deg), so once r passes 50/cos(30deg) = 57.7 those edges
 * are outside the box entirely and the ring contributes nothing but empty
 * space. An earlier pass had rings at 62 and 76 that were invisible for
 * exactly this reason.
 *
 * Directions alternate. Two adjacent rings turning opposite ways read as
 * movement; a stack all turning the same way reads as a single static
 * object, which is why the original 70-87s same-direction rotations were
 * invisible. Durations are spread and mutually non-dividing so the rings
 * never resynchronise into a pattern.
 *
 * There is deliberately no breathing/scale animation. Scaling a <g> scales
 * its stroke with it, so a 3% pulse made every outline's thickness pulse
 * too — five rings doing that on staggered cycles read as a flicker rather
 * than as breathing.
 */
const RINGS = [
  { r: 12, width: 1.0, opacity: 0.13, dur: 26, dir: "normal" },
  { r: 23, width: 1.1, opacity: 0.12, dur: 33, dir: "reverse" },
  { r: 34, width: 1.2, opacity: 0.11, dur: 41, dir: "normal" },
  { r: 45, width: 1.3, opacity: 0.1, dur: 52, dir: "reverse" },
  { r: 56, width: 1.4, opacity: 0.09, dur: 67, dir: "normal" },
];

/**
 * Vertices every 60 degrees from the upper-right, walking clockwise, and
 * never closing the path — five of six edges, the missing one being the
 * right vertical. Same winding order as the mark's own path data.
 */
function openHex(r: number) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = ((-30 - i * 60) * Math.PI) / 180;
    return `${(50 + r * Math.cos(a)).toFixed(3)},${(50 + r * Math.sin(a)).toFixed(3)}`;
  });
  return `M${pts.join(" L")}`;
}

/**
 * hidden below desk (820px) — removed on mobile on request. Rings at this
 * radius range were tuned for a wide hero; on a narrow viewport most of the
 * pattern falls outside the visible band anyway (see the geometry note
 * above on RINGS), so little was actually being shown there before this.
 * display:none also means zero animation cost on mobile, not just an
 * invisible one.
 */
function HexPattern() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden h-full w-full desk:block"
    >
      {RINGS.map((ring) => (
        <g
          key={ring.r}
          className="hex-ring"
          style={
            {
              transformOrigin: "50% 50%",
              "--hex-dur": `${ring.dur}s`,
              "--hex-dir": ring.dir,
            } as React.CSSProperties
          }
        >
          <path
            d={openHex(ring.r)}
            fill="none"
            stroke={RING_STROKE}
            strokeWidth={ring.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={ring.opacity}
          />
        </g>
      ))}
    </svg>
  );
}
