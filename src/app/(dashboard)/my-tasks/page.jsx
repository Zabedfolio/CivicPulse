"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RoleGate } from "@/components/layout/RoleGate";
import { useSession } from "@/lib/auth-client";
import {
  ListTodo,
  CheckCircle2,
  Clock,
  Camera,
  Navigation,
  MapPin,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function FieldStaffTasksPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Placeholder assigned field tasks
  const assignedTasks = [
    {
      id: "TASK-4821",
      reportId: "CP-2026-4821",
      title: "Resurface 45cm asphalt pothole hazard",
      location: "Agrabad Commercial Area (Crossway #4)",
      coordinates: "22.3255° N, 91.8123° E",
      priority: "CRITICAL",
      priorityColor: "bg-red-50 text-red-600 border-red-200",
      status: "In Progress",
      assignedAt: "Today, 08:00 AM",
      dueBy: "Today, 05:00 PM",
      materials: "Hot-mix asphalt, compaction roller",
    },
    {
      id: "TASK-4799",
      reportId: "CP-2026-4799",
      title: "Replace faulty high-pressure sodium lamp with LED",
      location: "O.R. Nizam Avenue, Near GEC Circle",
      coordinates: "22.3590° N, 91.8210° E",
      priority: "HIGH",
      priorityColor: "bg-amber-50 text-amber-600 border-amber-200",
      status: "Assigned",
      assignedAt: "Yesterday, 04:30 PM",
      dueBy: "Tomorrow, 12:00 PM",
      materials: "120W LED Luminaire, boom truck",
    },
  ];

  return (
    <RoleGate allowedRoles={["staff", "admin"]}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Field Staff Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-teal-500/10 border border-purple-200 dark:border-purple-900/60">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 mb-2">
              <ListTodo className="w-3.5 h-3.5" />
              <span>Field Maintenance Crew Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              My Active Repair Work Orders
            </h1>
            <p className="mt-1 text-sm text-muted">
              Staff: <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span> ({user?.email}) · Mobile On-Site Inspection & Verification
            </p>
          </div>
        </div>

        {/* Task Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted uppercase">Assigned to Me</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">2</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 flex items-center justify-center font-bold">
              2
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted uppercase">In Progress (Active)</div>
              <div className="text-2xl font-extrabold text-teal-600 mt-1">1</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0D9488] dark:bg-teal-950 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted uppercase">Resolved This Week</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">9</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Task Cards */}
        <div className="space-y-4">
          {assignedTasks.map((task) => (
            <div
              key={task.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {task.id} (Ticket #{task.reportId})
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${task.priorityColor}`}>
                    {task.priority}
                  </span>
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    {task.status}
                  </span>
                </div>
                <div className="text-xs text-muted">
                  Due by: <span className="font-semibold text-slate-700 dark:text-slate-300">{task.dueBy}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {task.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-1.5">
                  <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    {task.location}
                  </span>
                  <span>·</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {task.coordinates}
                  </span>
                  <span>·</span>
                  <span>Equipment: {task.materials}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D9488] hover:underline"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Open Navigation GPS
                </a>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Camera className="w-3.5 h-3.5 mr-1" />
                    Upload Photo Proof
                  </Button>
                  <Button variant="primary" size="sm">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Mark Resolved
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleGate>
  );
}
