/**
 * Join class names, dropping falsy values. Three lines instead of clsx —
 * the performance budget requires a written justification for any dependency
 * over 10 KB, and this is the whole of what clsx would give us.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
