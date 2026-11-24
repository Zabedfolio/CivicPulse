"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Clock, Award, Star, TrendingUp, CheckCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_METRICS = [
  {
    name: "Electrical & Lighting Works",
    slaRate: 98.4,
    avgHours: "18h",
    activeStaff: 14,
    satisfaction: 4.9,
    color: "#EAB308",
  },
  {
    name: "Road Maintenance Division",
    slaRate: 96.2,
    avgHours: "32h",
    activeStaff: 28,
    satisfaction: 4.8,
    color: "#EF4444",
  },
  {
    name: "Waste & Sanitation Board",
    slaRate: 97.5,
    avgHours: "14h",
    activeStaff: 36,
    satisfaction: 4.9,
    color: "#22C55E",
  },
  {
    name: "Stormwater Drainage Dept",
    slaRate: 91.8,
    avgHours: "42h",
    activeStaff: 18,
    satisfaction: 4.7,
    color: "#3B82F6",
  },
  {
    name: "Footpaths & Public Works",
    slaRate: 95.0,
    avgHours: "28h",
    activeStaff: 12,
    satisfaction: 4.8,
    color: "#A855F7",
  },
];

export function DepartmentSlaScorecard() {
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch("http://localhost:5000/api/v1/departments/analytics/sla-scorecard")
      .then((res) => {
        if (!res.ok) throw new Error("Scorecard fetch unsuccessful");
        return res.json();
      })
      .then((json) => {
        if (isMounted && json.data?.scorecard && json.data.scorecard.length > 0) {
          setMetrics(json.data.scorecard);
          setIsLive(true);
        }
      })
      .catch(() => {
        // Fallback to graceful default benchmarks
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 border border-teal-200 text-[#0D9488] dark:bg-teal-950/60 dark:border-teal-800 mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>Public Service Level Agreements</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Department Performance Scorecard
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-muted">
          CivicPulse enforces transparency: view on-time completion rates and average repair turnaround across municipal departments.
        </p>
      </div>

      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-lg overflow-hidden">
        <div className="p-4 sm:px-6 sm:py-3.5 bg-slate-50/75 dark:bg-slate-800/40 border-b border-border flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Chattogram Municipal SLA Benchmark Matrix
          </span>
          {isLive && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Live City GIS Feed
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-border">
              <tr>
                <th className="py-4 px-6">Municipal Department</th>
                <th className="py-4 px-4 text-center">On-Time SLA</th>
                <th className="py-4 px-4 text-center">Avg Repair SLA</th>
                <th className="py-4 px-4 text-center">Active Field Crew</th>
                <th className="py-4 px-6 text-right">Satisfaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {metrics.map((dept) => (
                <tr
                  key={dept.name}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: dept.color || "#0D9488" }}
                      />
                      <span>{dept.name}</span>
                      {dept.code && (
                        <span className="font-mono text-[10px] font-bold text-muted uppercase">
                          ({dept.code})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center font-semibold">
                    <div className="inline-flex items-center gap-2">
                      <span className="text-[#0D9488] font-bold">
                        {dept.slaRate}%
                      </span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#0D9488]"
                          style={{ width: `${Math.min(100, dept.slaRate)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 text-muted" />
                      {dept.avgHours}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-xs text-muted font-medium">
                    {dept.activeStaff} Crews Dispatched
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-slate-900 dark:text-white">
                    <span className="inline-flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {dept.satisfaction}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default DepartmentSlaScorecard;
