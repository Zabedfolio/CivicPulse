"use client";

import React from "react";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  ShieldCheck,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Lock,
  Eye,
  FileCheck,
  ArrowRight,
  Building2,
} from "lucide-react";

const PILLARS = [
  {
    icon: MapPin,
    title: "Geospatial Precision",
    desc: "Every citizen report is pinned with 2dsphere coordinates across Chattogram's 41 municipal wards, enabling proximity duplicate detection and ward-level heat analysis.",
  },
  {
    icon: Clock,
    title: "Deterministic SLA Targets",
    desc: "Strict priority-based resolution timers (24h Critical, 48h High, 72h Medium, 120h Low) keep engineering divisions accountable from submission to sign-off.",
  },
  {
    icon: Users,
    title: "Role-Scoped Operations",
    desc: "Dedicated workspaces separate Citizen reporting, Field Technician dispatch, Department Triage, and City Commissioner oversight.",
  },
  {
    icon: FileCheck,
    title: "Immutable Audit & PDF Dossiers",
    desc: "Every status transition, task update, and photographic proof is logged chronologically and exportable as an official A4 municipal PDF report.",
  },
];

const SLA_MATRIX = [
  {
    tier: "Critical",
    window: "24 Hours",
    examples: "Live downed power lines, collapsed road culverts, major water main bursts",
    badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
  },
  {
    tier: "High",
    window: "48 Hours",
    examples: "Deep arterial potholes, flooded intersections, unlit highway junctions",
    badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  },
  {
    tier: "Medium",
    window: "72 Hours",
    examples: "Damaged footpath slabs, overflowing ward waste bins, broken streetlights",
    badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
  },
  {
    tier: "Low",
    window: "120 Hours",
    examples: "Faded street signage, park bench repairs, minor curb restoration",
    badge: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-slate-950 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute left-1/2 -top-40 -translate-x-1/2 w-full max-w-[700px] h-[350px] bg-gradient-to-tr from-teal-400/15 via-cyan-400/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/70 text-[#0D9488] border border-teal-200 dark:border-teal-800">
            <Building2 className="size-3.5" aria-hidden="true" />
            <span>Citizen Service Charter</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Transparent Civic Operations for{" "}
            <span className="text-[#0D9488]">Smarter Cities</span>
          </h1>

          <p className="text-sm sm:text-base text-muted leading-relaxed">
            CivicPulse connects citizens directly with Chattogram City Corporation engineering divisions—turning public infrastructure reports into tracked, verified, and auditable field repairs.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <MagneticButton
              variant="primary"
              size="md"
              href="/issues/new"
              className="w-full sm:w-auto justify-center min-h-[44px] font-bold"
            >
              <span>Report an Issue</span>
              <ArrowRight className="size-4 ml-1.5" aria-hidden="true" />
            </MagneticButton>
            <MagneticButton
              variant="outline"
              size="md"
              href="/map"
              className="w-full sm:w-auto justify-center min-h-[44px] font-bold"
            >
              <span>Explore Live City Map</span>
            </MagneticButton>
          </div>
        </section>

        {/* 4 Core Pillars */}
        <section aria-labelledby="pillars-heading" className="space-y-5">
          <h2 id="pillars-heading" className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white text-center">
            How CivicPulse Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {PILLARS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5"
                >
                  <div className="size-10 rounded-2xl bg-teal-50 dark:bg-teal-950/70 text-[#0D9488] flex items-center justify-center border border-teal-200/70 dark:border-teal-800/70">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Statutory SLA Targets */}
        <section aria-labelledby="sla-heading" className="p-5 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div>
            <h2 id="sla-heading" className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Statutory SLA Resolution Commitments
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Every verified incident is assigned a priority tier with automated turnaround monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {SLA_MATRIX.map((row) => (
              <div
                key={row.tier}
                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${row.badge}`}>
                    {row.tier}
                  </span>
                  <span className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">
                    {row.window}
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{row.examples}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Governance, Privacy & Accessibility */}
        <section aria-labelledby="governance-heading" className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <Lock className="size-5 text-[#0D9488]" aria-hidden="true" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Privacy &amp; Data Protection
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Citizen contact details are encrypted and restricted to authorized municipal personnel. Public GIS maps display only incident locations and categories.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <ShieldCheck className="size-5 text-[#0D9488]" aria-hidden="true" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Security &amp; Role Isolation
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Backed by httpOnly cookie sessions, Helmet HTTP headers, strict role-based API authorization, and immutable operational activity audit logs.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <Eye className="size-5 text-[#0D9488]" aria-hidden="true" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              WCAG 2.2 AA Accessibility
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Designed for keyboard navigation, screen readers, high-contrast badges, and responsive touch targets across mobile, tablet, and desktop screens.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
