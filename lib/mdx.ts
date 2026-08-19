import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { CaseStudyFrontmatterSchema, type CaseStudyFrontmatter } from "@/lib/schemas";

/**
 * Reads content/case-studies/*.mdx with fs, unlike lib/content.ts's static
 * JSON imports — the filename here is dynamic (a route param), so it cannot
 * be resolved at bundle time the way a fixed JSON import can. This runs only
 * in a Server Component during static generation (generateStaticParams /
 * generateMetadata / the page body), never at request time — the site has
 * no per-request SSR.
 *
 * Deliberately NOT @next/mdx: that package routes .mdx files as pages, which
 * would put content inside app/ instead of /content.
 *
 * Frontmatter parsing (this file, via gray-matter) is separate from MDX body
 * compilation (compileMdxBody below, via next-mdx-remote/rsc). That split is
 * required, not stylistic: next-mdx-remote pulls in @mdx-js/mdx ->
 * estree-util-build-jsx -> estree-walker@3, which ships an ESM-only
 * `exports` map with no "require" condition. tsx's CJS path-alias resolver
 * (used by scripts/validate-content.ts) throws ERR_PACKAGE_PATH_NOT_EXPORTED
 * the moment that chain is imported, unconditionally — confirmed in Phase 2
 * with a probe script containing nothing but `import { compileMDX } from
 * "next-mdx-remote/rsc"`. Next's own bundler (Turbopack) resolves it fine, so
 * this is a tsx-only problem. The validate script therefore checks
 * frontmatter with gray-matter only; full MDX compilation is exercised by
 * `next build` itself, which fails loudly on a real syntax error the same
 * way any other page-compile error does.
 */

const CASE_STUDIES_DIR = path.join(process.cwd(), "content", "case-studies");

export type CaseStudy = {
  frontmatter: CaseStudyFrontmatter;
  body: string;
};

function readSlugs(): string[] {
  return readdirSync(CASE_STUDIES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function parseFrontmatter(raw: unknown, file: string): CaseStudyFrontmatter {
  const result = CaseStudyFrontmatterSchema.safeParse(raw);
  if (result.success) return result.data;
  const lines = result.error.issues.map(
    (issue) => `  • ${issue.path.join(".") || "(root)"}: ${issue.message}`,
  );
  throw new Error(`content/case-studies/${file}.mdx frontmatter is invalid:\n${lines.join("\n")}`);
}

/** Frontmatter + raw body, validated, no MDX compilation. Safe to call from
 * scripts/validate-content.ts (runs under tsx) as well as from Server
 * Components. */
export function readCaseStudy(slug: string): CaseStudy | null {
  const filePath = path.join(CASE_STUDIES_DIR, `${slug}.mdx`);
  let raw: string;
  try {
    raw = readFileSync(filePath, "utf8");
  } catch {
    return null;
  }

  const { data, content: body } = matter(raw);
  const frontmatter = parseFrontmatter(data, slug);

  if (frontmatter.slug !== slug) {
    throw new Error(
      `content/case-studies/${slug}.mdx: frontmatter "slug: ${frontmatter.slug}" does not match the filename`,
    );
  }

  return { frontmatter, body };
}

/**
 * Compiles the MDX body to a React element. Only import this from a Server
 * Component (Phase 5's case-study page) — never from scripts/validate-
 * content.ts. See the file-level comment for why.
 */
export async function compileCaseStudyBody(
  body: string,
  components?: Record<string, React.ComponentType>,
): Promise<React.ReactElement> {
  const { compileMDX } = await import("next-mdx-remote/rsc");
  const { content } = await compileMDX({
    source: body,
    options: { parseFrontmatter: false },
    components,
  });
  return content;
}

/** Excludes draft: true — see BUILD-PLAN §1.11. Used by generateStaticParams,
 * the work index and sitemap.ts, so a draft never gets a live URL. */
export function getAllCaseStudySlugs(): string[] {
  return readSlugs()
    .map((slug) => readCaseStudy(slug))
    .filter((s): s is CaseStudy => s !== null && !s.frontmatter.draft)
    .map((s) => s.frontmatter.slug);
}

/** Includes drafts — for the work index, which needs to know a case study is
 * coming rather than treat it as absent. */
export function getAllCaseStudyFrontmatter(): CaseStudyFrontmatter[] {
  return readSlugs()
    .map((slug) => readCaseStudy(slug))
    .filter((s): s is CaseStudy => s !== null)
    .map((s) => s.frontmatter);
}
