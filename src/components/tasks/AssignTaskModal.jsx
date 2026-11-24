"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { StaffWorkloadBadge } from "@/components/teams/StaffWorkloadBadge";
import {
  X,
  Wrench,
  User,
  Calendar,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
} from "lucide-react";

/**
 * AssignTaskModal (Motion Brew DialogSpring)
 * Work order dispatch dialog with real-time technician workload capacity selection
 */
export function AssignTaskModal({
  isOpen,
  issue,
  onClose,
  onTaskCreated,
}) {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [instructions, setInstructions] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Set default due date to 3 days from now
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    setDueDate(d.toISOString().split("T")[0]);
  }, [isOpen]);

  // Sync state whenever modal opens or issue changes
  useEffect(() => {
    if (issue) {
      setPriority(issue.priority || "medium");
      setInstructions("");
      setServerError("");
    }
  }, [issue, isOpen]);

  // Fetch technician workload for caller's department
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoadingStaff(true);

    fetch("http://localhost:5000/api/v1/tasks/workload", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data.success && Array.isArray(data.data?.staff)) {
            setStaffList(data.data.staff);
            // Default select the technician with the least active tasks
            if (data.data.staff.length > 0) {
              setSelectedStaffId(data.data.staff[0]._id);
            }
          }
          setIsLoadingStaff(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn("Failed to fetch staff workload:", err);
          setIsLoadingStaff(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !issue) return null;

  const ticketId = `CP-2026-${(issue._id || "").toString().slice(-4).toUpperCase()}`;
  const selectedStaff = staffList.find((s) => s._id === selectedStaffId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStaffId) {
      setServerError("Please select a field technician to dispatch this work order.");
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("http://localhost:5000/api/v1/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          issueId: issue._id,
          assignedTo: selectedStaffId,
          instructions: instructions.trim(),
          priority,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to create work order task.");
      }

      onTaskCreated?.(json.data?.task);
      onClose();
    } catch (err) {
      setServerError(err.message || "Failed to dispatch work order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md cursor-pointer"
          aria-hidden="true"
        />

        {/* Spring Dialog Card */}
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 32,
            mass: 0.9,
          }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-teal-50/50 dark:bg-teal-950/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-teal-100 dark:bg-teal-900/60 text-[#0D9488] flex items-center justify-center shrink-0">
                <Wrench className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-extrabold text-[#0D9488]">
                    #{ticketId}
                  </span>
                  <StatusBadge status={issue.status} />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Dispatch Field Maintenance Work Order
                </h2>
                <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                  <MapPin className="size-3 text-slate-400" />
                  <span className="truncate">{issue.address}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {serverError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0 text-rose-600" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Field Technician Workload Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Field Technician ({staffList.length} Available)
                </label>
                <span className="text-[11px] text-muted font-medium">Sorted by lowest active load</span>
              </div>

              {isLoadingStaff ? (
                <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-muted">
                  <Loader2 className="size-4 animate-spin text-[#0D9488]" />
                  <span>Loading department technicians...</span>
                </div>
              ) : staffList.length === 0 ? (
                <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
                  <p className="font-bold">No active technicians found in this department.</p>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">
                    Staff members must have the <code>staff</code> role and belong to your department.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {staffList.map((staff) => {
                    const isSelected = staff._id === selectedStaffId;
                    return (
                      <div
                        key={staff._id}
                        onClick={() => setSelectedStaffId(staff._id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-teal-50/70 border-[#0D9488] ring-2 ring-teal-500/20 dark:bg-teal-950/40 dark:border-teal-700"
                            : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="size-8 rounded-full bg-teal-100 dark:bg-teal-900 text-[#0D9488] flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                            {staff.image ? (
                              <img src={staff.image} alt={staff.name} className="size-full object-cover" />
                            ) : (
                              staff.name?.charAt(0) || <User className="size-3.5" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0 leading-tight">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {staff.name}
                            </span>
                            <span className="text-[10px] text-muted truncate">
                              {staff.phone || staff.email}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <StaffWorkloadBadge activeCount={staff.activeCount} tier={staff.tier} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Overloaded Warning */}
              {selectedStaff?.tier === "overloaded" && (
                <div className="mt-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-200 font-medium">
                  <AlertTriangle className="size-4 shrink-0 text-amber-600" />
                  <span>
                    <strong>Warning:</strong> {selectedStaff.name} currently has {selectedStaff.activeCount} active tasks. Turnaround time may be delayed.
                  </span>
                </div>
              )}
            </div>

            {/* Due Date & Work Order Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-slate-400" />
                  <span>Target SLA Due Date</span>
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="size-3.5 text-slate-400" />
                  <span>Work Order Severity</span>
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 capitalize"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical (Emergency)</option>
                </select>
              </div>
            </div>

            {/* Engineering Instructions / Special Directives */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Field Engineering Instructions &amp; Safety Directives
              </label>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Inspect culvert blockage with safety cones deployed. Upload before/after photographic proof upon clearing."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
              />
            </div>
          </form>

          {/* Footer Controls */}
          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-900/60 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <MagneticButton
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedStaffId}
              className="!bg-[#0D9488] hover:!bg-[#0f766e] text-white text-xs font-bold flex items-center gap-2 px-5 py-2.5 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Dispatching Work Order...</span>
                </>
              ) : (
                <>
                  <Wrench className="size-3.5" />
                  <span>Dispatch Work Order</span>
                  <ArrowRight className="size-3" />
                </>
              )}
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AssignTaskModal;
