import { cn } from "@/lib/cn";
import { Container } from "./Container";

type Surface = "page" | "sunken" | "band" | "card";
type Width = "site" | "band" | "read";

const SURFACE_CLASS: Record<Surface, string> = {
  page: "bg-page text-ink",
  sunken: "bg-sunken text-ink",
  band: "bg-band text-on-band",
  card: "bg-surface text-ink",
};

const WIDTH_MAX: Record<Width, string> = {
  site: "max-w-site",
  band: "max-w-band",
  read: "max-w-read",
};

/**
 * Owns section-level vertical padding and surface background. Vertical
 * padding switches at `sm` (640px, matching the design's --section-y);
 * the Container inside switches its horizontal gutter at `desk` (820px).
 * These are two different breakpoints on purpose — see BUILD-PLAN §2.5.
 */
export function Section({
  as: Tag = "section",
  id,
  surface = "page",
  width = "site",
  borderTop = false,
  borderBottom = false,
  reveal = true,
  className,
  containerClassName,
  children,
}: {
  as?: "section" | "header" | "article" | "footer";
  id?: string;
  surface?: Surface;
  width?: Width;
  borderTop?: boolean;
  borderBottom?: boolean;
  /** Fades and lifts the section as it enters the viewport (see .reveal in
   * globals.css). Defaults on — nearly every Section is below-the-fold
   * content. Turned off for anything that's part of the initial viewport
   * (PageHeader, CaseStudyHeader) or that already carries its own
   * scroll-driven behaviour (FactsStrip, once sticky). */
  reveal?: boolean;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      id={id}
      className={cn(
        "py-14 sm:py-24",
        SURFACE_CLASS[surface],
        borderTop && "border-t border-line",
        borderBottom && "border-b border-line",
        reveal && "reveal",
        className,
      )}
    >
      <Container className={cn(width !== "site" && WIDTH_MAX[width], containerClassName)}>
        {children}
      </Container>
    </Tag>
  );
}
