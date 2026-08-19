import { Fragment, type ComponentProps } from "react";

/**
 * Overrides for the MDX body inside a case study. Passed as the
 * `components` prop to compileCaseStudyBody (lib/mdx.ts). Body starts at h2
 * — the page's own h1 is CaseStudyHeader's title, and MDX must never render
 * a second one, so h1 is neutered to a Fragment rather than left to render.
 *
 * Typed against plain HTML element prop shapes rather than importing
 * `mdx/types` — that package isn't a direct dependency, and next-mdx-remote
 * types its `components` prop against @mdx-js/react's MDXProvider, which is
 * only present transitively. Standard element props are exactly what MDX
 * passes through, so this is both simpler and doesn't rely on an undeclared
 * package.
 */
export function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-sunken px-1.5 py-0.5 font-mono text-[0.9em]">
      {children}
    </code>
  );
}

export const proseComponents = {
  h1: ({ children }: ComponentProps<"h1">) => <Fragment>{children}</Fragment>,
  h2: ({ children }: ComponentProps<"h2">) => (
    <h2 className="t-h2 mt-12 text-ink desk:mt-[72px]">{children}</h2>
  ),
  p: ({ children }: ComponentProps<"p">) => (
    <p className="mt-[18px] text-base leading-[1.72] text-ink desk:text-lg" style={{ textWrap: "pretty" }}>
      {children}
    </p>
  ),
  strong: ({ children }: ComponentProps<"strong">) => (
    <strong className="font-semibold">{children}</strong>
  ),
  a: ({ href, children }: ComponentProps<"a">) => (
    <a href={href} className="text-brand underline underline-offset-2 hover:text-[var(--brand-teal-hover)]">
      {children}
    </a>
  ),
  Mono,
};
