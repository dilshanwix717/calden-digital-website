import { cn } from "@/lib/cn";

/**
 * 12px / 0.14em / uppercase / 600. On a normal surface it's --brand-teal; on
 * a band it must be --brand-on-band — never --teal-on-dark, which measures
 * 2.78:1 on the band and fails AA (BUILD-PLAN §1.6b).
 */
export function Eyebrow({
  children,
  onBand = false,
  className,
}: {
  children: React.ReactNode;
  onBand?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "t-caption",
        onBand ? "text-brand-on-band" : "text-brand",
        className,
      )}
    >
      {children}
    </div>
  );
}
