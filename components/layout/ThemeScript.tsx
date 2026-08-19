import { DARK_MODE_ENABLED } from "@/lib/theme";

/**
 * Blocking inline script that sets the theme class before first paint.
 *
 * DEACTIVATED: renders nothing while DARK_MODE_ENABLED is false (lib/theme.ts).
 * With no script, the `dark` class is never added, so every `dark:` variant in
 * the app stays inert and the site is light-only. The code below is kept
 * verbatim so re-enabling is a one-line change, not a rewrite.
 *
 * This is a Server Component emitting a raw <script>, NOT next/script. Every
 * next/script strategy — including beforeInteractive — can land after first
 * paint in the App Router, which is exactly the flash this exists to prevent.
 *
 * It also sets style.colorScheme, or native form controls and the scrollbar
 * paint light for one frame in dark mode.
 *
 * Because it mutates <html> before React hydrates, <html> needs
 * suppressHydrationWarning. See app/layout.tsx.
 */
export const THEME_STORAGE_KEY = "calden-theme";

// Minified by hand: this is inlined into every HTML response, and it must run
// before the browser paints, so it stays one statement long.
const script = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var e=document.documentElement;if(d)e.classList.add("dark");e.style.colorScheme=d?"dark":"light"}catch(_){}})()`;

export function ThemeScript() {
  if (!DARK_MODE_ENABLED) return null;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
