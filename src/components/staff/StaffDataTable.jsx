"use client";

import React from "react";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  XCircle,
  Edit2,
  FolderOpen,
  Briefcase,
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";
import { StaffWorkloadBadge } from "@/components/teams/StaffWorkloadBadge";

/**
 * StaffDataTable
 * Administrative and managerial workforce registry table with real-time capacity monitoring
 */
export function StaffDataTable({
  staff = [],
  isLoading = false,
  onEdit,
}) {
  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (staff.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
        <div className="size-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mx-auto flex items-center justify-center mb-4">
          <FolderOpen className="size-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          No Staff Members Found
        </h3>
        <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
          No technicians or staff members are currently listed under this division. Click &quot;Onboard Technician&quot; to add team members.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      {/* Mobile Card List (< 640px) */}
      <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {staff.map((member) => {
          const isActive = member.isActive !== false;
          const dept = member.department;
          const activeCount = member.activeTasks || 0;

          return (
            <div key={member._id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-9 rounded-2xl bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="size-full object-cover" />
                    ) : (
                      member.name?.charAt(0) || <User className="size-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {member.name}
                    </div>
                    <div className="text-[11px] text-muted truncate">{member.email}</div>
                  </div>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                  }`}
                >
                  {isActive ? "Active" : "Suspended"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                {dept && (
                  <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-[#0D9488] border border-teal-200 dark:border-teal-800">
                    {dept.code}
                  </span>
                )}
                <StaffWorkloadBadge activeTasks={activeCount} />
                <span className="text-[10px] font-mono font-bold text-muted">
                  ({activeCount} active / {member.completedTasks || 0} done)
                </span>
              </div>

              <button
                type="button"
                onClick={() => onEdit(member)}
                className="w-full min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-[#0D9488] transition-colors cursor-pointer"
              >
                <Edit2 className="size-3.5" />
                <span>Edit Technician</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Tablet & Desktop Table (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-black uppercase text-muted tracking-wider">
              <th className="py-3.5 px-5">Technician</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Capacity Load</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {staff.map((member, idx) => {
              const isActive = member.isActive !== false;
              const dept = member.department;
              const activeCount = member.activeTasks || 0;

              return (
                <motion.tr
                  key={member._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Name, Avatar, Email */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-2xl bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="size-full object-cover" />
                        ) : member.name ? (
                          member.name.charAt(0)
                        ) : (
                          <User className="size-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-slate-900 dark:text-white truncate">
                          {member.name}
                        </div>
                        <div className="text-[11px] text-muted flex items-center gap-2 truncate">
                          <span>{member.email}</span>
                          {member.phone && (
                            <span className="flex items-center gap-0.5">
                              • <Phone className="size-2.5 text-teal-600 inline ml-0.5" />
                              {member.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4">
                    {dept ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-[#0D9488] border border-teal-200 dark:border-teal-800">
                          {dept.code}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                          {dept.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted italic">Floating / Unassigned</span>
                    )}
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        member.role === "manager"
                          ? "bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                          : "bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                      }`}
                    >
                      <Briefcase className="size-2.5" />
                      <span>{member.role === "manager" ? "Supervisor" : "Technician"}</span>
                    </span>
                  </td>

                  {/* Capacity Load */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <StaffWorkloadBadge activeTasks={activeCount} />
                      <span className="text-[10px] font-mono font-bold text-muted">
                        ({activeCount} active / {member.completedTasks || 0} done)
                      </span>
                    </div>
                  </td>

                  {/* Account Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                      }`}
                    >
                      {isActive ? (
                        <CheckCircle2 className="size-3 text-emerald-600" />
                      ) : (
                        <XCircle className="size-3 text-rose-600" />
                      )}
                      <span>{isActive ? "Active" : "Suspended"}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => onEdit(member)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-[#0D9488] dark:hover:bg-teal-950 dark:hover:text-teal-300 transition-colors cursor-pointer"
                    >
                      <Edit2 className="size-3" />
                      <span>Edit</span>
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffDataTable;
