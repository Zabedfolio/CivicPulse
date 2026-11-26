import "./globals.css";
import { LayoutShell } from "@/components/layout/LayoutShell";

export const metadata = {
  title: "CivicPulse — Smarter Cities, Faster Fixes",
  description:
    "CivicPulse is a smart city infrastructure management platform enabling citizens and municipal authorities to report, triage, track, and resolve public works transparently.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100 antialiased"
      >
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
