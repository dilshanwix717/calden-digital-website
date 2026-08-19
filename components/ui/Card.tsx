import { cn } from "@/lib/cn";

/**
 * Flat card — warm surface, 1px border, small radius, no shadow. Elevation
 * is expressed with the border-color transition on hover, never a lift or a
 * shadow (the design system forbids shadows everywhere, both themes).
 */
export function Card({
  as: Tag = "div",
  href,
  className,
  children,
}: {
  as?: "div" | "a";
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const base = "rounded-md border border-line bg-surface transition-colors duration-200";
  if (Tag === "a" && href) {
    return (
      <a href={href} className={cn(base, "block hover:border-line-control", className)}>
        {children}
      </a>
    );
  }
  return <div className={cn(base, className)}>{children}</div>;
}
