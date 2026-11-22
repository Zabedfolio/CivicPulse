import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

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
        <footer className="border-t border-border bg-surface py-6 text-center text-xs text-muted dark:bg-slate-950 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4">
            <p>© {new Date().getFullYear()} CivicPulse. Smarter Cities, Faster Fixes. GovTech Infrastructure Platform.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
