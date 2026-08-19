"use client";

import { useEffect, useRef } from "react";
import { THEME_STORAGE_KEY } from "./ThemeScript";
import { Sun } from "@/components/icons/Sun";
import { Moon } from "@/components/icons/Moon";

const LABEL_TO_LIGHT = "Switch to light theme";
const LABEL_TO_DARK = "Switch to dark theme";

/** Pure DOM write. Outside the component: it never closes over React state. */
function applyTheme(dark: boolean) {
  const el = document.documentElement;
  el.classList.toggle("dark", dark);
  el.style.colorScheme = dark ? "dark" : "light";
}

function isDark() {
  return document.documentElement.classList.contains("dark");
}

/**
 * Light/dark switch.
 *
 * Two deliberate choices:
 *
 * 1. BOTH icons are always rendered and CSS decides which is visible. Deriving
 *    the icon from state would mean reading localStorage during render — which
 *    does not exist on the server — producing a hydration mismatch or a
 *    one-frame icon flip. This way the server HTML is correct for either theme.
 *
 * 2. The accessible name is written imperatively after mount rather than held in
 *    state. The static HTML ships a neutral "Toggle theme", and there is no
 *    re-render on mount or on click — no component state exists at all. (An
 *    earlier version used useState here; eslint-config-next's React Compiler
 *    rules flagged setState-in-effect and a use-before-declare, and this
 *    imperative version is genuinely simpler, not just lint-compliant.)
 *
 * It follows the OS preference only while the visitor has stored no explicit
 * choice; once they click, the stored value wins.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = ref.current;
    if (!button) return;

    const setLabel = (dark: boolean) => {
      const label = dark ? LABEL_TO_LIGHT : LABEL_TO_DARK;
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    };

    setLabel(isDark());

    // Follow the OS only while no explicit choice is stored.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(THEME_STORAGE_KEY)) return;
      } catch {
        return;
      }
      applyTheme(e.matches);
      setLabel(e.matches);
    };

    const onClick = () => {
      const next = !isDark();
      applyTheme(next);
      setLabel(next);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
      } catch {
        // Private mode or storage disabled: the theme still applies to this page.
      }
    };

    mq.addEventListener("change", onSystemChange);
    button.addEventListener("click", onClick);
    return () => {
      mq.removeEventListener("change", onSystemChange);
      button.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Toggle theme"
      title="Toggle theme"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink transition-colors duration-200 hover:text-brand ${className}`}
    >
      {/* `hidden dark:block` shows the sun in dark mode — the action the
          button performs is "go light", so the sun is the target state. */}
      <Sun className="hidden dark:block" />
      <Moon className="block dark:hidden" />
    </button>
  );
}
