"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { RoleGate } from "@/components/layout/RoleGate";
import { useSession } from "@/lib/auth-client";
import { TabBar } from "@/components/ui/TabBar";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressNoteModal } from "@/components/tasks/ProgressNoteModal";
import { CompletionProofModal } from "@/components/tasks/CompletionProofModal";
import {
  ListTodo,
  CheckCircle2,
  Clock,
  Camera,
  Navigation,
  MapPin,
  Sparkles,
  AlertCircle,
  FileText,
  Loader2,
  Play,
  ArrowRight,
  Calendar,
  AlertTriangle,
  ImageIcon,
} from "lucide-react";

const TASK_TABS = [
  { id: "all", label: "All Tasks" },
  { id: "Pending", label: "Pending" },
  { id: "In Progress", label: "In Progress" },
  { id: "Completed", label: "Completed" },
];

const PRIORITY_BADGES = {
  critical: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900",
  high: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900",
  medium: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900",
  low: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

export default function FieldStaffTasksPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [tasks, setTasks] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeNoteTask, setActiveNoteTask] = useState(null);
  const [activeProofTask, setActiveProofTask] = useState(null);
  const [startingTaskId, setStartingTaskId] = useState(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/v1/tasks?limit=50", {
        credentials: "include",
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to load maintenance tasks.");
      }

      setTasks(json.data?.tasks || []);
    } catch (err) {
      setError(err.message || "Failed to fetch work orders.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Start work on a task (Pending -> In Progress)
  const handleStartWork = async (taskId) => {
    setStartingTaskId(taskId);
    try {
      const res = await fetch(`http://localhost:5000/api/v1/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: "In Progress",
          note: "Technician began repair work on-site",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to start work order.");
      }

      // Refresh task list
      fetchTasks();
    } catch (err) {
      alert(err.message || "Failed to start task.");
    } finally {
      setStartingTaskId(null);
    }
  };

  // Filter tasks based on selected tab
  const filteredTasks = tasks.filter((t) => {
    if (selectedTab === "all") return true;
    return t.status === selectedTab;
  });

  // Calculate live metric counts
  const pendingCount = tasks.filter((t) => t.status === "Pending").length;
  const inProgressCount = tasks.filter((t) => t.status === "In Progress").length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  return (
    <RoleGate allowedRoles={["staff", "admin"]}>
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Field Staff Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-cyan-500/10 border border-teal-200/80 dark:border-teal-900/60">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 mb-2">
              <ListTodo className="size-3.5" />
              <span>Field Engineering Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              My Active Repair Work Orders
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              Technician: <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span> ({user?.email}) · Mobile On-Site Inspection &amp; Verification
            </p>
          </div>
        </div>

        {/* Live Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted uppercase">Pending Start</div>
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                {pendingCount}
              </div>
            </div>
            <div className="size-10 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 flex items-center justify-center font-bold">
              {pendingCount}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted uppercase">In Progress (Active)</div>
              <div className="text-2xl font-extrabold text-[#0D9488] mt-1">
                {inProgressCount}
              </div>
            </div>
            <div className="size-10 rounded-xl bg-teal-50 text-[#0D9488] dark:bg-teal-950 flex items-center justify-center">
              <Clock className="size-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted uppercase">Completed Repairs</div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {completedCount}
              </div>
            </div>
            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 flex items-center justify-center">
              <CheckCircle2 className="size-5" />
            </div>
          </div>
        </div>

        {/* Filter TabBar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {TASK_TABS.map((tab) => {
              const isSelected = selectedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.id === "all" && <span className="ml-1.5 opacity-70">({tasks.length})</span>}
                  {tab.id === "Pending" && <span className="ml-1.5 opacity-70">({pendingCount})</span>}
                  {tab.id === "In Progress" && <span className="ml-1.5 opacity-70">({inProgressCount})</span>}
                  {tab.id === "Completed" && <span className="ml-1.5 opacity-70">({completedCount})</span>}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={fetchTasks}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
          >
            Refresh Roster
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Tasks List */}
        {isLoading ? (
          <div className="p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3 text-muted">
            <Loader2 className="size-8 animate-spin text-[#0D9488]" />
            <span className="text-sm font-semibold">Loading your assigned work orders...</span>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            <div className="size-14 rounded-2xl bg-teal-50 dark:bg-teal-950 text-[#0D9488] flex items-center justify-center mb-3">
              <CheckCircle2 className="size-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No Work Orders in This View
            </h3>
            <p className="text-xs text-muted max-w-sm mt-1">
              You currently have no tasks matching the selected filter. As municipal managers dispatch new work orders, they will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const taskPriority = task.priority || "medium";
              const priorityClass =
                PRIORITY_BADGES[taskPriority] || PRIORITY_BADGES.medium;
              const issueTicketId = task.issue?._id
                ? `CP-2026-${task.issue._id.toString().slice(-4).toUpperCase()}`
                : "TICKET";

              const coords = task.issue?.location?.coordinates;
              const coordString = coords ? `${coords[1]?.toFixed(4)}° N, ${coords[0]?.toFixed(4)}° E` : "";
              const mapsUrl = coords
                ? `https://www.google.com/maps/search/?api=1&query=${coords[1]},${coords[0]}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.issue?.address || "Chattogram")}`;

              return (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
                >
                  {/* Card Top Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        #{issueTicketId}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${priorityClass}`}
                      >
                        {taskPriority}
                      </span>
                      <StatusBadge status={task.status} />
                      {task.department && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {task.department.code || task.department.name}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-muted flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-slate-400" />
                      <span>
                        Target Due Date:{" "}
                        <strong className="text-slate-800 dark:text-slate-200">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "ASAP"}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Title & Location */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {task.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-1.5">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                        <MapPin className="size-3.5 text-teal-600" />
                        <span>{task.issue?.address || "On-Site Location"}</span>
                      </span>
                      {coordString && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-[11px] text-slate-400">{coordString}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Engineering Instructions & Latest Progress */}
                  {task.instructions && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                        Directives from Manager:
                      </span>
                      <p className="text-slate-600 dark:text-slate-300">{task.instructions}</p>
                    </div>
                  )}

                  {/* Latest Progress Report Snippet */}
                  {task.progressReports && task.progressReports.length > 0 && (
                    <div className="p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/50 dark:border-teal-800/50 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-teal-900 dark:text-teal-200 text-[11px] uppercase tracking-wider">
                          Latest On-Site Progress ({task.progressReports.length} update{task.progressReports.length > 1 ? "s" : ""})
                        </span>
                        <span className="text-[10px] text-muted">
                          {new Date(task.progressReports[task.progressReports.length - 1].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-teal-800 dark:text-teal-300 font-medium">
                        "{task.progressReports[task.progressReports.length - 1].note}"
                      </p>
                    </div>
                  )}

                  {/* Completion Photos Gallery */}
                  {task.completionPhotos && task.completionPhotos.length > 0 && (
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">
                        Resolution Proof Attached ({task.completionPhotos.length})
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {task.completionPhotos.map((photo, pIdx) => (
                          <a
                            key={pIdx}
                            href={photo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-20 rounded-xl overflow-hidden border border-emerald-300 dark:border-emerald-800 bg-slate-900 block group relative"
                          >
                            <img
                              src={photo.url}
                              alt="Repair proof"
                              className="size-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons Toolbar */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D9488] hover:underline"
                    >
                      <Navigation className="size-3.5" />
                      <span>Open Navigation GPS</span>
                    </a>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Start Work Action (if Pending) */}
                      {task.status === "Pending" && (
                        <button
                          type="button"
                          onClick={() => handleStartWork(task._id)}
                          disabled={startingTaskId === task._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 transition-colors cursor-pointer"
                        >
                          {startingTaskId === task._id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Play className="size-3.5 fill-current" />
                          )}
                          <span>Start Work</span>
                        </button>
                      )}

                      {/* Add Progress Note */}
                      {task.status !== "Completed" && (
                        <button
                          type="button"
                          onClick={() => setActiveNoteTask(task)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                        >
                          <FileText className="size-3.5" />
                          <span>Progress Note</span>
                        </button>
                      )}

                      {/* Upload Photo Proof & Complete */}
                      {task.status !== "Completed" ? (
                        <MagneticButton
                          variant="primary"
                          size="sm"
                          onClick={() => setActiveProofTask(task)}
                          className="!bg-emerald-600 hover:!bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 px-3.5 py-1.5 shadow-sm"
                        >
                          <Camera className="size-3.5" />
                          <span>Upload Proof &amp; Resolve</span>
                        </MagneticButton>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="size-4" />
                          <span>Resolved &amp; Closed</span>
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Progress Note Modal */}
        <ProgressNoteModal
          isOpen={Boolean(activeNoteTask)}
          task={activeNoteTask}
          onClose={() => setActiveNoteTask(null)}
          onNoteAdded={() => {
            fetchTasks();
            setActiveNoteTask(null);
          }}
        />

        {/* Completion Photo Proof Modal */}
        <CompletionProofModal
          isOpen={Boolean(activeProofTask)}
          task={activeProofTask}
          onClose={() => setActiveProofTask(null)}
          onProofUploaded={() => {
            fetchTasks();
            setActiveProofTask(null);
          }}
        />
      </div>
    </RoleGate>
  );
}
