"use client";

import React from "react";
import { KpiMetricCard } from "./KpiMetricCard";
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  Star,
} from "lucide-react";

/**
 * ExecutiveKpiGrid
 * Displays the 5 primary smart-city operational KPIs.
 */
export function ExecutiveKpiGrid({ overview, isLoading = false }) {
  if (isLoading || !overview) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {[...Array(5)].map((_, idx) => (
          <div
            key={idx}
            className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800/60 animate-pulse border border-slate-200/60 dark:border-slate-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      <KpiMetricCard
        title="Total Incidents"
        value={overview.totalIssues}
        subtitle="Reported across all wards"
        badgeText={`${overview.resolutionRate}% resolved`}
        icon={FileText}
        accentClass="text-slate-900 dark:text-white"
        badgeBgClass="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        delay={0}
      />

      <KpiMetricCard
        title="Pending Triage"
        value={overview.pendingTriage}
        subtitle="Submitted & Under Review"
        icon={Clock}
        accentClass="text-amber-600 dark:text-amber-400"
        badgeBgClass="bg-amber-50 dark:bg-amber-950/50 border-amber-200/70 dark:border-amber-800/60"
        delay={0.05}
      />

      <KpiMetricCard
        title="Active Repairs"
        value={overview.activeRepairs}
        subtitle={`${overview.activeTasks} field tasks dispatched`}
        icon={Wrench}
        accentClass="text-purple-600 dark:text-purple-400"
        badgeBgClass="bg-purple-50 dark:bg-purple-950/50 border-purple-200/70 dark:border-purple-800/60"
        delay={0.1}
      />

      <KpiMetricCard
        title="Avg Turnaround"
        value={overview.avgResolutionHours}
        decimals={1}
        suffix="h"
        subtitle={`SLA compliance: ${overview.slaComplianceRate}%`}
        icon={CheckCircle2}
        accentClass="text-[#0D9488] dark:text-teal-400"
        badgeBgClass="bg-teal-50 dark:bg-teal-950/50 border-teal-200/70 dark:border-teal-800/60"
        delay={0.15}
      />

      <KpiMetricCard
        title="Citizen Rating"
        value={overview.citizenSatisfaction?.avgRating || 0}
        decimals={1}
        suffix=" ★"
        subtitle={`From ${overview.citizenSatisfaction?.totalReviews || 0} verified reviews`}
        icon={Star}
        accentClass="text-emerald-600 dark:text-emerald-400"
        badgeBgClass="bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200/70 dark:border-emerald-800/60"
        delay={0.2}
      />
    </div>
  );
}

export default ExecutiveKpiGrid;
