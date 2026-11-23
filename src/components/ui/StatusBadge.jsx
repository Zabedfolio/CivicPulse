"use client";

import React from "react";
import { CheckCircle2, Lock, Clock, Eye, UserCheck, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  Submitted: {
    label: "Submitted",
    bg: "bg-slate-100 dark:bg-slate-800/80",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-300 dark:border-slate-700",
    dot: "bg-slate-400",
    ping: "bg-slate-400/40",
    icon: Clock,
  },
  "Under Review": {
    label: "Under Review",
    bg: "bg-amber-50 dark:bg-amber-950/60",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-300 dark:border-amber-700/80",
    dot: "bg-amber-500",
    ping: "bg-amber-400/50",
    icon: Eye,
  },
  Assigned: {
    label: "Assigned",
    bg: "bg-blue-50 dark:bg-blue-950/60",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-300 dark:border-blue-700/80",
    dot: "bg-blue-500",
    ping: "bg-blue-400/50",
    icon: UserCheck,
  },
  "In Progress": {
    label: "In Progress",
    bg: "bg-purple-50 dark:bg-purple-950/60",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-300 dark:border-purple-700/80",
    dot: "bg-purple-500",
    ping: "bg-purple-400/50",
    icon: Wrench,
  },
  Resolved: {
    label: "Resolved",
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-300 dark:border-emerald-700/80",
    dot: "bg-emerald-500",
    ping: "bg-emerald-400/50",
    icon: CheckCircle2,
  },
  Closed: {
    label: "Closed",
    bg: "bg-slate-200 dark:bg-slate-850",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-300 dark:border-slate-700",
    dot: "bg-slate-500",
    ping: null,
    icon: Lock,
  },
};

export function StatusBadge({
  status = "Submitted",
  size = "sm",
  showIcon = false,
  className = "",
}) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Submitted;
  const Icon = config.icon;

  const isSmall = size === "sm";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border transition-all",
        config.bg,
        config.text,
        config.border,
        isSmall ? "px-2.5 py-0.5 text-[10px]" : "px-3.5 py-1 text-xs",
        className
      )}
    >
      {/* Pulse Beacon Indicator */}
      <span className="relative flex h-2 w-2">
        {config.ping && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              config.ping
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            config.dot
          )}
        />
      </span>

      {showIcon && Icon && <Icon className={isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} />}

      <span>{config.label}</span>
    </span>
  );
}
