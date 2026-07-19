import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

// Resolve the canonical origin for absolute metadata URLs (OG/Twitter images).
// Priority: an explicit override (set NEXT_PUBLIC_SITE_URL when you add a custom
// domain) → Vercel's production domain (auto-injected) → the current deployment.
function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

const SITE_URL = resolveSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Ali Haider — AI & Full-Stack Developer",
  description:
    "Ali Haider builds RAG systems, AI agents, and full-stack web applications. Background in AI/ML engineering.",
  keywords: [
    "Ali Haider",
    "AI Developer",
    "Full-Stack Developer",
    "RAG",
    "AI Agents",
    "Machine Learning Engineer",
  ],
  authors: [{ name: "Ali Haider" }],
  openGraph: {
    title: "Ali Haider — AI & Full-Stack Developer",
    description:
      "I build RAG systems, AI agents, and full-stack web applications.",
    type: "website",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ali Haider — AI & Full-Stack Developer",
    description:
      "I build RAG systems, AI agents, and full-stack web applications.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-ink-900 text-bone antialiased">{children}</body>
    </html>
  );
}
