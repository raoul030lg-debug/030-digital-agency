"use client";

import { useId, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Plus } from "lucide-react";

const HEADLINE: { word: string; italic: boolean }[] = [
  { word: "Was", italic: false },
  { word: "du", italic: false },
  { word: "wissen", italic: true },
  { word: "solltest.", italic: true },
];

type FaqItem = {
  q: string;
  a: string;
};

const ITEMS: FaqItem[] = [
  {
    q: "Was kostet das wirklich?",
    a: "Genau das, was im Pricing steht — 499 € BASIC oder 1.499 € PREMIUM einmalig. Logo und Google Business optional zubuchbar. Keine Setup-Gebühr, kein Stundensatz, keine Nachforderungen.",
  },
  {
    q: "Wie schnell ist die Site online?",
    a: "BASIC 48 Stunden ab Erhalt aller Inhalte. PREMIUM 7 Tage ab Briefing-Call. Verzögerungen entstehen meistens durch fehlende Inhalte deinerseits — nicht durch mich.",
  },
  {
    q: "Was kommt nach dem ersten Jahr?",
    a: "Das erste Jahr Wartung ist enthalten. Was danach kommt, klären wir 1:1 auf WhatsApp — fair und ohne Vertragsbindung. Du kannst immer aussteigen.",
  },
  {
    q: "Brauche ich Domain & Hosting separat?",
    a: "Nein. Domain und Hosting sind im ersten Jahr inklusive. Beides läuft auf deinen Namen — gehört dir, nicht mir.",
  },
  {
    q: "Was, wenn ich später was ändern will?",
    a: "Im ersten Jahr sind kleine Inhaltsänderungen kostenlos. Größere Ergänzungen (neue Sektionen, neue Seiten) als Festpreis vorab.",
  },
  {
    q: "Kann ich die Site behalten, wenn ich kündige?",
    a: "Ja, immer. Quellcode liegt auf GitHub, Domain gehört dir, Inhalte sind exportierbar. Du bist nie an mich gebunden.",
  },
  {
    q: "Warum kein WordPress?",
    a: "WordPress ist langsam, wartungsintensiv und sicherheitsanfällig. Modernes Stack (Next.js + Vercel) ist schneller, sicherer und in 5 Jahren noch lauffähig.",
  },
];

export default function FAQ() {
  const reduce = useReducedMotion();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const baseId = useId();

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

  const inViewProps = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: 0.2 },
  } as const;

  const panelTransition = {
    duration: reduce ? 0 : 0.32,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <section
      id="faq"
      aria-label="Häufige Fragen"
      className="
        relative w-full bg-page
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
            06 / 06 · FAQ
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

        {/* ACCORDION CONTAINER */}
        <motion.div
          {...inViewProps}
          variants={fadeUp(0.15)}
          className="
            mt-16 overflow-hidden rounded-2xl border bg-surface
            md:mt-20
          "
          style={{ borderColor: "var(--color-border-subtle)" }}
        >
          <ul role="list" className="flex flex-col">
            {ITEMS.map((item, idx) => {
              const isOpen = openIdx === idx;
              const buttonId = `${baseId}-faq-button-${idx}`;
              const panelId = `${baseId}-faq-panel-${idx}`;
              return (
                <li
                  key={item.q}
                  className={
                    idx === 0
                      ? ""
                      : "border-t"
                  }
                  style={
                    idx === 0
                      ? undefined
                      : { borderColor: "var(--color-border-divider)" }
                  }
                >
                  <h3 className="m-0">
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() =>
                        setOpenIdx((current) => (current === idx ? null : idx))
                      }
                      className="
                        group flex w-full items-center justify-between gap-6
                        px-6 py-6 text-left transition-colors duration-200
                        hover:bg-page/40
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent
                        md:px-8 md:py-7
                      "
                    >
                      <span
                        className="
                          font-sans text-base font-medium leading-snug text-text-primary
                          md:text-lg
                        "
                      >
                        {item.q}
                      </span>
                      <motion.span
                        aria-hidden="true"
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={panelTransition}
                        className="
                          flex h-9 w-9 shrink-0 items-center justify-center
                          rounded-full border
                          md:h-10 md:w-10
                        "
                        style={{
                          borderColor: "var(--color-border-medium)",
                        }}
                      >
                        <Plus
                          className="h-4 w-4 md:h-[18px] md:w-[18px]"
                          strokeWidth={1.5}
                        />
                      </motion.span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="panel"
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={panelTransition}
                        className="overflow-hidden"
                      >
                        <p
                          className="
                            px-6 pb-7 pt-0 max-w-3xl
                            font-sans text-sm leading-relaxed text-text-secondary
                            md:px-8 md:pb-8 md:text-[15px]
                          "
                        >
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
