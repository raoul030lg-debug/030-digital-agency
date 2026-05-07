"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const HEADLINE: { word: string; italic: boolean }[] = [
  { word: "Solo.", italic: false },
  { word: "Aus", italic: true },
  { word: "Überzeugung.", italic: true },
];

const STATS: { value: string; unit: string; label: string }[] = [
  { value: "1–2", unit: "h", label: "Antwort" },
  { value: "48", unit: "h", label: "Basic Live" },
  { value: "7", unit: "Tage", label: "Premium Live" },
];

export default function About() {
  const reduce = useReducedMotion();

  const headlineContainer: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.08,
        delayChildren: reduce ? 0 : 0.1,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: reduce ? 0 : 32,
      filter: reduce ? "blur(0px)" : "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduce ? 0 : 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const fadeUp = (delay = 0): Variants => ({
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.6,
        delay: reduce ? 0 : delay,
        ease: "easeOut",
      },
    },
  });

  const statsContainer: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.1,
        delayChildren: reduce ? 0 : 0.15,
      },
    },
  };

  const statItem: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.5, ease: "easeOut" },
    },
  };

  const inViewProps = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: 0.25 },
  } as const;

  return (
    <section
      id="about"
      aria-label="Über mich"
      className="
        relative w-full bg-transparent
        px-6 py-24 md:px-10 md:py-28
        lg:px-12 lg:py-32
      "
    >
      <div className="relative mx-auto w-full max-w-7xl">
        {/* HEADER */}
        <motion.div
          {...inViewProps}
          variants={fadeUp(0)}
          className="flex flex-col gap-2"
        >
          <span
            className="
              inline-flex w-fit items-center gap-2 rounded-full
              border px-3 py-1
              font-mono text-[10px] uppercase tracking-[0.18em] text-text-mono
              md:text-xs
            "
            style={{ borderColor: "var(--color-border-medium)" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            07 / 07 · Über mich
          </span>
        </motion.div>

        <motion.h2
          {...inViewProps}
          variants={headlineContainer}
          className="
            mt-8 max-w-5xl
            font-serif font-normal
            text-5xl leading-[0.95] tracking-tight text-text-primary
            sm:text-6xl
            md:text-7xl
            xl:text-8xl
          "
        >
          {HEADLINE.map((item, idx) => (
            <span
              key={`${item.word}-${idx}`}
              className="mr-[0.25em] inline-block overflow-hidden align-baseline"
            >
              <motion.span
                variants={wordVariants}
                className={`inline-block ${
                  item.italic ? "italic text-text-italic" : "text-text-primary"
                }`}
              >
                {item.word}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {/* MAIN GRID */}
        <div
          className="
            mt-16 grid grid-cols-1 gap-12
            md:mt-20
            lg:grid-cols-12 lg:gap-16
          "
        >
          {/* LEFT — Quote + Bio */}
          <motion.div
            {...inViewProps}
            variants={fadeUp(0.15)}
            className="flex flex-col lg:col-span-7"
          >
            <blockquote
              className="
                font-serif italic font-normal
                text-2xl leading-snug text-text-primary
                md:text-3xl lg:text-[2.25rem]
              "
            >
              <span
                aria-hidden="true"
                className="mr-2 align-baseline"
                style={{ color: "var(--color-accent-dark)" }}
              >
                „
              </span>
              Ich hab zu viele Selbstständige gesehen, die für eine schlechte
              WordPress-Seite jeden Monat zahlen. Eine Website ist ein Werkzeug
              — kein Abo.
              <span aria-hidden="true" className="ml-1 align-baseline">
                “
              </span>
            </blockquote>

            <div
              className="
                mt-10 space-y-5
                font-sans text-base leading-relaxed text-text-body
                md:text-lg
              "
            >
              <p>
                Ich bin Raoul, lebe in Berlin und baue 030 Digital
                als Solo-Studio. Mein Stack ist neuer als das, was die meisten
                Web-Agenturen kennen — Next.js 16, Three.js, AI als Werkzeug.
                Damit baue ich Sites, die normalerweise nur Studios mit fünf
                Leuten machen — solo, direkt, ohne Abo.
              </p>
              <p>
                AI und 3D sind nicht das Marketing — sie sind das Werkzeug.
                Mit Alex (mein AI-Agent für Erstkontakt + Filterung) bin ich
                für dich erreichbar, ohne dass es zur Vollzeit-Hotline wird.
              </p>
            </div>
          </motion.div>

          {/* RIGHT — Photo + Stats */}
          <div className="flex flex-col gap-8 lg:col-span-5">
            {/* Photo Placeholder */}
            <motion.div
              {...inViewProps}
              variants={fadeUp(0.2)}
              className="flex flex-col"
            >
              <div
                role="img"
                aria-label="Foto folgt — Platzhalter mit Initialen RH"
                className="
                  relative flex aspect-square w-full max-w-sm items-center justify-center
                  overflow-hidden rounded-2xl
                "
                style={{
                  backgroundColor: "var(--color-accent-dark)",
                }}
              >
                {/* Lime corner-rule top-right */}
                <span
                  aria-hidden="true"
                  className="absolute right-5 top-5 h-12 w-px"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />
                <span
                  aria-hidden="true"
                  className="absolute right-5 top-5 h-px w-12"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />

                {/* Initials block */}
                <span
                  className="
                    font-serif italic font-normal
                    text-[8rem] leading-none tracking-tighter
                    md:text-[10rem]
                  "
                  style={{ color: "var(--color-accent)" }}
                >
                  RH
                </span>

                {/* Status row bottom */}
                <span
                  className="
                    absolute inset-x-5 bottom-5
                    flex items-center justify-between
                    font-mono text-[10px] uppercase tracking-[0.2em]
                  "
                  style={{ color: "var(--color-accent)" }}
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    />
                    Foto folgt
                  </span>
                  <span style={{ color: "var(--color-page)", opacity: 0.6 }}>
                    Raoul H.
                  </span>
                </span>
              </div>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-text-mono">
                Berlin · 2026
              </p>
            </motion.div>

            {/* Stats */}
            <motion.dl
              {...inViewProps}
              variants={statsContainer}
              className="grid grid-cols-3 gap-3"
            >
              {STATS.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={statItem}
                  className="
                    flex flex-col rounded-2xl
                    border bg-surface
                    p-4
                    md:p-5
                  "
                  style={{ borderColor: "var(--color-border-subtle)" }}
                >
                  <dt className="order-2 mt-2 font-mono text-[10px] uppercase leading-tight tracking-[0.18em] text-text-mono md:text-[11px]">
                    {stat.label}
                  </dt>
                  <dd className="order-1 flex items-baseline gap-1 font-serif leading-none tracking-tight text-text-primary">
                    <span className="text-4xl md:text-5xl">{stat.value}</span>
                    <span className="text-lg text-text-secondary md:text-xl">
                      {stat.unit}
                    </span>
                  </dd>
                </motion.div>
              ))}
            </motion.dl>
          </div>
        </div>
      </div>
    </section>
  );
}
