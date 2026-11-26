"use client";

import React from "react";
import Link from "next/link";
import { RoleGate } from "@/components/layout/RoleGate";
import { useSession } from "@/lib/auth-client";
import {
  FilePlus2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CitizenDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Placeholder citizen activity
  const activeReports = [
    {
      id: "CP-2026-4821",
      title: "Deep pothole near Agrabad Circle crossway",
      category: "Road Damage",
      status: "In Progress",
      statusColor: "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950/50",
      createdAt: "Yesterday at 09:30 AM",
      address: "Agrabad C/A, Ward 24, Chittagong",
      assignedCrew: "Chittagong Road Maintenance Unit #4",
    },
    {
      id: "CP-2026-4790",
      title: "Broken streetlight luminaire on O.R. Nizam Ave",
      category: "Streetlight",
      status: "Under Review",
      statusColor: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/50",
      createdAt: "Nov 20, 2026",
      address: "GEC Circle, Ward 15, Chittagong",
      assignedCrew: "Pending Triage",
    },
    {
      id: "CP-2026-4610",
      title: "Stormwater drain silt overflow after monsoon downpour",
      category: "Drainage",
      status: "Resolved",
      statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50",
      createdAt: "Nov 15, 2026",
      address: "Port Access Road, Chittagong",
      assignedCrew: "Drainage Works Div #2",
    },
  ];

  return (
    <RoleGate allowedRoles={["citizen", "manager", "staff", "admin"]}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-500/10 via-teal-500/5 to-cyan-500/10 border border-teal-200 dark:border-teal-900/60">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-[#0D9488] dark:bg-teal-900/60 dark:text-teal-300 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Citizen Service Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Welcome back, {user?.name || "Citizen"}
            </h1>
            <p className="mt-1 text-sm text-muted">
              Track your reported neighborhood hazards and monitor municipal repair progress live.
            </p>
          </div>
          <Link href="/issues/new" className="shrink-0">
            <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold shadow-md whitespace-nowrap">
              <FilePlus2 className="w-4 h-4 mr-2 shrink-0" />
              Report New Issue
            </Button>
          </Link>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted uppercase">Total Reported</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">3</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0D9488] dark:bg-teal-950 flex items-center justify-center font-bold">
              3
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted uppercase">In Progress</div>
              <div className="text-2xl font-extrabold text-purple-600 mt-1">1</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted uppercase">Verified Resolved</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">1</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Recent Reports List */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                My Reported Neighborhood Issues
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Real-time status updates from assigned municipal crews
              </p>
            </div>
            <Link href="/issues/new">
              <Button variant="outline" size="sm">
                New Report
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-border">
            {activeReports.map((report) => (
              <div key={report.id} className="p-5 sm:p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        #{report.id}
                      </span>
                      <span className="text-xs font-medium text-slate-400">·</span>
                      <span className="text-xs font-bold text-[#0D9488]">
                        {report.category}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${report.statusColor}`}>
                        {report.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {report.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted pt-1">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {report.address}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {report.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <div className="text-right text-xs hidden sm:block">
                      <div className="text-[10px] text-muted uppercase">Assigned Unit</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">
                        {report.assignedCrew}
                      </div>
                    </div>
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
