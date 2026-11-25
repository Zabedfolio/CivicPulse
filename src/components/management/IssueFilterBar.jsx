"use client";

import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUSES = [
  { id: "all", label: "All Statuses" },
  { id: "Submitted", label: "Submitted" },
  { id: "Under Review", label: "Under Review" },
  { id: "Assigned", label: "Assigned" },
  { id: "In Progress", label: "In Progress" },
  { id: "Resolved", label: "Resolved" },
  { id: "Closed", label: "Closed" },
];

const PRIORITIES = [
  { id: "all", label: "All Priorities" },
  { id: "low", label: "Low", color: "bg-slate-400" },
  { id: "medium", label: "Medium", color: "bg-blue-500" },
  { id: "high", label: "High", color: "bg-amber-500" },
  { id: "critical", label: "Critical", color: "bg-rose-500" },
];

const CATEGORIES = [
  "All Categories",
  "Road Damage",
  "Streetlight",
  "Drainage",
  "Footpath",
  "Waste Management",
  "Public Infrastructure",
];

const SORT_OPTIONS = [
  { id: "createdAt_desc", label: "Newest First", sortBy: "createdAt", sortOrder: "desc" },
  { id: "createdAt_asc", label: "Oldest First", sortBy: "createdAt", sortOrder: "asc" },
  { id: "priority_desc", label: "Highest Priority", sortBy: "priority", sortOrder: "desc" },
  { id: "status_asc", label: "Status (A–Z)", sortBy: "status", sortOrder: "asc" },
];

export function IssueFilterBar({
  selectedStatus = "all",
  onStatusChange,
  selectedPriority = "all",
  onPriorityChange,
  selectedCategory = "All Categories",
  onCategoryChange,
  selectedDepartment = "all",
  onDepartmentChange,
  departments = [],
  sortOption = "createdAt_desc",
  onSortChange,
  onReset,
  showDepartmentFilter = false,
  className = "",
}) {
  const isFiltered =
    selectedStatus !== "all" ||
    selectedPriority !== "all" ||
    selectedCategory !== "All Categories" ||
    selectedDepartment !== "all" ||
    sortOption !== "createdAt_desc";

  return (
    <div className={cn("space-y-3.5", className)}>
      {/* Mobile Compact 2-Col Select Grid (< 640px) */}
      <div className="sm:hidden grid grid-cols-2 gap-2 text-xs">
        <select
          aria-label="Filter by Status"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="min-h-[40px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
        >
          {STATUSES.map((st) => (
            <option key={st.id} value={st.id}>
              {st.label}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by Priority"
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="min-h-[40px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
        >
          {PRIORITIES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Primary Row: Status Pills & Action (>= 640px) */}
      <div className="hidden sm:flex flex-wrap items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {STATUSES.map((st) => {
            const isActive = selectedStatus === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onStatusChange(st.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border cursor-pointer",
                  isActive
                    ? "bg-[#0D9488] text-white border-teal-600 shadow-sm shadow-teal-500/20"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700"
                )}
              >
                {st.label}
              </button>
            );
          })}
        </div>

        {/* Reset button */}
        {isFiltered && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Secondary Row: Priority Pills (>=640px), Category Dropdown, Department Dropdown, Sort */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 pt-1 text-xs">
        {/* Priority Filter (>= 640px) */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-50 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400 px-1.5">Priority:</span>
          {PRIORITIES.map((p) => {
            const isActive = selectedPriority === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onPriorityChange(p.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  isActive
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                {p.color && <span className={cn("size-2 rounded-full", p.color)} />}
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-1.5">
          <select
            aria-label="Filter by Category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full sm:w-auto min-h-[40px] sm:min-h-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer shadow-xs"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Optional Department Filter (Admins) */}
        {showDepartmentFilter && (
          <div className="flex items-center gap-1.5">
            <select
              aria-label="Filter by Department"
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="w-full sm:w-auto min-h-[40px] sm:min-h-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer shadow-xs"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d._id || d.code} value={d._id || d.code}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sort Selector */}
        <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5 sm:ml-auto">
          <span className="text-[11px] text-slate-400 shrink-0">Sort:</span>
          <select
            aria-label="Sort issues"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="flex-1 sm:flex-none min-h-[40px] sm:min-h-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer shadow-xs"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default IssueFilterBar;
