"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type RevealOptions = {
  /** Y-Offset in px before reveal. Default 32. */
  y?: number;
  /** Animation duration in seconds. Default 0.9. */
  duration?: number;
  /** Stagger between children when `selector` is set. Default 0.08. */
  stagger?: number;
  /** Start delay in seconds. Default 0. */
  delay?: number;
  /** ScrollTrigger start position. Default "top 82%". */
  start?: string;
  /** Optional CSS selector for child elements (enables stagger). */
  selector?: string;
  /** Add slight blur during reveal for editorial feel. Default true. */
  blur?: boolean;
};

export function useReveal<T extends HTMLElement>(
  options: RevealOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const {
      y = 32,
      duration = 0.9,
      stagger = 0.08,
      delay = 0,
      start = "top 82%",
      selector,
      blur = true,
    } = options;

    const targets: gsap.TweenTarget = selector
      ? Array.from(el.querySelectorAll(selector))
      : el;

    if (selector && (targets as Element[]).length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y,
        filter: blur ? "blur(8px)" : "blur(0px)",
        duration,
        delay,
        ease: "power3.out",
        stagger: selector ? stagger : 0,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => ctx.revert();
  }, [
    options.y,
    options.duration,
    options.stagger,
    options.delay,
    options.start,
    options.selector,
    options.blur,
  ]);

  return ref;
}
