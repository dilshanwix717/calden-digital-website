import { cn } from "@/lib/cn";

/**
 * Small uppercase pill. `variant="meta"` matches the project-card caption
 * style (sunken background); `variant="chip"` matches the services page
 * "included" chips (card background, sentence case, bordered).
 */
export function Tag({
  children,
  variant = "meta",
  className,
}: {
  children: React.ReactNode;
  variant?: "meta" | "chip";
  className?: string;
}) {
  if (variant === "chip") {
    return (
      <span
        className={cn(
          "rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] font-medium text-ink",
          className,
        )}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "rounded-full bg-sunken px-2.5 py-1 text-xs font-medium uppercase tracking-[0.04em] text-subtle",
        className,
      )}
    >
      {children}
    </span>
  );
}
