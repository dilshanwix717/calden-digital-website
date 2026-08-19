import type { Metadata } from "next";
import { getSite, getNavigation } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Page not found",
    description: "The page you're looking for may have moved or no longer exists.",
    path: "/404",
    noindex: true,
  });
}

/**
 * Root-level app/not-found.tsx — the only place Next will catch a
 * top-level unmatched path. A route-grouped or nested not-found.tsx would
 * not. Next serves this with a real HTTP 404 automatically for any
 * genuinely unmatched route; the same component also renders when a page
 * calls notFound() explicitly (e.g. an unpublished case-study slug).
 */
export default function NotFound() {
  const { notFound } = getSite();
  const { primary } = getNavigation();

  return (
    <>
      <Header currentPath="" />
      <Section surface="page" className="text-center">
        <h1 className="text-[36px] font-semibold leading-[1.05] tracking-[-0.022em] text-ink desk:text-[58px]">
          {notFound.heading}
        </h1>
        <p className="mx-auto mt-[18px] max-w-[52ch] text-lg leading-[1.5] text-muted desk:mt-[22px] desk:text-xl">
          {notFound.body}
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 desk:mt-9 desk:flex-row">
          <Button variant="primary" size="lg" href="/" className="w-full box-border desk:w-auto">
            {notFound.homeLabel}
          </Button>
          <Button variant="secondary" size="lg" href={primary[0]?.href ?? "/work"} className="w-full box-border desk:w-auto">
            {notFound.workLabel}
          </Button>
        </div>
      </Section>
    </>
  );
}
