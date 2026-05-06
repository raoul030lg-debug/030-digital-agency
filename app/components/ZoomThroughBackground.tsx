"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

type Direction = "in" | "out";

interface Props {
  imageSrc: string;
  children: React.ReactNode;
  /** Light overlay alpha (Studio Light theme = #fafaf7). Default 0.65. */
  overlayOpacity?: number;
  /** Maximum scale at the deepest zoom point. Default 1.4. */
  zoomTo?: number;
  /** "in" zooms forward as section exits; "out" reverses (zooms back). */
  direction?: Direction;
}

export default function ZoomThroughBackground({
  imageSrc,
  children,
  overlayOpacity = 0.65,
  zoomTo = 1.4,
  direction = "in",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const animateScale = !reducedMotion && !isMobile;

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    animateScale
      ? direction === "in"
        ? [1, 1.15, zoomTo]
        : [zoomTo, 1.15, 1]
      : [1, 1, 1],
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    reducedMotion ? [1, 1, 1, 1] : [0, 1, 1, 0],
  );

  return (
    <div ref={ref} className="relative isolate overflow-hidden">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${imageSrc})`,
          scale,
          opacity,
          willChange: animateScale ? "transform, opacity" : undefined,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: `rgba(250, 250, 247, ${overlayOpacity})` }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
