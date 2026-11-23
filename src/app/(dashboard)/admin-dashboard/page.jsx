"use client";

import React from "react";
import Link from "next/link";
import { RoleGate } from "@/components/layout/RoleGate";
import { useSession } from "@/lib/auth-client";
import {
  ShieldCheck,
  Building2,
  Users,
  Activity,
  AlertTriangle,
  FileText,
  BarChart3,
  Server,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Placeholder municipal system metrics
  const departmentHealth = [
    { name: "Road Maintenance Engineering", sla: "96.4%", activeIssues: 28, staff: 18, status: "Healthy" },
    { name: "Electrical & Public Lighting", sla: "98.8%", activeIssues: 12, staff: 14, status: "Optimal" },
    { name: "Drainage & Stormwater Board", sla: "91.2%", activeIssues: 45, staff: 22, status: "High Load" },
    { name: "Waste Management Directorate", sla: "97.5%", activeIssues: 19, staff: 26, status: "Healthy" },
  ];

  return (
    <RoleGate allowedRoles={["admin"]}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white border border-slate-700 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Administrator Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              City Infrastructure Command Center
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Admin: <span className="font-semibold text-white">{user?.name}</span> ({user?.email}) · Full Municipal Governance & SLA Audits
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Settings className="w-4 h-4 mr-2" />
              System Config
            </Button>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
            <div className="text-xs font-semibold text-muted uppercase">Total Registered Citizens</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">4,850</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">+142 this week</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
            <div className="text-xs font-semibold text-muted uppercase">Municipal Departments</div>
            <div className="text-2xl font-extrabold text-[#0D9488] mt-1">6</div>
            <p className="text-[11px] text-muted mt-1">Active SLA monitored</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
            <div className="text-xs font-semibold text-muted uppercase">City-Wide On-Time SLA</div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">94.8%</div>
            <p className="text-[11px] text-muted mt-1">Target: &gt; 90%</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
            <div className="text-xs font-semibold text-muted uppercase">Active Field Staff</div>
            <div className="text-2xl font-extrabold text-purple-600 mt-1">80</div>
            <p className="text-[11px] text-muted mt-1">Across 41 wards</p>
          </div>
        </div>

        {/* Department Health Overview */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Department SLA Audit & Workload
              </h2>
              <p className="text-xs text-muted">
                Real-time performance metrics and active workload per municipal engineering division
              </p>
            </div>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-1" />
              Export SLA Report
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-muted uppercase border-b border-border">
                <tr>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">SLA Compliance</th>
                  <th className="px-6 py-3.5">Active Incidents</th>
                  <th className="px-6 py-3.5">Staff Count</th>
                  <th className="px-6 py-3.5">Operating Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {departmentHealth.map((dept, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {dept.name}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-600">
                      {dept.sla}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                      {dept.activeIssues} open
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                      {dept.staff} deployed
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-[#0D9488] border border-teal-200 dark:bg-teal-950 dark:border-teal-800">
                        {dept.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
