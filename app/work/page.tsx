import { getSite, getProjects } from "@/lib/content";
import { getAllCaseStudyFrontmatter } from "@/lib/mdx";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { Section } from "@/components/ui/Section";
import { ProjectRow } from "@/components/work/ProjectRow";

export default function WorkPage() {
  const { pageHeaders } = getSite();
  const projects = getProjects();
  const drafts = new Set(getAllCaseStudyFrontmatter().filter((c) => c.draft).map((c) => c.slug));

  return (
    <>
      <Header currentPath="/work" />
      <PageHeader {...pageHeaders.work} />
      <Section surface="page" className="pb-14 pt-2 sm:pb-24 sm:pt-4">
        <div className="flex flex-col gap-14 desk:gap-[104px]">
          {projects.map((project, i) => (
            <ProjectRow
              key={project.slug}
              project={project}
              alternate={i % 2 === 1}
              isDraft={drafts.has(project.slug)}
            />
          ))}
        </div>
      </Section>
      <ContactCTA />
    </>
  );
}
