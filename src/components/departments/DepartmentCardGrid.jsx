"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Building2,
  User,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Edit2,
  AlertTriangle,
  FolderOpen,
  Users,
  Activity,
  Layers,
} from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * DepartmentCardGrid
 * Visual card layout for municipal department registry with quick actions
 */
export function DepartmentCardGrid({
  departments = [],
  isLoading = false,
  onEdit,
  onToggleStatus,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-64 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 animate-pulse space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
            <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
        <div className="size-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mx-auto flex items-center justify-center mb-4">
          <FolderOpen className="size-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          No Departments Registered
        </h3>
        <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
          No municipal departments have been registered yet. Click &quot;Add Department&quot; above to create the first division.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((dept, idx) => {
        const isActive = dept.status !== "inactive";
        const manager = dept.manager;
        const metrics = dept.metrics || {
          staffCount: 0,
          activeIssuesCount: 0,
          totalIssuesCount: 0,
        };

        return (
          <motion.div
            key={dept._id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            className={`flex flex-col justify-between rounded-3xl border bg-white dark:bg-slate-900/90 p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-teal-500/40 ${
              isActive
                ? "border-slate-200/80 dark:border-slate-800"
                : "border-slate-200 dark:border-slate-800 opacity-75"
            }`}
          >
            <div>
              {/* Header: Code & Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950 text-[#0D9488] border border-teal-200 dark:border-teal-800">
                  {dept.code}
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {isActive ? (
                    <CheckCircle2 className="size-3 text-emerald-600" />
                  ) : (
                    <XCircle className="size-3 text-slate-500" />
                  )}
                  <span>{isActive ? "Active" : "Inactive"}</span>
                </span>
              </div>

              {/* Department Name & Description */}
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight line-clamp-1">
                {dept.name}
              </h3>
              <p className="mt-1 text-xs text-muted line-clamp-2 leading-relaxed">
                {dept.description || "Official municipal engineering and urban maintenance division."}
              </p>

              {/* Manager Card */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="size-9 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                  {manager?.image ? (
                    <img src={manager.image} alt={manager.name} className="size-full object-cover" />
                  ) : manager?.name ? (
                    manager.name.charAt(0)
                  ) : (
                    <User className="size-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-muted uppercase">
                    Department Head
                  </div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                    {manager?.name || "Unassigned"}
                  </div>
                  {manager?.email && (
                    <div className="text-[11px] text-muted truncate">
                      {manager.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Workload Metrics */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    {metrics.activeIssuesCount}
                  </div>
                  <div className="text-[9px] font-bold text-amber-600 uppercase">
                    Active Issues
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    {metrics.staffCount}
                  </div>
                  <div className="text-[9px] font-bold text-teal-600 uppercase">
                    Staff Techs
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    {metrics.totalIssuesCount}
                  </div>
                  <div className="text-[9px] font-bold text-muted uppercase">
                    Total Tickets
                  </div>
                </div>
              </div>

              {/* Categories Managed */}
              {dept.categories && dept.categories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {dept.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Contact & Action Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[11px] text-muted truncate">
                {dept.contactPhone && (
                  <span className="flex items-center gap-1 truncate">
                    <Phone className="size-3 text-teal-600" />
                    <span>{dept.contactPhone}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onEdit(dept)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-[#0D9488] dark:hover:bg-teal-950 dark:hover:text-teal-300 transition-colors cursor-pointer"
                >
                  <Edit2 className="size-3" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default DepartmentCardGrid;
