"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function HeroPlaceholder3D() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.9,
        delay: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      aria-hidden="true"
      className="
        relative w-full overflow-hidden
        rounded-2xl border
        aspect-square lg:aspect-[4/5]
        bg-[linear-gradient(180deg,#0f0f0f_0%,#141414_60%,#0a0a0a_100%)]
      "
      style={{ borderColor: "var(--color-border-subtle)" }}
    >
      {/* Subtile Crosshair-Andeutung — bewusst minimal */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-px w-16"
          style={{ backgroundColor: "var(--color-border-medium)" }}
        />
        <div
          className="absolute h-16 w-px"
          style={{ backgroundColor: "var(--color-border-medium)" }}
        />
      </div>

      {/* Accent-Glow-Punkt zentral, sehr subtil */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          backgroundColor: "var(--color-accent)",
          boxShadow: "0 0 24px 4px rgb(var(--color-accent-glow-rgb) / 0.35)",
        }}
      />

      {/* Mono-Label unten */}
      <div className="absolute inset-x-0 bottom-5 flex justify-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
          [ 3D-Platzhalter · folgt im nächsten Schritt ]
        </span>
      </div>

      {/* Top-Right: Modus-Label */}
      <div className="absolute right-5 top-5 flex items-center gap-2">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "var(--color-accent)" }}
        />
        <span className="font-mono text-[10px] uppercase tracking-wider text-text-mono">
          Skyline
        </span>
      </div>
    </motion.div>
  );
}
