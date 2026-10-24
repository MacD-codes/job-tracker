import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobTrackr — AI-Powered Job Application Tracker & Fraud Detector",
  description:
    "Automatically parse your job email inbox, detect recruitment scams, track applications on a Kanban board, schedule follow-ups, and generate AI interview prep — all in one place.",
  keywords:
    "job tracker, application tracker, fraud detection, job search, interview prep, kanban board",
  openGraph: {
    title: "JobTrackr — AI Job Application Tracker",
    description:
      "Parse your job emails, detect scams, track applications, and prep for interviews.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-surface-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
