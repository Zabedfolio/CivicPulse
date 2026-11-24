"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Award,
  Clock,
  Star,
  Users,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Building2,
  FileText,
  Activity,
  Layers,
  Sparkles,
  MessageSquareQuote,
  Loader2,
} from "lucide-react";

/**
 * DepartmentAnalyticsView
 * Comprehensive department SLA performance scorecard and priority matrix
 */
export function DepartmentAnalyticsView({
  departmentId,
  departmentName = "",
}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!departmentId) return;

    let isMounted = true;
    setIsLoading(true);
    setFetchError("");

    fetch(`http://localhost:5000/api/v1/departments/${departmentId}/analytics`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load department analytics.");
        return res.json();
      })
      .then((json) => {
        if (isMounted && json.data?.analytics) {
          setData(json.data.analytics);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setFetchError(err.message || "Failed to connect to analytics engine.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [departmentId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 animate-pulse"
            />
          ))}
        </div>
        <div className="h-64 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 animate-pulse" />
      </div>
    );
  }

  if (fetchError || !data) {
    return (
      <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <AlertTriangle className="size-8 text-amber-500 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Analytics Unavailable
        </h3>
        <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
          {fetchError || "Could not retrieve performance metrics for this department."}
        </p>
      </div>
    );
  }

  const { kpis, priorityMatrix, statusCounts, capacitySummary, recentFeedback } = data;

  return (
    <div className="space-y-6">
      {/* 4 Top KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: On-Time SLA Rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
              On-Time SLA Rate
            </span>
            <span className="p-1.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-[#0D9488]">
              <Award className="size-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0D9488]">
            {kpis.overallSlaRate}%
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted">
            <span className="font-semibold text-emerald-600">✓ Target: ≥ 95%</span>
            <span>· SLA Benchmark</span>
          </div>
        </motion.div>

        {/* KPI 2: Average Turnaround */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
              Avg Repair Turnaround
            </span>
            <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
              <Clock className="size-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {kpis.avgTurnaroundHours}
          </div>
          <div className="text-[10px] text-muted">
            Based on {kpis.resolvedIssues} resolved repairs
          </div>
        </motion.div>

        {/* KPI 3: Citizen Satisfaction */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
              Citizen Satisfaction
            </span>
            <span className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-500">
              <Star className="size-4 fill-amber-400 text-amber-400" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>{kpis.avgSatisfaction}</span>
            <span className="text-xs text-muted font-normal">/ 5.0</span>
          </div>
          <div className="text-[10px] text-muted">
            From {kpis.totalReviews} verified post-resolution reviews
          </div>
        </motion.div>

        {/* KPI 4: Active Crews */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
              Field Technician Pool
            </span>
            <span className="p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
              <Users className="size-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {capacitySummary?.totalStaff || 0}
          </div>
          <div className="text-[10px] text-muted flex items-center gap-1">
            <span className="text-emerald-600 font-bold">{capacitySummary?.available || 0} available</span>
            <span>· {capacitySummary?.busy || 0} busy</span>
            <span>· {capacitySummary?.overloaded || 0} loaded</span>
          </div>
        </motion.div>
      </div>

      {/* Priority SLA Compliance Matrix */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-[#0D9488]" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Priority SLA Compliance Matrix
            </h3>
          </div>
          <span className="text-[10px] text-muted font-mono">
            Standard Municipal SLA Turnaround Targets
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(priorityMatrix).map(([pKey, pVal]) => {
            const badgeColors = {
              critical: "text-rose-600 bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800",
              high: "text-amber-600 bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800",
              medium: "text-blue-600 bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800",
              low: "text-slate-600 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700",
            };

            return (
              <div
                key={pKey}
                className="p-4 rounded-2xl bg-slate-50/75 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border ${
                      badgeColors[pKey] || ""
                    }`}
                  >
                    {pKey}
                  </span>
                  <span className="text-xs font-mono font-bold text-muted">
                    Target: {pVal.target}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {pVal.complianceRate}%
                  </span>
                  <span className="text-[10px] text-muted font-mono">
                    {pVal.onTime} / {pVal.resolved} on-time
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0D9488]"
                    style={{ width: `${Math.min(100, pVal.complianceRate)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Issue Lifecycle Breakdown Pipeline */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Activity className="size-4 text-teal-600" />
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Incident Lifecycle Pipeline
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1 text-center">
          {Object.entries(statusCounts).map(([sName, sCount]) => (
            <div
              key={sName}
              className="p-3 rounded-2xl bg-slate-50/75 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80"
            >
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {sCount}
              </div>
              <div className="text-[10px] font-bold text-muted uppercase mt-0.5">
                {sName}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Citizen Feedback Spotlight */}
      {recentFeedback && recentFeedback.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="size-4 text-amber-500" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Verified Citizen Satisfaction Reviews
              </h3>
            </div>
            <span className="text-[10px] text-muted">
              Recent post-resolution feedback
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentFeedback.map((fb) => (
              <div
                key={fb._id}
                className="p-4 rounded-2xl bg-amber-50/40 dark:bg-slate-800/40 border border-amber-100 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-3.5 ${
                          star <= (fb.rating || 5)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-transparent text-slate-300"
                        }`}
                      />
                    ))}
                    <span className="font-bold text-xs text-slate-900 dark:text-white ml-1">
                      {fb.rating}.0
                    </span>
                  </div>
                  <span className="text-[10px] text-muted">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 italic line-clamp-2">
                  &quot;{fb.comment || "Citizen rated repair quality with 5 stars."}&quot;
                </p>

                <div className="text-[10px] text-muted font-semibold flex items-center justify-between pt-1 border-t border-amber-100/60 dark:border-slate-800/60">
                  <span>{fb.citizen?.name || "Verified Citizen"}</span>
                  <span className="text-teal-600 font-mono">{fb.issue?.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentAnalyticsView;
