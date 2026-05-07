# TODO vor Launch

Launch-Blocker, die nicht im Code-Review verschwinden dürfen.

- [ ] **WhatsApp-Nummer ersetzen** — Fake `+49 170 000 0000` ist in 9 `wa.me`-Links + Kontakt-Karte. Sobald 360dialog-Nummer (nach Gewerbeanmeldung) da ist, alle auf einmal ersetzen. Betroffene Stellen: `app/components/Hero.tsx`, `app/components/Process.tsx`, `app/components/Pricing.tsx`, `app/components/Contact.tsx`, `app/components/Footer.tsx`.
- [ ] **Social-Links** — Instagram + LinkedIn aktuell aus Footer entfernt. Entscheiden: echte Profile anlegen + Links rein, oder dauerhaft weglassen.
- [ ] **About: echtes Foto** — `app/components/About.tsx` zeigt RH-Initialen-Platzhalter mit Lime-Akzent. Ersetzen sobald Foto da ist.
- [ ] **Kontakt-Form: Submit-Endpoint** — `app/components/Contact.tsx` macht aktuell nur `console.info` + Demo-Erfolg. Echten Endpoint anschließen (Resend-API-Route, Formspree, oder eigener Mail-Provider).
- [ ] **Footer-Impressum prüfen** — `/impressum`, `/datenschutz`, `/agb`, `/bfsg` als Routen verlinkt. Inhalte für DE-Pflicht (TMG §5, DSGVO, BFSG ab Juni 2025) gegen-checken.
