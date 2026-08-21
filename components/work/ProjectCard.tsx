import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/schemas";

/**
 * Homepage "Selected work" card. Whole card is one Link; hover lifts the
 * card, deepens the border to brand teal, and turns the title teal — all
 * via the group-hover pattern rather than separate handlers per element.
 * No box-shadow: the brand explicitly forbids shadows (see globals.css's
 * focus-ring comment), so "lift" here is translateY plus the border colour
 * change carrying the weight a shadow normally would. Fixed 4:3 media
 * aspect ratio means the image never causes layout shift (CLS 0) regardless
 * of whether it has loaded. reveal on the card itself, not just the parent
 * Section, so cards in a vertical stack (work index rows use this too via
 * ProjectRow, but the homepage grid is horizontal) still get a clean fade.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group reveal flex flex-col overflow-hidden rounded-md border border-line bg-surface transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-brand"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-line bg-sunken">
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          sizes="(max-width: 820px) 100vw, (max-width: 1200px) 33vw, 384px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
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
