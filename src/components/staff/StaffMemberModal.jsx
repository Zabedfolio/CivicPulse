"use client";


import { API_BASE_URL } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  Loader2,
  CheckCircle2,
  UserPlus,
  Briefcase,
} from "lucide-react";

/**
 * StaffMemberModal (Motion Brew DialogSpring)
 * Form modal for onboarding new field technicians and managing staff credentials
 */
export function StaffMemberModal({
  isOpen,
  staffMember = null, // null for onboard, or staff object for edit
  departments = [],
  currentUserRole = "admin", // "admin" | "manager"
  currentManagerDept = null, // if manager, their department
  onClose,
  onSuccess,
}) {
  const isEditing = Boolean(staffMember?._id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("CivicPulse2026!");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("staff");
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (staffMember) {
      setName(staffMember.name || "");
      setEmail(staffMember.email || "");
      setPassword("");
      setPhone(staffMember.phone || "");
      setDepartment(staffMember.department?._id || staffMember.department || "");
      setRole(staffMember.role || "staff");
      setIsActive(staffMember.isActive !== false);
    } else {
      setName("");
      setEmail("");
      setPassword("CivicPulse2026!");
      setPhone("");
      setDepartment(
        currentUserRole === "manager"
          ? currentManagerDept?._id || currentManagerDept || ""
          : ""
      );
      setRole("staff");
      setIsActive(true);
    }
    setError("");
  }, [staffMember, isOpen, currentUserRole, currentManagerDept]);

  // Lock body scroll
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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!isEditing && !email.trim()) {
      setError("Email address is required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const url = isEditing
        ? `${API_BASE_URL}/users/staff/${staffMember._id}`
        : `${API_BASE_URL}/users/staff`;
      const method = isEditing ? "PATCH" : "POST";

      const payload = isEditing
        ? {
            name: name.trim(),
            phone: phone.trim() || null,
            isActive,
            ...(currentUserRole === "admin" && {
              department: department || null,
              role,
            }),
          }
        : {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password.trim() || "CivicPulse2026!",
            phone: phone.trim() || null,
            department:
              currentUserRole === "manager"
                ? currentManagerDept?._id || currentManagerDept
                : department || null,
            role: currentUserRole === "admin" ? role : "staff",
          };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to process staff record.");
      }

      onSuccess?.(json.data?.user);
      onClose();
    } catch (err) {
      setError(err.message || "An error occurred while saving staff details.");
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
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 z-10 my-auto"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="size-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="size-11 rounded-2xl bg-teal-50 dark:bg-teal-950 text-[#0D9488] flex items-center justify-center">
              <UserPlus className="size-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-50 dark:bg-teal-950 text-[#0D9488] border border-teal-200 dark:border-teal-800 mb-1">
                <Briefcase className="size-3" />
                <span>Personnel Operations</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {isEditing ? "Update Staff Profile" : "Onboard Field Technician"}
              </h2>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 font-medium"
            >
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Technician Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                  <User className="size-3.5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rafiqul Islam"
                  required
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Official Email Address {!isEditing && <span className="text-rose-500">*</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                  <Mail className="size-3.5" />
                </div>
                <input
                  type="email"
                  value={email}
                  disabled={isEditing}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="technician@civicpulse.gov.bd"
                  required={!isEditing}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-800/60"
                />
              </div>
              {isEditing && (
                <p className="text-[10px] text-muted">
                  Email identity cannot be modified after registration.
                </p>
              )}
            </div>

            {/* Initial Password (only on create) */}
            {!isEditing && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Initial Login Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                    <KeyRound className="size-3.5" />
                  </div>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="CivicPulse2026!"
                    className="w-full pl-9 pr-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
                <p className="text-[10px] text-muted">
                  Staff can update their password immediately via their profile dashboard.
                </p>
              </div>
            )}

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Contact Hotline / Mobile
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                  <Phone className="size-3.5" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1812 345678"
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* Department Selection (For Admin) */}
            {currentUserRole === "admin" ? (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Assigned Municipal Department
                </label>
                <div className="relative">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
                  >
                    <option value="">-- No Department Assigned (Floating) --</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-muted font-bold uppercase">
                    Department Assignment
                  </div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {currentManagerDept?.name || "Your Department"} (
                    {currentManagerDept?.code || "AUTO"})
                  </div>
                </div>
                <Building2 className="size-4 text-teal-600" />
              </div>
            )}

            {/* Account Status Switcher */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Account Status
                </div>
                <div className="text-[10px] text-muted">
                  Active technicians can receive and execute field repair orders
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsActive(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shadow-xs"
                      : "text-muted hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setIsActive(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    !isActive
                      ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 shadow-xs"
                      : "text-muted hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Suspended
                </button>
              </div>
            </div>

            {/* Submit actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <MagneticButton
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                className="text-xs font-bold shadow-md shadow-teal-500/10 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Saving...</span>
                  </span>
                ) : (
                  <span>{isEditing ? "Save Changes" : "Onboard Technician"}</span>
                )}
              </MagneticButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default StaffMemberModal;
