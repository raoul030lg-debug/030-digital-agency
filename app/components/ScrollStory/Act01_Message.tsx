"use client";

import { useInView } from "./useInView";

export default function Act01Message() {
  const { ref, inView } = useInView(0.3);

  return (
    <section
      ref={ref}
      aria-label="Akt 1 — Du rufst an"
      className="relative flex min-h-screen items-center px-6 py-20 md:px-12"
    >
      <span
        className="absolute left-6 top-12 font-mono text-[10px] tracking-[0.3em] md:left-12"
        style={{ color: "var(--color-accent)" }}
      >
        AKT 01 · DU RUFST AN
      </span>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-20">
        <div
          className={`transition-all duration-1000 ease-out ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
          }`}
        >
          <h2 className="mb-6 font-serif text-4xl font-medium leading-tight text-page md:text-6xl">
            Eine Nachricht.
            <br />
            Ein Anruf.
            <br />
            <span style={{ color: "var(--color-accent)" }}>Mehr nicht.</span>
          </h2>
          <p className="max-w-md text-base leading-relaxed text-text-muted md:text-lg">
            Kein Termin-Marathon. Keine Vertragsorgie. Du sagst, was du
            brauchst — wir kümmern uns.
          </p>
        </div>

        <div
          className={`transition-all delay-200 duration-1000 ease-out ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
          }`}
        >
          <div
            className="mx-auto max-w-sm rounded-3xl bg-surface-1 p-5"
            style={{
              border:
                "1px solid color-mix(in srgb, var(--color-accent) 40%, transparent)",
            }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full bg-accent"
              />
              <span
                className="font-mono text-[10px] tracking-widest text-accent"
              >
                NACHRICHT
              </span>
            </div>
            <p className="text-sm leading-relaxed text-page md:text-base">
              „Hi, ich bin Maler aus Pankow. Brauche eine Website. Was kostet
              das?"
            </p>
            <p className="mt-3 font-mono text-[10px] text-text-muted/60">
              14:32
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
