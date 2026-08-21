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
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { getSite, getNavigation, getServices, getProcess, getProjects } from "../lib/content";
import { getAllCaseStudyFrontmatter } from "../lib/mdx";

/**
 * Intrinsic size of a PNG or JPEG, read from the file header. Enough for a
 * dimension check without pulling in an image library.
 */
function imageSize(file: string): { width: number; height: number } | null {
  const buf = readFileSync(file);
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }
  return null;
}

/**
 * Every width/height declared in content must match the file on disk.
 *
 * These numbers are not decoration: next/image reserves layout from them, and
 * ScreensSection derives each figure's aspect-ratio from them. A stale pair
 * silently distorts or letterboxes the image, which is exactly the failure
 * this catches — it has happened twice, both times after a screenshot was
 * re-exported at a new size without the content file being updated.
 */
function checkImageDimensions(images: { src: string; width: number; height: number; where: string }[]) {
  const problems: string[] = [];
  for (const img of images) {
    if (!img.src.startsWith("/")) continue;
    const file = path.join(process.cwd(), "public", img.src);
    if (!existsSync(file)) {
      problems.push(`  • ${img.where}: ${img.src} does not exist in public/`);
      continue;
    }
    const real = imageSize(file);
    if (!real) continue;
    if (real.width !== img.width || real.height !== img.height) {
      problems.push(
        `  • ${img.where}: ${img.src} is ${real.width}x${real.height} ` +
          `but content declares ${img.width}x${img.height}`,
      );
    }
  }
  if (problems.length > 0) {
    throw new Error(`Image dimensions do not match the files on disk:\n${problems.join("\n")}`);
  }
}

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

  checkImageDimensions([
    ...projects.map((p) => ({ ...p.cover, where: `projects.json (${p.slug}) cover` })),
    ...caseStudies.flatMap((c) =>
      c.screens.map((s, i) => ({ ...s.image, where: `${c.slug}.mdx screens[${i}]` })),
    ),
  ]);

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
