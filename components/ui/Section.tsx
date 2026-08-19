import { cn } from "@/lib/cn";
import { Container } from "./Container";

type Surface = "page" | "sunken" | "band" | "card";
type Width = "site" | "band" | "read";

const SURFACE_CLASS: Record<Surface, string> = {
  page: "bg-page text-ink",
  sunken: "bg-sunken text-ink",
  // Band inverts direction between themes (darker in light, lighter in dark —
  // see globals.css and BUILD-PLAN §1.6). The hairlines only render in dark
  // mode, where they reinforce a step that is otherwise a subtle upward move.
  band: "bg-band text-on-band dark:border-y dark:border-line",
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
        className,
      )}
    >
      <Container className={cn(width !== "site" && WIDTH_MAX[width], containerClassName)}>
        {children}
      </Container>
    </Tag>
  );
}
