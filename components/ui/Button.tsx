import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "text";
type Size = "sm" | "md" | "lg";

const SIZE_CLASS: Record<Size, string> = {
  sm: "text-[13px] px-4 py-2",
  md: "text-[15px] px-[22px] py-3",
  lg: "text-[17px] px-[30px] py-4",
};

// Primary hovers/actives by changing the background, never opacity — the
// brand rules forbid opacity fades on primary actions. Secondary fills a
// faint teal wash (color-mix, not a token — it's a one-off transparency
// effect, not a reusable design value).
const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    "bg-brand text-on-brand border border-brand hover:bg-brand-hover hover:border-brand-hover active:bg-brand-active active:border-brand-active",
  secondary:
    "bg-transparent text-brand border border-brand hover:bg-[color-mix(in_srgb,var(--brand-teal)_7%,transparent)] active:bg-[color-mix(in_srgb,var(--brand-teal)_13%,transparent)]",
  text: "bg-transparent text-brand border-transparent px-1.5 rounded-xs hover:underline hover:underline-offset-[3px]",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-sm font-semibold leading-none tracking-[-0.01em] whitespace-nowrap transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  className?: string;
};

type ButtonAsLink = CommonProps & {
  href: string;
  type?: never;
  disabled?: never;
  onClick?: never;
};

type ButtonAsButton = CommonProps & {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

type ButtonProps = ButtonAsLink | ButtonAsButton;

/**
 * One polymorphic component for every button-shaped thing on the site.
 * href starting with "/" -> next/link (client-side nav, no full reload).
 * href starting with http/mailto/tel -> plain <a>, target=_blank + rel only
 * for http(s) — a mailto: or tel: link should never open a new tab.
 * No href -> a real <button>.
 */
export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = cn(BASE, SIZE_CLASS[size], VARIANT_CLASS[variant], className);

  if (href) {
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={cls}>
          {children}
        </Link>
      );
    }
    const isHttp = href.startsWith("http://") || href.startsWith("https://");
    return (
      <a
        href={href}
        className={cls}
        {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  const { type = "button", disabled, onClick } = rest as ButtonAsButton;
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
