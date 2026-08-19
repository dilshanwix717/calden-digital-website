import { cn } from "@/lib/cn";

/**
 * Owns the page-level max-width and horizontal gutter. No page file writes
 * its own padding — every section's content sits inside one of these.
 * Gutter switches at `desk` (820px, a layout concern), matching the design's
 * --section-x. See Section.tsx for the width variants.
 */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-site px-5 desk:px-16", className)}>
      {children}
    </div>
  );
}
