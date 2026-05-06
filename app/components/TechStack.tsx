"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const HEADLINE: { word: string; italic: boolean }[] = [
  { word: "Modernes", italic: false },
  { word: "Stack.", italic: true },
  { word: "Kein", italic: false },
  { word: "WordPress.", italic: true },
];

type Tool = {
  name: string;
  category: string;
  description: string;
};

const TOOLS: Tool[] = [
  {
    name: "Next.js 16",
    category: "Framework",
    description: "Server-Components, blitzschnell, SEO-ready.",
  },
  {
    name: "Tailwind v4",
    category: "Styling",
    description: "Konsistente Design-Tokens, kein CSS-Wildwuchs.",
  },
  {
    name: "Framer Motion",
    category: "Animation",
    description: "Präzise UI-Animationen statt Parallax-Slop.",
  },
  {
    name: "Three.js / R3F",
    category: "3D / WebGL",
    description: "Echtes 3D im Browser. Dein USP.",
  },
  {
    name: "Vercel",
    category: "Hosting",
    description: "Globales CDN, automatische SSL, Preview-URLs.",
  },
  {
    name: "Plausible",
    category: "Analytics",
    description: "DSGVO-konform, ohne Cookie-Banner-Hölle.",
  },
];

const INCLUDED: string[] = [
  "Mobile-optimiert · Lighthouse 95+",
  "WCAG AA / BFSG-konform",
  "DSGVO + EU-gehostet",
  "Eigene Domain & E-Mail",
  "SEO-Grundsetup + Sitemap",
  "Quellcode auf GitHub gehört dir",
];

const EXCLUDED: string[] = [
  "WordPress + 14 Plugins",
  "Wix-Templates",
  "SELLWERK-Verträge",
  "Page-Builder-Slop",
  "Stock-Foto-Karussells",
  "Glassmorphism (2021 called)",
];

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="mt-[3px] h-4 w-4 flex-none"
      fill="none"
    >
      <circle cx="8" cy="8" r="8" fill="var(--color-accent)" />
      <path
        d="M4.5 8.2 6.8 10.5 11.5 5.8"
        stroke="#1a1a1a"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="mt-[3px] h-4 w-4 flex-none"
      fill="none"
    >
      <circle
        cx="8"
        cy="8"
        r="7.4"
        stroke="var(--color-border-medium)"
        strokeWidth="1.2"
      />
      <path
        d="m5.5 5.5 5 5M10.5 5.5l-5 5"
        stroke="var(--color-text-muted)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function TechStack() {
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
        staggerChildren: reduce ? 0 : 0.07,
        delayChildren: reduce ? 0 : 0.15,
      },
    },
  };

  const cardItem: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const listItemVariant: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : -6 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: reduce ? 0 : 0.4, ease: "easeOut" },
    },
  };

  const listContainer: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.05,
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
      id="tech-stack"
      aria-label="Tech Stack"
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
            04 / 06 · Was du bekommst
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
          Unter der Haube läuft das, was Linear, Vercel und Framer selbst
          einsetzen — nicht das, was 2014 mal Standard war.
        </motion.p>

        {/* TECH CARDS */}
        <motion.ul
          {...inViewProps}
          variants={cardsContainer}
          className="
            mt-16 grid grid-cols-1 gap-4
            md:mt-20 md:grid-cols-2 md:gap-5
            lg:grid-cols-3 lg:gap-5
          "
        >
          {TOOLS.map((tool) => (
            <motion.li
              key={tool.name}
              variants={cardItem}
              className="
                group relative flex flex-col rounded-2xl
                bg-surface p-7 md:p-8
                transition-colors duration-200
              "
              style={{ border: "1px solid var(--color-border-subtle)" }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-mono md:text-xs">
                {tool.category}
              </span>
              <h3 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-text-primary md:text-4xl">
                {tool.name}
              </h3>
              <p className="mt-4 font-sans text-sm leading-relaxed text-text-secondary md:text-[15px]">
                {tool.description}
              </p>
            </motion.li>
          ))}
        </motion.ul>

        {/* TWO LISTS */}
        <div
          className="
            mt-16 grid grid-cols-1 gap-10
            md:mt-20 md:grid-cols-2 md:gap-12
            lg:gap-16
          "
        >
          {/* INCLUDED */}
          <motion.div
            {...inViewProps}
            variants={listContainer}
            className="flex flex-col gap-5"
          >
            <motion.span
              variants={listItemVariant}
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-mono md:text-xs"
            >
              Inklusive
            </motion.span>
            <ul className="flex flex-col gap-3">
              {INCLUDED.map((item) => (
                <motion.li
                  key={item}
                  variants={listItemVariant}
                  className="flex items-start gap-3 font-sans text-[15px] leading-relaxed text-text-body"
                >
                  <CheckIcon />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* EXCLUDED */}
          <motion.div
            {...inViewProps}
            variants={listContainer}
            className="flex flex-col gap-5"
          >
            <motion.span
              variants={listItemVariant}
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-mono md:text-xs"
            >
              Was du nicht bekommst
            </motion.span>
            <ul className="flex flex-col gap-3">
              {EXCLUDED.map((item) => (
                <motion.li
                  key={item}
                  variants={listItemVariant}
                  className="flex items-start gap-3 font-sans text-[15px] leading-relaxed text-text-muted line-through decoration-1"
                >
                  <CrossIcon />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
