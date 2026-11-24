"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  ArrowRight,
  MapPin,
  Calendar,
  User,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRIORITY_BADGES = {
  critical: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900",
  high: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900",
  medium: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900",
  low: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

/**
 * IssueDataTable (Motion Brew DataTableSpring)
 * Responsive data table with staggered row reveals, sort indicators, and action triggers
 */
export function IssueDataTable({
  issues = [],
  isLoading = false,
  onInspect,
  className = "",
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 450,
        damping: 32,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse flex items-center justify-between px-4"
          >
            <div className="space-y-2 w-1/3">
              <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
            </div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-20" />
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-24" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="w-full text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="size-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#0D9488] mx-auto flex items-center justify-center mb-3">
          <AlertCircle className="size-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No Issues Found
        </h3>
        <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
          No reports match the currently selected search query, status, or priority filters.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header */}
          <thead className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold text-muted uppercase tracking-wider select-none">
            <tr>
              <th className="px-5 py-3.5">Ticket & Headline</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">Priority</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Reporter</th>
              <th className="px-4 py-3.5">Reported</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>

          {/* Staggered Rows */}
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="divide-y divide-slate-100 dark:divide-slate-800/60"
          >
            {issues.map((issue) => {
              const ticketId = `CP-2026-${(issue._id || "").toString().slice(-4).toUpperCase()}`;
              const priorityClass =
                PRIORITY_BADGES[issue.priority?.toLowerCase()] || PRIORITY_BADGES.medium;
              const formattedDate = issue.createdAt
                ? new Date(issue.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recent";

              return (
                <motion.tr
                  key={issue._id}
                  variants={rowVariants}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Ticket & Headline */}
                  <td className="px-5 py-4 min-w-[240px]">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[11px] font-extrabold text-[#0D9488]">
                        #{ticketId}
                      </span>
                      <Link
                        href={`/issues/${issue._id}`}
                        className="font-bold text-slate-900 dark:text-white hover:text-[#0D9488] transition-colors truncate max-w-sm text-sm"
                        title={issue.title}
                      >
                        {issue.title}
                      </Link>
                      <span className="flex items-center gap-1 text-[11px] text-muted truncate max-w-xs">
                        <MapPin className="size-3 shrink-0 text-slate-400" />
                        <span className="truncate">{issue.address || "Chattogram, Bangladesh"}</span>
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {issue.category}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border",
                        priorityClass
                      )}
                    >
                      {issue.priority || "medium"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge status={issue.status} />
                  </td>

                  {/* Reporter */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-teal-100 dark:bg-teal-950 text-[#0D9488] flex items-center justify-center font-bold text-xs uppercase overflow-hidden shrink-0">
                        {issue.reporter?.image ? (
                          <img
                            src={issue.reporter.image}
                            alt={issue.reporter.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          issue.reporter?.name?.charAt(0) || <User className="size-3.5" />
                        )}
                      </div>
                      <div className="flex flex-col leading-tight min-w-0">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                          {issue.reporter?.name || "Citizen"}
                        </span>
                        <span className="text-[10px] text-muted truncate max-w-[120px]">
                          {issue.reporter?.email || "anonymous"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Reported Date */}
                  <td className="px-4 py-4 whitespace-nowrap text-muted text-[11px]">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3 text-slate-400" />
                      <span>{formattedDate}</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onInspect ? (
                        <button
                          type="button"
                          onClick={() => onInspect(issue)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#0D9488] bg-teal-50 dark:bg-teal-950/80 hover:bg-teal-100 dark:hover:bg-teal-900 border border-teal-200/80 dark:border-teal-800/80 transition-colors cursor-pointer"
                        >
                          <span>Triage</span>
                          <ArrowRight className="size-3" />
                        </button>
                      ) : (
                        <Link
                          href={`/issues/${issue._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#0D9488] bg-teal-50 dark:bg-teal-950/80 hover:bg-teal-100 dark:hover:bg-teal-900 border border-teal-200/80 dark:border-teal-800/80 transition-colors"
                        >
                          <span>Triage</span>
                          <ArrowRight className="size-3" />
                        </Link>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}

export default IssueDataTable;
