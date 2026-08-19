"use client";

import { useEffect, useRef, useState } from "react";
import { Menu } from "@/components/icons/Menu";
import { Close } from "@/components/icons/Close";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Trigger + panel only. The link list is passed as children so it stays
 * server-rendered — this component's own JavaScript is the whole cost of
 * the mobile nav, not the links inside it.
 *
 * Every item in the accessibility checklist here was called out explicitly
 * in BUILD-PLAN §3 because each is commonly missed:
 *   - focus moves into the panel on open (the close button), and back to
 *     the trigger on close
 *   - focus is trapped in the panel while open (Tab wraps at both ends)
 *   - Escape closes it
 *   - body scroll is locked while open, restored on close AND on unmount
 *   - it closes when a link inside it is clicked (route change)
 */
export function MobileNav({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Body scroll lock, restored on close and on unmount — not just on close,
  // in case the component unmounts while the menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus management: move in on open, trap while open, return on close.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Return focus to the trigger on close, but not on the initial mount
  // (open starts false and this effect must not fire then).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) {
      triggerRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  // Close when a link inside the panel is activated (route change). The
  // links are plain <Link>s passed as children, so this is wired with a
  // click handler on the panel container rather than per-link props.
  function onPanelClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    if (target.closest("a")) setOpen(false);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center desk:hidden"
      >
        <Menu size={26} />
      </button>

      {/* Scrim */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity duration-200 desk:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        id="mobile-nav-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        onClick={onPanelClick}
        className={`fixed inset-y-0 right-0 z-40 flex w-[min(84vw,360px)] flex-col gap-6 bg-page px-6 py-5 shadow-none transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] desk:hidden ${
          open ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-4 opacity-0"
        }`}
        // Hidden from the accessibility tree entirely while closed, on top
        // of the visual hiding above — belt and braces for AT that ignores
        // opacity/transform.
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between">
          <span className="t-caption text-subtle">Menu</span>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center"
          >
            <Close size={22} />
          </button>
        </div>
        <div className="flex flex-col gap-5">{children}</div>
      </div>
    </>
  );
}
