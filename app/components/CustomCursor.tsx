"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.documentElement.classList.add("custom-cursor-active");

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, "x", {
      duration: reduced ? 0 : 0.12,
      ease: "power3.out",
    });
    const dotY = gsap.quickTo(dot, "y", {
      duration: reduced ? 0 : 0.12,
      ease: "power3.out",
    });
    const ringX = gsap.quickTo(ring, "x", {
      duration: reduced ? 0 : 0.4,
      ease: "power3.out",
    });
    const ringY = gsap.quickTo(ring, "y", {
      duration: reduced ? 0 : 0.4,
      ease: "power3.out",
    });

    let firstMove = true;
    const onMove = (e: PointerEvent) => {
      if (firstMove) {
        firstMove = false;
        gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    let isHover = false;
    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const interactive = target?.closest(
        "a, button, [role='button'], [data-cursor='hover']",
      );
      const next = !!interactive;
      if (next === isHover) return;
      isHover = next;
      gsap.to(ring, {
        scale: next ? 1.7 : 1,
        duration: 0.3,
        ease: "power3.out",
      });
      gsap.to(dot, {
        scale: next ? 0 : 1,
        duration: 0.3,
        ease: "power3.out",
      });
    };

    const onLeaveWindow = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };
    const onEnterWindow = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onPointerOver);
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    document.documentElement.addEventListener("pointerenter", onEnterWindow);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      document.documentElement.removeEventListener("pointerenter", onEnterWindow);
      gsap.killTweensOf([dot, ring]);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-8 w-8 rounded-full border-2 opacity-0"
        style={{ borderColor: "var(--color-text-primary)" }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full opacity-0"
        style={{ backgroundColor: "var(--color-accent)" }}
      />
    </>
  );
}
