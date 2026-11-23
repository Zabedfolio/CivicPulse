"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  Eye,
  UserCheck,
  Wrench,
  Lock,
  ArrowDown,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TIMELINE_STAGES = [
  {
    status: "Submitted",
    title: "1. Incident Submitted & Audited",
    description: "Citizen reported problem with GPS coordinates & photo evidence.",
    icon: Clock,
  },
  {
    status: "Under Review",
    title: "2. Departmental Triage",
    description: "Municipal manager verified report and designated severity priority.",
    icon: Eye,
  },
  {
    status: "Assigned",
    title: "3. Maintenance Crew Assigned",
    description: "Technical staff assigned with repair equipment and due date.",
    icon: UserCheck,
  },
  {
    status: "In Progress",
    title: "4. Physical Repair Underway",
    description: "On-site civil/engineering crews initiated physical restoration.",
    icon: Wrench,
  },
  {
    status: "Resolved",
    title: "5. Work Completed & Documented",
    description: "Repair finished with photographic completion proof uploaded.",
    icon: CheckCircle2,
  },
  {
    status: "Closed",
    title: "6. Citizen Audit & Ticket Closed",
    description: "Resolution confirmed by citizen feedback or executive audit.",
    icon: Lock,
  },
];

const STATUS_RANKS = {
  Submitted: 1,
  "Under Review": 2,
  Assigned: 3,
  "In Progress": 4,
  Resolved: 5,
  Closed: 6,
};

function formatTimestamp(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function StatusTimeline({ currentStatus = "Submitted", history = [] }) {
  const currentRank = STATUS_RANKS[currentStatus] || 1;

  // Build a map of history entries by toStatus for rapid lookup
  const historyByStatus = {};
  if (Array.isArray(history)) {
    history.forEach((h) => {
      if (h.toStatus) {
        historyByStatus[h.toStatus] = h;
      }
    });
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-[#0D9488] border border-teal-200 dark:border-teal-800 mb-1">
            <Sparkles className="w-3 h-3" />
            Live Municipal Audit Trail
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Repair Lifecycle Progress
          </h3>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono font-semibold text-muted">
            Stage {currentRank} of 6
          </span>
        </div>
      </div>

      {/* Vertical Stepper Container */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {TIMELINE_STAGES.map((stage, idx) => {
          const stageRank = idx + 1;
          const isCompleted = currentRank > stageRank;
          const isCurrent = currentRank === stageRank;
          const isPending = currentRank < stageRank;

          const historyItem = historyByStatus[stage.status];
          const Icon = stage.icon;

          return (
            <div key={stage.status} className="relative group">
              {/* Stepper Node Icon */}
              <div
                className={cn(
                  "absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 z-10",
                  isCompleted &&
                    "bg-emerald-500 text-white shadow-md shadow-emerald-500/20",
                  isCurrent &&
                    "bg-[#0D9488] text-white ring-4 ring-teal-500/20 shadow-lg shadow-teal-500/30 scale-110",
                  isPending &&
                    "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                ) : (
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                )}
              </div>

              {/* Step Content */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4
                    className={cn(
                      "text-xs sm:text-sm font-bold tracking-tight",
                      isCurrent && "text-[#0D9488] dark:text-teal-400 font-extrabold",
                      isCompleted && "text-slate-900 dark:text-white",
                      isPending && "text-slate-400 dark:text-slate-600"
                    )}
                  >
                    {stage.title}
                  </h4>

                  {historyItem?.createdAt && (
                    <span className="text-[11px] font-mono text-muted">
                      {formatTimestamp(historyItem.createdAt)}
                    </span>
                  )}
                </div>

                <p
                  className={cn(
                    "mt-0.5 text-xs",
                    isPending
                      ? "text-slate-400 dark:text-slate-600"
                      : "text-muted"
                  )}
                >
                  {stage.description}
                </p>

                {/* Official Actor Audit Box if entry exists */}
                {historyItem && (
                  <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488]" />
                      <span>
                        Verified by: {historyItem.changedBy?.name || "Municipal Dispatch Unit"}
                      </span>
                      {historyItem.role && (
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-teal-50 dark:bg-teal-950 text-[#0D9488] border border-teal-200 dark:border-teal-800">
                          {historyItem.role}
                        </span>
                      )}
                    </div>
                    {historyItem.note && (
                      <p className="text-slate-600 dark:text-slate-400 italic">
                        "{historyItem.note}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
