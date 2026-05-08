"use client";

import { useInView } from "./useInView";

const PHASES = [
  { tag: "TAG 1", titel: "Konzept", desc: "Du erzählst, wir verstehen.", highlighted: false },
  { tag: "TAG 3", titel: "Design", desc: "Erste Vorschau bei dir.", highlighted: true },
  { tag: "TAG 5", titel: "Live", desc: "Online und auffindbar.", highlighted: false },
];

export default function Act02Process() {
  const { ref, inView } = useInView(0.3);

  return (
    <section
      ref={ref}
      aria-label="Akt 2 — Wir bauen"
      className="relative flex min-h-screen items-center px-6 py-20 md:px-12"
    >
      <span
        className="absolute left-6 top-12 font-mono text-[10px] tracking-[0.3em] md:left-12"
        style={{ color: "var(--color-accent)" }}
      >
        AKT 02 · WIR BAUEN
      </span>

      <div className="mx-auto w-full max-w-5xl">
        <div
          className={`mb-16 text-center transition-all duration-1000 ease-out ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-serif text-4xl font-medium leading-tight text-page md:text-6xl">
            5 Tage später.
            <br />
            <span style={{ color: "var(--color-accent)" }}>
              Live im Internet.
            </span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PHASES.map((phase, i) => (
            <div
              key={phase.tag}
              className={`rounded-2xl bg-surface-1 p-8 text-center transition-all duration-1000 ease-out ${
                phase.highlighted ? "border border-accent" : "border border-border-soft"
              } ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
              }`}
              style={{
                transitionDelay: `${300 + i * 200}ms`,
                boxShadow: phase.highlighted
                  ? "0 24px 60px -28px rgb(var(--color-accent-glow-rgb) / 0.6)"
                  : "none",
              }}
            >
              <div
                className="mb-4 font-mono text-xs tracking-widest"
                style={{ color: "var(--color-accent)" }}
              >
                {phase.tag}
              </div>
              <div className="mb-2 text-lg font-medium text-page md:text-xl">
                {phase.titel}
              </div>
              <div className="text-sm text-text-muted">{phase.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
