import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

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
    "Solo-Studio aus Berlin. Moderne Websites mit AI-gestützten Visuals, 3D und Premium-Animation. Onepager in 48 h, Premium-Sites in 7 Tagen. Festpreis.",
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
      <body className="min-h-screen bg-page text-text-primary font-sans">
        {children}
      </body>
    </html>
  );
}
