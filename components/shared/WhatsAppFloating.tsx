"use client";

import { useEffect, useRef, useState } from "react";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

/**
 * Not mounted anywhere yet — see the comment in app/layout.tsx for where to
 * add it. Forwards every prop straight to WhatsAppButton untouched; this
 * file's only job is fixed positioning and an optional scroll-based reveal.
 * WhatsAppButton itself holds no positioning of its own, which is what
 * makes this a ~25-line wrapper instead of a second implementation.
 *
 * Uses IntersectionObserver on a full-height sentinel rather than a scroll
 * event listener — a scroll listener runs on every frame; the observer
 * fires only on the one crossing that matters.
 */
type WhatsAppFloatingProps = React.ComponentProps<typeof WhatsAppButton> & {
  /** Reveal only after scrolling past this many viewport heights. 0 = always visible. */
  revealAfterViewports?: number;
};

export function WhatsAppFloating({
  revealAfterViewports = 1,
  ...buttonProps
}: WhatsAppFloatingProps) {
  const [visible, setVisible] = useState(revealAfterViewports === 0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (revealAfterViewports === 0) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry?.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [revealAfterViewports]);

  return (
    <>
      {revealAfterViewports > 0 && (
        <div
          ref={sentinelRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 w-px"
          style={{ height: `${revealAfterViewports * 100}vh` }}
        />
      )}
      <div
        className={`fixed bottom-5 right-5 z-30 transition-opacity duration-200 ${
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <WhatsAppButton {...buttonProps} />
      </div>
    </>
  );
}
