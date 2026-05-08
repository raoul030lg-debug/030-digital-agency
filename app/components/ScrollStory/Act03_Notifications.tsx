"use client";

import { useInView } from "./useInView";

const NOTIFICATIONS = [
  { app: "NACHRICHT", time: "9:38", text: "Frau Schmidt: \u201EWann k\u00F6nnen Sie kommen?\u201C" },
  { app: "ANRUF", time: "9:23", text: "Verpasst: +49 30 12345678" },
  { app: "NACHRICHT", time: "8:51", text: "Hr. Weber: \u201EK\u00F6nnen Sie streichen?\u201C" },
];

export default function Act03Notifications() {
  const { ref, inView } = useInView(0.3);

  return (
    <section
      ref={ref}
      aria-label="Akt 3 — Du bekommst Anrufe"
      className="relative flex min-h-screen items-center px-6 py-20 md:px-12"
    >
      <span
        className="absolute left-6 top-12 font-mono text-[10px] tracking-[0.3em] md:left-12"
        style={{ color: "var(--color-accent)" }}
      >
        AKT 03 · DU BEKOMMST ANRUFE
      </span>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-20">
        <div
          className={`order-2 md:order-1 transition-all duration-1000 ease-out ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <div
            className="relative mx-auto h-[420px] w-64 overflow-hidden rounded-3xl bg-surface-1 p-4"
            style={{
              border:
                "1px solid color-mix(in srgb, var(--color-accent) 40%, transparent)",
            }}
          >
            <div className="mb-2 py-2 text-center font-mono text-[10px] text-text-muted">
              9:41 AM
            </div>

            {NOTIFICATIONS.map((notif, i) => (
              <div
                key={`${notif.app}-${notif.time}`}
                className={`mb-2 rounded-xl bg-surface-2 p-3 transition-all duration-700 ease-out ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: `${500 + i * 300}ms`,
                }}
              >
                <div
                  className="mb-1 font-mono text-[9px] tracking-wider"
                  style={{ color: "var(--color-accent)" }}
                >
                  {notif.app} · {notif.time}
                </div>
                <div className="text-xs leading-snug text-page">
                  {notif.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`order-1 md:order-2 transition-all delay-200 duration-1000 ease-out ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
          }`}
        >
          <h2 className="mb-6 font-serif text-4xl font-medium leading-tight text-page md:text-6xl">
            Deine neuen
            <br />
            Kunden{" "}
            <span style={{ color: "var(--color-accent)" }}>warten.</span>
          </h2>
          <p className="max-w-md text-base leading-relaxed text-text-muted md:text-lg">
            Direkt auf dein Handy. Kein E-Mail-Postfach. Kein Lead-Formular.
            Anruf und Nachricht, fertig.
          </p>
        </div>
      </div>
    </section>
  );
}
