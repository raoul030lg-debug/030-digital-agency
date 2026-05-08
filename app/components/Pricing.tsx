"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import MagnetButton from "./MagnetButton";

const WHATSAPP_HANDWERKER =
  "https://wa.me/491700000000?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20die%20Handwerker-Website.";
const WHATSAPP_LAUNCH =
  "https://wa.me/491700000000?text=Hallo%2C%20ich%20m%C3%B6chte%20einen%20Platz%20der%20Gr%C3%BCndungs-Aktion%20%28690%E2%82%AC%29.";

// Manuell anpassbar — wird im Counter angezeigt
const LAUNCH_OFFER = {
  active: true,
  totalSlots: 10,
  remainingSlots: 4,
};

const HEADLINE: { word: string; italic: boolean }[] = [
  { word: "Festpreis.", italic: false },
  { word: "Vor", italic: true },
  { word: "Projektstart.", italic: true },
];

const HANDWERKER_FEATURES: string[] = [
  "4–5 Seiten (Home, Leistungen, Referenzen, Über uns, Kontakt)",
  "Mobile optimiert für alle Geräte",
  "WhatsApp + Anruf-Button prominent",
  "Kontaktformular",
  "Google Business Profil Setup",
  "Lokale SEO-Basis (Schema, Meta-Tags, Sitemap)",
  "AI-generierte Hintergründe (Gemini)",
  "Cinematische Animationen (GSAP, Parallax)",
  "Hosting + Domain im 1. Jahr inklusive",
  "2 Korrekturrunden",
  "5 Tage Lieferzeit",
];

const PREMIUM_FEATURES: string[] = [
  "Custom Design (kein Template)",
  "Lokale Bezirks-Landingpages (Pankow, Wedding, etc.)",
  "Termin-Buchungssystem",
  "Erweiterte SEO",
  "Mehrsprachig",
  "Review-Integration",
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

function HourglassIcon() {
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
        d="M5.5 4.5h5M5.5 11.5h5M5.5 4.5c0 2 5 3 5 4s-5 1.5-5 3.5M10.5 4.5c0 2-5 3-5 4s5 1.5 5 3.5"
        stroke="var(--color-text-secondary)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/premium-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Etwas ist schiefgelaufen.");
      }
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Etwas ist schiefgelaufen.");
    }
  }

  if (status === "success") {
    return (
      <div
        className="
          flex items-start gap-3
          rounded-2xl bg-surface px-5 py-4
        "
        style={{ border: "1px solid var(--color-border-subtle)" }}
      >
        <CheckIcon />
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[15px] leading-snug text-text-primary">
            Du stehst auf der Warteliste.
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-mono">
            Wir melden uns beim Launch.
          </span>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
      noValidate
    >
      <label htmlFor="waitlist-email" className="sr-only">
        E-Mail-Adresse für die Premium-Warteliste
      </label>
      <input
        id="waitlist-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="deine@email.de"
        autoComplete="email"
        disabled={status === "loading"}
        className="
          min-h-[52px] flex-1 rounded-full bg-surface px-5
          font-sans text-[15px] text-text-primary
          placeholder:text-text-muted
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
          disabled:opacity-60
        "
        style={{ border: "1px solid var(--color-border-medium)" }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="
          inline-flex min-h-[52px] items-center justify-center gap-3
          rounded-full px-7
          font-mono text-xs uppercase tracking-[0.18em]
          transition-all duration-200
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent
          disabled:cursor-not-allowed disabled:opacity-60
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
        {status === "loading" ? "Wird gesendet…" : "Auf Warteliste"}
      </button>
      {status === "error" && (
        <p
          role="alert"
          className="font-mono text-[11px] uppercase tracking-[0.18em] sm:basis-full"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {errorMsg || "Bitte erneut versuchen."}
        </p>
      )}
    </form>
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

  const featureItem: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : -8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: reduce ? 0 : 0.4, ease: "easeOut" },
    },
  };

  const featureContainer: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.04,
        delayChildren: reduce ? 0 : 0.2,
      },
    },
  };

  const inViewProps = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: 0.2 },
  } as const;

  const slotsLeft = LAUNCH_OFFER.remainingSlots;
  const slotsTotal = LAUNCH_OFFER.totalSlots;

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
          All-inclusive. Keine Stundensätze, keine Überraschungen, kein
          Aufgepreise. Du weißt vorher, was du zahlst.
        </motion.p>

        {/* LAUNCH-AKTION BANNER */}
        {LAUNCH_OFFER.active && (
          <motion.div
            {...inViewProps}
            variants={fadeUp(0.15)}
            className="
              relative mt-14 overflow-hidden rounded-3xl
              p-7 md:p-9
            "
            style={{
              backgroundColor: "var(--color-accent-dark)",
              border: "2px solid var(--color-accent)",
              boxShadow:
                "0 30px 70px -28px rgba(212, 255, 79, 0.55), 0 8px 22px -10px rgba(26, 26, 26, 0.25)",
            }}
          >
            <div className="flex flex-col gap-7 md:flex-row md:items-center md:gap-10">
              <div className="flex flex-col gap-3 md:flex-1">
                <span
                  className="
                    inline-flex w-fit items-center gap-2 rounded-full
                    px-3 py-1
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
                  Gründungs-Aktion · Erste 10 Kunden
                </span>

                <h3
                  className="
                    font-serif text-3xl leading-tight tracking-tight
                    md:text-4xl lg:text-5xl
                  "
                  style={{ color: "var(--color-page)" }}
                >
                  690 €{" "}
                  <span
                    className="font-sans text-xl line-through opacity-60 md:text-2xl"
                    style={{ color: "var(--color-page)" }}
                  >
                    statt 990 €
                  </span>
                </h3>

                <ul
                  className="mt-1 flex flex-col gap-1.5 font-sans text-sm leading-relaxed md:text-[15px]"
                  style={{ color: "var(--color-page)" }}
                >
                  <li className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    />
                    300 € Rabatt auf die Handwerker-Website
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    />
                    1 Jahr Wartung gratis
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    />
                    Logo gratis (Wert 149 €)
                  </li>
                </ul>

                <p
                  className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] md:text-xs"
                  style={{ color: "var(--color-accent)" }}
                >
                  Gesamtersparnis ca. 800 €
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 md:items-end">
                <div
                  className="
                    rounded-2xl px-5 py-4
                    font-mono text-[11px] uppercase tracking-[0.2em]
                    md:text-xs
                  "
                  style={{
                    backgroundColor: "rgba(212,255,79,0.08)",
                    border: "1px solid rgba(212,255,79,0.35)",
                    color: "var(--color-accent)",
                  }}
                >
                  <span className="block text-[10px] opacity-80">
                    Verfügbar
                  </span>
                  <span
                    className="mt-1 block font-serif text-3xl normal-case tracking-tight md:text-4xl"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {slotsLeft}
                    <span
                      className="ml-1 font-mono text-base opacity-70"
                      style={{ color: "var(--color-page)" }}
                    >
                      / {slotsTotal}
                    </span>
                  </span>
                  <span className="mt-1 block text-[10px] opacity-80">
                    Plätze
                  </span>
                </div>

                <MagnetButton strength={0.25}>
                  <a
                    href={WHATSAPP_LAUNCH}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Gründungs-Aktion über WhatsApp anfragen"
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
                      backgroundColor: "var(--color-accent)",
                      color: "#1a1a1a",
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: "#1a1a1a" }}
                    />
                    Platz sichern
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </a>
                </MagnetButton>
              </div>
            </div>
          </motion.div>
        )}

        {/* PRICING CARDS */}
        <div
          className="
            mt-10 grid grid-cols-1 gap-5
            md:gap-6
            lg:grid-cols-2 lg:gap-6
          "
        >
          {/* HANDWERKER-WEBSITE CARD */}
          <motion.article
            {...inViewProps}
            variants={fadeUp(0.1)}
            className="
              relative flex flex-col rounded-3xl
              p-8 md:p-10
              lg:scale-[1.015]
            "
            style={{
              backgroundColor: "var(--color-page)",
              border: "2px solid var(--color-accent)",
              boxShadow:
                "0 24px 60px -28px rgba(212, 255, 79, 0.45), 0 6px 18px -8px rgba(26, 26, 26, 0.08)",
            }}
          >
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
              Buchbar
            </span>

            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-mono md:text-xs">
              Handwerker-Website
            </span>

            <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-serif text-6xl leading-none tracking-tight text-text-primary md:text-7xl">
                990 €
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-mono md:text-xs">
                all-inclusive · einmalig
              </span>
            </div>

            <p className="mt-4 font-sans text-sm leading-relaxed text-text-secondary md:text-[15px]">
              5 Tage Lieferzeit · 4–5 Seiten · mobile optimiert · Hosting im
              1. Jahr inklusive
            </p>

            <div
              className="my-7 h-px w-full"
              style={{ backgroundColor: "var(--color-border-divider)" }}
            />

            <motion.ul
              {...inViewProps}
              variants={featureContainer}
              className="flex flex-col gap-3"
            >
              {HANDWERKER_FEATURES.map((feature) => (
                <motion.li
                  key={feature}
                  variants={featureItem}
                  className="flex items-start gap-3 font-sans text-[15px] leading-relaxed text-text-body"
                >
                  <CheckIcon />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </motion.ul>

            <div className="mt-10 flex">
              <MagnetButton className="block w-full" strength={0.25}>
                <a
                  href={WHATSAPP_HANDWERKER}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Handwerker-Website über WhatsApp anfragen"
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
                  Auf WhatsApp anfragen →
                </a>
              </MagnetButton>
            </div>
          </motion.article>

          {/* PREMIUM CARD — Coming Soon */}
          <motion.article
            {...inViewProps}
            variants={fadeUp(0.18)}
            className="
              relative flex flex-col rounded-3xl
              p-8 md:p-10
            "
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <span
              className="
                absolute -top-3 left-8
                inline-flex items-center gap-2
                rounded-full px-3 py-1
                font-mono text-[10px] uppercase tracking-[0.18em] text-text-mono
                md:text-xs
              "
              style={{
                backgroundColor: "var(--color-page)",
                border: "1px solid var(--color-border-medium)",
              }}
            >
              <HourglassIcon />
              Coming Soon
            </span>

            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-mono md:text-xs">
              Premium
            </span>

            <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span
                className="font-serif text-5xl italic leading-none tracking-tight text-text-italic md:text-6xl"
              >
                Coming Soon
              </span>
            </div>

            <p className="mt-4 font-sans text-sm leading-relaxed text-text-secondary md:text-[15px]">
              Custom-Design + erweiterte Features. Trag dich auf die Warteliste
              ein und sei zuerst dran.
            </p>

            <div
              className="my-7 h-px w-full"
              style={{ backgroundColor: "var(--color-border-divider)" }}
            />

            <motion.ul
              {...inViewProps}
              variants={featureContainer}
              className="flex flex-col gap-3"
            >
              {PREMIUM_FEATURES.map((feature) => (
                <motion.li
                  key={feature}
                  variants={featureItem}
                  className="flex items-start gap-3 font-sans text-[15px] leading-relaxed text-text-body"
                >
                  <CheckIcon />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </motion.ul>

            <div className="mt-10">
              <WaitlistForm />
            </div>
          </motion.article>
        </div>

        {/* WARTUNG BLOCK — kein Preis (PAngV) */}
        <motion.div
          {...inViewProps}
          variants={fadeUp(0.1)}
          className="
            mt-6 flex flex-col gap-3 rounded-3xl
            bg-surface p-7 md:p-9
            md:flex-row md:items-center md:gap-8
          "
          style={{ border: "1px solid var(--color-border-subtle)" }}
        >
          <div className="flex flex-1 items-start gap-4 md:items-center">
            <CheckIcon />
            <div className="flex flex-col gap-1">
              <span className="font-serif text-2xl italic leading-tight tracking-tight text-text-primary md:text-3xl">
                Inkl. 1 Jahr Wartung gratis (Launch-Aktion)
              </span>
              <span className="font-sans text-sm leading-relaxed text-text-secondary md:text-[15px]">
                Updates · Backups · Security · kleine Inhaltsänderungen.
                Konditionen ab Jahr 2 klären wir per WhatsApp.
              </span>
            </div>
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
