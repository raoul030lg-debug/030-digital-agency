import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "./components/LenisProvider";
import CustomCursor from "./components/CustomCursor";

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "030 Digital — Eine Website. Ein Festpreis. Kein Abo.",
  description:
    "Solo-Studio aus Berlin. Moderne Websites mit AI-gestützten Visuals und cinematischen Animationen. Handwerker-Websites in 5 Tagen. Festpreis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${fraunces.variable} ${jetbrainsMono.variable} ${inter.variable} antialiased`}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/backgrounds/01_window_outside.webp"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="/backgrounds/02_window_inside.webp"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="/backgrounds/03_studio_wide.webp"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="/backgrounds/04_workspace_closer.webp"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="/backgrounds/05_smartphone_macro.webp"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="/backgrounds/06_lime_plant_macro.webp"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="/backgrounds/07_screen_wireframe.webp"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="/backgrounds/08_berlin_skyline.webp"
          type="image/webp"
        />
      </head>
      <body className="min-h-screen bg-page text-text-primary font-sans">
        <CustomCursor />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
