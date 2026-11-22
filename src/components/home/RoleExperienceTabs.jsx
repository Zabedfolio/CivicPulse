"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Wrench,
  Building,
  BarChart3,
  CheckCircle,
  Smartphone,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const ROLES_INFO = [
  {
    id: "citizen",
    role: "Citizen",
    badge: "Public User",
    icon: Users,
    color: "#14B8A6",
    headline: "Report Public Hazards in Under 30 Seconds",
    desc: "Snap a photo, verify your GPS location on OpenStreetMap, and receive real-time notifications as field crews are dispatched and repairs are verified.",
    highlights: [
      "No bureaucratic paperwork or municipal office visits",
      "Instant 50m duplicate notice if neighbors already reported",
      "Live timeline tracking from inspection to fix",
      "1 to 5 star satisfaction rating on finished work",
    ],
    ctaText: "Create Free Citizen Account",
    ctaLink: "/register",
    mockupTitle: "Citizen Mobile Portal",
    mockupDetails: {
      tag: "Live Incident #CP-2026-118",
      title: "Broken Streetlight at GEC Crossway",
      status: "In Progress (Crew On-Site)",
      time: "Reported today at 08:45 AM",
    },
  },
  {
    id: "staff",
    role: "Maintenance Crew",
    badge: "Field Operations",
    icon: Wrench,
    color: "#8B5CF6",
    headline: "Mobile-First Task Execution in the Field",
    desc: "A simplified mobile portal designed for on-site maintenance crews: view assigned work orders, update progress logs, and upload required before/after photo proofs.",
    highlights: [
      "GPS turn-by-turn route to exact issue coordinates",
      "One-tap 'Start Work' and 'Log Progress' updates",
      "Mandatory high-res completion photo proof enforcement",
      "Workload transparency and scheduled due dates",
    ],
    ctaText: "Staff Portal Login",
    ctaLink: "/login",
    mockupTitle: "Field Staff Task Console",
    mockupDetails: {
      tag: "Assigned Work Order",
      title: "Asphalt Pothole Patching - Agrabad Ward 24",
      status: "Assigned · Due Today, 5 PM",
      time: "Dispatched by Road Maintenance Dept",
    },
  },
  {
    id: "manager",
    role: "Dept Manager",
    badge: "Department Triage",
    icon: Building,
    color: "#F59E0B",
    headline: "Automated Triage & Proximity Duplicate Detection",
    desc: "Triage public complaints for your department, inspect severity, set priority levels, and assign tasks to available personnel while monitoring staff workloads in real time.",
    highlights: [
      "2dsphere geospatial engine flags duplicates within 50m",
      "Department-scoped issue queue and filtering",
      "Team workload distribution (Available, Busy, Overloaded)",
      "SLA breach warnings for delayed inspections",
    ],
    ctaText: "Manager Portal Login",
    ctaLink: "/login",
    mockupTitle: "Department Triage Console",
    mockupDetails: {
      tag: "Road Maintenance Division",
      title: "14 Pending Triages · 6 Active Crews",
      status: "96.4% Department SLA Met",
      time: "Proximity duplicates automatically grouped",
    },
  },
  {
    id: "admin",
    role: "City Administrator",
    badge: "Executive Leadership",
    icon: BarChart3,
    color: "#06B6D4",
    headline: "City-Wide Infrastructure Analytics & Governance",
    desc: "Monitor municipal performance across all departments, track city-wide resolution hours, manage municipal accounts, and optimize public works resource allocation.",
    highlights: [
      "Comprehensive Recharts executive dashboard",
      "Cross-department resolution time (SLA) comparisons",
      "Citizen satisfaction score monitoring per ward",
      "Department provisioning and staff onboarding",
    ],
    ctaText: "Administrator Login",
    ctaLink: "/login",
    mockupTitle: "Executive City Dashboard",
    mockupDetails: {
      tag: "Chittagong Municipal Authority",
      title: "City Infrastructure Health: Optimal",
      status: "4,850+ Repairs Verified · 94.8% SLA",
      time: "Real-time municipal telemetry stream",
    },
  },
];

export function RoleExperienceTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const current = ROLES_INFO[activeTab];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-50/70 dark:bg-slate-950/50 rounded-3xl border border-border my-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#0D9488] mb-2">
          Tailored Workspaces
        </h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Built for Every Municipal Stakeholder
        </h3>
        <p className="mt-3 text-sm text-muted">
          CivicPulse segregates workflows to empower citizens, field workers, triage managers, and city executives with purpose-built tools.
        </p>
      </div>

      {/* Role Navigation Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto mb-10 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-xs">
        {ROLES_INFO.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeTab === idx;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={cn(
                "flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer select-none",
                isActive
                  ? "bg-teal-50 dark:bg-teal-950/80 text-[#0D9488] border border-teal-200 dark:border-teal-800 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" style={{ color: item.color }} />
              <span>{item.role}</span>
            </button>
          );
        })}
      </div>

      {/* Role Card Showcase */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="max-w-5xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 p-6 sm:p-10 gap-8 items-center"
        >
          {/* Left Feature Description */}
          <div className="lg:col-span-7 space-y-4">
            <span
              className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: current.color }}
            >
              {current.badge}
            </span>

            <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {current.headline}
            </h4>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {current.desc}
            </p>

            <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {current.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link href={current.ctaLink}>
                <Button variant="primary" size="md" className="font-bold">
                  {current.ctaText}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Live UI Mockup Preview */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl p-5 bg-slate-50 dark:bg-slate-800/80 border border-border dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-xs font-bold font-mono text-muted">
                  {current.mockupTitle}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-2.5">
                <span
                  className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded text-white"
                  style={{ backgroundColor: current.color }}
                >
                  {current.mockupDetails.tag}
                </span>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {current.mockupDetails.title}
                </div>
                <div className="text-xs font-semibold text-[#0D9488]">
                  {current.mockupDetails.status}
                </div>
                <div className="text-[11px] text-muted">
                  {current.mockupDetails.time}
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted font-mono">
                <span>CivicPulse GovTech Engine</span>
                <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

export default RoleExperienceTabs;
