"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type MagnetButtonProps = {
  children: React.ReactNode;
  /** Magnet strength 0-1 (translation = cursor-offset × strength). Default 0.3. */
  strength?: number;
  className?: string;
};

export default function MagnetButton({
  children,
  strength = 0.3,
  className,
}: MagnetButtonProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const inner = wrap.firstElementChild as HTMLElement | null;
    if (!inner) return;

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      gsap.to(inner, {
        x: (e.clientX - cx) * strength,
        y: (e.clientY - cy) * strength,
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const onLeave = () => {
      gsap.to(inner, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      });
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(inner);
    };
  }, [strength]);

  const hasDisplay = className?.match(/\b(block|inline-block|inline-flex|flex|inline)\b/);
  return (
    <span
      ref={wrapRef}
      className={`${hasDisplay ? "" : "inline-block"} ${className ?? ""}`.trim()}
    >
      {children}
    </span>
  );
}
