"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Site } from "@/lib/schemas";

const MOBILE_QUERY = "(max-width: 819px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * The only client component in the hero, and only mounted at all when
 * hero.video.enabled is true (Hero.tsx renders `{videoEnabled && <HeroVideo />}`
 * — while disabled this module is imported but the component tree never
 * instantiates it, so nothing here runs).
 *
 * The poster is server-rendered and is the LCP element the instant video is
 * turned on (BUILD-PLAN §1.8). The <video> itself is NOT in the initial
 * markup — it is created imperatively after mount, scheduled with
 * requestIdleCallback so it never competes with first paint, and it fades
 * in only once playable. If the video stalls or fails, the poster is never
 * removed, so the fallback is automatic. On prefers-reduced-motion: reduce
 * we return before even creating the <video> element — poster only, no
 * network request at all.
 */
export function HeroVideo({ video }: { video: Site["hero"]["video"] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    const schedule =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback
        : (cb: IdleRequestCallback) => window.setTimeout(() => cb({} as IdleDeadline), 0);
    const cancelSchedule =
      typeof window.cancelIdleCallback === "function"
        ? window.cancelIdleCallback
        : (id: number) => window.clearTimeout(id);

    const handle = schedule(() => {
      if (cancelled) return;

      const isMobile = window.matchMedia(MOBILE_QUERY).matches;
      const source = isMobile ? video.sources.mobile : video.sources.desktop;

      const el = document.createElement("video");
      el.muted = true;
      el.autoplay = true;
      el.playsInline = true;
      el.loop = true;
      el.preload = "none";
      el.className = "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[320ms]";
      el.setAttribute("aria-hidden", "true");

      const src = document.createElement("source");
      src.src = source.src;
      src.type = source.type;
      el.appendChild(src);

      el.addEventListener(
        "canplaythrough",
        () => {
          el.style.opacity = "1";
        },
        { once: true },
      );

      container.appendChild(el);
      videoElRef.current = el;
      el.preload = "auto";
      el.load();
    });

    return () => {
      cancelled = true;
      cancelSchedule(handle as never);
      videoElRef.current?.remove();
      videoElRef.current = null;
    };
  }, [video]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <Image
        src={video.poster.src}
        alt={video.poster.alt}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
}
