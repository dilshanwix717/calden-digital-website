import { getSite } from "@/lib/content";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * WhatsApp then email. Two layouts, both used in the design:
 *   - "stack" (default): left-aligned column, full-width buttons on mobile —
 *     the homepage contact section and the /contact page's left column.
 *   - "row": centred, side-by-side on desktop, stacked full-width on mobile
 *     — the shared ContactCTA band on /work, /services, /about.
 */
export function ContactActions({
  size = "lg",
  layout = "stack",
  className,
}: {
  size?: "sm" | "md" | "lg";
  layout?: "stack" | "row";
  className?: string;
}) {
  const { contact } = getSite();
  const buttonWidth = layout === "row" ? "w-full box-border desk:w-auto" : "w-full box-border";

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        layout === "stack" && "items-start",
        layout === "row" && "items-center desk:flex-row desk:justify-center",
        className,
      )}
    >
      <WhatsAppButton size={size} className={buttonWidth} />
      <Button variant="secondary" size={size} href={`mailto:${contact.email}`} className={buttonWidth}>
        {contact.email}
      </Button>
    </div>
  );
}
