import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "CivicPulse — Smarter Cities, Faster Fixes",
  description:
    "CivicPulse is a smart city infrastructure management platform enabling citizens and municipal authorities to report, triage, track, and resolve public works transparently.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
