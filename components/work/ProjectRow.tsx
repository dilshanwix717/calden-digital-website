import Image from "next/image";
import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import type { Project } from "@/lib/schemas";

/**
 * Work-index row. `alternate` decides image-left vs image-right at desk and
 * above; below desk every row stacks image-first regardless (flex-col
 * naturally puts the first child on top). Draft case studies render
 * "Case study coming soon" as plain text — never `<a href="#">`, which is a
 * link to nowhere and fails the accessibility pass.
 */
export function ProjectRow({
  project,
  alternate,
  isDraft,
}: {
  project: Project;
  alternate: boolean;
  isDraft: boolean;
}) {
  const href = `/work/${project.slug}`;

  const media = (
    <div className="flex-1">
      {isDraft ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-line bg-sunken">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes="(max-width: 820px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      ) : (
        <Link href={href} className="block">
          <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-line bg-sunken">
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              sizes="(max-width: 820px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Link>
      )}
    </div>
  );

  const body = (
    <div className="flex flex-1 flex-col justify-center">
      <div className="flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <h2 className="mt-4 text-[28px] font-semibold tracking-[-0.02em] text-ink desk:text-[34px]">
        {project.title}
      </h2>
      <p className="mt-2 text-lg leading-[1.4] font-normal text-muted desk:text-[19px]">
        {project.subtitle}
      </p>
      <p className="mt-[18px] max-w-[58ch] text-base leading-[1.62] text-ink" style={{ textWrap: "pretty" }}>
        {project.summary}
      </p>
      <div className="mt-[22px] grid max-w-[440px] grid-cols-2 gap-4">
        <Fact label="Role" value={project.role} />
        <Fact label="Timeline" value={project.timeline} />
      </div>
      <div className="mt-3.5">
        <Fact label="Stack" value={project.stack.join(" · ")} />
      </div>
      <div className="mt-6">
        {isDraft ? (
          <span className="text-[15px] font-medium text-subtle">Case study coming soon</span>
        ) : (
          <Link href={href} className="text-[15px] font-semibold text-brand no-underline">
            Read case study
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col gap-6 desk:gap-16 ${alternate ? "desk:flex-row-reverse" : "desk:flex-row"}`}>
      {media}
      {body}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-subtle">{label}</div>
      <div className="mt-1 text-sm leading-[1.45] text-ink">{value}</div>
    </div>
  );
}
