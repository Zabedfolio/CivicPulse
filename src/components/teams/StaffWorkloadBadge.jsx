"use client";

import React from "react";

/**
 * StaffWorkloadBadge (Motion Brew StatusBadgePulse)
 * Real-time technician capacity indicator: Available (0-2), Busy (3-5), Overloaded (6+)
 */
export function StaffWorkloadBadge({ activeCount = 0, tier, className = "" }) {
  let resolvedTier = tier;
  if (!resolvedTier) {
    if (activeCount >= 6) resolvedTier = "overloaded";
    else if (activeCount >= 3) resolvedTier = "busy";
    else resolvedTier = "available";
  }

  if (resolvedTier === "overloaded") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-900 ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
        </span>
        <span>Overloaded ({activeCount})</span>
      </span>
    );
  }

  if (resolvedTier === "busy") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-900 ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
        </span>
        <span>Busy ({activeCount})</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-900 ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span>Available ({activeCount})</span>
    </span>
  );
}

export default StaffWorkloadBadge;
