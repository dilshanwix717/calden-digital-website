import type { z } from "zod";
import siteRaw from "@/content/site.json";
import navigationRaw from "@/content/navigation.json";
import servicesRaw from "@/content/services.json";
import processRaw from "@/content/process.json";
import projectsRaw from "@/content/projects.json";
import {
  SiteSchema,
  NavigationSchema,
  ServicesSchema,
  ProcessSchema,
  ProjectsSchema,
  type Site,
  type Navigation,
  type Service,
  type Process,
  type Project,
} from "@/lib/schemas";

/**
 * The only module that imports from /content. Every component reaches site
 * copy through the functions below, never through a direct JSON import.
 *
 * JSON is imported (not read with fs) so the bundler includes it statically
 * and TypeScript sees its shape. Each file is parsed once at module scope,
 * so a malformed field throws at import time — which during `next build`
 * means the build fails with the file and field named. That is deliberate:
 * see parseOrThrow below and scripts/validate-content.ts, which imports every
 * accessor so an unreferenced content file is still checked.
 */

function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  const lines = result.error.issues.map(
    (issue) => `  • ${issue.path.join(".") || "(root)"}: ${issue.message}`,
  );
  throw new Error(`content/${file} is invalid:\n${lines.join("\n")}`);
}

const site = parseOrThrow(SiteSchema, siteRaw, "site.json");
const navigation = parseOrThrow(NavigationSchema, navigationRaw, "navigation.json");
const services = parseOrThrow(ServicesSchema, servicesRaw, "services.json");
const process_ = parseOrThrow(ProcessSchema, processRaw, "process.json");
const projects = parseOrThrow(ProjectsSchema, projectsRaw, "projects.json");

const projectsByOrder = [...projects].sort((a, b) => a.displayOrder - b.displayOrder);

export function getSite(): Site {
  return site;
}

export function getNavigation(): Navigation {
  return navigation;
}

export function getServices(): Service[] {
  return services;
}

export function getProcess(): Process {
  return process_;
}

/** Sorted by displayOrder — the single source of truth for project ordering. */
export function getProjects(): Project[] {
  return projectsByOrder;
}

export function getFeaturedProjects(): Project[] {
  return projectsByOrder.filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projectsByOrder.find((p) => p.slug === slug);
}

/**
 * Wraps around the displayOrder-sorted list. Reordering projects.json is a
 * one-field edit — prev/next are never stored in frontmatter (BUILD-PLAN §2,
 * Phase 2 "common pitfalls").
 */
export function getAdjacentProjects(slug: string): { prev: Project; next: Project } {
  const index = projectsByOrder.findIndex((p) => p.slug === slug);
  if (index === -1) {
    throw new Error(`getAdjacentProjects: no project with slug "${slug}"`);
  }
  const prev = projectsByOrder[(index - 1 + projectsByOrder.length) % projectsByOrder.length]!;
  const next = projectsByOrder[(index + 1) % projectsByOrder.length]!;
  return { prev, next };
}
