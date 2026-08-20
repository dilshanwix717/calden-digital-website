import { getSite } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { ChatGlyph } from "@/components/icons/ChatGlyph";
import { cn } from "@/lib/cn";

/**
 * Reused as-is in the nav, hero and contact section, and later as the
 * floating widget (Phase 6). Deliberately holds NO positioning, layout or
 * fixed/absolute styles — that is what lets the floating variant be a thin
 * wrapper around this component instead of a rewrite. See BUILD-PLAN §3.
 */
type WhatsAppButtonProps = {
  variant?: "primary" | "secondary" | "secondaryOnBand" | "text";
  size?: "sm" | "md" | "lg";
  /** Overrides site.json's whatsapp.defaultMessage. */
  message?: string;
  /** Overrides site.json's whatsapp.label. */
  label?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
  className?: string;
};

export function WhatsAppButton({
  variant = "primary",
  size = "md",
  message,
  label,
  showIcon = true,
  fullWidth = false,
  className,
}: WhatsAppButtonProps) {
  const { whatsapp } = getSite();
  return (
    <Button
      variant={variant}
      size={size}
      href={whatsappUrl(message)}
      className={cn(fullWidth && "w-full box-border", className)}
    >
      {showIcon && <ChatGlyph size={size === "lg" ? 18 : 17} />}
      {label ?? whatsapp.label}
    </Button>
  );
}
