import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"]
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono"
});

export const metadata: Metadata = {
  title: "Ledger — AI Investment Research Agent",
  description:
    "A multi-agent AI system that researches a company and returns an INVEST / PASS decision with reasoning."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${inter.variable} ${jbmono.variable} font-body bg-base text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
