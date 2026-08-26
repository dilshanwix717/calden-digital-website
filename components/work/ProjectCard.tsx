import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/schemas";

/**
 * Homepage "Selected work" card. Whole card is one Link; hover lifts the
 * card, deepens the border to brand teal, and turns the title teal — all
 * via the group-hover pattern rather than separate handlers per element.
 * No box-shadow: the brand explicitly forbids shadows (see globals.css's
 * focus-ring comment), so "lift" here is translateY plus the border colour
 * change carrying the weight a shadow normally would.
 *
 * transition-[translate,border-color], NOT transition-[transform,...].
 * Tailwind v4's hover:-translate-y-* utilities set the CSS `translate`
 * property, a separate property from `transform` since CSS Transforms
 * Level 2 — listing `transform` in the transition-property arbitrary value
 * transitions nothing, because nothing ever sets `transform` here. That
 * was the original bug: border-color eased in over 300ms while the lift
 * itself snapped to its full -4px in a single frame, which is exactly what
 * reads as a "jump" rather than a hover. Confirmed by sampling
 * getComputedStyle(el).translate every 20ms through a hover: it was
 * already "0px -4px" at the very first sample, no intermediate values at
 * all. 500ms/ease-out on the corrected property is what the settle you see
 * now actually is. (Tailwind's *named* transition-transform utility, used
 * for the cover image's zoom below, does not have this problem — it
 * expands to `transform, translate, scale, rotate` automatically. Only the
 * arbitrary-value form needs the property spelled out by hand.)
 *
 * Fixed 4:3 media aspect ratio means the image never causes layout shift
 * (CLS 0) regardless of whether it has loaded. reveal on the card itself,
 * not just the parent Section, so cards in a vertical stack (work index
 * rows use this too via ProjectRow, but the homepage grid is horizontal)
 * still get a clean fade.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group reveal flex flex-col overflow-hidden rounded-md border border-line bg-surface transition-[translate,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-brand"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-line bg-sunken">
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          sizes="(max-width: 820px) 100vw, (max-width: 1200px) 33vw, 384px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-3 p-6">
        <h3 className="text-[22px] font-semibold tracking-[-0.015em] text-ink transition-colors duration-200 group-hover:text-brand">
          {project.cardTitle}
        </h3>
        <p className="t-small text-muted">{project.cardSummary}</p>
        <span className="mt-1 text-xs font-medium uppercase tracking-[0.04em] text-subtle">
          {project.cardMeta}
        </span>
      </div>
    </Link>
  );
}
