"use client";

import React, { useEffect } from "react";
import { ServerCrash, RotateCcw, Home } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("CivicPulse Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-16 px-4 bg-slate-50/70 dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute left-1/2 -top-32 -translate-x-1/2 w-full max-w-[520px] h-[280px] bg-gradient-to-tr from-rose-400/15 via-amber-400/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-4">
        <div className="size-16 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/70 dark:border-rose-800/70 flex items-center justify-center">
          <ServerCrash className="size-8" aria-hidden="true" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
          Error 500 · System Interruption
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Something Went Wrong
        </h1>

        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          An unexpected service interruption occurred while rendering this view. You can retry immediately or return to the CivicPulse home portal.
        </p>

        {error?.digest && (
          <p className="text-[10px] font-mono text-muted bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg inline-block">
            Reference ID: {error.digest}
          </p>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5">
          <MagneticButton
            variant="primary"
            size="md"
            onClick={() => reset()}
            className="w-full sm:w-auto justify-center min-h-[44px] font-bold cursor-pointer"
          >
            <RotateCcw className="size-4 mr-1.5" aria-hidden="true" />
            <span>Try Again</span>
          </MagneticButton>
          <MagneticButton
            variant="outline"
            size="md"
            href="/"
            className="w-full sm:w-auto justify-center min-h-[44px] font-bold"
          >
            <Home className="size-4 mr-1.5" aria-hidden="true" />
            <span>Return Home</span>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
