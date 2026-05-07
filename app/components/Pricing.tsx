"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import MagnetButton from "./MagnetButton";

const WHATSAPP_BASIC =
  "https://wa.me/491700000000?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20das%20BASIC-Paket.";
const WHATSAPP_PREMIUM =
  "https://wa.me/491700000000?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20das%20PREMIUM-Paket.";
const WHATSAPP_WARTUNG =
  "https://wa.me/491700000000?text=Hallo%2C%20ich%20m%C3%B6chte%20Wartungs-Konditionen%20kl%C3%A4ren.";

const HEADLINE: { word: string; italic: boolean }[] = [
  { word: "Festpreise.", italic: false },
  { word: "Vor", italic: true },
  { word: "Projektstart.", italic: true },
];

type Feature = string;

type AddOn = {
  label: string;
  price: string;
};

type Tier = {
  name: string;
  price: string;
  priceNote: string;
  subtitle: string;
  features: Feature[];
  addons: AddOn[];
  cta: string;
  href: string;
  highlighted: boolean;
};

const TIERS: Tier[] = [
  {
    name: "BASIC",
    price: "499 €",
    priceNote: "einmalig · netto",
    subtitle: "Onepager · 1 Sprache · 48h ab Inhalten",
    features: [
      "Custom Design (kein Template)",
      "Bis zu 5 Sektionen",
      "Mobile-optimiert · WCAG AA",
      "Eigene Domain + SSL",
      "Eigene E-Mail-Adresse",
      "SEO-Grundsetup + Analytics",
    ],
    addons: [
      { label: "Logo (Wortmarke + Bildmarke)", price: "+149 €" },
      { label: "Google Business Eintrag", price: "+99 €" },
    ],
    cta: "BASIC anfragen →",
    href: WHATSAPP_BASIC,
    highlighted: false,
  },
  {
    name: "PREMIUM",
    price: "1.499 €",
    priceNote: "einmalig · netto",
    subtitle: "Multipage · AI-Visuals · 3D · 7 Tage ab Briefing",
    features: [
      "Alles aus BASIC",
      "AI-generierte Hintergründe (kuratiert)",
      "Bis zu 3 Custom-3D / WebGL-Elemente",
      "Premium-Animationen (Framer Motion)",
      "Bis zu 8 Sektionen / 4 Unterseiten",
      "Conversion-Tracking inkl.",
    ],
    addons: [
      { label: "Logo Premium (Branding-System)", price: "+299 €" },
      { label: "Google Business Premium", price: "+199 €" },
    ],
    cta: "Premium anfragen →",
    href: WHATSAPP_PREMIUM,
    highlighted: true,
  },
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

export default function Pricing() {
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
        staggerChildren: reduce ? 0 : 0.18,
        delayChildren: reduce ? 0 : 0.2,
      },
    },
  };

  const cardItem: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28, scale: reduce ? 1 : 0.985 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reduce ? 0 : 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const featureItem: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : -8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: reduce ? 0 : 0.4, ease: "easeOut" },
    },
  };

  const inViewProps = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: 0.2 },
  } as const;

  return (
    <section
      id="preise"
      aria-label="Preise"
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
            03 / 07 · Preise
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
          Keine Stundensätze, keine Überraschungen, kein Aufgepreise. Du weißt
          vorher, was du zahlst.
        </motion.p>

        {/* PRICING CARDS */}
        <motion.div
          {...inViewProps}
          variants={cardsContainer}
          className="
            mt-16 grid grid-cols-1 gap-5
            md:mt-20 md:gap-6
            lg:grid-cols-2 lg:gap-6
          "
        >
          {TIERS.map((tier) => (
            <motion.article
              key={tier.name}
              variants={cardItem}
              className={`
                relative flex flex-col rounded-3xl
                p-8 md:p-10
                ${tier.highlighted ? "lg:scale-[1.015]" : ""}
              `}
              style={{
                backgroundColor: tier.highlighted
                  ? "var(--color-page)"
                  : "var(--color-surface)",
                border: tier.highlighted
                  ? "2px solid var(--color-accent)"
                  : "1px solid var(--color-border-subtle)",
                boxShadow: tier.highlighted
                  ? "0 24px 60px -28px rgba(212, 255, 79, 0.45), 0 6px 18px -8px rgba(26, 26, 26, 0.08)"
                  : "none",
              }}
            >
              {/* EMPFOHLEN BADGE */}
              {tier.highlighted && (
                <span
                  className="
                    absolute -top-3 left-8
                    inline-flex items-center gap-2
                    rounded-full px-3 py-1
                    font-mono text-[10px] uppercase tracking-[0.18em]
                    md:text-xs
                  "
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "#1a1a1a",
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "#1a1a1a" }}
                  />
                  Empfohlen
                </span>
              )}

              {/* TIER LABEL */}
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-mono md:text-xs">
                {tier.name}
              </span>

              {/* PRICE */}
              <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-serif text-6xl leading-none tracking-tight text-text-primary md:text-7xl">
                  {tier.price}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-mono md:text-xs">
                  {tier.priceNote}
                </span>
              </div>

              {/* SUBTITLE */}
              <p className="mt-4 font-sans text-sm leading-relaxed text-text-secondary md:text-[15px]">
                {tier.subtitle}
              </p>

              {/* DIVIDER */}
              <div
                className="my-7 h-px w-full"
                style={{ backgroundColor: "var(--color-border-divider)" }}
              />

              {/* FEATURES */}
              <ul className="flex flex-col gap-3">
                {tier.features.map((feature) => (
                  <motion.li
                    key={feature}
                    variants={featureItem}
                    className="flex items-start gap-3 font-sans text-[15px] leading-relaxed text-text-body"
                  >
                    <CheckIcon />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* ADDONS */}
              <div className="mt-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-mono md:text-xs">
                  Zubuchbar
                </span>
                <ul className="mt-3 flex flex-col gap-2">
                  {tier.addons.map((addon) => (
                    <li
                      key={addon.label}
                      className="
                        flex items-center justify-between gap-4
                        font-sans text-sm text-text-secondary
                      "
                    >
                      <span>{addon.label}</span>
                      <span className="font-mono text-xs tracking-wider text-text-primary">
                        {addon.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="mt-10 flex">
                {tier.highlighted ? (
                  <MagnetButton className="block w-full" strength={0.25}>
                    <a
                      href={tier.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${tier.name} über WhatsApp anfragen`}
                      className="
                        group inline-flex min-h-[52px] w-full items-center justify-center gap-3
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
                      {tier.cta}
                    </a>
                  </MagnetButton>
                ) : (
                  <MagnetButton className="block w-full" strength={0.2}>
                    <a
                      href={tier.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${tier.name} über WhatsApp anfragen`}
                      className="
                        group inline-flex min-h-[52px] w-full items-center justify-center
                        rounded-full border px-7 py-3
                        font-mono text-xs uppercase tracking-[0.18em] text-text-primary
                        transition-colors duration-200
                        hover:bg-black/[0.04]
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent
                        md:text-sm
                      "
                      style={{ borderColor: "var(--color-border-medium)" }}
                    >
                      {tier.cta}
                    </a>
                  </MagnetButton>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* WARTUNG BLOCK */}
        <motion.div
          {...inViewProps}
          variants={fadeUp(0.1)}
          className="
            mt-6 flex flex-col gap-5 rounded-3xl
            bg-surface p-7 md:p-9
            md:flex-row md:items-center md:gap-8
          "
          style={{ border: "1px solid var(--color-border-subtle)" }}
        >
          <div className="flex flex-none items-start gap-4 md:items-center">
            <CheckIcon />
            <div className="flex flex-col gap-1">
              <span className="font-serif text-2xl italic leading-tight tracking-tight text-text-primary md:text-3xl">
                Wartung — 1 Jahr geschenkt
              </span>
              <span className="font-sans text-sm leading-relaxed text-text-secondary md:text-[15px]">
                Updates · Backups · Security · kleine Inhaltsänderungen
              </span>
            </div>
          </div>

          <div className="md:ml-auto">
            <a
              href={WHATSAPP_WARTUNG}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group inline-flex items-center gap-2
                font-mono text-[11px] uppercase tracking-[0.18em] text-text-mono
                transition-colors duration-200
                hover:text-text-primary
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent
                md:text-xs
              "
            >
              Konditionen ab Jahr 2 → WhatsApp
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </a>
          </div>
        </motion.div>

        {/* BOTTOM ROW */}
        <motion.p
          {...inViewProps}
          variants={fadeUp(0.15)}
          className="
            mt-10
            font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted
            md:text-xs
          "
        >
          Alle Preise zzgl. 19 % USt. Keine Setupgebühr. Kein Abo. Quellcode +
          Domain gehören dir.
        </motion.p>
      </div>
    </section>
  );
}
