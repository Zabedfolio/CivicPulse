"use client";

import React from "react";
import Link from "next/link";
import { RoleGate } from "@/components/layout/RoleGate";
import { useSession } from "@/lib/auth-client";
import {
  Building2,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  BarChart3,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DepartmentDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Placeholder Department Incident Queue
  const incomingQueue = [
    {
      id: "CP-2026-4912",
      title: "Uncovered drain culvert collapse near Agrabad Market",
      reporter: "Rahim Chowdhury",
      reportedAt: "25 mins ago",
      priority: "CRITICAL",
      priorityColor: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
      status: "Under Review",
      slaHoursLeft: "11h remaining",
    },
    {
      id: "CP-2026-4908",
      title: "Broken asphalt depression on Port Access Road Lane 2",
      reporter: "Nusrat Jahan",
      reportedAt: "1 hour ago",
      priority: "HIGH",
      priorityColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
      status: "Under Review",
      slaHoursLeft: "23h remaining",
    },
    {
      id: "CP-2026-4899",
      title: "Submerged sidewalk tile hazards along GEC Circle",
      reporter: "Tanvir Ahmed",
      reportedAt: "3 hours ago",
      priority: "MEDIUM",
      priorityColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
      status: "Under Review",
      slaHoursLeft: "45h remaining",
    },
  ];

  return (
    <RoleGate allowedRoles={["manager", "admin"]}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Manager Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-teal-500/10 border border-amber-200 dark:border-amber-900/60">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Department Operations & Triage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {user?.department || "Roads & Civil Infrastructure"} Division
            </h1>
            <p className="mt-1 text-sm text-muted">
              Logged in as Manager: <span className="font-semibold">{user?.name}</span> ({user?.email})
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="md">
              <BarChart3 className="w-4 h-4 mr-2" />
              SLA Analytics
            </Button>
          </div>
        </div>

        {/* Operational KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
            <div className="text-xs font-semibold text-muted uppercase">Unassigned Triage</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">3</div>
            <p className="text-[11px] text-muted mt-1">Requires crew assignment</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
            <div className="text-xs font-semibold text-muted uppercase">Active Dispatches</div>
            <div className="text-2xl font-extrabold text-purple-600 mt-1">8</div>
            <p className="text-[11px] text-muted mt-1">Crews currently on site</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
            <div className="text-xs font-semibold text-muted uppercase">On-Time SLA Rate</div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">98.2%</div>
            <p className="text-[11px] text-muted mt-1">Within department target</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
            <div className="text-xs font-semibold text-muted uppercase">Active Field Staff</div>
            <div className="text-2xl font-extrabold text-[#0D9488] mt-1">14</div>
            <p className="text-[11px] text-muted mt-1">Available for dispatch</p>
          </div>
        </div>

        {/* Incident Triage Queue */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Incoming Citizen Incident Queue
              </h2>
              <p className="text-xs text-muted">
                Review incoming citizen reports, check for 50m duplicates, and assign field maintenance crews
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                3 Pending Review
              </span>
            </div>
          </div>

          <div className="divide-y divide-border">
            {incomingQueue.map((item) => (
              <div key={item.id} className="p-5 sm:p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        #{item.id}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${item.priorityColor}`}>
                        {item.priority}
                      </span>
                      <span className="text-xs text-muted">
                        Reported by {item.reporter} ({item.reportedAt})
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-amber-600 font-semibold pt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>SLA Window: {item.slaHoursLeft}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm">
                      Check 50m Duplicate
                    </Button>
                    <Button variant="primary" size="sm">
                      Assign Field Crew
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
