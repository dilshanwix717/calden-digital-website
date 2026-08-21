import Link from "next/link";
import { Section } from "@/components/ui/Section";

export function CaseStudyHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  // reveal off — same reasoning as PageHeader: always in the initial viewport.
  return (
    <Section as="header" surface="page" reveal={false} className="pb-2 pt-10 sm:pb-4 sm:pt-16" containerClassName="max-w-read">
      <Link href="/work" className="text-sm font-medium text-muted no-underline hover:text-brand">
        ← Work
      </Link>
      <h1 className="mt-5 text-[34px] font-semibold leading-[1.06] tracking-[-0.022em] text-ink desk:mt-6 desk:text-[54px]">
        {title}
      </h1>
      <p className="mt-4 max-w-[32ch] text-lg font-normal leading-[1.4] text-muted desk:text-[22px]">
        {subtitle}
      </p>
    </Section>
  );
}
