import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PathPilot AI — AI Career Roadmap Generator for College Students",
  description:
    "Generate structured, milestone-driven technical learning paths with realistic study hour estimates, portfolio capstone projects, and interactive progress tracking.",
  keywords: [
    "career roadmap",
    "learning path",
    "college students",
    "software engineering roadmap",
    "AI learning path",
    "web developer roadmap",
    "pathpilot ai",
  ],
  authors: [{ name: "PathPilot AI Engineering Team" }],
  openGraph: {
    title: "PathPilot AI — AI Career Roadmap Generator",
    description:
      "Personalized, milestone-driven career roadmaps for students and developers.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#090d16" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
