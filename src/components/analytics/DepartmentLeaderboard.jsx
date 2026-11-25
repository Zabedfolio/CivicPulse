"use client";

import React from "react";
import { Building2, Star, Clock, Users } from "lucide-react";

/**
 * DepartmentLeaderboard
 * Compares municipal departments on resolution rate, turnaround speed, and citizen satisfaction.
 */
export function DepartmentLeaderboard({ departments = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="h-5 w-52 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-14 w-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="size-4 text-[#0D9488]" aria-hidden="true" />
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Departmental Performance &amp; SLA Benchmark
          </h3>
        </div>
        <span className="text-[11px] font-bold text-muted">
          Ranked by resolution rate
        </span>
      </div>

      {departments.length === 0 ? (
        <p className="text-xs text-muted py-6 text-center">
          No department performance metrics available.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-muted">
                <th scope="col" className="pb-2.5 pr-3">Division</th>
                <th scope="col" className="pb-2.5 px-3 text-right">Assigned</th>
                <th scope="col" className="pb-2.5 px-3 text-right">Resolved</th>
                <th scope="col" className="pb-2.5 px-3 w-40">Resolution Rate</th>
                <th scope="col" className="pb-2.5 px-3 text-right">Avg Turnaround</th>
                <th scope="col" className="pb-2.5 pl-3 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-xs">
              {departments.map((dept, index) => (
                <tr
                  key={dept._id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2.5">
                      <span className="size-6 rounded-lg bg-teal-50 dark:bg-teal-950/70 text-[#0D9488] font-mono text-[10px] font-extrabold flex items-center justify-center shrink-0">
                        #{index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {dept.name}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted">
                          <span className="font-mono font-semibold">{dept.code}</span>
                          <span className="inline-flex items-center gap-1">
                            <Users className="size-2.5" aria-hidden="true" />
                            {dept.staffCount} staff
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                    {dept.totalAssigned}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {dept.resolved}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#0D9488] transition-all duration-500"
                          style={{ width: `${dept.resolutionRate}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] font-extrabold text-slate-900 dark:text-white w-11 text-right">
                        {dept.resolutionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-slate-700 dark:text-slate-300">
                      <Clock className="size-3 text-muted" aria-hidden="true" />
                      {dept.avgResolutionHours > 0 ? `${dept.avgResolutionHours}h` : "—"}
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-mono text-[11px] font-extrabold">
                      <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                      {dept.citizenRating > 0 ? dept.citizenRating.toFixed(1) : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DepartmentLeaderboard;
