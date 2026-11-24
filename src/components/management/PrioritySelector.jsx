"use client";

import React from "react";
import { motion } from "motion/react";
import { ShieldAlert, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const PRIORITIES = [
  {
    id: "low",
    label: "Low Severity",
    description: "Minor aesthetic or non-obstructive wear",
    icon: Info,
    colorText: "text-slate-600 dark:text-slate-300",
    colorBg: "bg-slate-50 dark:bg-slate-800/60",
    activeBorder: "border-slate-500 ring-2 ring-slate-400/40",
  },
  {
    id: "medium",
    label: "Medium Severity",
    description: "Standard public works maintenance repair",
    icon: AlertCircle,
    colorText: "text-blue-600 dark:text-blue-400",
    colorBg: "bg-blue-50 dark:bg-blue-950/40",
    activeBorder: "border-blue-500 ring-2 ring-blue-500/30",
  },
  {
    id: "high",
    label: "High Urgency",
    description: "Major traffic obstruction or utility disruption",
    icon: AlertTriangle,
    colorText: "text-amber-600 dark:text-amber-400",
    colorBg: "bg-amber-50 dark:bg-amber-950/40",
    activeBorder: "border-amber-500 ring-2 ring-amber-500/30",
  },
  {
    id: "critical",
    label: "Critical Hazard",
    description: "Life-safety threat or structural collapse",
    icon: ShieldAlert,
    colorText: "text-rose-600 dark:text-rose-400",
    colorBg: "bg-rose-50 dark:bg-rose-950/40",
    activeBorder: "border-rose-500 ring-2 ring-rose-500/30",
  },
];

/**
 * PrioritySelector (Motion Brew MotionCard)
 * Animated interactive severity radio cards
 */
export function PrioritySelector({
  value = "medium",
  onChange,
  className = "",
}) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-2.5", className)}>
      {PRIORITIES.map((p) => {
        const isSelected = value?.toLowerCase() === p.id;
        const Icon = p.icon;

        return (
          <motion.div
            key={p.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(p.id)}
            className={cn(
              "relative p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none",
              isSelected
                ? `${p.colorBg} ${p.activeBorder} shadow-xs`
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            )}
          >
            {/* Severity Icon */}
            <div
              className={cn(
                "size-8 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                isSelected
                  ? "bg-white dark:bg-slate-800 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              )}
            >
              <Icon className={cn("size-4", isSelected ? p.colorText : "text-slate-400")} />
            </div>

            {/* Label & Description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={cn("text-xs font-bold", isSelected ? p.colorText : "text-slate-800 dark:text-slate-200")}>
                  {p.label}
                </span>

                {/* Radio Circle */}
                <div
                  className={cn(
                    "size-4 rounded-full border flex items-center justify-center transition-colors",
                    isSelected
                      ? "border-current bg-current text-white dark:text-slate-900"
                      : "border-slate-300 dark:border-slate-700"
                  )}
                >
                  {isSelected && <div className="size-1.5 rounded-full bg-white dark:bg-slate-950" />}
                </div>
              </div>
              <p className="mt-0.5 text-[11px] text-muted leading-tight">
                {p.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default PrioritySelector;
