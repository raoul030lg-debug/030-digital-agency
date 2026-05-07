"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import MagnetButton from "./MagnetButton";

const WHATSAPP_HREF =
  "https://wa.me/491700000000?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20030%20Digital.";

const HEADLINE: { word: string; italic: boolean }[] = [
  { word: "Eine", italic: false },
  { word: "Website.", italic: false },
  { word: "Ein", italic: false },
  { word: "Festpreis.", italic: false },
  { word: "Kein", italic: true },
  { word: "Abo.", italic: true },
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function useLiveSeconds(): { hh: string; mm: string; ss: string } | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) return null;
  return {
    hh: pad(now.getHours()),
    mm: pad(now.getMinutes()),
    ss: pad(now.getSeconds()),
  };
}

export default function Hero() {
  const reduce = useReducedMotion();
  const time = useLiveSeconds();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.08,
        delayChildren: reduce ? 0 : 0.2,
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

  const fadeUp = (delay: number): Variants => ({
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

  const fadeDown = (delay: number): Variants => ({
    hidden: { opacity: 0, y: reduce ? 0 : -12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.5,
        delay: reduce ? 0 : delay,
        ease: "easeOut",
      },
    },
  });

  return (
    <section
      aria-label="Hero"
      className="
        relative isolate flex min-h-dvh w-full flex-col overflow-hidden
        bg-transparent
        px-6 pb-10 pt-6 md:px-10 lg:px-12 lg:pb-12 lg:pt-8
      "
    >
      {/* Atmosphärisches warmes Glow für hellen Editorial-Look */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, rgba(212,255,79,0.10) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(26,26,26,0.025) 0%, transparent 60%)",
        }}
      />

      {/* TOP-BAR */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeDown(0)}
        className="relative z-10 flex flex-wrap items-start justify-between gap-y-4 gap-x-6"
      >
        <div className="flex flex-col gap-2">
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
            Solo-Studio · Berlin · Seit 2024
          </span>
          <span
            className="font-mono text-[11px] tracking-wider text-text-secondary md:text-xs"
            aria-live="polite"
            suppressHydrationWarning
          >
            52.520° N · 13.405° E —{" "}
            {time ? (
              <>
                {time.hh}:{time.mm}:
                <span style={{ color: "var(--color-accent)" }}>{time.ss}</span>
              </>
            ) : (
              <span className="opacity-0">00:00:00</span>
            )}
          </span>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className="
              inline-flex w-fit items-center gap-2 rounded-full
              px-3 py-1
              font-mono text-[10px] uppercase tracking-[0.18em]
              md:text-xs
            "
            style={{
              backgroundColor: "#1a1a1a",
              color: "var(--color-accent)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            Verfügbar · Mai 2026
          </span>
          <span className="font-mono text-[11px] tracking-wider text-text-secondary md:text-xs">
            2 / 3 Slots offen
          </span>
        </div>
      </motion.header>

      {/* MAIN CONTENT — Headline füllt volle Breite */}
      <div
        className="
          pointer-events-none relative z-10 mx-auto flex w-full max-w-7xl flex-1
          flex-col justify-center
          py-16 md:py-24 lg:py-28
          [&_a]:pointer-events-auto [&_button]:pointer-events-auto
        "
      >
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="
            max-w-[90%]
            font-serif font-normal
            text-6xl leading-[0.92] tracking-tight text-text-primary
            sm:text-7xl
            md:text-8xl
            lg:text-[10rem]
            xl:text-[12rem]
          "
        >
          {HEADLINE.map((item, idx) => (
            <span
              key={`${item.word}-${idx}`}
              className="mr-[0.18em] inline-block overflow-hidden align-baseline"
            >
              <motion.span
                variants={wordVariants}
                className={`inline-block ${
                  item.italic
                    ? "italic text-text-italic"
                    : "text-text-primary"
                }`}
              >
                {item.word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp(0.85)}
          className="
            mt-12 max-w-2xl
            font-sans text-base leading-relaxed text-text-body
            md:mt-16 md:text-lg
            lg:text-xl
          "
        >
          Ich baue moderne Websites mit AI-gestützten Visuals, 3D und
          Premium-Animation. Onepager in 48 h, Premium-Sites in 7 Tagen.
          Festpreis. Kein WordPress. Kein SELLWERK. Kein Bullshit.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp(1.0)}
          className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-12"
        >
          <MagnetButton>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Über WhatsApp Kontakt aufnehmen"
              className="
                group inline-flex min-h-[52px] items-center justify-center gap-3
                rounded-full px-7 py-3
                font-mono text-xs uppercase tracking-[0.18em]
                transition-all duration-200
                hover:gap-4
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent
                md:text-sm
              "
              style={{
                backgroundColor: "#1a1a1a",
                color: "var(--color-accent)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
              Auf WhatsApp schreiben
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </MagnetButton>
          <MagnetButton strength={0.25}>
            <a
              href="#showcase"
              className="
                inline-flex min-h-[52px] items-center justify-center
                rounded-full border px-7 py-3
                font-mono text-xs uppercase tracking-[0.18em] text-text-primary
                transition-colors duration-200
                hover:bg-black/[0.04]
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent
                md:text-sm
              "
              style={{ borderColor: "var(--color-border-medium)" }}
            >
              Showcase ansehen
            </a>
          </MagnetButton>
        </motion.div>
      </div>

      {/* BOTTOM-STATUS-BAR */}
      <motion.footer
        initial="hidden"
        animate="visible"
        variants={fadeUp(1.2)}
        className="
          relative z-10 mt-auto grid w-full max-w-7xl mx-auto
          grid-cols-1 gap-4
          border-t pt-6
          sm:grid-cols-[1fr_auto] sm:items-end sm:gap-8
        "
        style={{ borderColor: "var(--color-border-divider)" }}
      >
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-mono">
            Live-Demo
          </span>
          <a
            href="https://maler-teal.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="
              font-mono text-xs text-text-secondary
              underline-offset-4 hover:text-text-primary hover:underline
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
            "
          >
            Maler-Berlin.de — verfügbar
          </a>
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
            scroll
          </span>
          <span aria-hidden="true" className="text-text-muted">
            ↓
          </span>
        </div>
      </motion.footer>
    </section>
  );
}
