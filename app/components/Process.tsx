"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const WHATSAPP_HREF =
  "https://wa.me/491700000000?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20030%20Digital.";

const HEADLINE: { word: string; italic: boolean }[] = [
  { word: "Vier", italic: false },
  { word: "Schritte.", italic: false },
  { word: "Keine", italic: true },
  { word: "Schleife.", italic: true },
];

type Step = {
  n: string;
  position: string;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    position: "01 / 04",
    title: "WhatsApp",
    body:
      "Du schreibst kurz, was du brauchst. Alex (mein AI-Agent) antwortet sofort und filtert vor. Persönliche Antwort von mir innerhalb 1–2 Stunden.",
  },
  {
    n: "02",
    position: "02 / 04",
    title: "Briefing",
    body:
      "30 Minuten Call oder Voice. Ziel, Branche, Wording, Bilder. Ich schicke dir ein Festpreis-Angebot innerhalb 24 h.",
  },
  {
    n: "03",
    position: "03 / 04",
    title: "Design + Build",
    body:
      "5 Tage ab Erhalt aller Inhalte. Du bekommst eine erste Variante als interaktiven Prototyp und gibst Feedback. 2 Korrekturrunden inklusive.",
  },
  {
    n: "04",
    position: "04 / 04",
    title: "Live",
    body:
      "Deploy auf Vercel, eigene Domain, eigene E-Mail, DSGVO-konform. SEO + Analytics laufen ab Tag 1.",
  },
];

export default function Process() {
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

  const cardsContainer: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.1,
        delayChildren: reduce ? 0 : 0.2,
      },
    },
  };

  const cardItem: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const inViewProps = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: 0.25 },
  } as const;

  return (
    <section
      id="prozess"
      aria-label="Prozess"
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
            01 / 07 · So arbeite ich
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

        <motion.p
          {...inViewProps}
          variants={fadeUp(0.5)}
          className="
            mt-8 max-w-xl
            font-sans text-base leading-relaxed text-text-body
            md:text-lg
          "
        >
          Ein klar definierter Ablauf — kein offener Stundenzettel, keine
          endlosen Reviews.
        </motion.p>

        {/* CARDS */}
        <motion.ol
          {...inViewProps}
          variants={cardsContainer}
          className="
            mt-16 grid grid-cols-1 gap-4
            md:mt-20 md:grid-cols-2 md:gap-5
            lg:grid-cols-4 lg:gap-5
          "
        >
          {STEPS.map((step) => (
            <motion.li
              key={step.n}
              variants={cardItem}
              className="
                group relative flex flex-col rounded-2xl
                border bg-surface
                p-6 transition-colors duration-200
                md:p-7 lg:p-8
              "
              style={{ borderColor: "var(--color-border-subtle)" }}
            >
              {/* Step-Number-Pill */}
              <span
                className="
                  inline-flex w-fit items-center
                  rounded-full px-3 py-1
                  font-mono text-[11px] tracking-[0.18em]
                "
                style={{
                  backgroundColor: "var(--color-accent-dark)",
                  color: "var(--color-accent)",
                }}
              >
                {step.n}
              </span>

              {/* Position */}
              <span
                className="
                  mt-6 font-mono text-[11px] uppercase tracking-[0.2em]
                  text-text-mono
                  md:text-xs
                "
              >
                {step.position}
              </span>

              {/* Title */}
              <h3
                className="
                  mt-2 font-sans text-2xl font-semibold
                  leading-tight tracking-tight text-text-primary
                  md:text-3xl
                "
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                className="
                  mt-4 font-sans text-sm leading-relaxed text-text-secondary
                  md:text-[15px]
                "
              >
                {step.body}
              </p>
            </motion.li>
          ))}
        </motion.ol>

        {/* FOOTER-ROW */}
        <motion.div
          {...inViewProps}
          variants={fadeUp(0.2)}
          className="
            mt-16 flex flex-col items-start gap-6
            border-t pt-8
            md:mt-20 md:flex-row md:items-center md:justify-between md:gap-10
          "
          style={{ borderColor: "var(--color-border-divider)" }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-mono md:text-xs">
            Festpreis vor Projektstart · 50 % bei Briefing · 50 % bei Live-Gang
          </p>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Anfrage über WhatsApp starten"
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
              backgroundColor: "var(--color-accent-dark)",
              color: "var(--color-accent)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            Anfrage starten
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
