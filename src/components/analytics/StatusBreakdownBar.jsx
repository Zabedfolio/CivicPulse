"use client";

import React from "react";
import { Activity } from "lucide-react";

const STATUS_META = [
  { key: "Submitted", label: "Submitted", color: "#64748B", bg: "bg-slate-500" },
  { key: "Under Review", label: "Under Review", color: "#F59E0B", bg: "bg-amber-500" },
  { key: "Assigned", label: "Assigned", color: "#3B82F6", bg: "bg-blue-500" },
  { key: "In Progress", label: "In Progress", color: "#8B5CF6", bg: "bg-purple-500" },
  { key: "Resolved", label: "Resolved", color: "#10B981", bg: "bg-emerald-500" },
  { key: "Closed", label: "Closed", color: "#334155", bg: "bg-slate-700" },
];

/**
 * StatusBreakdownBar
 * Horizontal stacked pipeline visualization across the 6 issue lifecycle stages.
 */
export function StatusBreakdownBar({ statusCounts = {}, total = 0, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="h-5 w-48 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-5 w-full bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-[#0D9488]" aria-hidden="true" />
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Incident Lifecycle Pipeline
          </h3>
        </div>
        <span className="text-xs font-semibold text-muted">
          Total Volume: <strong className="text-slate-900 dark:text-white">{total}</strong>
        </span>
      </div>

      {/* Multi-segment horizontal stacked bar */}
      <div
        className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800"
        role="img"
        aria-label="Horizontal breakdown of incident statuses across 6 lifecycle stages"
      >
        {total > 0 &&
          STATUS_META.map((st) => {
            const count = statusCounts[st.key] || 0;
            const pct = (count / total) * 100;
            if (pct <= 0) return null;
            return (
              <div
                key={st.key}
                style={{ width: `${pct}%`, backgroundColor: st.color }}
                title={`${st.label}: ${count} (${pct.toFixed(1)}%)`}
                className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
              />
            );
          })}
      </div>

      {/* Stage Legend Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
        {STATUS_META.map((st) => {
          const count = statusCounts[st.key] || 0;
          const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
          return (
            <div
              key={st.key}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: st.color }}
                  aria-hidden="true"
                />
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
                  {st.label}
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-1.5">
                <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                  {count}
                </span>
                <span className="text-[10px] font-bold text-muted">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatusBreakdownBar;
