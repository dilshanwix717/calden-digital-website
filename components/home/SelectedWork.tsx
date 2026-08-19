import Link from "next/link";
import { getSite, getFeaturedProjects } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/work/ProjectCard";

export function SelectedWork() {
  const { homepage } = getSite();
  const projects = getFeaturedProjects();

  return (
    <Section surface="page">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="t-h2 text-ink">{homepage.selectedWork.heading}</h2>
        <Link
          href={homepage.selectedWork.seeAllHref}
          className="hidden text-[15px] font-semibold text-brand no-underline desk:inline"
        >
          {homepage.selectedWork.seeAllLabel}
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 desk:mt-11 desk:grid-cols-3 desk:gap-6">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>

      <Link
        href={homepage.selectedWork.seeAllHref}
        className="mt-6 inline-block text-[15px] font-semibold text-brand no-underline desk:hidden"
      >
        {homepage.selectedWork.seeAllLabel}
        <span aria-hidden="true">→</span>
      </Link>
    </Section>
  );
}
