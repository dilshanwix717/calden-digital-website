import { cn } from "@/lib/cn";

/**
 * Label + control + hint/error wrapper. error replaces hint when present.
 * The wrapping component is responsible for setting aria-invalid and
 * aria-describedby on the control itself and pointing it at this
 * component's message id.
 */
export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  const messageId = `${htmlFor}-message`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium tracking-[-0.005em] text-ink">
        {label}
        {required && <span className="ml-0.5 text-brand">*</span>}
      </label>
      {children}
      {error ? (
        <span id={messageId} role="alert" className="text-[13px] leading-[1.4] text-danger">
          {error}
        </span>
      ) : hint ? (
        <span id={messageId} className="text-[13px] leading-[1.4] text-subtle">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Shared control styling, exported so Input/Select/Textarea stay in sync.
 * Focus uses outline, matching the global :focus-visible rule in
 * globals.css — never box-shadow/ring utilities, which the design system
 * forbids in every theme (BUILD-PLAN §2.4, "no shadows anywhere").
 */
export const CONTROL_CLASS = cn(
  "w-full box-border rounded-sm border bg-surface px-[14px] py-[11px] text-base text-ink",
  "placeholder:text-subtle",
  "transition-colors duration-200",
  "focus:border-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-0",
);

export function controlBorder(hasError: boolean): string {
  return hasError ? "border-danger" : "border-line-control";
}
