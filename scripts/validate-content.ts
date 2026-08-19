/**
 * Build-time content gate. Importing JSON via lib/content.ts only validates
 * files some page actually imports; this script imports every accessor
 * directly, so a newly added or currently-unreferenced content file is still
 * checked. Wired as "prebuild" — runs automatically before `next build` —
 * and as the standalone `pnpm validate` script.
 *
 * This checks JSON content and MDX frontmatter only, not MDX body compilation
 * — see the comment at the top of lib/mdx.ts for why the two are split.
 * A body syntax error still fails the real build, in Phase 5's case-study
 * page, the same way any other compile error does.
 */
import { getSite, getNavigation, getServices, getProcess, getProjects } from "../lib/content";
import { getAllCaseStudyFrontmatter } from "../lib/mdx";

function main() {
  // Importing lib/content triggers every module-scope parseOrThrow call.
  // Calling the accessors also exercises the derived logic (sorting, etc).
  getSite();
  getNavigation();
  const services = getServices();
  getProcess();
  const projects = getProjects();

  const caseStudies = getAllCaseStudyFrontmatter();

  // Cross-file check no single schema can express: every project needs a
  // corresponding MDX file, published or draft.
  const caseStudySlugs = new Set(caseStudies.map((c) => c.slug));
  const missing = projects.filter((p) => !caseStudySlugs.has(p.slug));
  if (missing.length > 0) {
    throw new Error(
      `projects.json references slugs with no content/case-studies/*.mdx file: ` +
        missing.map((p) => p.slug).join(", "),
    );
  }

  const jsonFileCount = 5; // site, navigation, services, process, projects
  console.log(
    `✓ ${jsonFileCount} JSON files, ${caseStudies.length} case studies ` +
      `(${caseStudies.filter((c) => !c.draft).length} published, ` +
      `${caseStudies.filter((c) => c.draft).length} draft), ` +
      `${services.length} services, ${projects.length} projects`,
  );
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
