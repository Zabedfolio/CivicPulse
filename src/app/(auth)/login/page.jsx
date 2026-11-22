"use client";

import React from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-gradient-to-tr from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl opacity-70 pointer-events-none" />
      </div>

      <div className="w-full max-w-[400px] flex flex-col items-center">
        <div className="w-full flex justify-start mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-[#0D9488] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>

        <AuthCard defaultMode="signin" />
      </div>
    </div>
  );
}
