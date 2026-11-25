"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { Layers } from "lucide-react";

const CATEGORY_COLORS = {
  "Road Damage": "#EF4444",
  Streetlight: "#EAB308",
  Drainage: "#3B82F6",
  Footpath: "#A855F7",
  "Waste Management": "#10B981",
  "Public Infrastructure": "#64748B",
};

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;

  return (
    <div className="p-3 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-lg text-xs">
      <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white mb-1">
        <span
          className="size-2.5 rounded-full"
          style={{ backgroundColor: CATEGORY_COLORS[item.category] || "#0D9488" }}
        />
        <span>{item.category}</span>
      </div>
      <div className="space-y-0.5 text-slate-600 dark:text-slate-300">
        <p>
          Total: <strong className="text-slate-900 dark:text-white">{item.count}</strong> ({item.percentage}%)
        </p>
        <p>
          Resolved: <strong className="text-emerald-600">{item.resolved}</strong>
        </p>
      </div>
    </div>
  );
}

/**
 * CategoryPieChart
 * Recharts Donut Chart displaying distribution across the 6 civic infrastructure categories.
 */
export function CategoryPieChart({
  distribution = [],
  total = 0,
  isLoading = false,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nonZeroData = distribution.filter((d) => d.count > 0);

  return (
    <figure className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-[#0D9488]" aria-hidden="true" />
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Category Distribution
          </h3>
        </div>
        <figcaption className="text-xs text-muted mt-0.5">
          Breakdown across 6 municipal infrastructure domains
        </figcaption>
      </div>

      {isLoading || !mounted ? (
        <div className="w-full h-64 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
      ) : total === 0 ? (
        <div className="w-full h-64 flex items-center justify-center text-xs text-muted">
          No categorized incidents recorded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="relative h-48 sm:h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={nonZeroData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={84}
                  paddingAngle={3}
                  stroke="none"
                >
                  {nonZeroData.map((entry) => (
                    <Cell
                      key={entry.category}
                      fill={CATEGORY_COLORS[entry.category] || "#0D9488"}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Donut Metric */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">
                {total}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted mt-1">
                Incidents
              </span>
            </div>
          </div>

          {/* Interactive Legend List */}
          <ul className="space-y-2.5">
            {distribution.map((item) => {
              const color = CATEGORY_COLORS[item.category] || "#0D9488";
              return (
                <li
                  key={item.category}
                  className="flex items-center justify-between text-xs gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    />
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-extrabold text-slate-900 dark:text-white">
                      {item.count}
                    </span>
                    <span className="text-[10px] font-bold text-muted w-10 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </figure>
  );
}

export default CategoryPieChart;
