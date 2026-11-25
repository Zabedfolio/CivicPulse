"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

function CustomTrendsTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="p-3 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-lg text-xs">
      <p className="font-extrabold text-slate-900 dark:text-white mb-1.5">{label}</p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-mono font-extrabold text-slate-900 dark:text-white">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * MonthlyTrendsChart
 * Recharts AreaChart comparing monthly reported vs resolved incident velocity.
 */
export function MonthlyTrendsChart({
  trends = [],
  months = 6,
  onMonthsChange,
  isLoading = false,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <figure className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-[#0D9488]" aria-hidden="true" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Monthly Incident Velocity
            </h3>
          </div>
          <figcaption className="text-xs text-muted mt-0.5">
            Reported complaints compared against resolved municipal tickets
          </figcaption>
        </div>

        {onMonthsChange && (
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 w-fit">
            {[6, 12].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onMonthsChange(m)}
                className={`px-3 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                  months === m
                    ? "bg-white dark:bg-slate-900 text-[#0D9488] shadow-xs"
                    : "text-muted hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {m}M
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full h-60 sm:h-72">
        {isLoading || !mounted ? (
          <div className="w-full h-full rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
        ) : trends.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted">
            No trend data available for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="reportedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9488" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" strokeOpacity={0.2} vertical={false} />
              <XAxis
                dataKey="shortMonth"
                minTickGap={18}
                tick={{ fontSize: 10, fill: "#64748B", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#64748B", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTrendsTooltip />} />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", fontWeight: 700, paddingTop: "12px" }}
              />
              <Area
                type="monotone"
                dataKey="reported"
                name="Reported Incidents"
                stroke="#0D9488"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#reportedGrad)"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                name="Resolved Tickets"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#resolvedGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </figure>
  );
}

export default MonthlyTrendsChart;
