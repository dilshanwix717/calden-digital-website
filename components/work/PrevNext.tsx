import Link from "next/link";
import { Section } from "@/components/ui/Section";
import type { Project } from "@/lib/schemas";

export function PrevNext({ prev, next }: { prev: Project; next: Project }) {
  return (
    <Section surface="page" className="py-10 desk:py-14">
      <div className="grid grid-cols-1 gap-3 desk:grid-cols-2 desk:gap-6">
        <Link
          href={`/work/${prev.slug}`}
          className="block rounded-md border border-line bg-surface p-5 no-underline transition-colors duration-200 hover:border-line-control desk:p-7"
        >
          <span className="text-[13px] font-semibold uppercase tracking-[0.04em] text-brand">
            ← Previous
          </span>
          <h3 className="mt-2.5 text-xl font-semibold tracking-[-0.015em] text-ink desk:text-2xl">
            {prev.title}
          </h3>
          <p className="mt-2 text-[15px] leading-[1.5] text-muted">{prev.subtitle}</p>
        </Link>
        <Link
          href={`/work/${next.slug}`}
          className="block rounded-md border border-line bg-surface p-5 text-right no-underline transition-colors duration-200 hover:border-line-control desk:p-7"
        >
          <span className="text-[13px] font-semibold uppercase tracking-[0.04em] text-brand">
            Next →
          </span>
          <h3 className="mt-2.5 text-xl font-semibold tracking-[-0.015em] text-ink desk:text-2xl">
            {next.title}
          </h3>
          <p className="mt-2 text-[15px] leading-[1.5] text-muted">{next.subtitle}</p>
        </Link>
      </div>
    </Section>
  );
}
