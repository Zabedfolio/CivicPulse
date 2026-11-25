"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { MotionCard } from "@/components/ui/MotionCard";
import { ArrowLeft, User, Lock, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info"); // "info" | "security"

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/profile");
    }
  }, [session, isPending, router]);

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-muted">Loading profile settings...</p>
        </div>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 dark:bg-slate-950 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute left-1/2 -top-40 -translate-x-1/2 w-full max-w-[600px] h-[350px] bg-gradient-to-tr from-teal-400/15 via-cyan-400/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* Back navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-[#0D9488] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/80 text-[#0D9488] border border-teal-200 dark:border-teal-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified GovTech Account
          </span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Account &amp; Security Settings
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-muted">
            Manage your personal contact details, visual municipal avatar, and secure account credentials.
          </p>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border mb-8 pb-px">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all -mb-px",
              activeTab === "info"
                ? "border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400"
                : "border-transparent text-muted hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            <User className="w-4 h-4" />
            <span>Personal Information</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all -mb-px",
              activeTab === "security"
                ? "border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400"
                : "border-transparent text-muted hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            <Lock className="w-4 h-4" />
            <span>Password &amp; Security</span>
          </button>
        </div>

        {/* Main Settings Card */}
        <MotionCard className="p-6 sm:p-10 bg-white dark:bg-slate-900/90 shadow-xl border-border">
          {activeTab === "info" ? (
            <div>
              <div className="mb-6 pb-4 border-b border-border">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Personal Information
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Update your display name and emergency phone contact for municipal notifications.
                </p>
              </div>

              <ProfileForm user={user} />
            </div>
          ) : (
            <div>
              <div className="mb-6 pb-4 border-b border-border">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Password &amp; Security
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Change your password to keep your municipal permissions and citizen reports secure.
                </p>
              </div>

              <PasswordChangeForm />
            </div>
          )}
        </MotionCard>
      </div>
    </div>
  );
}
