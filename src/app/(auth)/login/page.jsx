"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/forms/LoginForm";
import { ShieldCheck, MapPin, CheckCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md md:max-w-4xl">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-border dark:border-slate-800 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left Hero Graphic Section */}
          <div className="bg-gradient-to-br from-[#14B8A6] via-[#0D9488] to-[#042F2E] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-cyan-400/10 blur-2xl pointer-events-none" />

            <div>
              <Link href="/" className="inline-flex items-center gap-2 group mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/10 p-1 backdrop-blur border border-white/20 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="CivicPulse Logo"
                    width={36}
                    height={36}
                    className="w-8 h-8 object-contain rounded-lg"
                    priority
                  />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">CivicPulse</span>
              </Link>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
                Smarter Cities, Faster Fixes.
              </h2>
              <p className="text-sm text-teal-100 leading-relaxed">
                Log in to access your civic dashboard, submit infrastructure reports, and monitor repair progress in real time.
              </p>
            </div>

            <div className="mt-8 space-y-4 text-xs text-teal-50">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                <span>GovTech certified municipal data protection</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-teal-200 shrink-0" />
                <span>Live GPS geocoding & 50m proximity deduplication</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-teal-200 shrink-0" />
                <span>Verified photo resolution proof on completed tasks</span>
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <div className="mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-[#0D9488] mb-4 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Home
              </Link>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Sign in to your account
              </h1>
              <p className="text-xs text-muted mt-1">
                Enter your registered credentials to access your portal.
              </p>
            </div>

            <Suspense fallback={<div className="text-center py-6 text-sm text-muted">Loading login form...</div>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
