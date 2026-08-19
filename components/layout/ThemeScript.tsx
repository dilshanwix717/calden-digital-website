/**
 * Blocking inline script that sets the theme class before first paint.
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
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
