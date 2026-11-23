"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Sparkles, LogIn } from "lucide-react";
import { IssueReportForm } from "@/components/issues/IssueReportForm";
import { useSession } from "@/lib/auth-client";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function NewIssuePage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-slate-950 relative overflow-hidden">
      {/* Ambient decorative gradient */}
      <div className="absolute left-1/2 -top-40 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-tr from-teal-400/15 via-emerald-400/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* Navigation / Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-[#0D9488] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0D9488]"></span>
            </span>
            <span className="text-[11px] font-mono font-medium text-muted">
              Live Dispatch Active
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-[#0D9488] border border-teal-200 dark:border-teal-800/80 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Citizen Public Works Dispatch
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Report Public Infrastructure Issue
          </h1>
          <p className="mt-2 text-sm text-muted max-w-2xl">
            Submit photographic evidence and geocoded coordinates directly to Chattogram City Corporation engineering units. Every report is audited and tracked with public resolution proofs.
          </p>
        </div>

        {/* Auth status notice if not logged in */}
        {!isPending && !user && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900 dark:text-amber-200">
                  Authentication Recommended
                </p>
                <p className="text-amber-700 dark:text-amber-300/80 mt-0.5">
                  Sign in before reporting to track ticket resolution status, receive SMS/email updates, and earn citizen verification badges.
                </p>
              </div>
            </div>
            <MagneticButton
              variant="secondary"
              size="sm"
              href="/login?redirect=/issues/new"
              className="text-xs shrink-0 self-start sm:self-auto bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 border-none"
            >
              <LogIn className="w-3.5 h-3.5 mr-1" />
              Sign In First
            </MagneticButton>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-xl shadow-slate-900/5">
          <IssueReportForm />
        </div>
      </div>
    </div>
  );
}
