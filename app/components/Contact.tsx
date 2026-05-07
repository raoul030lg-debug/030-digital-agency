"use client";

import { useState, type FormEvent } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Clock, Globe, Mail, MapPin, MessageCircle } from "lucide-react";

const WHATSAPP_HREF =
  "https://wa.me/491700000000?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20030%20Digital.";
const WHATSAPP_DISPLAY = "+49 170 000 0000";

const HEADLINE: { word: string; italic: boolean }[] = [
  { word: "Schreib", italic: false },
  { word: "mir.", italic: false },
  { word: "Direkt.", italic: true },
];

type InfoCard = {
  label: string;
  value: string;
  href?: string;
  icon: typeof Mail;
};

const INFO_CARDS: InfoCard[] = [
  {
    label: "E-Mail",
    value: "hi@030.digital",
    href: "mailto:hi@030.digital",
    icon: Mail,
  },
  { label: "Standort", value: "Berlin, DE", icon: MapPin },
  { label: "Sprachen", value: "DE · EN", icon: Globe },
  { label: "Verfügbar", value: "Mai 2026", icon: Clock },
];

type SubmitStatus = "idle" | "submitting" | "success";

export default function Contact() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<SubmitStatus>("idle");

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

  const fieldsContainer: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.08,
        delayChildren: reduce ? 0 : 0.2,
      },
    },
  };

  const fieldItem: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.5, ease: "easeOut" },
    },
  };

  const inViewProps = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: 0.2 },
  } as const;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("submitting");

    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.info("[Contact] Demo-Submit (kein Backend angebunden):", data);
    }

    await new Promise((resolve) =>
      window.setTimeout(resolve, reduce ? 0 : 600)
    );

    form.reset();
    setStatus("success");
  }

  const inputClass =
    "block w-full rounded-xl border bg-transparent px-4 py-3 " +
    "font-sans text-base text-text-primary placeholder:text-text-muted " +
    "transition-colors duration-200 " +
    "hover:bg-black/[0.02] " +
    "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-accent " +
    "md:text-[15px]";

  return (
    <section
      id="kontakt"
      aria-label="Kontakt"
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
            06 / 07 · Kontakt
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
          WhatsApp ist der schnellste Weg. Voicenotes erlaubt. Antwort meistens
          innerhalb 1–2 Stunden — Alex (mein AI-Agent) filtert vor und leitet
          dich direkt weiter.
        </motion.p>

        {/* MAIN GRID */}
        <div
          className="
            mt-16 grid grid-cols-1 gap-12
            md:mt-20
            lg:grid-cols-12 lg:gap-16
          "
        >
          {/* LEFT — WhatsApp + Info Cards */}
          <motion.div
            {...inViewProps}
            variants={fadeUp(0.15)}
            className="flex flex-col gap-8 lg:col-span-7"
          >
            <motion.a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Auf WhatsApp schreiben — ${WHATSAPP_DISPLAY}`}
              whileHover={
                reduce ? undefined : { scale: 1.015 }
              }
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="
                group relative inline-flex items-center justify-between gap-4
                rounded-full px-7 py-5
                transition-all duration-200
                hover:gap-5
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent
                md:px-8 md:py-6
              "
              style={{
                backgroundColor: "var(--color-accent-dark)",
                color: "var(--color-accent)",
                boxShadow: reduce
                  ? "none"
                  : "0 0 0 0 rgba(212, 255, 79, 0)",
              }}
            >
              <span className="flex items-center gap-3">
                <MessageCircle
                  className="h-5 w-5 md:h-6 md:w-6"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-mono opacity-90 md:text-xs">
                    WhatsApp · Voicenotes ok
                  </span>
                  <span className="font-mono text-base tracking-[0.06em] md:text-lg">
                    {WHATSAPP_DISPLAY}
                  </span>
                </span>
              </span>
              <span
                aria-hidden="true"
                className="font-mono text-base transition-transform duration-200 group-hover:translate-x-0.5 md:text-lg"
              >
                →
              </span>
            </motion.a>

            <ul
              role="list"
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
            >
              {INFO_CARDS.map((card) => {
                const Icon = card.icon;
                const inner = (
                  <>
                    <div className="flex items-center gap-2">
                      <Icon
                        className="h-3.5 w-3.5 text-text-mono"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-mono md:text-[11px]">
                        {card.label}
                      </span>
                    </div>
                    <span className="mt-3 font-serif text-2xl leading-tight tracking-tight text-text-primary md:text-[1.625rem]">
                      {card.value}
                    </span>
                  </>
                );

                return (
                  <li key={card.label}>
                    {card.href ? (
                      <a
                        href={card.href}
                        className="
                          flex h-full flex-col rounded-2xl
                          border bg-surface p-5
                          transition-colors duration-200
                          hover:bg-surface-elevated
                          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
                          md:p-6
                        "
                        style={{ borderColor: "var(--color-border-subtle)" }}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div
                        className="
                          flex h-full flex-col rounded-2xl
                          border bg-surface p-5
                          md:p-6
                        "
                        style={{ borderColor: "var(--color-border-subtle)" }}
                      >
                        {inner}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* RIGHT — Form */}
          <motion.div
            {...inViewProps}
            variants={fadeUp(0.25)}
            className="flex flex-col lg:col-span-5"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-mono md:text-xs">
              Oder klassisch
            </span>

            <motion.form
              {...inViewProps}
              variants={fieldsContainer}
              onSubmit={handleSubmit}
              noValidate={false}
              aria-busy={status === "submitting"}
              className="mt-5 flex flex-col gap-5"
            >
              <motion.div variants={fieldItem} className="flex flex-col gap-2">
                <label
                  htmlFor="contact-name"
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-mono"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Vorname"
                  className={inputClass}
                  style={{ borderColor: "var(--color-border-medium)" }}
                />
              </motion.div>

              <motion.div variants={fieldItem} className="flex flex-col gap-2">
                <label
                  htmlFor="contact-email"
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-mono"
                >
                  E-Mail
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="du@example.com"
                  className={inputClass}
                  style={{ borderColor: "var(--color-border-medium)" }}
                />
              </motion.div>

              <motion.div variants={fieldItem} className="flex flex-col gap-2">
                <label
                  htmlFor="contact-message"
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-mono"
                >
                  Was brauchst du?
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Branche, Wunsch-Lieferzeit, Handwerker-Website oder Premium-Warteliste?"
                  className={`${inputClass} resize-y min-h-[140px]`}
                  style={{ borderColor: "var(--color-border-medium)" }}
                />
              </motion.div>

              <motion.div
                variants={fieldItem}
                className="mt-2 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="
                    group inline-flex min-h-[52px] items-center justify-center gap-3
                    rounded-full px-7 py-3
                    font-mono text-xs uppercase tracking-[0.18em]
                    transition-all duration-200
                    hover:gap-4
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent
                    disabled:cursor-progress disabled:opacity-70
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
                  {status === "submitting" ? "Senden …" : "Anfrage senden"}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </button>

                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-mono md:text-[11px]">
                  DSGVO-konform · 0 Tracking · 0 Newsletter
                </span>
              </motion.div>

              {/* Live region for status announcements */}
              <span aria-live="polite" className="sr-only">
                {status === "submitting"
                  ? "Anfrage wird gesendet"
                  : status === "success"
                    ? "Anfrage erfolgreich gesendet"
                    : ""}
              </span>

              <AnimatePresence initial={false}>
                {status === "success" && (
                  <motion.p
                    key="success"
                    initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduce ? 0 : -4 }}
                    transition={{ duration: reduce ? 0 : 0.4, ease: "easeOut" }}
                    role="status"
                    className="
                      rounded-xl border p-4
                      font-sans text-sm leading-relaxed text-text-primary
                      md:text-[15px]
                    "
                    style={{
                      borderColor: "var(--color-border-medium)",
                      backgroundColor: "var(--color-surface)",
                    }}
                  >
                    Danke — Demo-Anfrage erfasst. Für eine echte Antwort
                    schreib mir kurz auf WhatsApp.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
