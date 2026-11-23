"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { BlurText } from "@/components/ui/BlurText";
import { MotionCard } from "@/components/ui/MotionCard";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PixelScroll } from "@/components/ui/PixelScroll";
import { cn } from "@/lib/utils";

// Home Components
import { EmergencyHotlineBar } from "@/components/home/EmergencyHotlineBar";
import { QuickActionWidget } from "@/components/home/QuickActionWidget";
import { BeforeAfterSlider } from "@/components/home/BeforeAfterSlider";
import { RoleExperienceTabs } from "@/components/home/RoleExperienceTabs";
import { LiveIncidentFeed } from "@/components/home/LiveIncidentFeed";
import { DepartmentSlaScorecard } from "@/components/home/DepartmentSlaScorecard";
import { CitizenFaqAccordion } from "@/components/home/CitizenFaqAccordion";

import {
  ArrowRight,
  Flame,
  Lightbulb,
  Droplets,
  Footprints,
  Trash2,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  MapPin,
} from "lucide-react";

// 6 Categories matching PLAN.md design tokens
const CATEGORIES = [
  {
    id: "road",
    title: "Road Damage",
    desc: "Potholes, broken asphalt, and road sinkholes.",
    color: "#EF4444",
    bgLight: "bg-red-50 dark:bg-red-950/40",
    borderLight: "border-red-200 dark:border-red-800/60",
    textLight: "text-red-600 dark:text-red-400",
    icon: Flame,
    count: "1,240 resolved",
  },
  {
    id: "streetlight",
    title: "Streetlights",
    desc: "Dark streets, broken poles, and malfunctioning lamps.",
    color: "#EAB308",
    bgLight: "bg-amber-50 dark:bg-amber-950/40",
    borderLight: "border-amber-200 dark:border-amber-800/60",
    textLight: "text-amber-600 dark:text-amber-400",
    icon: Lightbulb,
    count: "890 resolved",
  },
  {
    id: "drainage",
    title: "Drainage & Water",
    desc: "Waterlogging, clogged drains, and stormwater overflow.",
    color: "#3B82F6",
    bgLight: "bg-blue-50 dark:bg-blue-950/40",
    borderLight: "border-blue-200 dark:border-blue-800/60",
    textLight: "text-blue-600 dark:text-blue-400",
    icon: Droplets,
    count: "730 resolved",
  },
  {
    id: "footpath",
    title: "Footpaths & Walkways",
    desc: "Cracked sidewalk tiles, walkway hazards, and curbs.",
    color: "#A855F7",
    bgLight: "bg-purple-50 dark:bg-purple-950/40",
    borderLight: "border-purple-200 dark:border-purple-800/60",
    textLight: "text-purple-600 dark:text-purple-400",
    icon: Footprints,
    count: "410 resolved",
  },
  {
    id: "waste",
    title: "Waste Management",
    desc: "Uncollected garbage bins and illegal waste dumping.",
    color: "#22C55E",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/40",
    borderLight: "border-emerald-200 dark:border-emerald-800/60",
    textLight: "text-emerald-600 dark:text-emerald-400",
    icon: Trash2,
    count: "1,150 resolved",
  },
  {
    id: "public",
    title: "Public Infrastructure",
    desc: "Damaged guardrails, public signs, benches, and barriers.",
    color: "#64748B",
    bgLight: "bg-slate-50 dark:bg-slate-800/60",
    borderLight: "border-slate-200 dark:border-slate-700",
    textLight: "text-slate-600 dark:text-slate-300",
    icon: Building2,
    count: "380 resolved",
  },
];

// 6-Stage Authoritative Workflow Stepper
const LIFECYCLE_STEPS = [
  {
    num: "01",
    status: "Submitted",
    actor: "Citizen",
    color: "#64748B",
    title: "Citizen Issue Report",
    desc: "Reported with mobile photo evidence, precise OpenStreetMap coordinates, and category tagging.",
  },
  {
    num: "02",
    status: "Under Review",
    actor: "Dept Manager",
    color: "#F59E0B",
    title: "Triage & 50m Duplicate Check",
    desc: "Manager inspects severity, sets priority (Low to Critical), and checks for proximity duplicate reports.",
  },
  {
    num: "03",
    status: "Assigned",
    actor: "Dept Manager",
    color: "#3B82F6",
    title: "Maintenance Dispatch",
    desc: "Assigned to dedicated field crew with real-time team workload monitoring and deadline scheduling.",
  },
  {
    num: "04",
    status: "In Progress",
    actor: "Field Staff",
    color: "#8B5CF6",
    title: "On-Site Physical Work",
    desc: "Technicians log live progress reports directly from their mobile console while repairs are underway.",
  },
  {
    num: "05",
    status: "Resolved",
    actor: "Field Staff",
    color: "#22C55E",
    title: "Verified Completion Proof",
    desc: "Field staff must upload high-resolution completion photos before an issue can be marked resolved.",
  },
  {
    num: "06",
    status: "Closed",
    actor: "Citizen & Manager",
    color: "#334155",
    title: "Citizen Feedback & Audit Close",
    desc: "The reporting citizen rates repair quality from 1 to 5 stars, completing the transparent public audit trail.",
  },
];

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="relative isolate overflow-hidden">
      {/* 1. TOP EMERGENCY HOTLINE RIBBON */}
      <EmergencyHotlineBar />

      {/* Background radial gradient mesh */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#14B8A6] via-[#06B6D4] to-[#FBBF24] opacity-25 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      {/* 2. HERO SECTION + INSTANT QUICK ACTION WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        {/* Animated Badge Pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-50 border border-teal-200 text-[#0D9488] shadow-xs dark:bg-teal-950/60 dark:border-teal-800 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse" />
          <span>GovTech Smart City Platform · Active Municipal Dispatch</span>
        </motion.div>

        {/* BlurText Main Headline */}
        <div className="max-w-4xl mx-auto">
          <BlurText
            as="h1"
            text="Smarter Cities, Faster Fixes."
            stagger={0.06}
            duration={0.65}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          />
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Empowering citizens to report public infrastructure failures with GPS accuracy and photo evidence, while municipal teams triage and resolve them with complete public transparency.
        </motion.p>

        {/* Quick Action Widget: Report Fast OR Track by Ticket ID */}
        <div className="mt-8 sm:mt-12">
          <QuickActionWidget />
        </div>
      </section>

      {/* 3. LIVE CITY METRICS (Pulse Counter Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <MotionCard className="text-center p-6 bg-white/80 backdrop-blur dark:bg-slate-900/80">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0D9488] mb-1">
              4,850+
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              Verified Repairs
            </div>
          </MotionCard>
          <MotionCard className="text-center p-6 bg-white/80 backdrop-blur dark:bg-slate-900/80">
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-600 mb-1">
              94.8%
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              Resolution Rate
            </div>
          </MotionCard>
          <MotionCard className="text-center p-6 bg-white/80 backdrop-blur dark:bg-slate-900/80">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-500 mb-1">
              &lt; 48h
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              Average Triage SLA
            </div>
          </MotionCard>
          <MotionCard className="text-center p-6 bg-white/80 backdrop-blur dark:bg-slate-900/80">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 mb-1 flex items-center justify-center gap-1">
              4.9 <Star className="w-6 h-6 fill-amber-400 text-amber-400 inline" />
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              Citizen Satisfaction
            </div>
          </MotionCard>
        </div>
      </section>

      {/* SCROLL-DRIVEN PIXEL TRANSITION (Motion Brew PixelScroll) */}
      <section className="w-full overflow-hidden my-6">
        <PixelScroll
          from="#F0FDFA"
          to="#0B132B"
          pixelSize={18}
          length={1.3}
          direction="center-out"
          pattern="wave"
          accents={["#14B8A6", "#06B6D4", "#F59E0B", "#22C55E"]}
          label="Civic Infrastructure Transformation Transition"
        >
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/20 mb-3 shadow-lg">
              <span>Scroll-Driven City Audit</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              Transforming Broken Streets Into Verified Repairs
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-teal-200 max-w-lg mx-auto drop-shadow">
              Scroll downward to inspect authentic before-and-after municipal repair proofs.
            </p>
          </div>
        </PixelScroll>
      </section>

      {/* 4. BEFORE & AFTER INTERACTIVE REPAIR SLIDER */}
      <BeforeAfterSlider />

      {/* 5. SIX INFRASTRUCTURE CATEGORIES (Bento Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0D9488] mb-2">
            Coverage Scope
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Report Any Public Infrastructure Issue
          </h3>
          <p className="mt-3 text-sm text-muted">
            Each category routes automatically to specialized municipal engineering departments with dedicated field maintenance teams.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <MotionCard
                key={cat.id}
                borderColor={cat.color}
                className="group flex flex-col justify-between p-6 sm:p-7"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-xs",
                        cat.bgLight,
                        cat.borderLight,
                        "border"
                      )}
                    >
                      <Icon className={cn("w-6 h-6", cat.textLight)} />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-border">
                      {cat.count}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0D9488] transition-colors">
                    {cat.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#0D9488]">
                  <Link
                    href={`/issues/new?category=${encodeURIComponent(cat.title)}`}
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    Report {cat.title}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </MotionCard>
            );
          })}
        </div>
      </section>

      {/* 6. 4-STAKEHOLDER ROLE EXPERIENCE TABS */}
      <RoleExperienceTabs />

      {/* 7. LIVE INCIDENT STREAM & CITIZEN RADAR */}
      <LiveIncidentFeed />

      {/* 8. MUNICIPAL SLA PERFORMANCE SCORECARD */}
      <DepartmentSlaScorecard />

      {/* 9. TRANSPARENT 6-STAGE WORKFLOW (Interactive Stepper) */}
      <section className="bg-surface/60 dark:bg-slate-900/40 border-y border-border py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0D9488] mb-2">
              Public Accountability
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              The 6-Stage Transparent Repair Journey
            </h3>
            <p className="mt-3 text-sm text-muted">
              Every status change is recorded on an immutable audit history with actor verification and photo proof.
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {LIFECYCLE_STEPS.map((step, idx) => (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer select-none",
                  activeStep === idx
                    ? "bg-white dark:bg-slate-800 border-teal-500 shadow-md shadow-teal-500/10 ring-2 ring-teal-500/20"
                    : "bg-white/60 dark:bg-slate-900/60 border-border hover:bg-white dark:hover:bg-slate-800"
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-muted">
                    {step.num}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: step.color }}
                  />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {step.status}
                </div>
                <div className="text-[10px] text-muted truncate">{step.actor}</div>
              </button>
            ))}
          </div>

          {/* Active Step Showcase Card */}
          <MotionCard className="max-w-3xl mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border-teal-200 dark:border-teal-900">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-mono font-bold text-sm shadow-xs"
                  style={{ backgroundColor: LIFECYCLE_STEPS[activeStep].color }}
                >
                  {LIFECYCLE_STEPS[activeStep].num}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {LIFECYCLE_STEPS[activeStep].title}
                  </h4>
                  <p className="text-xs text-muted">
                    Handled by: <span className="font-semibold text-slate-800 dark:text-slate-200">{LIFECYCLE_STEPS[activeStep].actor}</span>
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-[#0D9488] border border-teal-200 dark:bg-teal-950 dark:border-teal-800">
                Status: {LIFECYCLE_STEPS[activeStep].status}
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {LIFECYCLE_STEPS[activeStep].desc}
            </p>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
                Immutable audit history log created
              </span>
              <button
                type="button"
                onClick={() =>
                  setActiveStep((prev) => (prev + 1) % LIFECYCLE_STEPS.length)
                }
                className="font-semibold text-[#0D9488] hover:underline inline-flex items-center gap-1"
              >
                Next Step
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </MotionCard>
        </div>
      </section>

      {/* 10. CITIZEN FAQ ACCORDION */}
      <CitizenFaqAccordion />

      {/* 11. MUNICIPAL CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#042F2E] p-8 sm:p-14 text-white text-center shadow-xl overflow-hidden">
          <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-xl mx-auto">
            Ready to Help Make Your City Better?
          </h3>
          <p className="mt-4 text-sm sm:text-base text-teal-100 max-w-xl mx-auto leading-relaxed">
            Report broken infrastructure in your neighborhood today. No paperwork, instant GPS location tagging, and verified progress notifications.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-slate-900 hover:bg-teal-50 border-white text-base font-semibold px-8 h-12"
              >
                Create Citizen Account
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10 text-base font-semibold px-6 h-12"
              >
                Sign In to Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
