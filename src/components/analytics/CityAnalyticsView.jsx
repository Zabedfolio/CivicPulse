"use client";


import { API_BASE_URL } from "@/lib/api";
import React, { useState, useEffect, useCallback } from "react";
import { ExecutiveKpiGrid } from "./ExecutiveKpiGrid";
import { MonthlyTrendsChart } from "./MonthlyTrendsChart";
import { CategoryPieChart } from "./CategoryPieChart";
import { StatusBreakdownBar } from "./StatusBreakdownBar";
import { DepartmentLeaderboard } from "./DepartmentLeaderboard";
import { BarChart3, RefreshCw, AlertCircle } from "lucide-react";

/**
 * CityAnalyticsView
 * Executive analytics suite combining KPI spotlight cards, Recharts area/donut charts,
 * lifecycle status breakdown, and department SLA leaderboard.
 */
export function CityAnalyticsView({
  departments = [],
  lockedDepartmentId = null,
  title = "City-Wide Executive Intelligence",
  subtitle = "Real-time municipal performance, incident velocity, and SLA compliance across Chattogram.",
}) {
  const [selectedDept, setSelectedDept] = useState(lockedDepartmentId || "all");
  const [months, setMonths] = useState(6);

  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  const [categoryDist, setCategoryDist] = useState({ distribution: [], total: 0 });
  const [deptLeaderboard, setDeptLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (lockedDepartmentId) {
      setSelectedDept(lockedDepartmentId);
    }
  }, [lockedDepartmentId]);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError("");
    const deptQuery =
      selectedDept && selectedDept !== "all" ? `department=${selectedDept}` : "";

    try {
      const [ovRes, trRes, catRes, perfRes] = await Promise.all([
        fetch(
          `${API_BASE_URL}/analytics/overview${deptQuery ? `?${deptQuery}` : ""}`,
          { credentials: "include" }
        ),
        fetch(
          `${API_BASE_URL}/analytics/monthly-trends?months=${months}${
            deptQuery ? `&${deptQuery}` : ""
          }`,
          { credentials: "include" }
        ),
        fetch(
          `${API_BASE_URL}/analytics/category-distribution${
            deptQuery ? `?${deptQuery}` : ""
          }`,
          { credentials: "include" }
        ),
        fetch(`${API_BASE_URL}/analytics/department-performance`, {
          credentials: "include",
        }),
      ]);

      if (!ovRes.ok || !trRes.ok || !catRes.ok || !perfRes.ok) {
        throw new Error("Failed to retrieve executive analytics data.");
      }

      const [ovJson, trJson, catJson, perfJson] = await Promise.all([
        ovRes.json(),
        trRes.json(),
        catRes.json(),
        perfRes.json(),
      ]);

      setOverview(ovJson.data?.overview || null);
      setTrends(trJson.data?.trends || []);
      setCategoryDist({
        distribution: catJson.data?.distribution || [],
        total: catJson.data?.total || 0,
      });
      setDeptLeaderboard(perfJson.data?.departments || []);
    } catch (err) {
      setError(err.message || "Analytics service unavailable.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDept, months]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <section className="space-y-6" aria-label="Executive Analytics Dashboard">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60 flex items-center justify-center shrink-0">
            <BarChart3 className="size-5 text-[#0D9488]" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {title}
            </h2>
            <p className="text-xs text-muted mt-0.5">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {!lockedDepartmentId && departments.length > 0 && (
            <select
              aria-label="Filter analytics by municipal department"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#0D9488]"
            >
              <option value="all">All Municipal Divisions (City-Wide)</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.code} — {dept.name}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Executive KPI Spotlight Cards */}
      <ExecutiveKpiGrid overview={overview} isLoading={isLoading} />

      {/* 2. Primary Charts Row: Monthly Velocity & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <MonthlyTrendsChart
            trends={trends}
            months={months}
            onMonthsChange={setMonths}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-5">
          <CategoryPieChart
            distribution={categoryDist.distribution}
            total={categoryDist.total}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* 3. Lifecycle Pipeline Bar */}
      <StatusBreakdownBar
        statusCounts={overview?.statusCounts}
        total={overview?.totalIssues || 0}
        isLoading={isLoading}
      />

      {/* 4. Departmental Performance Leaderboard (shown when viewing City-Wide or Admin) */}
      {!lockedDepartmentId && (
        <DepartmentLeaderboard departments={deptLeaderboard} isLoading={isLoading} />
      )}
    </section>
  );
}

export default CityAnalyticsView;
