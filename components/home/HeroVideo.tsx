"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Site } from "@/lib/schemas";

const MOBILE_QUERY = "(max-width: 819px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Applied identically to the poster and the <video> so the crossfade between
 * them is invisible — any mismatch here shows up as a colour pop at the
 * moment the video fades in.
 *
 * The stock clip is cyan-blue (mean RGB 24,91,131), which fights the teal
 * palette; hue-rotate walks it toward brand green and saturate takes the
 * edge off. brightness() is not taste: it caps the brightest pixel the clip
 * can produce, and that cap is what lets scrimOpacity sit at 0.50 instead of
 * the 0.77 a raw clip would need for the same guaranteed contrast. A darker
 * clip means a LIGHTER scrim, so more of the video survives, not less.
 *
 * Changing these numbers changes the contrast floor under the hero text —
 * re-measure against site.json's hero.video.scrimOpacity before shipping a
 * new grade. Current floor: 5.84:1 for --text-on-band against the brightest
 * pixel across every frame of both clips.
 */
const VIDEO_FILTER = "brightness(.55) saturate(.8) hue-rotate(-15deg)";

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
      el.style.filter = VIDEO_FILTER;

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
        style={{ filter: VIDEO_FILTER }}
      />
    </div>
  );
}
