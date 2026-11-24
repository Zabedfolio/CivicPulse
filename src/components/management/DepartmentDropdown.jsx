"use client";

import React from "react";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * DepartmentDropdown
 * Clean department re-routing selector with division codes
 */
export function DepartmentDropdown({
  departments = [],
  currentDepartmentId = null,
  selectedDepartmentId = "",
  onChange,
  disabled = false,
  className = "",
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Building2 className="size-4" />
      </div>
      <select
        value={selectedDepartmentId}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-teal-500 disabled:opacity-50 cursor-pointer shadow-xs"
      >
        <option value="">Keep current department</option>
        {departments.map((dept) => {
          const isCurrent = dept._id === currentDepartmentId;
          return (
            <option key={dept._id} value={dept._id}>
              {dept.name} ({dept.code}) {isCurrent ? "— [Current]" : ""}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default DepartmentDropdown;
