"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const HEADLINE: { word: string; italic: boolean }[] = [
  { word: "Demos.", italic: false },
  { word: "Keine", italic: true },
  { word: "Mockups.", italic: true },
];

type Industry = {
  id: string;
  name: string;
  tier: string;
  description: string;
  href: string;
};

const INDUSTRIES: Industry[] = [
  {
    id: "maler",
    name: "Maler",
    tier: "Premium-Tier",
    description:
      "Komplettes Maler-Branding mit Vorher/Nachher-Slider, Kostenrechner und Anfrage-Form.",
    href: "https://maler-teal.vercel.app",
  },
  {
    id: "elektriker",
    name: "Elektriker",
    tier: "Premium-Tier",
    description:
      "Elektriker-Demo mit 24h-Notdienst, Kostenrechner und Smarthome-Services.",
    href: "https://elektriker-030digital.vercel.app",
  },
  {
    id: "dachdecker",
    name: "Dachdecker",
    tier: "Premium-Tier",
    description:
      "Dachdecker-Demo mit Sturmschaden-Hotline, Foto-Upload und Vorher/Nachher-Galerie.",
    href: "https://dachdecker-demo.vercel.app",
  },
  {
    id: "schreiner",
    name: "Schreiner",
    tier: "Premium-Tier",
    description:
      "Schreiner-Demo mit Galerie, Materialien-Bibliothek und Architekt-Kollaboration.",
    href: "https://schreiner-demo.vercel.app",
  },
];

export default function Showcase() {
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
        delayChildren: reduce ? 0 : 0.15,
      },
    },
  };

  const cardItem: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const inViewProps = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: 0.2 },
  } as const;

  return (
    <section
      id="showcase"
      aria-label="Showcase — Branchen-Demos"
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
            02 / 07 · Showcase
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
          Vier Live-Demos. Klicke eine Branche an um die Demo anzusehen — alle
          echte Next.js-Sites, keine Mockups.
        </motion.p>

        {/* INDUSTRY CARDS */}
        <motion.ul
          {...inViewProps}
          variants={cardsContainer}
          className="
            mt-16 grid grid-cols-1 gap-5
            md:mt-20 md:grid-cols-2 md:gap-6
            lg:grid-cols-4 lg:gap-6
          "
        >
          {INDUSTRIES.map((ind) => (
            <motion.li key={ind.id} variants={cardItem} className="flex">
              <IndustryCard industry={ind} reduce={!!reduce} />
            </motion.li>
          ))}
        </motion.ul>

        {/* BOTTOM STATEMENT */}
        <motion.p
          {...inViewProps}
          variants={fadeUp(0.2)}
          className="
            mt-12 text-center
            font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted
            md:mt-16 md:text-xs
          "
        >
          Alle Demos sind echte Next.js-Sites — keine Photoshop-Mockups. Du
          kannst sie öffnen, scrollen, klicken, testen.
        </motion.p>
      </div>
    </section>
  );
}

type CardProps = {
  industry: Industry;
  reduce: boolean;
};

function IndustryCard({ industry, reduce }: CardProps) {
  const baseCardClass = `
    group relative flex h-full w-full flex-col gap-5
    rounded-3xl p-8
    transition-all duration-300 ease-out
    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent
  `;

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#fafaf7",
    border: "2px solid var(--color-accent)",
    boxShadow:
      "0 18px 48px -24px rgb(var(--color-accent-glow-rgb) / 0.55), 0 4px 14px -8px rgba(26,26,26,0.06)",
  };

  const hoverTransition = { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const };

  const hoverProps = {
    whileHover: reduce
      ? undefined
      : {
          y: -4,
          scale: 1.02,
          boxShadow:
            "0 28px 60px -22px rgb(var(--color-accent-glow-rgb) / 0.7), 0 8px 20px -10px rgba(26,26,26,0.08)",
        },
    transition: hoverTransition,
  };

  return (
    <motion.a
      href={industry.href}
      aria-label={`${industry.name}-Demo öffnen`}
      className={baseCardClass}
      style={cardStyle}
      {...hoverProps}
    >
      {/* STATUS BADGE */}
      <span
        className="
          inline-flex w-fit items-center gap-2
          rounded-full px-3 py-1
          font-mono text-[10px] uppercase tracking-[0.2em]
          md:text-xs
        "
        style={{
          backgroundColor: "var(--color-accent)",
          color: "#1a1a1a",
        }}
      >
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "#1a1a1a" }}
        />
        LIVE
      </span>

      {/* INDUSTRY NAME */}
      <h3 className="font-serif font-normal leading-[0.95] tracking-tight text-text-primary text-4xl md:text-5xl">
        {industry.name}
      </h3>

      {/* TIER */}
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-mono md:text-xs">
        {industry.tier}
      </span>

      {/* DESCRIPTION */}
      <p className="font-sans text-sm leading-relaxed text-text-secondary md:text-[15px]">
        {industry.description}
      </p>

      <div className="flex-1" />

      {/* CTA */}
      <span
        className="
          inline-flex min-h-[48px] w-full items-center justify-center gap-3
          rounded-full px-6 py-3
          font-mono text-xs uppercase tracking-[0.18em]
          transition-all duration-200
          md:text-sm
        "
        style={{
          backgroundColor: "var(--color-accent)",
          color: "#1a1a1a",
        }}
      >
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "#1a1a1a" }}
        />
        Demo öffnen
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
    </motion.a>
  );
}
