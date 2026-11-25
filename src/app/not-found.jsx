import React from "react";
import Link from "next/link";
import { Compass, ArrowLeft, MapPin } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-16 px-4 bg-slate-50/70 dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute left-1/2 -top-32 -translate-x-1/2 w-full max-w-[520px] h-[280px] bg-gradient-to-tr from-teal-400/15 via-cyan-400/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-4">
        <div className="size-16 mx-auto rounded-2xl bg-teal-50 dark:bg-teal-950/70 text-[#0D9488] border border-teal-200/70 dark:border-teal-800/70 flex items-center justify-center">
          <Compass className="size-8" aria-hidden="true" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          Error 404 · Route Not Found
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          We Couldn&apos;t Locate That Page
        </h1>

        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          The municipal record, ticket link, or route you requested does not exist or may have been relocated.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5">
          <MagneticButton
            variant="primary"
            size="md"
            href="/"
            className="w-full sm:w-auto justify-center min-h-[44px] font-bold"
          >
            <ArrowLeft className="size-4 mr-1.5" aria-hidden="true" />
            <span>Back to Home</span>
          </MagneticButton>
          <MagneticButton
            variant="outline"
            size="md"
            href="/map"
            className="w-full sm:w-auto justify-center min-h-[44px] font-bold"
          >
            <MapPin className="size-4 mr-1.5" aria-hidden="true" />
            <span>Open City Map</span>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
