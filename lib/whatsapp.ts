import { getSite } from "@/lib/content";

/**
 * Builds a wa.me link from the number and message in site.json, so the
 * number lives in exactly one place. encodeURIComponent, not encodeURI —
 * the default message contains an em dash and a typographic apostrophe,
 * both of which encodeURI leaves unescaped in a way that breaks the link.
 */
export function whatsappUrl(message?: string): string {
  const { whatsapp } = getSite();
  const text = encodeURIComponent(message ?? whatsapp.defaultMessage);
  return `https://wa.me/${whatsapp.number}?text=${text}`;
}
