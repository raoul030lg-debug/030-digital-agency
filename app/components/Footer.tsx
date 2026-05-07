"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const WHATSAPP_HREF =
  "https://wa.me/491700000000?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20030%20Digital.";
const MAIL_HREF = "mailto:hi@030.digital";

type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

const STUDIO_LINKS: LinkItem[] = [
  { label: "Prozess", href: "#prozess" },
  { label: "Showcase", href: "#showcase" },
  { label: "Preise", href: "#preise" },
  { label: "Über mich", href: "#about" },
];

const LEGAL_LINKS: LinkItem[] = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "AGB", href: "/agb" },
  { label: "BFSG-Erklärung", href: "/bfsg" },
];

const CONTACT_LINKS: LinkItem[] = [
  { label: "WhatsApp", href: WHATSAPP_HREF, external: true },
  { label: "hi@030.digital", href: MAIL_HREF, external: true },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: LinkItem[];
}) {
  return (
    <nav aria-label={title} className="flex flex-col gap-4">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-mono md:text-xs">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="
                inline-flex items-center
                font-sans text-sm text-text-body
                transition-colors duration-200
                hover:text-text-primary
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
                md:text-[15px]
              "
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const reduce = useReducedMotion();

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.6, ease: "easeOut" },
    },
  };

  return (
    <footer
      aria-label="Seitenfuß"
      className="
        relative w-full bg-transparent
        px-6 pb-10 pt-16 md:px-10 md:pb-12 md:pt-20
        lg:px-12 lg:pb-14 lg:pt-24
      "
      style={{ borderTop: "1px solid var(--color-border-divider)" }}
    >
      <div className="relative mx-auto w-full max-w-7xl">
        {/* MAIN GRID */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="
            grid grid-cols-1 gap-12
            sm:grid-cols-2
            lg:grid-cols-12 lg:gap-10
          "
        >
          {/* Brand */}
          <div className="flex flex-col lg:col-span-5">
            <a
              href="#top"
              className="
                font-serif text-4xl font-normal leading-none tracking-tight text-text-primary
                md:text-5xl
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent
              "
              aria-label="030 Digital — zur Startseite"
            >
              030.<span className="italic text-text-italic">Digital</span>
            </a>
            <p className="mt-5 max-w-sm font-sans text-sm leading-relaxed text-text-secondary md:text-[15px]">
              Solo-Studio für moderne Websites. Berlin, seit 2024.
            </p>

            {/* Status-Pill */}
            <span
              className="
                mt-6 inline-flex w-fit items-center gap-2 rounded-full
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
              Verfügbar · Mai 2026
            </span>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8 lg:col-span-7 lg:gap-10">
            <FooterColumn title="Studio" links={STUDIO_LINKS} />
            <FooterColumn title="Legal" links={LEGAL_LINKS} />
            <FooterColumn title="Kontakt" links={CONTACT_LINKS} />
          </div>
        </motion.div>

        {/* BOTTOM-BAR */}
        <div
          className="
            mt-16 flex flex-col items-start gap-3
            border-t pt-6
            md:mt-20 md:flex-row md:items-center md:justify-between md:gap-6
          "
          style={{ borderColor: "var(--color-border-divider)" }}
        >
          <p className="font-mono text-[11px] tracking-[0.1em] text-text-muted md:text-xs">
            © 2026 030 Digital · Berlin
          </p>
          <p className="font-mono text-[11px] tracking-[0.1em] text-text-muted md:text-xs">
            Built mit Next.js · Hosted EU · 0 Cookies
          </p>
        </div>
      </div>
    </footer>
  );
}
