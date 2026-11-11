import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Ledger AI — Investment Research Agent",
  description:
    "Multi-agent AI system that researches any company and returns an INVEST / PASS decision with deep analysis.",
  keywords: "AI investment research, stock analysis, financial AI, LangChain, multi-agent",
  openGraph: {
    title: "Ledger AI — Investment Research Agent",
    description: "AI-powered investment research for public markets.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&amp;display=swap" rel="stylesheet"/>
      </head>
      <body
        className={`${inter.variable} ${jbmono.variable} font-body bg-base text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
