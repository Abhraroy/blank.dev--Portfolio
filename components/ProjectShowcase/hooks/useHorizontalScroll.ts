"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, type RefObject } from "react";
import { registerScrollTrigger } from "@/lib/gsap/scrollTrigger";

type UseHorizontalScrollOptions = {
  /** Tall outer wrapper — its height drives how long the sticky phase lasts. */
  containerRef: RefObject<HTMLElement | null>;
  /** Horizontal track translated by scroll progress. */
  trackRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
};

/** Ease-in-out curve for horizontal travel (soft start + soft finish). */
const SCROLL_EASE = gsap.parseEase("power2.inOut");

/**
 * Sticky horizontal carousel with eased scrub:
 * - Outer height = viewport + travel (sticky “pin” window)
 * - Cached distance (no per-frame scrollWidth)
 * - Debounced ScrollTrigger.refresh
 */
export function useHorizontalScroll({
  containerRef,
  trackRef,
  enabled = true,
}: UseHorizontalScrollOptions) {
  useLayoutEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    registerScrollTrigger();

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    let distance = 0;

    const measure = () => {
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      container.style.height = `${window.innerHeight + distance}px`;
    };

    const setTrackX = (progress: number) => {
      const eased = SCROLL_EASE(gsap.utils.clamp(0, 1, progress));
      gsap.set(track, { x: -distance * eased, force3D: true });
    };

    const setWillChange = (on: boolean) => {
      track.style.willChange = on ? "transform" : "auto";
    };

    gsap.set(track, { x: 0 });
    measure();

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => setTrackX(self.progress),
      onToggle: (self) => setWillChange(self.isActive),
      onRefresh: (self) => {
        measure();
        setTrackX(self.progress);
      },
    });

    const scheduleRefresh = gsap.delayedCall(0.15, () => {
      measure();
      ScrollTrigger.refresh();
    }).pause();

    const requestRefresh = () => {
      scheduleRefresh.restart(true);
    };

    const raf = requestAnimationFrame(() => {
      measure();
      ScrollTrigger.refresh();
    });

    window.addEventListener("resize", requestRefresh);

    return () => {
      cancelAnimationFrame(raf);
      scheduleRefresh.kill();
      window.removeEventListener("resize", requestRefresh);
      trigger.kill();
      setWillChange(false);
      container.style.height = "";
      gsap.set(track, { clearProps: "transform" });
    };
  }, [containerRef, trackRef, enabled]);
}
