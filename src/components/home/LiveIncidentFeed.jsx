"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Lightbulb,
  Droplets,
  Footprints,
  Trash2,
  Building2,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

const RECENT_INCIDENTS = [
  {
    id: "CP-2026-4821",
    category: "Road Damage",
    title: "Large crater pothole resurfaced & steamrolled",
    location: "Agrabad Commercial Area, Ward 24",
    status: "Resolved",
    timeAgo: "18 mins ago",
    department: "Road Maintenance Division",
    icon: Flame,
    color: "#EF4444",
  },
  {
    id: "CP-2026-4819",
    category: "Streetlight",
    title: "LED luminaire installed & wiring restored",
    location: "GEC Circle, O.R. Nizam Road",
    status: "Resolved",
    timeAgo: "42 mins ago",
    department: "Electrical Works Unit",
    icon: Lightbulb,
    color: "#EAB308",
  },
  {
    id: "CP-2026-4814",
    category: "Drainage",
    title: "Severe canal blockage desilted before rainfall",
    location: "Nasirabad Housing Society",
    status: "In Progress",
    timeAgo: "1 hour ago",
    department: "Stormwater Drainage Dept",
    icon: Droplets,
    color: "#3B82F6",
  },
  {
    id: "CP-2026-4809",
    category: "Waste Management",
    title: "Garbage overflow cleared & area sanitized",
    location: "Halishahar Block B",
    status: "Resolved",
    timeAgo: "2 hours ago",
    department: "Waste & Sanitation Board",
    icon: Trash2,
    color: "#22C55E",
  },
];

export function LiveIncidentFeed() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 border border-teal-200 text-[#0D9488] dark:bg-teal-950/60 dark:border-teal-800 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-Time Municipal Dispatch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Live Incident Stream & Citizen Radar
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            Recent public works actions dispatched and verified across city wards.
          </p>
        </div>

        <Link
          href="/map"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D9488] hover:underline"
        >
          View All Incidents on Live City Map
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {RECENT_INCIDENTS.map((inc) => {
          const Icon = inc.icon;
          const isResolved = inc.status === "Resolved";
          return (
            <div
              key={inc.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: `${inc.color}15`,
                  borderColor: `${inc.color}40`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color: inc.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-muted">
                    {inc.id}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                      isResolved
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300"
                    )}
                  >
                    {inc.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
                  {inc.title}
                </h4>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted mt-2">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0D9488]" />
                    {inc.location}
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {inc.timeAgo}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default LiveIncidentFeed;
