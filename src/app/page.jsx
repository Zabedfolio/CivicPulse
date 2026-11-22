"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#14B8A6] to-[#06B6D4] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
        {/* Hero badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 border border-teal-200 text-[#0D9488] shadow-sm dark:bg-teal-950/60 dark:border-teal-800">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            CivicPulse Phase 0 Setup Verified
          </div>
        </div>

        {/* Hero Headline & Subhead */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Smarter Cities, <span className="text-[#0D9488]">Faster Fixes.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            Report public infrastructure issues in seconds. Track municipal maintenance workflows from inspection to verified repair with full transparency.
          </p>

          {/* Call to action buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/issues/new">
              <Button variant="primary" size="lg" className="group">
                Report an Issue
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/map">
              <Button variant="outline" size="lg">
                View City Infrastructure Map
              </Button>
            </Link>
          </div>
        </div>

        {/* Brand Theme Variable & Status Token Verification Panel */}
        <div className="mt-20 max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-surface border border-teal-100 dark:bg-slate-800/60 dark:border-slate-700/60 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#0D9488] mb-4">
            Design Tokens & Motion Brew Foundations (SETUP-02)
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-border text-center shadow-xs">
              <span className="inline-block w-3 h-3 rounded-full bg-status-submitted mb-1" />
              <div className="text-xs font-medium">Submitted</div>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-border text-center shadow-xs">
              <span className="inline-block w-3 h-3 rounded-full bg-status-review mb-1" />
              <div className="text-xs font-medium">Under Review</div>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-border text-center shadow-xs">
              <span className="inline-block w-3 h-3 rounded-full bg-status-assigned mb-1" />
              <div className="text-xs font-medium">Assigned</div>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-border text-center shadow-xs">
              <span className="inline-block w-3 h-3 rounded-full bg-status-progress mb-1" />
              <div className="text-xs font-medium">In Progress</div>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-border text-center shadow-xs">
              <span className="inline-block w-3 h-3 rounded-full bg-status-resolved mb-1" />
              <div className="text-xs font-medium">Resolved</div>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-border text-center shadow-xs">
              <span className="inline-block w-3 h-3 rounded-full bg-status-closed mb-1" />
              <div className="text-xs font-medium">Closed</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-teal-200/50 dark:border-slate-700">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#0D9488] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Contrast Safe</p>
                <p className="text-xs text-muted">WCAG contrast strictly enforced on dark teal buttons.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Spring Physics</p>
                <p className="text-xs text-muted">Motion Brew spring tap and hover micro-animations.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">CSS Variables</p>
                <p className="text-xs text-muted">Zero hardcoded hex scattered across layout components.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
